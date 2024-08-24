import { Request, Response } from 'express';
import subjectService from '../services/subjectService';

class SubjectController {
  async addSubject(req: Request, res: Response) {
    try{
      const subject = await subjectService.addSubject(req.body);
      res.status(201).json(subject);
    } catch (error) {
      console.log(error);
      //returnError(res, error);
    }
  }
}

export default new SubjectController();
