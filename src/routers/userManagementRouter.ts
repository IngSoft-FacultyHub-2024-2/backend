import { Router } from 'express';
import userManagmentController from '../controllers/userManagmentController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isCoordinatorMiddleware } from '../middlewares/isCoordinatorMiddleware';

const router = Router();

router.get('/roles', authMiddleware, userManagmentController.getRoles);

router.get('/', authMiddleware, userManagmentController.getUsers);
router.post(
  '/',
  authMiddleware,
  isCoordinatorMiddleware,
  userManagmentController.createUser
);
router.put('/update-password', userManagmentController.updatePassword);
router.get('/:id', authMiddleware, userManagmentController.getUserById);
router.put(
  '/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  userManagmentController.updateUser
);

export default router;
