import { Router } from 'express';
import userManagmentController from '../controllers/userManagmentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/roles', authMiddleware, userManagmentController.getRoles);

router.get('/', authMiddleware, userManagmentController.getUsers);
router.post('/', userManagmentController.createUser);
router.put('/:id', authMiddleware, userManagmentController.updatePassword);
router.get('/:id', authMiddleware, userManagmentController.getUserById);

export default router;
