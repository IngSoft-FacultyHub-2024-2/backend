import { Request, Response } from 'express';
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../modules/teacher';
import { returnError } from '../shared/utils/exceptions/handleExceptions';

class CategoryController {
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await getCategories();
      res.status(200).json(categories);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async addCategory(req: Request, res: Response) {
    try {
      const category = await addCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const category = await updateCategory(Number(req.params.id), req.body);
      res.status(200).json(category);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      await deleteCategory(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new CategoryController();
