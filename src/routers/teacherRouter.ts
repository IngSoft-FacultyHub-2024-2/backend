import { Router } from 'express';
import TeacherController from '../controllers/teacherController';

const router = Router();

router.post('/', TeacherController.addTeacher);

export default router;