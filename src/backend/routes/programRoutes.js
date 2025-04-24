import express from 'express';
import { body } from 'express-validator';
import * as programController from '../controllers/programController.js';

const router = express.Router();

// Validation middleware
const validateProgram = [
  body('name')
    .notEmpty().withMessage('Program name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Program name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

// Create a new health program
router.post('/', validateProgram, programController.createProgram);

// Get all health programs
router.get('/', programController.getAllPrograms);

// Get a specific health program by ID
router.get('/:id', programController.getProgramById);

// Update a health program
router.put('/:id', validateProgram, programController.updateProgram);

// Delete a health program
router.delete('/:id', programController.deleteProgram);

// Get all clients enrolled in a specific program
router.get('/:id/clients', programController.getProgramClients);

export default router;