const pool = require("../config/db.js");
const productService = require("../services/product.service.js");
const fs = require("fs");
const path = require("path");

// GetAll
exports.getAll = async (req, res, next) => {
  try {
    const products = await productService.getAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// GetOne
exports.getOne = async (req, res, next) => {
  try {
    const product = await productService.getOne(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Create
exports.create = async (req, res, next) => {
  try {
    const { name, price, stock, description } = req.body;
    if (!name || price == null || stock == null) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    // Manejo de imagen
    const image = req.file ? req.file.filename : null;

    const result = await productService.create({ name, price, stock, description, image });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// Update
exports.update = async (req, res, next) => {
  try {
    const { name, price, stock, description } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : undefined; // No sobreescribir sino hay imagen
    const result = await productService.update(req.params.id, { name, price, stock, description, image });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Delete
exports.remove = async (req, res, next) => {
  try {
    const product = await productService.getOne(req.params.id);
    // Borrar imagen (Si existe)
    if (product.image) {
      const imagePath = path.join(__dirname, "../..", product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const result = await productService.remove(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/* Update
if (req.file && product.image) {
  const oldPath = path.join(__dirname, "../../", product.image);
  if (fs.existsSync(oldPath)) {
  fs.unlinkSync(oldPath);
  }
}
*/