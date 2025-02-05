import { Router } from 'express';
import DegreeController from '../controllers/degreeController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, DegreeController.addDegree);
router.get('/', authMiddleware, DegreeController.getDegrees);
router.put('/:id', authMiddleware, DegreeController.updateDegree);
router.delete('/:id', authMiddleware, DegreeController.deleteDegree);

export default router;
