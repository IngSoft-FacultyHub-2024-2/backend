import { Router } from 'express';
import SubjectController from '../controllers/subjectController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: API for managing subjects
 */

/**
 * @swagger
 * /api/subjects:
 *   post:
 *     summary: Add a new subject
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Subject created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', SubjectController.addSubject);

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Get all subjects
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: A list of subjects
 */
router.get('/', SubjectController.getSubjects);

/**
 * @swagger
 * /api/subjects/names:
 *   get:
 *     summary: Get names of all subjects
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: A list of subject names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: Mathematics
 */
router.get('/names', SubjectController.getAllSubjectNames);

/**
 * @swagger
 * /api/subjects/{id}:
 *   get:
 *     summary: Get a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the subject to retrieve
 *     responses:
 *       200:
 *         description: A single subject
 *       404:
 *         description: Subject not found
 */
router.get('/:id', SubjectController.getSubject);

/**
 * @swagger
 * /api/subjects/{id}:
 *   put:
 *     summary: Update a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the subject to update
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       404:
 *         description: Subject not found
 */
router.put('/:id', SubjectController.updateSubject);

/**
 * @swagger
 * /api/subjects/{id}:
 *   delete:
 *     summary: Delete a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the subject to delete
 *     responses:
 *       204:
 *         description: Subject deleted successfully
 *       404:
 *         description: Subject not found
 */
router.delete('/:id', SubjectController.deleteSubject);

export default router;
