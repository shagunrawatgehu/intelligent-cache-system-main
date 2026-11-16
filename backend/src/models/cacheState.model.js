const { pool } = require('../config/db');

class CacheStateModel {
  static async create({
    simulation_id,
    algorithm_name,
    request_order,
    page_number,
    cache_state,
    result,
    evicted_page = null
  }, executor = pool) {
    const query = `
      INSERT INTO cache_states 
        (simulation_id, algorithm_name, request_order, page_number, cache_state, result, evicted_page)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const stateJson = typeof cache_state === 'string' ? cache_state : JSON.stringify(cache_state);
    const [res] = await executor.execute(query, [
      simulation_id,
      algorithm_name,
      request_order,
      page_number,
      stateJson,
      result.toUpperCase(),
      evicted_page
    ]);

    return {
      id: res.insertId,
      simulation_id,
      algorithm_name,
      request_order,
      page_number,
      cache_state,
      result: result.toUpperCase(),
      evicted_page
    };
  }

  static async bulkCreate(simulation_id, algorithm_name, states, executor = pool) {
    if (!states || states.length === 0) return [];

    const values = states.map((s, idx) => [
      simulation_id,
      s.algorithm_name || algorithm_name,
      s.request_order !== undefined ? s.request_order : idx + 1,
      s.page_number,
      typeof s.cache_state === 'string' ? s.cache_state : JSON.stringify(s.cache_state || []),
      (s.result || 'MISS').toUpperCase(),
      s.evicted_page !== undefined ? s.evicted_page : null
    ]);

    const query = `
      INSERT INTO cache_states 
        (simulation_id, algorithm_name, request_order, page_number, cache_state, result, evicted_page)
      VALUES ?
    `;

    const [res] = await executor.query(query, [values]);
    return {
      affectedRows: res.affectedRows,
      firstInsertId: res.insertId
    };
  }

  static async findBySimulationId(simulation_id, algorithm_name = null) {
    let query = `
      SELECT 
        id, 
        simulation_id, 
        algorithm_name, 
        request_order, 
        page_number, 
        cache_state, 
        result, 
        evicted_page, 
        created_at
      FROM cache_states
      WHERE simulation_id = ?
    `;
    const params = [simulation_id];

    if (algorithm_name) {
      query += ` AND algorithm_name = ?`;
      params.push(algorithm_name);
    }

    query += ` ORDER BY algorithm_name ASC, request_order ASC`;

    const [rows] = await pool.execute(query, params);
    
    return rows.map(row => ({
      ...row,
      cache_state: typeof row.cache_state === 'string' ? JSON.parse(row.cache_state) : row.cache_state
    }));
  }
}

module.exports = CacheStateModel;