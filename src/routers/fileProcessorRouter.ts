import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import fileProcessorController from '../controllers/fileProcessorController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '../uploads');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Guardar con el nombre original del archivo
  },
});

const upload = multer({ storage: storage });

router.post(
  '/',
  authMiddleware,
  upload.single('file'),
  fileProcessorController.processFile
);

export default router;
