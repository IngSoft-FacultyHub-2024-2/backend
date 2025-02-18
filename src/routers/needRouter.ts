import { Router } from 'express';
import NeedController from '../controllers/needController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isCoordinatorMiddleware } from '../middlewares/isCoordinatorMiddleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  isCoordinatorMiddleware,
  NeedController.addNeed
);
router.get(
  '/',
  authMiddleware,
  isCoordinatorMiddleware,
  NeedController.getNeeds
);
router.put(
  '/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  NeedController.updateNeed
);
router.delete(
  '/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  NeedController.deleteNeed
);

export default router;
