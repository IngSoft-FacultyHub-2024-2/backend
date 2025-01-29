import { Router } from 'express';
import SubjectController from '../controllers/subjectController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, SubjectController.addSubject);
router.get('/', authMiddleware, SubjectController.getSubjects);
router.get('/names', authMiddleware, SubjectController.getAllSubjectNames);
router.get(
  '/study-plan/:id',
  authMiddleware,
  SubjectController.getSubjectsNamesByStudyPlan
);

router.get('/:id', authMiddleware, SubjectController.getSubject);
router.put('/:id', authMiddleware, SubjectController.updateSubject);
router.delete('/:id', authMiddleware, SubjectController.deleteSubject);

export default router;
