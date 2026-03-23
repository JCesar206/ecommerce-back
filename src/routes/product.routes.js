const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller.js");
const upload = require("../middlewares/upload.middleware.js")

const auth = require("../middlewares/auth.middleware.js");
const role = require("../middlewares/role.middleware.js");
// Público
router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
// Admin
router.post("/", auth, role("admin"), upload.single("image"), productController.create);
router.put("/:id", auth, role("admin"), upload.single("image"), productController.update);
router.delete("/:id", auth, role("admin"), productController.remove);

module.exports = router;