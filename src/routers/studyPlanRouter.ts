import { Router } from 'express';
import StudyPlanController from '../controllers/studyPlanController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, StudyPlanController.addStudyPlan);
router.get('/', authMiddleware, StudyPlanController.getStudyPlans);
router.put('/:id', authMiddleware, StudyPlanController.updateStudyPlan);
router.delete('/:id', authMiddleware, StudyPlanController.deleteStudyPlan);

export default router;
