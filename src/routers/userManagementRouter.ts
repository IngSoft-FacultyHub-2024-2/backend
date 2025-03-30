import { Router } from 'express';
import userManagmentController from '../controllers/userManagmentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/roles', authMiddleware, userManagmentController.getRoles);

router.get('/', authMiddleware, userManagmentController.getUsers);
router.post('/', authMiddleware, userManagmentController.createUser);
router.put('/update-password', userManagmentController.updatePassword);
router.get('/:id', authMiddleware, userManagmentController.getUserById);
router.put('/:id', authMiddleware, userManagmentController.updateUser);

export default router;
