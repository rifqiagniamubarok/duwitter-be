import { request } from 'express';
import { prisma } from '../lib/prisma';
import { Response_error } from '../utils/response_error';
import { password } from 'bun';
import { sign_jwt, verify_token, type token_payload } from '../utils/jwt';

type create_user_payload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export const create_new_user = async (request: create_user_payload) => {
  const result = await prisma.$transaction(async (tx) => {
    //   Check if user already exists
    const countUser = await tx.user.count({
      where: {
        email: request.email,
      },
    });

    if (countUser > 0) {
      throw new Response_error(400, 'Email already exists');
    }

    // Hash the password
    request.password = await password.hash(request.password);

    // Create user
    const user = await tx.user.create({
      data: request,
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    // Create space
    const space = await tx.space.create({
      data: {
        name: `${request.first_name}'s Space`,
        is_personal: true,
        owner_id: user.user_id,
        space_members: {
          createMany: {
            data: [
              {
                user_id: user.user_id,
                is_default: true,
              },
            ],
          },
        },
      },
      select: {
        space_id: true,
        name: true,
      },
    });

    await tx.user.update({
      where: { user_id: user.user_id },
      data: {
        default_space_id: space.space_id,
      },
    });

    return { ...user, space_id: space.space_id, space_name: space.name };
  });

  return result;
};

export const login_user_with_password = async (request: { email: string; password: string; remember_me: 'Y' | 'N' }) => {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        email: request.email,
      },
    });

    // Check user availibility
    if (!user || !user.password || user.default_space_id === null) {
      throw new Response_error(400, 'Invalid email or password');
    }

    const is_password_valid = await password.verify(request.password, user.password);

    if (!is_password_valid) {
      throw new Response_error(400, 'Invalid email or password');
    }

    const space = await tx.space.findFirst({
      where: {
        space_id: user.default_space_id,
      },
    });

    // is profile required for checking if profile has been fullfil or not
    let is_profile_required = false;
    if (!user.country || !user.city || !user.birth_date || !user.birth_place || !user.q1 || !user.q2) {
      is_profile_required = true;
    }

    if (!space || !space.space_id || !space.name) throw new Response_error(400, 'Invalid email or password');

    const token_payload: token_payload = {
      email: user.email,
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      is_profile_required,
      space_id: space.space_id,
      space_name: space.name,
    };

    const token = sign_jwt(token_payload);
    let remember_token = null;

    if (request.remember_me == 'Y') {
      remember_token = sign_jwt(token_payload, 60 * 60 * 24 * 30); // remember token for 30 days
    }

    // update remember token and token in db
    await tx.user.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        remember_token,
        current_token: token,
      },
    });

    const response = {
      email: user.email,
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      is_profile_required,
      space_id: space?.space_id,
      space_name: space?.name,
      token,
    };

    return response;
  });

  return result;
};

export const login_user_with_remember_token = async (request: { email: string; token: string }) => {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        email: request.email,
      },
      select: {
        user_id: true,
        remember_token: true,
        current_token: true,
      },
    });

    // Check user availibility
    if (!user || !user.remember_token) {
      throw new Response_error(400, 'Invalid email or password');
    }

    if (user.current_token !== request.token) {
      throw new Response_error(400, 'Invalid email or password');
    }

    // Verify remember token
    const remember_token_decoded = await verify_token(user.remember_token);
    if (!remember_token_decoded.ok || remember_token_decoded.data == null) throw new Response_error(400, 'Your session has expired');

    const token = sign_jwt(remember_token_decoded.data);

    // update remember token and token in db
    await tx.user.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        current_token: token,
      },
    });

    const response = {
      ...remember_token_decoded.data,
      token,
    };

    return response;
  });

  return result;
};
