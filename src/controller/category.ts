import type { Response, Request, NextFunction } from 'express';
import { create_new_category, edit_existing_category, edit_existing_subcategory, get_all_category_service, get_detail_category_service } from '../service/category';
import { create_category_request_validation, edit_category_request_validation, edit_subcategory_request_validation, get_category_validation } from '../validation/category';

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

export const edit_category = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsedBody = edit_category_request_validation.parse(req.body);

    const { name, description, icon } = parsedBody;

    const result = await edit_existing_category(req.space_id as string, req.params.category_id as string, {
      name,
      description: description || null,
      icon: icon || null,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const edit_subcategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsedBody = edit_subcategory_request_validation.parse(req.body);

    const { name, description, icon } = parsedBody;

    const result = await edit_existing_subcategory(req.space_id as string, req.params.subcategory_id as string, {
      name,
      description: description || null,
      icon: icon || null,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const get_all_category = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsedBody = get_category_validation.parse(req.query);
    const { type } = parsedBody;
    const data = await get_all_category_service(req.space_id as string, type);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const get_detail_category = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await get_detail_category_service(req.space_id as string, req.params.category_id as string);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
