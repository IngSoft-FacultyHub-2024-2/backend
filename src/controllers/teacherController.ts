import { Request, Response } from 'express';
import {
  addTeacher,
  dismissTeacher,
  getAllTeachersNames,
  getTeacherById,
  getTeachers,
  temporaryDismissTeacher,
  updateTeacher,
} from '../modules/teacher';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import inputTeacherSchema from './validationSchemas/teacherSchemas/inputTeacherSchema';
import inputTemporaryDismisssSchema from './validationSchemas/teacherSchemas/inputTemporaryDismisssSchema';

class TeacherController {
  async addTeacher(req: Request, res: Response) {
    try {
      await inputTeacherSchema.validate(req.body);
      const teacher = await addTeacher(req.body);
      res.status(201).json(teacher);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getTeacherById(req: Request, res: Response) {
    try {
      const teacherId = parseInt(req.params.id);
      const teacher = await getTeacherById(teacherId);
      res.status(200).json(teacher);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async dismissTeacher(req: Request, res: Response) {
    try {
      const teacherId = parseInt(req.params.id);
      await dismissTeacher(teacherId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async temporaryDismissTeacher(req: Request, res: Response) {
    try {
      await inputTemporaryDismisssSchema.validate(req.body);
      const teacherId = parseInt(req.params.id);
      const retentionDate = req.body.retentionDate;
      temporaryDismissTeacher(teacherId, retentionDate);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getTeachers(req: any, res: Response) {
    try {
      const {
        search,
        state,
        unsubscribe_risk,
        sortField,
        sortOrder,
        withDeleted,
        page,
        pageSize,
      } = req.query;
      const teachersResponse = await getTeachers(
        search,
        state,
        unsubscribe_risk,
        sortField,
        sortOrder,
        page,
        pageSize,
        withDeleted
      );
      res.status(200).json(teachersResponse);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getAllTeachersNames(req: Request, res: Response) {
    try {
      const teachers = await getAllTeachersNames();
      res.status(200).json(teachers);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async updateTeacher(req: Request, res: Response) {
    try {
      const teacherId = parseInt(req.params.id);
      await inputTeacherSchema.validate(req.body);
      const teacher = await updateTeacher(teacherId, req.body);
      res.status(200).json(teacher);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new TeacherController();
