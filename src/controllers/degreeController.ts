import { Request, Response } from 'express';
import {
  addDegree,
  deleteDegree,
  getDegrees,
  updateDegree,
} from '../modules/degree';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import inputDegreeSchema from './validationSchemas/degreeSchemas/inputDegreeSchema';

class DegreeController {
  async getDegrees(req: Request, res: Response) {
    try {
      const degrees = await getDegrees();
      res.status(200).json(degrees);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async addDegree(req: Request, res: Response) {
    console.log('addDegree');
    try {
      await inputDegreeSchema.validate(req.body);
      const { name, acronym } = req.body;
      const degree = await addDegree(name, acronym);
      res.status(201).json(degree);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async updateDegree(req: Request, res: Response) {
    try {
      console.log('updateDegree', req.body);
      await inputDegreeSchema.validate(req.body);
      const { id } = req.params;
      const { name, acronym } = req.body;
      const degree = await updateDegree(Number(id), name, acronym);
      res.status(201).json(degree);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async deleteDegree(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await deleteDegree(Number(id));
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new DegreeController();
