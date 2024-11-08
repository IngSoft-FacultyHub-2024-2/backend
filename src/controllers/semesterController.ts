import { Request, Response } from 'express';
import {
  addLecture,
  addSemester,
  getSemesterLectures,
  getSemesters,
} from '../modules/semester';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import inputLectureSchema from './validationSchemas/lectureSchemas/inputLectureSchema';
import inputSemesterSchema from './validationSchemas/semesterSchemas/inputSemesterSchema';

class SemesterController {
  async addSemester(req: Request, res: Response) {
    try {
      await inputSemesterSchema.validate(req.body);
      const semester = await addSemester(req.body);
      res.status(201).json(semester);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getSemesters(req: Request, res: Response) {
    try {
      const semesters = await getSemesters();
      res.status(200).json(semesters);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async addLecture(req: Request, res: Response) {
    try {
      await inputLectureSchema.validate(req.body);
      const event = await addLecture(req.body);
      res.status(201).json(event);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getLectures(req: any, res: Response) {
    try {
      const semesterId = req.params.semesterId;
      const { degreeId, subjectId, group } = req.query;
      const semester = await getSemesterLectures(
        semesterId,
        degreeId,
        subjectId,
        group
      );
      res.status(200).json(semester);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new SemesterController();
