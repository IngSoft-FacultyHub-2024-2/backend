import { Router } from 'express';
import EventController from '../controllers/eventController';

const router = Router();

router.post('/', EventController.addEvent);
router.get('/', EventController.getEvents);

export default router;