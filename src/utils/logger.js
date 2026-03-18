const winston = require("winston");
const path = require("path");
// Ruta de logs
const logDir = "logs";
// Formato de logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// Logger principal
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    // Consola
    new winston.transports.Console(),
    // Archivo errores
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error"
    }),
    // Archivo general
    new winston.transports.File({
      filename: path.join(logDir, "combined.log")
    })
  ]
});

module.exports = { logger };