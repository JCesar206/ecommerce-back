const jwt = require("jsonwebtoken");
// Generar Access Token (corto)
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "15m"
  });
};
// Generar Refresh Token (largo)
const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d"
  });
};
// Verificar Access Token
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
// Verificar Refresh Token
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};