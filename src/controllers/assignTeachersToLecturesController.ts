import { assignTeachersToSemesterLectures } from '../modules/assignTeachersToLectures';
import { Response, Request } from 'express';
import { returnError } from '../shared/utils/exceptions/handleExceptions';

class AssignTeachersToLecturesController {
  async assignTeachersToSemesterLectures(req: Request, res: Response) {
    try {
      const result = await assignTeachersToSemesterLectures(req.body);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new AssignTeachersToLecturesController();
