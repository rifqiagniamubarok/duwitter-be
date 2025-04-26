import { request } from 'express';
import { prisma } from '../lib/prisma';
import { Response_error } from '../utils/response_error';
import { password } from 'bun';
import { signJwt, verifyJwt } from '../utils/jwt';

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
        id: true,
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
        owner_id: user.id,
        space_members: {
          createMany: {
            data: [
              {
                user_id: user.id,
                is_default: true,
              },
            ],
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    await tx.user.update({
      where: { id: user.id },
      data: {
        default_space_id: space.id,
      },
    });

    return { ...user, space: { id: space.id, name: space.name } };
  });

  return result;
};

export const login_user = async (request: { email: string; password: string | null; reset_token: string | null }) => {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        email: request.email,
      },
    });

    // Check login method
    let is_using_password = true;
    if (!request.password) is_using_password = false;

    if (!user || !user.password || user.default_space_id === null) {
      throw new Response_error(400, 'Invalid email or password');
    }

    if (is_using_password && request.password) {
      const is_password_valid = await password.verify(request.password, user.password);

      if (!is_password_valid) {
        throw new Response_error(400, 'Invalid email or password');
      }
    } else if (!is_using_password) {
      if (!request.reset_token) throw new Response_error(404, 'Invalid email or password');
      await verifyJwt(user.remember_token as string);

      if (user.current_token !== request.reset_token) throw new Response_error(400, 'Invalid email or password');
    }

    const space = await tx.space.findFirst({
      where: {
        id: user.default_space_id,
      },
    });

    let is_profile_required = false;

    if (!user.country || !user.city || !user.birth_date || !user.birth_place || !user.q1 || !user.q2) {
      is_profile_required = true;
    }

    const token_payload = {
      email: user.email,
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      space: { id: space?.id, name: space?.name },
    };

    const token = await signJwt(token_payload);
    const remember_token = await signJwt(token_payload, 60 * 60 * 3 + 60 * 5); // remember token 3 hour + 5 menuites

    await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        remember_token,
        current_token: token,
      },
    });

    const response = {
      email: user.email,
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      space: { id: space?.id, name: space?.name },
      token,
    };

    return response;
  });

  return result;
};
