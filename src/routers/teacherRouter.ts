import { Router } from 'express';
import benefitController from '../controllers/benefitController';
import categoryController from '../controllers/categoryController';
import teacherController from '../controllers/teacherController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', teacherController.addTeacher);
router.get('/', authMiddleware, teacherController.getTeachers);
router.get('/names', teacherController.getAllTeachersNames);

router.get('/benefits', benefitController.getBenefits);
router.post('/benefits', benefitController.addBenefit);
router.put('/benefits/:id', benefitController.updateBenefit);
router.delete('/benefits/:id', benefitController.deleteBenefit);

router.get('/categories', categoryController.getCategories);
router.post('/categories', categoryController.addCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

router.get('/:id', teacherController.getTeacherById);
router.delete('/:id', teacherController.dismissTeacher);
router.patch(
  '/:id/temporary-dismiss',
  teacherController.temporaryDismissTeacher
);
router.put('/:id', teacherController.updateTeacher);

export default router;
