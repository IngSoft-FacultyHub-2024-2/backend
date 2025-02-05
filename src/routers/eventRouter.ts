import { Router } from 'express';
import EventController from '../controllers/eventController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, EventController.addEvent);
router.get('/', authMiddleware, EventController.getEvents);
router.put('/:id', authMiddleware, EventController.updateEvent);
router.delete('/:id', authMiddleware, EventController.deleteEvent);

export default router;
