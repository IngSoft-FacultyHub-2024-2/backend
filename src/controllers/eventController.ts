import { Request, Response } from 'express';
import { getEvents, addEvent } from '../modules/subject';
import inputEventSchema from './validationSchemas/subjectSchemas/inputEventSchema';
import { returnError } from '../shared/utils/exceptions/handleExceptions';

class EventController {
  async addEvent(req: Request, res: Response) {
    try{
      await inputEventSchema.validate(req.body)
      const event = await addEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async getEvents(req: Request, res: Response) {
    try{
      const queryParams = req.query;
      console.log('Query Parameters:', queryParams);

      const events = await getEvents(queryParams);
      res.status(200).json(events);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new EventController();