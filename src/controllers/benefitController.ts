import { Request, Response } from 'express';
import {
  addBenefit,
  deleteBenefit,
  getBenefits,
  updateBenefit,
} from '../modules/teacher';
import { returnError } from '../shared/utils/exceptions/handleExceptions';

class BenefitController {
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

  async addBenefit(req: Request, res: Response) {
    try {
      const benefit = await addBenefit(req.body);
      res.status(201).json(benefit);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async updateBenefit(req: Request, res: Response) {
    try {
      const benefit = await updateBenefit(Number(req.params.id), req.body);
      res.status(200).json(benefit);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async deleteBenefit(req: Request, res: Response) {
    try {
      const benefit = await deleteBenefit(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new BenefitController();
