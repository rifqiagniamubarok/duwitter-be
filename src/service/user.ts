import { hash } from 'bcryptjs';
import { request } from 'express';
import { prisma } from '../lib/prisma';
import { Response_error } from '../utils/response_error';

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
    request.password = await hash(request.password, 10);

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
