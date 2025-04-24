import { validationResult } from 'express-validator';
import Enrollment from '../models/Enrollment.js';
import Client from '../models/Client.js';
import Program from '../models/Program.js';

export const enrollClient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { clientId, programId } = req.body;
    
    // Verify client exists
    await Client.getById(clientId);
    
    // Verify program exists
    await Program.getById(programId);
    
    // Check if already enrolled
    const isEnrolled = await Enrollment.isEnrolled(clientId, programId);
    if (isEnrolled) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Client is already enrolled in this program'
      });
    }
    
    const enrollment = await Enrollment.create(clientId, programId);
    res.status(201).json(enrollment);
  } catch (error) {
    if (error.message === 'Client not found' || error.message === 'Program not found') {
      return res.status(404).json({ error: 'Not found', message: error.message });
    }
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.getAll();
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.getById(req.params.id);
    res.json(enrollment);
  } catch (error) {
    if (error.message === 'Enrollment not found') {
      return res.status(404).json({ error: 'Not found', message: error.message });
    }
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const getClientEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.getByClientId(req.params.clientId);
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const getProgramEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.getByProgramId(req.params.programId);
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const updateEnrollmentStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { status } = req.body;
    const validStatuses = ['active', 'completed', 'withdrawn'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Validation error',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const enrollment = await Enrollment.updateStatus(req.params.id, status);
    res.json(enrollment);
  } catch (error) {
    if (error.message === 'Enrollment not found') {
      return res.status(404).json({ error: 'Not found', message: error.message });
    }
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const unenrollClient = async (req, res) => {
  try {
    const deleted = await Enrollment.delete(req.params.id);
    if (deleted) {
      res.json({ message: 'Client unenrolled successfully' });
    } else {
      res.status(404).json({ error: 'Not found', message: 'Enrollment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};