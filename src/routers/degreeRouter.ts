import { Router } from 'express';
import DegreeController from '../controllers/degreeController';

const router = Router();

router.post('/', DegreeController.addDegree);
router.get('/', DegreeController.getDegrees);
router.put('/:id', DegreeController.updateDegree);
router.delete('/:id', DegreeController.deleteDegree);

export default router;
