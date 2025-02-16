import { Router } from 'express';
import moduleController from '../controllers/moduleController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isCoordinatorMiddleware } from '../middlewares/isCoordinatorMiddleware';

const router = Router();

router.get('/', authMiddleware, moduleController.getModules);
router.post(
  '/',
  authMiddleware,
  isCoordinatorMiddleware,
  moduleController.addModule
);
router.put(
  '/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  moduleController.updateModule
);

export default router;
