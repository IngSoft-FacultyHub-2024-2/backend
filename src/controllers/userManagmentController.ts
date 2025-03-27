import { Request, Response } from 'express';
import {
  createUser,
  getRoles,
  getUserById,
  getUsers,
  updatePassword,
  updateUser,
} from '../modules/userManagement';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import inputUpdatePasswordSchema from './validationSchemas/userSchemas/inputUpdatePasswordSchema';
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

  async getUsers(req: any, res: Response) {
    try {
      const { search, role, is_active, page } = req.query;
      const users = await getUsers(search, role, is_active, page);
      res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getRoles(req: any, res: any) {
    try {
      const roles = await getRoles();
      res.status(200).json(roles);
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
      await inputUpdatePasswordSchema.validate(req.body);

      const teacher_employee_number = req.body.teacher_employee_number;
      const oldPassword = req.body.old_password;
      const newPassword = req.body.new_password;

      await updatePassword(teacher_employee_number, oldPassword, newPassword);
      res.status(200).json();
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      await inputUpdatePasswordSchema.validate(req.body);

      const userId = parseInt(req.params.id);
      const password = req.body.password;
      const role_id = req.body.role_id;

      const user = await updateUser(userId, role_id, password);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new userManagementController();
