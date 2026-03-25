const { pool } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// GetAll
exports.getAll = async () => {
  const [rows] = await pool.query("SELECT * FROM products");
  return rows;
};

// GetOne
exports.getOne = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    throw new Error("Producto no encontrado");
  }
  return rows[0];
};

// Create
exports.create = async ({ id, name, price, stock, description, image }) => {
  // const id = uuidv4();
  await pool.query(
    "INSERT INTO products (id, name, price, stock, description, image) VALUES (?,?,?,?,?,?)",
    [id, name, price, stock, description, image]
  );
  return { message: "Producto creado", id };
};

// Update
exports.update = async (id, { name, price, stock, description, image }) => {
  await pool.query(
    "UPDATE products SET name=?, price=?, stock=?, description=?, image=? WHERE id=?",
    [name, price, stock, description, image, id]
  );
  return { message: "Producto actualizado" };
};

// Delete
exports.remove = async (id) => {
  await pool.query(
    "DELETE FROM products WHERE id = ?",
    [id]
  );
  return { message: "Producto eliminado" };
};