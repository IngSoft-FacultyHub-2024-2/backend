import { Router } from 'express';
import userManagmentController from '../controllers/userManagmentController';

const router = Router();

router.get('/', userManagmentController.getUsers);
router.post('/', userManagmentController.createUser);
router.put('/:id', userManagmentController.updatePassword);
router.get('/:id', userManagmentController.getUserById);

export default router;
