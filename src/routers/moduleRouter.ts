import { Router } from 'express';
import moduleController from '../controllers/moduleController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware, moduleController.getModules);
router.post('/', authMiddleware, moduleController.addModule);
router.put('/:id', authMiddleware, moduleController.updateModule);

export default router;
