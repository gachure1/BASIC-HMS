import { run, get, all } from '../utils/database.js';

export default {
  /**
   * Create a new health program
   * @param {string} name - Name of the health program
   * @param {string} description - Description of the health program
   * @returns {Promise<object>} - The created program object
   */
  async create(name, description) {
    try {
      const result = await run(
        'INSERT INTO programs (name, description) VALUES (?, ?)',
        [name, description]
      );
      return this.getById(result.id);
    } catch (error) {
      throw new Error(`Error creating program: ${error.message}`);
    }
  },

  /**
   * Get all health programs
   * @returns {Promise<Array>} - Array of program objects
   */
  async getAll() {
    try {
      return await all('SELECT * FROM programs ORDER BY name');
    } catch (error) {
      throw new Error(`Error fetching programs: ${error.message}`);
    }
  },

  /**
   * Get a health program by ID
   * @param {number} id - Program ID
   * @returns {Promise<object>} - Program object
   */
  async getById(id) {
    try {
      const program = await get('SELECT * FROM programs WHERE id = ?', [id]);
      if (!program) {
        throw new Error('Program not found');
      }
      return program;
    } catch (error) {
      throw new Error(`Error fetching program: ${error.message}`);
    }
  },

  /**
   * Update a health program
   * @param {number} id - Program ID
   * @param {string} name - Updated name
   * @param {string} description - Updated description
   * @returns {Promise<object>} - Updated program object
   */
  async update(id, name, description) {
    try {
      await run(
        'UPDATE programs SET name = ?, description = ? WHERE id = ?',
        [name, description, id]
      );
      return this.getById(id);
    } catch (error) {
      throw new Error(`Error updating program: ${error.message}`);
    }
  },

  /**
   * Delete a health program
   * @param {number} id - Program ID
   * @returns {Promise<boolean>} - Success status
   */
  async delete(id) {
    try {
      const result = await run('DELETE FROM programs WHERE id = ?', [id]);
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Error deleting program: ${error.message}`);
    }
  },
  
  /**
   * Get programs by client ID (programs that client is enrolled in)
   * @param {number} clientId - Client ID
   * @returns {Promise<Array>} - Array of program objects
   */
  async getByClientId(clientId) {
    try {
      return await all(
        `SELECT p.* FROM programs p
         JOIN enrollments e ON p.id = e.program_id
         WHERE e.client_id = ?
         ORDER BY p.name`,
        [clientId]
      );
    } catch (error) {
      throw new Error(`Error fetching client programs: ${error.message}`);
    }
  }
};