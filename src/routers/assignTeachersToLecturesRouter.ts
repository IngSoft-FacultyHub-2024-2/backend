import { Router } from 'express';
import assignTeachersToLecturesController from '../controllers/assignTeachersToLecturesController';

const router = Router();

router.post(
  '/',
  assignTeachersToLecturesController.assignTeachersToSemesterLectures
);
router.get(
  '/conflicts/:semesterId',
  assignTeachersToLecturesController.getAssignationsConflicts
);

export default router;
