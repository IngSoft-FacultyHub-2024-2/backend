import { Request, Response } from 'express';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import { addTeacher } from '../modules/teacher';
import inputTeacherSchema from './validationSchemas/teacherSchemas/inputTeacherSchema';

class TeacherController {
  async addTeacher(req: Request, res: Response) {
    try{
      await inputTeacherSchema.validate(req.body)
      const teacher = await addTeacher(req.body);
      res.status(201).json(teacher);
    } catch (error) {
      console.log('error adding teacher:', error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new TeacherController();
