import { Request, Response } from 'express';
import {
  createUser,
  getUserById,
  getUsers,
  updatePassword,
} from '../modules/userManagement';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import inputUpdatePasswordSchema from './validationSchemas/userSchemas/inputUpdatePassworSchema';
import inputUserSchema from './validationSchemas/userSchemas/inputUserSchema';

class userManagementController {
  async createUser(req: Request, res: Response) {
    try {
      await inputUserSchema.validate(req.body);
      const user = await createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await getUsers();
      res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const user = await getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      await inputUpdatePasswordSchema.validate(req.body);

      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;

      await updatePassword(userId, oldPassword, newPassword);
      res.status(200).json();
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new userManagementController();
