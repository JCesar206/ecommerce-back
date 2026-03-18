const { verifyAccessToken } = require("../utils/jwt");
// Middleware de autenticación
module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // No hay header
    if (!authHeader) {
      return res.status(401).json({ error: "No autorizado (sin token)" });
    }
    // Formato: Bearer token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token inválido" });
    }
    // Verificar token
    const decoded = verifyAccessToken(token);
    // Guardar usuario en request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token expirado o inválido" });
  }
};