import { Router } from 'express';
import userManagmentController from '../controllers/userManagmentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware, userManagmentController.getUsers);
router.post('/', authMiddleware, userManagmentController.createUser);
router.put('/:id', authMiddleware, userManagmentController.updatePassword);
router.get('/:id', authMiddleware, userManagmentController.getUserById);

export default router;
