const authService = require("../services/auth.service");
const { logger } = require("../utils/logger");

// Register
exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ error: "Email y password requeridos" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password mínimo 6 caracteres" });
    }
    const result = await authService.register({ email, password });
    logger.info(`Usuario registrado: ${email}`);
    res.status(201).json(result);
  } catch (err) {
    logger.error(`Register error: ${err.message}`);
    next(err);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Credenciales requeridas" });
    }

    const { accessToken, refreshToken } = await authService.login({
      email,
      password
    });

    // Cookie segura
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false
    });
    logger.info(`Login exitoso: ${email}`);
    res.json({ accessToken });
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    next(err);
  }
};

// Refresh Token
exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: "No refresh token" });
    }

    const data = await authService.refresh(token);
    logger.info("Token refrescado");
    res.json(data);
  } catch (err) {
    logger.error(`Refresh error: ${err.message}`);
    next(err);
  }
};

// Logout
exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(400).json({ error: "No token para logout" });
    }

    await authService.logout(token);
    res.clearCookie("refreshToken");
    logger.info("Logout exitoso");
    res.json({ message: "Logout OK" });
  } catch (err) {
    logger.error(`Logout error: ${err.message}`);
    next(err);
  }
};