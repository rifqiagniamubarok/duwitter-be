import type { Category, Transaction_type } from '../../generated/prisma';
import { prisma } from '../lib/prisma';
import { Response_error } from '../utils/response_error';

interface SubcategoryRequest {
  name: string;
  description: string | null;
  icon: string | null;
}

interface CategoryRequest {
  name: string;
  description: string | null;
  icon: string | null;
  type: Transaction_type;
  subcategories: SubcategoryRequest[] | [];
}

interface CategoryOnlyRequest {
  name: string;
  description: string | null;
  icon: string | null;
  type: Transaction_type;
}

export const create_new_category = async (space_id: string, request: CategoryRequest) => {
  const result = await prisma.$transaction(async (tx) => {
    const category = await tx.category.create({
      data: {
        name: request.name,
        description: request.description,
        icon: request.icon,
        type: request.type,
        space_id,
        subcategories: {
          createMany: {
            data: request.subcategories?.map((subcategory) => ({
              name: subcategory.name,
              description: subcategory.description,
              icon: subcategory.icon,
            })),
          },
        },
      },
      include: {
        subcategories: true,
      },
    });

    return category;
  });

  return result;
};

export const edit_existing_category = async (space_id: string, category_id: string, request: CategoryOnlyRequest) => {
  const result = await prisma.$transaction(async (tx) => {
    const checkCategory = await tx.category.count({
      where: {
        category_id,
        space_id,
      },
    });
    if (checkCategory === 0) {
      throw new Response_error(400, 'Category not found');
    }
    const data = await prisma.category.update({
      where: {
        category_id,
      },
      data: {
        name: request.name,
        description: request.description,
        icon: request.icon,
        type: request.type,
      },
    });

    return data;
  });

  return result;
};

export const get_all_category = async (space_id: string, type: Transaction_type) => {
  const data = await prisma.category.findMany({
    where: {
      space_id,
      type,
    },
    include: {
      subcategories: true,
    },
  });

  return data;
};

export const get_detail_category = async (space_id: string, category_id: string) => {
  const data = await prisma.category.findFirst({
    where: {
      space_id,
      category_id,
    },
    include: {
      subcategories: true,
    },
  });

  if (!data) {
    throw new Response_error(400, 'Category not found');
  }

  return data;
};
