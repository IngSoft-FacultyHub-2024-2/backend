import { Router } from 'express';
import SubjectController from '../controllers/subjectController';

const router = Router();

router.post('/', SubjectController.addSubject);
router.get('/', SubjectController.getSubjects);

export default router;