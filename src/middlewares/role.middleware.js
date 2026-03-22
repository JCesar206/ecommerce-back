// Middleware de autorización por rol
module.exports = (requiredRole) => {
  return (req, res, next) => {
    try {
      // No hay usuario (no pasó por auth)
      if (!req.user) {
        return res.status(401).json({ error: "No autenticado" });
      }
      // No tiene el rol requerido
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ error: "Sin permisos" });
      }
      next();
    } catch (error) {
      return res.status(500).json({ error: "Error en autorización" });
    }
  };
};