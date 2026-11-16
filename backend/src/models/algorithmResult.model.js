const { pool } = require('../config/db');

class AlgorithmResultModel {
  static async create({
    simulation_id,
    algorithm_name,
    hits,
    misses,
    hit_ratio,
    memory_overhead = '0 KB',
    execution_time = 0.0
  }, executor = pool) {
    const query = `
      INSERT INTO algorithm_results 
        (simulation_id, algorithm_name, hits, misses, hit_ratio, memory_overhead, execution_time)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await executor.execute(query, [
      simulation_id,
      algorithm_name,
      hits,
      misses,
      hit_ratio,
      memory_overhead,
      execution_time
    ]);

    return {
      id: result.insertId,
      simulation_id,
      algorithm_name,
      hits,
      misses,
      hit_ratio,
      memory_overhead,
      execution_time,
      created_at: new Date()
    };
  }

  static async bulkCreate(simulation_id, results, executor = pool) {
    if (!results || results.length === 0) return [];

    const values = results.map(r => [
      simulation_id,
      r.algorithm_name,
      r.hits || 0,
      r.misses || 0,
      r.hit_ratio || 0.0,
      r.memory_overhead || '0 KB',
      r.execution_time || 0.0
    ]);

    const query = `
      INSERT INTO algorithm_results 
        (simulation_id, algorithm_name, hits, misses, hit_ratio, memory_overhead, execution_time)
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
      SELECT 
        id, 
        simulation_id, 
        algorithm_name, 
        hits, 
        misses, 
        hit_ratio, 
        memory_overhead, 
        execution_time, 
        created_at
      FROM algorithm_results
      WHERE simulation_id = ?
      ORDER BY hit_ratio DESC, execution_time ASC
    `;
    const [rows] = await pool.execute(query, [simulation_id]);
    return rows;
  }
}

module.exports = AlgorithmResultModel;