import { Router } from 'express';
import DegreeController from '../controllers/degreeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isCoordinatorMiddleware } from '../middlewares/isCoordinatorMiddleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  isCoordinatorMiddleware,
  DegreeController.addDegree
);
router.get('/', authMiddleware, DegreeController.getDegrees);
router.put(
  '/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  DegreeController.updateDegree
);
router.delete(
  '/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  DegreeController.deleteDegree
);

export default router;
