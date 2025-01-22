import { Router } from 'express';
import moduleController from '../controllers/moduleController';

const router = Router();

router.get('/', moduleController.getModules);
router.post('/', moduleController.addModule);
router.put('/:id', moduleController.updateModule);

export default router;
