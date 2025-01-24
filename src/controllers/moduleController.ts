import { Response } from 'express';
import { addModule, getModules, updateModule } from '../modules/teacher';
import { returnError } from '../shared/utils/exceptions/handleExceptions';

class ModuleController {
  async getModules(req: any, res: Response) {
    try {
      const modules = await getModules();
      res.status(200).json(modules);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async addModule(req: any, res: Response) {
    try {
      const module = await addModule(req.body);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }

  async updateModule(req: any, res: Response) {
    try {
      const module = await updateModule(parseInt(req.params.id), req.body);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new ModuleController();
