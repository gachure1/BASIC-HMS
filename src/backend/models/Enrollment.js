import { run, get, all } from '../utils/database.js';

export default {
  /**
   * Enroll a client in a health program
   * @param {number} clientId - Client ID
   * @param {number} programId - Program ID
   * @returns {Promise<object>} - The created enrollment object
   */
  async create(clientId, programId) {
    try {
      const result = await run(
        'INSERT INTO enrollments (client_id, program_id) VALUES (?, ?)',
        [clientId, programId]
      );
      return this.getById(result.id);
    } catch (error) {
      throw new Error(`Error enrolling client: ${error.message}`);
    }
  },

  /**
   * Get all enrollments
   * @returns {Promise<Array>} - Array of enrollment objects
   */
  async getAll() {
    try {
      return await all(`
        SELECT e.*, c.name as client_name, p.name as program_name 
        FROM enrollments e
        JOIN clients c ON e.client_id = c.id
        JOIN programs p ON e.program_id = p.id
        ORDER BY e.enrolled_at DESC
      `);
    } catch (error) {
      throw new Error(`Error fetching enrollments: ${error.message}`);
    }
  },

  /**
   * Get an enrollment by ID
   * @param {number} id - Enrollment ID
   * @returns {Promise<object>} - Enrollment object
   */
  async getById(id) {
    try {
      const enrollment = await get(`
        SELECT e.*, c.name as client_name, p.name as program_name 
        FROM enrollments e
        JOIN clients c ON e.client_id = c.id
        JOIN programs p ON e.program_id = p.id
        WHERE e.id = ?
      `, [id]);
      
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }
      return enrollment;
    } catch (error) {
      throw new Error(`Error fetching enrollment: ${error.message}`);
    }
  },
  
  /**
   * Get enrollments by client ID
   * @param {number} clientId - Client ID
   * @returns {Promise<Array>} - Array of enrollment objects
   */
  async getByClientId(clientId) {
    try {
      return await all(`
        SELECT e.*, p.name as program_name, p.description
        FROM enrollments e
        JOIN programs p ON e.program_id = p.id
        WHERE e.client_id = ?
        ORDER BY e.enrolled_at DESC
      `, [clientId]);
    } catch (error) {
      throw new Error(`Error fetching client enrollments: ${error.message}`);
    }
  },
  
  /**
   * Get enrollments by program ID
   * @param {number} programId - Program ID
   * @returns {Promise<Array>} - Array of enrollment objects
   */
  async getByProgramId(programId) {
    try {
      return await all(`
        SELECT e.*, c.name as client_name, c.age, c.gender
        FROM enrollments e
        JOIN clients c ON e.client_id = c.id
        WHERE e.program_id = ?
        ORDER BY e.enrolled_at DESC
      `, [programId]);
    } catch (error) {
      throw new Error(`Error fetching program enrollments: ${error.message}`);
    }
  },

  /**
   * Update an enrollment's status
   * @param {number} id - Enrollment ID
   * @param {string} status - New status ('active', 'completed', 'withdrawn')
   * @returns {Promise<object>} - Updated enrollment object
   */
  async updateStatus(id, status) {
    try {
      await run(
        'UPDATE enrollments SET status = ? WHERE id = ?',
        [status, id]
      );
      return this.getById(id);
    } catch (error) {
      throw new Error(`Error updating enrollment status: ${error.message}`);
    }
  },

  /**
   * Delete an enrollment (unenroll a client from a program)
   * @param {number} id - Enrollment ID
   * @returns {Promise<boolean>} - Success status
   */
  async delete(id) {
    try {
      const result = await run('DELETE FROM enrollments WHERE id = ?', [id]);
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Error deleting enrollment: ${error.message}`);
    }
  },
  
  /**
   * Check if a client is enrolled in a specific program
   * @param {number} clientId - Client ID
   * @param {number} programId - Program ID
   * @returns {Promise<boolean>} - Whether the client is enrolled
   */
  async isEnrolled(clientId, programId) {
    try {
      const enrollment = await get(
        'SELECT * FROM enrollments WHERE client_id = ? AND program_id = ?',
        [clientId, programId]
      );
      return !!enrollment;
    } catch (error) {
      throw new Error(`Error checking enrollment: ${error.message}`);
    }
  }
};