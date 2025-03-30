import { Request, Response } from 'express';
import {
  assignTeachersToSemesterLectures,
  getAssignationsConflicts,
} from '../modules/teacherAssignations';
import { returnError } from '../shared/utils/exceptions/handleExceptions';

class TeacherAssignationsController {
  async assignTeachersToSemesterLectures(req: Request, res: Response) {
    try {
      const { semesterId } = req.params;
      if (!semesterId || isNaN(Number(semesterId))) {
        throw new Error('El semetreId es invalido');
      }
      const result = await assignTeachersToSemesterLectures(Number(semesterId));
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getAssignationsConflicts(req: Request, res: Response) {
    try {
      const { semesterId } = req.params;
      const semesterIdNumber = parseInt(semesterId, 10);
      if (isNaN(semesterIdNumber)) {
        return res.status(400).json({ message: 'Invalid semesterId' });
      }
      const result = await getAssignationsConflicts(semesterIdNumber);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        returnError(res, error);
      }
    }
  }
}

export default new TeacherAssignationsController();
