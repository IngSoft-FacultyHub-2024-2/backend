import { Request, Response } from 'express';
import { addSubject, getSubjects, getSubjectById, updateSubject, deleteSubject, getAllSubjectNames } from '../modules/subject';
import inputSubjectSchema from './validationSchemas/subjectSchemas/inputSubjectSchema';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import { extractParameters } from '../shared/utils/queryParamsHelper';

class SubjectController {
  addSubject = async (req: Request, res: Response) => {
    try{
      await inputSubjectSchema.validate(req.body)
      const subject = await addSubject(req.body);
      res.status(201).json(subject);
    } catch (error) {
      console.log('error adding subject:', error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  getSubjects = async(req: Request, res: Response) => {
    try {
      const queryParams = req.query;
      const { filters, search, sortField, sortOrder, page, pageSize, withDeleted } = extractParameters(queryParams);
      const subjects = await getSubjects(filters, search, sortField, sortOrder, page, pageSize, withDeleted);
      res.status(200).json(subjects);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  getSubject = async (req: Request, res: Response) => {
    try {
      const subject = await getSubjectById(parseInt(req.params.id), true);
      res.status(200).json(subject);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  getAllSubjectNames = async (req: Request, res: Response) => {
    try {
      const subjects = await getAllSubjectNames();
      res.status(200).json(subjects);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }


  updateSubject = async (req: Request, res: Response) => {
    try {
      await inputSubjectSchema.validate(req.body)
      const subject = await updateSubject(parseInt(req.params.id), req.body);
      res.status(200).json(subject);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  deleteSubject = async (req: Request, res: Response) => {
    try {
      const subject = await deleteSubject(parseInt(req.params.id));
      res.status(204).json(subject);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new SubjectController();
