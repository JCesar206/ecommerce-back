const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		const uniqueName =
			Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
			cb(null, uniqueName);
	},
});

// Filtro (solo imagenes)
const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Formato no permitido"), false);
	}
};

const upload = multer({ storage, fileFilter });

module.exports = upload;