const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

require("dotenv").config();

const { logger } = require("./utils/logger.js");
const { testConnection } = require("./config/db.js");
const { initDatabase } = require("./scripts/init.js"); // tu initDatabase
const seedDB = require("./scripts/seed.js"); // tu seed refactorizado
const authRoutes = require("./routes/auth.routes.js");
const productRoutes = require("./routes/product.routes.js");

const errorMiddleware = require("./middlewares/error.middleware.js");

const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/uploads", express.static("uploads"));

// Test
app.get("/", (req, res) => {
  res.send("🚀 API OK");
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    // Probar conexión
    await testConnection();
    // Crear DB y tablas si no existen
    await initDatabase();
    // Ejecutar seed idempotente
    await seedDB();
    // Arrancar servidor
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
})();