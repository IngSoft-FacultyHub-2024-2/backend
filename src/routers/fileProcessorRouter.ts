import { Router } from "express";
import fileProcessorController from "../controllers/fileProcessorController";
import multer from "multer";
import path from "path";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, '../uploads');
        cb(null, uploadPath); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Guardar con el nombre original del archivo
    },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), fileProcessorController.processFile);

export default router;