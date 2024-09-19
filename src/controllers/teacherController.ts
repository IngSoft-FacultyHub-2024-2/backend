import { Request, Response } from 'express';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import { addTeacher, getTeachers, getBenefits, getCategories, getAllTeachersNames } from '../modules/teacher';
import inputTeacherSchema from './validationSchemas/teacherSchemas/inputTeacherSchema';
import { extractParameters } from '../shared/utils/queryParamsHelper';

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

  async getTeachers(req: Request, res: Response) {
    try {
      const queryParams = req.query;
      const {filters, search, sortField, sortOrder, page, pageSize } = extractParameters(queryParams);
      const teachers = await getTeachers(filters, search, sortField, sortOrder, page, pageSize);
      res.status(200).json(teachers);
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
