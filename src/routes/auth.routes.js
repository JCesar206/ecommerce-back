const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// Auth Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

// Test Rápido
router.get("/ping", (req, res) => {
  res.send("Auth OK");
});

module.exports = router;