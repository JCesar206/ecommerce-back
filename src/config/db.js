const mysql = require("mysql2/promise");
require("dotenv").config();

const { logger } = require("../utils/logger");

// Pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    logger.info("✅ MySQL conectado correctamente");
    connection.release();
  } catch (error) {
    logger.error(`❌ Error conectando a MySQL: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  pool,
  testConnection
};