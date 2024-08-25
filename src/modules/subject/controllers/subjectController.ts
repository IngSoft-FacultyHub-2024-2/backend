import { Request, Response } from 'express';
import subjectService from '../services/subjectService';
import inputSubjectSchema from './schemas/inputSubjectSchema';
import { returnError } from '../../../shared/utils/exceptions/handleExceptions';

class SubjectController {
  async addSubject(req: Request, res: Response) {
    try{
      await inputSubjectSchema.validate(req.body)
      const subject = await subjectService.addSubject(req.body);
      res.status(201).json(subject);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new SubjectController();
