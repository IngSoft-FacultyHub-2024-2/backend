import { Router } from 'express';
import NeedController from '../controllers/needController';

const router = Router();

router.post('/', NeedController.addNeed);
router.get('/', NeedController.getNeeds);

export default router;