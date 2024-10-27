import { Response } from 'express';
import { processFile } from '../modules/file-processor/services/fileProcessorService';
import { returnError } from '../shared/utils/exceptions/handleExceptions';

class FileProcessorController {

  async processFile(req: any, res: Response) {
    try {
      await processFile(req.file.originalname, req.body.fileType);

      return res.status(200).json({ message: 'File uploaded and processed successfully' });
    } catch (error) {
      if (error instanceof Error) {
        returnError(res, error);
      }
    }
  }
}

export default new FileProcessorController();