import { Router } from 'express';
import semesterController from '../controllers/semesterController';

const router = Router();

router.post('/', semesterController.addSemester);
router.get('/', semesterController.getSemesters);
router.post('/lectures', semesterController.addLecture);
router.get('/:semesterId/lectures', semesterController.getLectures);
router.get(
  '/:semesterId/lectures/groups',
  semesterController.getLecturesGroups
);

export default router;
