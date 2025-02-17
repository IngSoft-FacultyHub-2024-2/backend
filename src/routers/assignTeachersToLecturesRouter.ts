import { Router } from 'express';
import assignTeachersToLecturesController from '../controllers/assignTeachersToLecturesController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isCoordinatorMiddleware } from '../middlewares/isCoordinatorMiddleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  isCoordinatorMiddleware,
  assignTeachersToLecturesController.assignTeachersToSemesterLectures
);
router.get(
  '/conflicts/:semesterId',
  authMiddleware,
  isCoordinatorMiddleware,
  assignTeachersToLecturesController.getAssignationsConflicts
);

export default router;
