import { Router } from 'express';
import SubjectController from '../controllers/subjectController';

const router = Router();

router.post('/', SubjectController.addSubject);
router.get('/', SubjectController.getSubjects);
router.get('/:id', SubjectController.getSubject);
router.put('/:id', SubjectController.updateSubject);

export default router;