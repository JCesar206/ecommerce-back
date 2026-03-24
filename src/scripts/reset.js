const { pool } = require("../config/db");
const { logger } = require("../utils/logger");

const resetDB = async () => {
  try {
    logger.info("⚠️ Reseteando base de datos...");
    
    // Borra Tablas
    await pool.query("DROP TABLE IF EXISTS users");
    await pool.query("DROP TABLE IF EXISTS refresh_tokens");
    await pool.query("DROP TABLE IF EXISTS products");
    await pool.query("DROP TABLE IF EXISTS orders");
    await pool.query("DROP TABLE IF EXISTS order_items");
    
    // Users
    await pool.query(`
      CREATE TABLE users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT "user",
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Refresh Tokens
    await pool.query(`
      CREATE TABLE refresh_tokens (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36),
        token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Products
    await pool.query(`
      CREATE TABLE products (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255),
        price DECIMAL(10,2),
        stock INT,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders
    await pool.query(`
      CREATE TABLE orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      total DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Ordes_items
    await pool.query(`
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      product_id INT,
      quantity INT,
      price DECIMAL(10,2)
      );
    `)

    logger.info("✅ Base de datos reseteada correctamente");
    process.exit();
  } catch (error) {
    logger.error(`❌ Error reset DB: ${error.message}`);
    process.exit(1);
  }
};

resetDB();