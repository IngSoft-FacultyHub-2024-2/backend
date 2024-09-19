import { Router } from 'express';
import teacherController from '../controllers/teacherController';

const router = Router();

router.post('/', teacherController.addTeacher);
router.get('/', teacherController.getTeachers);
router.get('/names', teacherController.getAllTeachersNames);
router.get('/:id', teacherController.getTeacherById);
router.delete('/:id', teacherController.dismissTeacher);
router.patch('/:id', teacherController.temporaryDismissTeacher);

router.get('/benefits', teacherController.getBenefits);
router.get('/categories', teacherController.getCategories);


export default router;