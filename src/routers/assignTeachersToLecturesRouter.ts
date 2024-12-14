import { Router } from 'express';
import assignTeachersToLecturesController from '../controllers/assignTeachersToLecturesController';

const router = Router();

router.post(
  '/',
  assignTeachersToLecturesController.assignTeachersToSemesterLectures
);

export default router;
