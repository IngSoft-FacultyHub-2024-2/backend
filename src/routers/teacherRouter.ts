import { Router } from 'express';
import benefitController from '../controllers/benefitController';
import categoryController from '../controllers/categoryController';
import teacherController from '../controllers/teacherController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, teacherController.addTeacher);
router.get('/', authMiddleware, teacherController.getTeachers);
router.get('/names', authMiddleware, teacherController.getAllTeachersNames);

router.get('/contacts', teacherController.getTeachersContacts);

router.get('/benefits', benefitController.getBenefits);
router.post('/benefits', benefitController.addBenefit);
router.put('/benefits/:id', benefitController.updateBenefit);
router.delete('/benefits/:id', benefitController.deleteBenefit);

router.get('/categories', authMiddleware, categoryController.getCategories);
router.post('/categories', authMiddleware, categoryController.addCategory);
router.put(
  '/categories/:id',
  authMiddleware,
  categoryController.updateCategory
);
router.delete(
  '/categories/:id',
  authMiddleware,
  categoryController.deleteCategory
);

router.get('/:id', authMiddleware, teacherController.getTeacherById);
router.delete('/:id', authMiddleware, teacherController.dismissTeacher);
router.patch(
  '/:id/temporary-dismiss',
  authMiddleware,
  teacherController.temporaryDismissTeacher
);
router.put('/:id', authMiddleware, teacherController.updateTeacher);

export default router;
