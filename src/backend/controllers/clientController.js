import { validationResult } from 'express-validator';
import Client from '../models/Client.js';
import Program from '../models/Program.js';

export const createClient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const clientData = {
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      contact: req.body.contact,
      address: req.body.address
    };
    
    const client = await Client.create(clientData);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.getAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await Client.getById(req.params.id);
    res.json(client);
  } catch (error) {
    if (error.message === 'Client not found') {
      return res.status(404).json({ error: 'Not found', message: error.message });
    }
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const searchClients = async (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query.trim()) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Search query is required' 
      });
    }
    
    const clients = await Client.search(query);
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const updateClient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const clientData = {
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      contact: req.body.contact,
      address: req.body.address
    };
    
    const client = await Client.update(req.params.id, clientData);
    res.json(client);
  } catch (error) {
    if (error.message === 'Client not found') {
      return res.status(404).json({ error: 'Not found', message: error.message });
    }
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const deleted = await Client.delete(req.params.id);
    if (deleted) {
      res.json({ message: 'Client deleted successfully' });
    } else {
      res.status(404).json({ error: 'Not found', message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const getClientPrograms = async (req, res) => {
  try {
    // First check if client exists
    await Client.getById(req.params.id);
    
    // Get programs the client is enrolled in
    const programs = await Program.getByClientId(req.params.id);
    res.json(programs);
  } catch (error) {
    if (error.message === 'Client not found') {
      return res.status(404).json({ error: 'Not found', message: error.message });
    }
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const getClientProfile = async (req, res) => {
  try {
    // Get client information
    const client = await Client.getById(req.params.id);
    
    // Get client's enrollments with program details
    const enrollments = await import('../models/Enrollment.js')
      .then(module => module.default.getByClientId(req.params.id));
    
    // Combine into a single profile object
    const profile = {
      ...client,
      enrollments
    };
    
    res.json(profile);
  } catch (error) {
    if (error.message === 'Client not found') {
      return res.status(404).json({ error: 'Not found', message: error.message });
    }
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};