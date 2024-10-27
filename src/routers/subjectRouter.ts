import { Router } from 'express';
import SubjectController from '../controllers/subjectController';

const router = Router();

router.post('/', SubjectController.addSubject);
router.get('/', SubjectController.getSubjects);
router.get('/names', SubjectController.getAllSubjectNames);

router.get('/:id', SubjectController.getSubject);
router.put('/:id', SubjectController.updateSubject);
router.delete('/:id', SubjectController.deleteSubject);

export default router;