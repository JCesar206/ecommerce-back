const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { logger } = require("../utils/logger");

const seedDB = async () => {
  try {
    logger.info("🌱 Insertando datos de prueba...");
    // Usuario admin
    const adminPass = await bcrypt.hash("123456", 10);
    await pool.query(
      "INSERT INTO users (id, email, password, role) VALUES (?,?,?,?)",
      [uuidv4(), "admin@test.com", adminPass, "admin"]
    );
    // Usuario normal
    const userPass = await bcrypt.hash("123456", 10);
    await pool.query(
      "INSERT INTO users (id, email, password, role) VALUES (?,?,?,?)",
      [uuidv4(), "user@test.com", userPass, "user"]
    );
    // Productos
    const products = [
      ["Laptop Gamer", 25000, 10],
      ["Mouse RGB", 500, 50],
      ["Teclado Mecánico", 1500, 30]
    ];

    for (const p of products) {
      await pool.query(
        "INSERT INTO products (id, name, price, stock) VALUES (?,?,?,?)",
        [uuidv4(), p[0], p[1], p[2]]
      );
    }
    logger.info("✅ Seed completado");
    process.exit();
  } catch (error) {
    logger.error(`❌ Error seed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();