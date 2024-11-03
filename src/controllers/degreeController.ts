import { Request, Response } from 'express';
import { addDegree, getDegrees } from "../modules/degree";
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
            await inputDegreeSchema.validate(req.body)
            const { name, acronym } = req.body;
            const degree = await addDegree(name, acronym);
            res.status(201).json(degree);
        } catch (error) {
            if (error instanceof Error) {
                returnError(res, error);
            }
        }
    }
}

export default new DegreeController();