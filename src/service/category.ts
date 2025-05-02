import type { Category, Transaction_type } from '../../generated/prisma';
import { prisma } from '../lib/prisma';

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
