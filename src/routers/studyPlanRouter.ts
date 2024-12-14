import { Router } from 'express';
import StudyPlanController from '../controllers/studyPlanController';

const router = Router();

router.post('/', StudyPlanController.addStudyPlan);
router.get('/', StudyPlanController.getStudyPlans);
router.put('/:id', StudyPlanController.updateStudyPlan);
router.delete('/:id', StudyPlanController.deleteStudyPlan);

export default router;
