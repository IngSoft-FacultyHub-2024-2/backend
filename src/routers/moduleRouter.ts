import { Router } from 'express';
import moduleController from '../controllers/moduleController';

const router = Router();

router.get('/', moduleController.getModules);

export default router;