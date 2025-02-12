import { Router } from 'express';
import benefitController from '../controllers/benefitController';
import categoryController from '../controllers/categoryController';
import teacherController from '../controllers/teacherController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, teacherController.addTeacher);
router.get('/', authMiddleware, teacherController.getTeachers);
router.get('/names', authMiddleware, teacherController.getAllTeachersNames);

router.get('/contacts', authMiddleware, teacherController.getTeachersContacts);

router.get('/benefits', authMiddleware, benefitController.getBenefits);
router.post('/benefits', authMiddleware, benefitController.addBenefit);
router.put('/benefits/:id', authMiddleware, benefitController.updateBenefit);
router.delete('/benefits/:id', authMiddleware, benefitController.deleteBenefit);

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

router.patch('/:id/rehire',
  authMiddleware,teacherController.rehireTeacher)

router.put('/:id', authMiddleware, teacherController.updateTeacher);


export default router;
