import { Router } from 'express';
import NeedController from '../controllers/needController';

const router = Router();

router.post('/', NeedController.addNeed);
router.get('/', NeedController.getNeeds);
router.put('/:id', NeedController.updateNeed);
router.delete('/:id', NeedController.deleteNeed);

export default router;
