import { Router } from 'express';
import DegreeController from '../controllers/degreeController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, DegreeController.addDegree);
router.get('/', DegreeController.getDegrees);
router.put('/:id', DegreeController.updateDegree);
router.delete('/:id', DegreeController.deleteDegree);

export default router;
