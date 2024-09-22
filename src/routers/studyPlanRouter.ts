import { Router } from 'express';
import StudyPlanController from '../controllers/studyPlanController';

const router = Router();

router.post('/', StudyPlanController.addStudyPlan);
router.get('/', StudyPlanController.getStudyPlans);

export default router;