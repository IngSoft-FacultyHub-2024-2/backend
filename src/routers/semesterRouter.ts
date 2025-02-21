import { Router } from 'express';
import semesterController from '../controllers/semesterController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isCoordinatorMiddleware } from '../middlewares/isCoordinatorMiddleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  isCoordinatorMiddleware,
  semesterController.addSemester
);
router.put(
  '/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  semesterController.updateSemester
);
router.delete(
  '/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  semesterController.deleteSemester
);
router.get('/', authMiddleware, semesterController.getSemesters);
router.post(
  '/lectures',
  authMiddleware,
  isCoordinatorMiddleware,
  semesterController.addLecture
);
router.put(
  '/lectures/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  semesterController.updateLecture
);
router.delete(
  '/lectures/:id',
  authMiddleware,
  isCoordinatorMiddleware,
  semesterController.deleteLecture
);
router.get(
  '/:semesterId/lectures',
  authMiddleware,
  semesterController.getLectures
);
router.get(
  '/:semesterId/lectures/groups',
  authMiddleware,
  semesterController.getLecturesGroups
);
router.get(
  '/:semesterId/assigned-lectures-csv',
  authMiddleware,
  semesterController.getAssignedLecturesCsv
);
router.patch(
  '/lectures/:lectureId/teacher-review',
  authMiddleware,
  semesterController.teacherReviewLecture
);

export default router;
