import { Request, Response } from 'express';
import {
  addLecture,
  addSemester,
  deleteLecture,
  deleteSemester,
  getSemesterLectures,
  getSemesterLecturesGroups,
  getSemesters,
  updateLecture,
  updateSemester,
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

  async updateSemester(req: Request, res: Response) {
    try {
      await inputSemesterSchema.validate(req.body);
      const semester = await updateSemester(parseInt(req.params.id), req.body);
      res.status(201).json(semester);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async deleteSemester(req: Request, res: Response) {
    try {
      const semester = await deleteSemester(parseInt(req.params.id));
      res.status(200).json(semester);
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
      const lecture = await addLecture(req.body);
      res.status(201).json(lecture);
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

  async getLecturesGroups(req: any, res: Response) {
    try {
      const semesterId = req.params.semesterId;
      const { degreeId, subjectId } = req.query;
      const semester = await getSemesterLecturesGroups(semesterId, degreeId);
      res.status(200).json(semester);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async updateLecture(req: Request, res: Response) {
    try {
      await inputLectureSchema.validate(req.body);
      const lecture = await updateLecture(parseInt(req.params.id), req.body);
      res.status(200).json(lecture);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async deleteLecture(req: Request, res: Response) {
    try {
      const lecture = await deleteLecture(parseInt(req.params.id));
      res.status(200).json(lecture);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new SemesterController();
