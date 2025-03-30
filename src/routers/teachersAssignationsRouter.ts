import { Router } from 'express';
import TeacherAssignationsController from '../controllers/teacherAssignationsController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isCoordinatorMiddleware } from '../middlewares/isCoordinatorMiddleware';

const router = Router();

router.post(
  '/semester/:semesterId',
  authMiddleware,
  isCoordinatorMiddleware,
  TeacherAssignationsController.assignTeachersToSemesterLectures
);
router.get(
  '/semester/:semesterId/conflicts',
  authMiddleware,
  isCoordinatorMiddleware,
  TeacherAssignationsController.getAssignationsConflicts
);

export default router;
