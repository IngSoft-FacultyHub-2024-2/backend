import { Router } from 'express';
import semesterController from '../controllers/semesterController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, semesterController.addSemester);
router.put('/:id', authMiddleware, semesterController.updateSemester);
router.delete('/:id', authMiddleware, semesterController.deleteSemester);
router.get('/', authMiddleware, semesterController.getSemesters);
router.post('/lectures', authMiddleware, semesterController.addLecture);
router.put('/lectures/:id', authMiddleware, semesterController.updateLecture);
router.delete(
  '/lectures/:id',
  authMiddleware,
  semesterController.deleteLecture
);
router.get(
  '/:semesterId/lectures',
  authMiddleware,
  semesterController.getLectures
);
router.get(
  '/:semesterId/lectures/groups',
  authMiddleware,
  semesterController.getLecturesGroups
);

export default router;
