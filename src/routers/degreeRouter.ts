import { Router } from 'express';
import DegreeController from '../controllers/degreeController';

const router = Router();

router.post('/', DegreeController.addDegree);
router.get('/', DegreeController.getDegrees);

export default router;