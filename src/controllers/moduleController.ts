import { getModules } from '../modules/teacher';
import { Response } from 'express';
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
}

export default new ModuleController();
