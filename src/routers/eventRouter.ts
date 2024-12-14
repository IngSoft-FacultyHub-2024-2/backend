import { Router } from 'express';
import EventController from '../controllers/eventController';

const router = Router();

router.post('/', EventController.addEvent);
router.get('/', EventController.getEvents);
router.put('/:id', EventController.updateEvent);
router.delete('/:id', EventController.deleteEvent);

export default router;
