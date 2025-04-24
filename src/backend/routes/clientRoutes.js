import express from 'express';
import { body } from 'express-validator';
import * as clientController from '../controllers/clientController.js';

const router = express.Router();

// Validation middleware
const validateClient = [
  body('name')
    .notEmpty().withMessage('Client name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 120 }).withMessage('Age must be between 0 and 120'),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say']).withMessage('Invalid gender value'),
  body('contact')
    .optional()
    .isLength({ max: 50 }).withMessage('Contact cannot exceed 50 characters'),
  body('address')
    .optional()
    .isLength({ max: 200 }).withMessage('Address cannot exceed 200 characters')
];

// Create a new client
router.post('/', validateClient, clientController.createClient);

// Get all clients
router.get('/', clientController.getAllClients);

// Search for clients
router.get('/search', clientController.searchClients);

// Get a specific client by ID
router.get('/:id', clientController.getClientById);

// Update a client
router.put('/:id', validateClient, clientController.updateClient);

// Delete a client
router.delete('/:id', clientController.deleteClient);

// Get programs a client is enrolled in
router.get('/:id/programs', clientController.getClientPrograms);

// Get client profile (client + enrollments)
router.get('/:id/profile', clientController.getClientProfile);

export default router;