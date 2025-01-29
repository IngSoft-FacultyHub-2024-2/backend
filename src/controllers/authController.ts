import { Request, Response } from 'express';
import { login } from '../modules/auth';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import inputLoginSchema from './validationSchemas/authSchemas/inputLoginSchema';

class AuthController {
  async login(req: Request, res: Response) {
    try {
      console.log(req.body);
      await inputLoginSchema.validate(req.body);
      const { teacher_employee_number, password } = req.body;
      const result = await login(teacher_employee_number, password);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new AuthController();
