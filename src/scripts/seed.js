const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { logger } = require("../utils/logger");

async function seedDB() {
  try {
    logger.info("🌱 Insertando datos iniciales...");

    // Usuario admin
    const adminEmail = "admin@test.com";
    const [adminExists] = await pool.query("SELECT id FROM users WHERE email = ?", [adminEmail]);
    if (adminExists.length === 0) {
      const adminPass = await bcrypt.hash("123456", 10);
      await pool.query(
        "INSERT INTO users (id, email, password, role) VALUES (?,?,?,?)",
        [uuidv4(), adminEmail, adminPass, "admin"]
      );
      logger.info(`✅ Usuario ${adminEmail} creado`);
    } else {
      logger.info(`ℹ️ Usuario ${adminEmail} ya existe, se omite`);
    }

    // Usuario normal
    const userEmail = "user@test.com";
    const [userExists] = await pool.query("SELECT id FROM users WHERE email = ?", [userEmail]);
    if (userExists.length === 0) {
      const userPass = await bcrypt.hash("123456", 10);
      await pool.query(
        "INSERT INTO users (id, email, password, role) VALUES (?,?,?,?)",
        [uuidv4(), userEmail, userPass, "user"]
      );
      logger.info(`✅ Usuario ${userEmail} creado`);
    } else {
      logger.info(`ℹ️ Usuario ${userEmail} ya existe, se omite`);
    }

    // Productos iniciales
    const products = [
      ["Laptop Gamer", 25000, 10],
      ["Mouse RGB", 500, 50],
      ["Teclado Mecánico", 1500, 30]
    ];

    for (const [name, price, stock] of products) {
      const [productExists] = await pool.query("SELECT id FROM products WHERE name = ?", [name]);
      if (productExists.length === 0) {
        await pool.query(
          "INSERT INTO products (id, name, price, stock) VALUES (?,?,?,?)",
          [uuidv4(), name, price, stock]
        );
        logger.info(`✅ Producto ${name} creado`);
      } else {
        logger.info(`ℹ️ Producto ${name} ya existe, se omite`);
      }
    }

    logger.info("🎉 Seed completado sin duplicados");
  } catch (error) {
    logger.error(`❌ Error seed: ${error.message}`);
    throw error;
  }
}

module.exports = seedDB;