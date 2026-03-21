const { logger } = require("../utils/logger");
// Middleware global de errores
module.exports = (err, req, res, next) => {
  // Log completo
  logger.error(err.message);
  // Puedes personalizar errores aquí
  if (err.message.includes("Usuario ya existe")) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message.includes("Usuario no encontrado")) {
    return res.status(404).json({ error: err.message });
  }
  if (err.message.includes("Password incorrecto")) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message.includes("Token")) {
    return res.status(401).json({ error: err.message });
  }
  // Fallback
  return res.status(500).json({
    error: "Error interno del servidor"
  });
};