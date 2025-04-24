import { run, get, all } from '../utils/database.js';

export default {
  /**
   * Create a new client
   * @param {object} clientData - Client information
   * @returns {Promise<object>} - The created client object
   */
  async create(clientData) {
    const { name, age, gender, contact, address } = clientData;
    
    try {
      const result = await run(
        'INSERT INTO clients (name, age, gender, contact, address) VALUES (?, ?, ?, ?, ?)',
        [name, age, gender, contact, address || null]
      );
      return this.getById(result.id);
    } catch (error) {
      throw new Error(`Error creating client: ${error.message}`);
    }
  },

  /**
   * Get all clients
   * @returns {Promise<Array>} - Array of client objects
   */
  async getAll() {
    try {
      return await all('SELECT * FROM clients ORDER BY name');
    } catch (error) {
      throw new Error(`Error fetching clients: ${error.message}`);
    }
  },

  /**
   * Get a client by ID
   * @param {number} id - Client ID
   * @returns {Promise<object>} - Client object
   */
  async getById(id) {
    try {
      const client = await get('SELECT * FROM clients WHERE id = ?', [id]);
      if (!client) {
        throw new Error('Client not found');
      }
      return client;
    } catch (error) {
      throw new Error(`Error fetching client: ${error.message}`);
    }
  },

  /**
   * Search clients by name or ID
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of matching client objects
   */
  async search(query) {
    try {
      const searchTerm = `%${query}%`;
      return await all(
        `SELECT * FROM clients 
        WHERE name LIKE ? OR id = ? 
        ORDER BY name`,
        [searchTerm, query]
      );
    } catch (error) {
      throw new Error(`Error searching clients: ${error.message}`);
    }
  },

  /**
   * Update a client
   * @param {number} id - Client ID
   * @param {object} clientData - Updated client information
   * @returns {Promise<object>} - Updated client object
   */
  async update(id, clientData) {
    const { name, age, gender, contact, address } = clientData;
    
    try {
      await run(
        'UPDATE clients SET name = ?, age = ?, gender = ?, contact = ?, address = ? WHERE id = ?',
        [name, age, gender, contact, address || null, id]
      );
      return this.getById(id);
    } catch (error) {
      throw new Error(`Error updating client: ${error.message}`);
    }
  },

  /**
   * Delete a client
   * @param {number} id - Client ID
   * @returns {Promise<boolean>} - Success status
   */
  async delete(id) {
    try {
      const result = await run('DELETE FROM clients WHERE id = ?', [id]);
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Error deleting client: ${error.message}`);
    }
  },
  
  /**
   * Get clients by program ID (clients enrolled in a specific program)
   * @param {number} programId - Program ID
   * @returns {Promise<Array>} - Array of client objects
   */
  async getByProgramId(programId) {
    try {
      return await all(
        `SELECT c.* FROM clients c
         JOIN enrollments e ON c.id = e.client_id
         WHERE e.program_id = ?
         ORDER BY c.name`,
        [programId]
      );
    } catch (error) {
      throw new Error(`Error fetching program clients: ${error.message}`);
    }
  }
};