import { Router } from 'express';
import NeedController from '../controllers/needController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, NeedController.addNeed);
router.get('/', authMiddleware, NeedController.getNeeds);
router.put('/:id', authMiddleware, NeedController.updateNeed);
router.delete('/:id', authMiddleware, NeedController.deleteNeed);

export default router;
