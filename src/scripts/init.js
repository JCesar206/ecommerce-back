const mysql = require("mysql2/promise");
const { logger } = require("../utils/logger");

async function initDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });

    // Crear DB si no existe
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "ecommerce_db"}`);
    await connection.query(`USE ${process.env.DB_NAME || "ecommerce_db"}`);

    // Crear tablas si no existen
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        role ENUM("user","admin") DEFAULT "user",
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) UNIQUE,
        price DECIMAL(10,2),
        stock INT,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(36),
        total DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        product_id VARCHAR(36),
        quantity INT,
        price DECIMAL(10,2)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36),
        token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    logger.info("🔥 DB y tablas creadas/verificadas correctamente");
  } catch (error) {
    logger.error("❌ Error al inicializar la DB:", error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

module.exports = { initDatabase };