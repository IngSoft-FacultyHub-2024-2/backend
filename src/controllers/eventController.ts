import { Request, Response } from 'express';
import {
  addEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from '../modules/subject';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import { extractParameters } from '../shared/utils/queryParamsHelper';
import inputEventSchema from './validationSchemas/subjectSchemas/inputEventSchema';

class EventController {
  async addEvent(req: Request, res: Response) {
    try {
      await inputEventSchema.validate(req.body);
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
    try {
      const queryParams = req.query;
      const { filters, sortField, sortOrder, page, pageSize } =
        extractParameters(queryParams);
      const events = await getEvents(
        filters,
        sortField,
        sortOrder,
        page,
        pageSize
      );
      res.status(200).json(events);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      await inputEventSchema.validate(req.body);
      const { id } = req.params;
      const event = await updateEvent(Number(id), req.body);
      res.status(201).json(event);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await deleteEvent(Number(id));
      res.status(204).send();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new EventController();
