import { Request, Response } from 'express';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import { addTeacher, dismissTeacher, getAllTeachersNames, getBenefits, getCategories, getTeacherById, getTeachers, temporaryDismissTeacher } from '../modules/teacher';
import inputTeacherSchema from './validationSchemas/teacherSchemas/inputTeacherSchema';
import inputTemporaryDismisssSchema from './validationSchemas/teacherSchemas/inputTemporaryDismisssSchema';

class TeacherController {
  async addTeacher(req: Request, res: Response) {
    try{
      await inputTeacherSchema.validate(req.body)
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
      const teacher = await dismissTeacher(teacherId);
      res.status(204).send(teacher);
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
      const teacher = await temporaryDismissTeacher(teacherId, retentionDate);
      res.status(200).send(teacher);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getTeachers(req: any, res: Response) {
    try {
      const { search, state, sortField, sortOrder, page, pageSize } = req.query;
      const teachersResponse = await getTeachers(search, state, sortField, sortOrder, page, pageSize);

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

  async getBenefits(req: Request, res: Response) {
    try {
      const benefits = await getBenefits();
      res.status(200).json(benefits);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await getCategories();
      res.status(200).json(categories);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}


export default new TeacherController();
