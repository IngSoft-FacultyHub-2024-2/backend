import { Router } from 'express';
import EventController from '../controllers/eventController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isCoordinatorMiddleware } from '../middlewares/isCoordinatorMiddleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  isCoordinatorMiddleware,
  EventController.addEvent
);
router.get(
  '/',
  authMiddleware,
  isCoordinatorMiddleware,
  EventController.getEvents
);
router.put(
  '/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  EventController.updateEvent
);
router.delete(
  '/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  EventController.deleteEvent
);

export default router;
