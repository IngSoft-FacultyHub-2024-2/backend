import { Router } from 'express';
import benefitController from '../controllers/benefitController';
import categoryController from '../controllers/categoryController';
import teacherController from '../controllers/teacherController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isCoordinatorMiddleware } from '../middlewares/isCoordinatorMiddleware';
import { isTeacherOwnDataMiddleware } from '../middlewares/isTeacherOwnDataMiddleware';

const router = Router();

// Beneficios
router.get('/benefits', authMiddleware, benefitController.getBenefits);
router.post(
  '/benefits',
  authMiddleware,
  isCoordinatorMiddleware,
  benefitController.addBenefit
);
router.put(
  '/benefits/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  benefitController.updateBenefit
);
router.delete(
  '/benefits/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  benefitController.deleteBenefit
);

// Categorías
router.get('/categories', authMiddleware, categoryController.getCategories);
router.post(
  '/categories',
  authMiddleware,
  isCoordinatorMiddleware,
  categoryController.addCategory
);
router.put(
  '/categories/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  categoryController.updateCategory
);
router.delete(
  '/categories/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  categoryController.deleteCategory
);

// Profesores
router.get('/names', authMiddleware, teacherController.getAllTeachersNames);
router.get(
  '/contacts',
  authMiddleware,
  isCoordinatorMiddleware,
  teacherController.getTeachersContacts
);
router.post(
  '/',
  authMiddleware,
  isCoordinatorMiddleware,
  teacherController.addTeacher
);
router.get(
  '/',
  authMiddleware,
  isCoordinatorMiddleware,
  teacherController.getTeachers
);
router.get(
  '/:id',
  authMiddleware,
  isTeacherOwnDataMiddleware,
  teacherController.getTeacherById
);
router.delete(
  '/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  teacherController.dismissTeacher
);
router.patch(
  '/:id/temporary-dismiss',
  authMiddleware,
  isCoordinatorMiddleware,
  teacherController.temporaryDismissTeacher
);

router.patch('/:id/rehire',
  authMiddleware,isCoordinatorMiddleware,teacherController.rehireTeacher)

router.put(
  '/:id',
  authMiddleware,
  isTeacherOwnDataMiddleware,
  teacherController.updateTeacher
);




export default router;
