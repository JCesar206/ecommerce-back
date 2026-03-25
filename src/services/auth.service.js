const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/jwt");
// Register
exports.register = async ({ email, password }) => {
  const [exists] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (exists.length > 0) {
    throw new Error("Usuario ya existe");
  }

  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (id, email, password) VALUES (?, ?, ?)",
    [uuidv4(), email, hashed]
  );
  return { message: "Usuario registrado" };
};
// Login
exports.login = async ({ email, password }) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    throw new Error("Usuario no encontrado");
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Password incorrecto");
  }

  const payload = {
    id: user.id,
    role: user.role
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  // Guardar refresh token en DB
  await pool.query(
    "INSERT INTO refresh_tokens (id, user_id, token) VALUES (?, ?, ?)",
    [uuidv4(), user.id, refreshToken]
  );
  return { accessToken, refreshToken };
};
// Refresh
exports.refresh = async (token) => {
  if (!token) {
    throw new Error("No refresh token");
  }

  const [rows] = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token = ?",
    [token]
  );

  if (rows.length === 0) {
    throw new Error("Token inválido");
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const payload = {
    id: decoded.id,
    role: decoded.role
  };

  const newAccessToken = generateAccessToken(payload);
  return { accessToken: newAccessToken };
};
// Logout
exports.logout = async (token) => {
  await pool.query(
    "DELETE FROM refresh_tokens WHERE token = ?",
    [token]
  );
};