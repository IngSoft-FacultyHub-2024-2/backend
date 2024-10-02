import { Request, Response } from 'express';
import { getNeeds, addNeed } from '../modules/subject';
import inputNeedSchema from './validationSchemas/subjectSchemas/inputNeedSchema';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import { extractParameters } from '../shared/utils/queryParamsHelper';

class NeedController {
    async addNeed(req: Request, res: Response) {
      try{
        await inputNeedSchema.validate(req.body)
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
        try{
          const queryParams = req.query;
          const { filters, sortField, sortOrder, search } = extractParameters(queryParams);
          const needs = await getNeeds(filters, search, sortField, sortOrder);
          res.status(200).json(needs);
        } catch (error) {
          console.log(error);
          if (error instanceof Error) {
            returnError(res, error);
          }
        }
    }
}

export default new NeedController();