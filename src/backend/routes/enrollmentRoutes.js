import express from 'express';
import { body } from 'express-validator';
import * as enrollmentController from '../controllers/enrollmentController.js';

const router = express.Router();

// Validation middleware
const validateEnrollment = [
  body('clientId')
    .notEmpty().withMessage('Client ID is required')
    .isInt({ min: 1 }).withMessage('Client ID must be a positive integer'),
  body('programId')
    .notEmpty().withMessage('Program ID is required')
    .isInt({ min: 1 }).withMessage('Program ID must be a positive integer')
];

const validateStatus = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['active', 'completed', 'withdrawn']).withMessage('Invalid status value')
];

// Enroll a client in a program
router.post('/', validateEnrollment, enrollmentController.enrollClient);

// Get all enrollments
router.get('/', enrollmentController.getAllEnrollments);

// Get a specific enrollment by ID
router.get('/:id', enrollmentController.getEnrollmentById);

// Get enrollments for a specific client
router.get('/client/:clientId', enrollmentController.getClientEnrollments);

// Get enrollments for a specific program
router.get('/program/:programId', enrollmentController.getProgramEnrollments);

// Update enrollment status
router.patch('/:id/status', validateStatus, enrollmentController.updateEnrollmentStatus);

// Unenroll a client (delete enrollment)
router.delete('/:id', enrollmentController.unenrollClient);

export default router;