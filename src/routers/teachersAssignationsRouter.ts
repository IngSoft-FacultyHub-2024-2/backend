import { Router } from 'express';
import teacherAssignatiosController from '../controllers/teacherAssignatiosController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isCoordinatorMiddleware } from '../middlewares/isCoordinatorMiddleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  isCoordinatorMiddleware,
  teacherAssignatiosController.assignTeachersToSemesterLectures
);
router.get(
  '/conflicts/:semesterId',
  authMiddleware,
  isCoordinatorMiddleware,
  teacherAssignatiosController.getAssignationsConflicts
);

export default router;
