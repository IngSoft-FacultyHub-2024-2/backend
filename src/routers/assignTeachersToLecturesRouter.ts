import { Router } from 'express';
import assignTeachersToLecturesController from '../controllers/assignTeachersToLecturesController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  assignTeachersToLecturesController.assignTeachersToSemesterLectures
);
router.get(
  '/conflicts/:semesterId',
  authMiddleware,
  assignTeachersToLecturesController.getAssignationsConflicts
);

export default router;
