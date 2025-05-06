import type { Response, Request, NextFunction } from 'express';
import { create_new_category } from '../service/category';
import { create_category_request_validation } from '../validation/category';

export const create_category = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsedBody = create_category_request_validation.parse(req.body);

    const { name, description, type, icon, subcategories } = parsedBody;

    const result = await create_new_category(req.space_id as string, {
      name,
      description: description || null,
      type,
      icon: icon || null,
      subcategories: subcategories.map((subcategory) => ({
        name: subcategory.name,
        description: subcategory.description || null,
        icon: subcategory.icon || null,
      })),
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
