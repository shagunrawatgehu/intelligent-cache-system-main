const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cache_prediction_db',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  queueLimit: 0,
  multipleStatements: true
});

const checkDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return { connected: true, message: 'MySQL connected successfully' };
  } catch (error) {
    return { connected: false, message: error.message };
  }
};

const initDatabase = async () => {
  try {
    const rootConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      multipleStatements: true
    });

    const schemaPath = path.resolve(__dirname, '../../../schema.sql');
    const fallbackPath = path.resolve(__dirname, '../../schema.sql');
    const targetPath = fs.existsSync(fallbackPath) ? fallbackPath : schemaPath;

    if (fs.existsSync(targetPath)) {
      const sql = fs.readFileSync(targetPath, 'utf8');
      await rootConnection.query(sql);
    }
    await rootConnection.end();

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = {
  pool,
  checkDbConnection,
  initDatabase
};