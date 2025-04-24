import { validationResult } from 'express-validator';
import Program from '../models/Program.js';

export const createProgram = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description } = req.body;
    const program = await Program.create(name, description);
    res.status(201).json(program);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'A program with this name already exists' 
      });
    }
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.getAll();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const getProgramById = async (req, res) => {
  try {
    const program = await Program.getById(req.params.id);
    res.json(program);
  } catch (error) {
    if (error.message === 'Program not found') {
      return res.status(404).json({ error: 'Not found', message: error.message });
    }
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const updateProgram = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description } = req.body;
    const program = await Program.update(req.params.id, name, description);
    res.json(program);
  } catch (error) {
    if (error.message === 'Program not found') {
      return res.status(404).json({ error: 'Not found', message: error.message });
    }
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'A program with this name already exists' 
      });
    }
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const deleted = await Program.delete(req.params.id);
    if (deleted) {
      res.json({ message: 'Program deleted successfully' });
    } else {
      res.status(404).json({ error: 'Not found', message: 'Program not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const getProgramClients = async (req, res) => {
  try {
    // First check if program exists
    await Program.getById(req.params.id);
    
    // Use the Client model's method to get clients by program ID
    const clients = await import('../models/Client.js')
      .then(module => module.default.getByProgramId(req.params.id));
      
    res.json(clients);
  } catch (error) {
    if (error.message === 'Program not found') {
      return res.status(404).json({ error: 'Not found', message: error.message });
    }
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};