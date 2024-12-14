import { Request, Response } from 'express';
import {
  addStudyPlan,
  deleteStudyPlan,
  getStudyPlans,
  updateStudyPlan,
} from '../modules/subject';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import { extractParameters } from '../shared/utils/queryParamsHelper';
import inputStudyPlanSchema from './validationSchemas/subjectSchemas/inputStudyPlanSchema';

class StudyPlanController {
  async addStudyPlan(req: Request, res: Response) {
    try {
      await inputStudyPlanSchema.validate(req.body);
      const studyPlan = await addStudyPlan(req.body);
      res.status(201).json(studyPlan);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getStudyPlans(req: Request, res: Response) {
    try {
      const queryParams = req.query;
      const { filters, sortField, sortOrder, search } =
        extractParameters(queryParams);
      const studyPlans = await getStudyPlans(
        filters,
        search,
        sortField,
        sortOrder
      );
      res.status(200).json(studyPlans);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async updateStudyPlan(req: Request, res: Response) {
    try {
      console.log(req.body);
      await inputStudyPlanSchema.validate(req.body);
      const { id } = req.params;
      const studyPlan = await updateStudyPlan(Number(id), req.body);
      res.status(201).json(studyPlan);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async deleteStudyPlan(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await deleteStudyPlan(Number(id));
      res.status(204).send();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new StudyPlanController();
