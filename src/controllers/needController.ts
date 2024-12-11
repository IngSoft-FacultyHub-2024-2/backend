import { Request, Response } from 'express';
import { addNeed, deleteNeed, getNeeds, updateNeed } from '../modules/subject';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import { extractParameters } from '../shared/utils/queryParamsHelper';
import inputNeedSchema from './validationSchemas/subjectSchemas/inputNeedSchema';

class NeedController {
  async addNeed(req: Request, res: Response) {
    try {
      await inputNeedSchema.validate(req.body);
      const need = await addNeed(req.body);
      res.status(201).json(need);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getNeeds(req: Request, res: Response) {
    try {
      const queryParams = req.query;
      const { filters, sortField, sortOrder, search } =
        extractParameters(queryParams);
      const needs = await getNeeds(filters, search, sortField, sortOrder);
      res.status(200).json(needs);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async updateNeed(req: Request, res: Response) {
    try {
      await inputNeedSchema.validate(req.body);
      const { id } = req.params;
      const need = await updateNeed(Number(id), req.body);
      res.status(201).json(need);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async deleteNeed(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await deleteNeed(Number(id));
      res.status(204).send();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new NeedController();
