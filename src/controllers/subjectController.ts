import { Request, Response } from 'express';
import { addSubject } from '../modules/subject';
import inputSubjectSchema from './schemas/inputSubjectSchema';
import { returnError } from '../shared/utils/exceptions/handleExceptions';

class SubjectController {
  async addSubject(req: Request, res: Response) {
    try{
      await inputSubjectSchema.validate(req.body)
      const subject = await addSubject(req.body);
      res.status(201).json(subject);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  /*async getSubjects(req: Request, res: Response) {
    try {
      const queryParams = req.query;
      console.log('Query Parameters:', queryParams);

      const subjects = await getSubjects(queryParams);
      // TODO: Implement pagination, and convert to DTO
      res.status(200).json(subjects);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }*/
}

export default new SubjectController();
