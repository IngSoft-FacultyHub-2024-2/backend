import { Router } from 'express';
import semesterController from '../controllers/semesterController';

const router = Router();

router.post('/', semesterController.addSemester);
router.put('/:id', semesterController.updateSemester);
router.delete('/:id', semesterController.deleteSemester);
router.get('/', semesterController.getSemesters);
router.post('/lectures', semesterController.addLecture);
router.put('/lectures/:id', semesterController.updateLecture);
router.delete('/lectures/:id', semesterController.deleteLecture);
router.get('/:semesterId/lectures', semesterController.getLectures);
router.get(
  '/:semesterId/lectures/groups',
  semesterController.getLecturesGroups
);

export default router;
