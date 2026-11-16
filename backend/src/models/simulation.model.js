const { pool } = require('../config/db');
const SimulationRequestModel = require('./simulationRequest.model');
const AlgorithmResultModel = require('./algorithmResult.model');
const CacheStateModel = require('./cacheState.model');

class SimulationModel {
  static async create({ cache_size, reference_string }, executor = pool) {
    const query = `
      INSERT INTO simulations (cache_size, reference_string)
      VALUES (?, ?)
    `;
    const [result] = await executor.execute(query, [cache_size, reference_string]);
    return {
      id: result.insertId,
      cache_size,
      reference_string,
      created_at: new Date()
    };
  }

  static async saveFullSimulation({ cache_size, reference_string, pages, details }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [simResult] = await connection.execute(
        `INSERT INTO simulations (cache_size, reference_string) VALUES (?, ?)`,
        [cache_size, reference_string]
      );
      const simulationId = simResult.insertId;

      await SimulationRequestModel.bulkCreate(simulationId, pages, connection);

      for (const algoKey of Object.keys(details)) {
        const algoData = details[algoKey];
        await AlgorithmResultModel.create({
          simulation_id: simulationId,
          algorithm_name: algoData.algorithm,
          hits: algoData.hits,
          misses: algoData.misses,
          hit_ratio: algoData.hitRatio,
          memory_overhead: algoData.memoryOverhead || `${cache_size * 4} Bytes`,
          execution_time: algoData.executionTimeMs
        }, connection);

        await CacheStateModel.bulkCreate(
          simulationId,
          algoData.algorithm,
          algoData.steps.map((st, idx) => ({
            algorithm_name: algoData.algorithm,
            request_order: idx + 1,
            page_number: st.request,
            cache_state: st.cacheState,
            result: st.result,
            evicted_page: st.evictedPage
          })),
          connection
        );
      }

      await connection.commit();
      return simulationId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async findAll({ limit = 50, offset = 0 } = {}) {
    const query = `
      SELECT 
        s.id,
        s.cache_size,
        s.reference_string,
        s.created_at,
        COUNT(DISTINCT r.id) AS total_requests,
        COUNT(DISTINCT ar.id) AS executed_algorithms_count
      FROM simulations s
      LEFT JOIN simulation_requests r ON s.id = r.simulation_id
      LEFT JOIN algorithm_results ar ON s.id = ar.simulation_id
      GROUP BY s.id
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(query, [parseInt(limit, 10), parseInt(offset, 10)]);
    return rows;
  }

  static async findById(id) {
    const query = `SELECT * FROM simulations WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  static async findFullDetailsById(id) {
    const simulation = await this.findById(id);
    if (!simulation) return null;

    const [requests] = await pool.execute(
      `SELECT id, request_order, page_number FROM simulation_requests WHERE simulation_id = ? ORDER BY request_order ASC`,
      [id]
    );

    const [results] = await pool.execute(
      `SELECT id, algorithm_name, hits, misses, hit_ratio, memory_overhead, execution_time, created_at 
       FROM algorithm_results WHERE simulation_id = ? ORDER BY id ASC`,
      [id]
    );

    return {
      ...simulation,
      requests,
      algorithm_results: results
    };
  }

  static async deleteById(id) {
    const query = `DELETE FROM simulations WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = SimulationModel;