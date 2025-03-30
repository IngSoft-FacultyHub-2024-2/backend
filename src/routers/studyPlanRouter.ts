import { Router } from 'express';
import StudyPlanController from '../controllers/studyPlanController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isCoordinatorMiddleware } from '../middlewares/isCoordinatorMiddleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  isCoordinatorMiddleware,
  StudyPlanController.addStudyPlan
);
router.get('/', authMiddleware, StudyPlanController.getStudyPlans);
router.put(
  '/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  StudyPlanController.updateStudyPlan
);
router.delete(
  '/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  StudyPlanController.deleteStudyPlan
);

export default router;
