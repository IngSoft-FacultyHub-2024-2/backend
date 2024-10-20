import { Request, Response } from 'express';
import { returnError } from '../shared/utils/exceptions/handleExceptions';
import path from 'path';
import xlsx from 'xlsx';
import { processFile } from '../modules/file-processor/services/fileProcessorService';

class FileProcessorController {

  async processFile(req: any, res: Response) {
    try {
      processFile(req.file.originalname);

      return res.status(200).json({ message: 'File uploaded and processed successfully' });
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new FileProcessorController();