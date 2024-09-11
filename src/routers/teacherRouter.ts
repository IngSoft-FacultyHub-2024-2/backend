import { Router } from 'express';
import teacherController from '../controllers/teacherController';

const router = Router();

router.post('/', teacherController.addTeacher);
router.get('/', teacherController.getTeachers);

router.get('/benefits', teacherController.getBenefits);
router.get('/categories', teacherController.getCategories);


export default router;