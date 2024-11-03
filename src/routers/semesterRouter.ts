import { Router } from 'express';
import semesterController from '../controllers/semesterController';

const router = Router();

router.post('/', semesterController.addSemester);
router.post('/lectures', semesterController.addLecture);
router.get('/:semesterId/lectures', semesterController.getLectures);

export default router;