const { pool } = require('../config/db');

class SimulationRequestModel {
  static async create({ simulation_id, request_order, page_number }, executor = pool) {
    const query = `
      INSERT INTO simulation_requests (simulation_id, request_order, page_number)
      VALUES (?, ?, ?)
    `;
    const [result] = await executor.execute(query, [simulation_id, request_order, page_number]);
    return {
      id: result.insertId,
      simulation_id,
      request_order,
      page_number
    };
  }

  static async bulkCreate(simulation_id, requests, executor = pool) {
    if (!requests || requests.length === 0) return [];

    const values = requests.map((req, idx) => [
      simulation_id,
      req.request_order !== undefined ? req.request_order : idx + 1,
      req.page_number !== undefined ? req.page_number : req
    ]);

    const query = `
      INSERT INTO simulation_requests (simulation_id, request_order, page_number)
      VALUES ?
    `;

    const [result] = await executor.query(query, [values]);
    return {
      affectedRows: result.affectedRows,
      firstInsertId: result.insertId
    };
  }

  static async findBySimulationId(simulation_id) {
    const query = `
      SELECT id, simulation_id, request_order, page_number, created_at
      FROM simulation_requests
      WHERE simulation_id = ?
      ORDER BY request_order ASC
    `;
    const [rows] = await pool.execute(query, [simulation_id]);
    return rows;
  }
}

module.exports = SimulationRequestModel;