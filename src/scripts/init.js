const mysql = require("mysql2/promise");

async function initDB() {
	const connection = await mysql.createConnection({
		host: "localhost",
		user: "root",
		password: ""
	});

await connection.query("CREATE DATABASE IF NOT EXISTS ecommerce_db");
await connection.query("USE ecommerce_db");

await connection.query(`CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
	email VARCHAR(100) UNIQUE,
	password VARCHAR(255),
	role ENUM("user","admin") DEFAULT "user",
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)
`);

await connection.query(`CREATE TABLE products (
	id VARCHAR(36) PRIMARY KEY,
	name VARCHAR(100),
	price DECIMAL(10,2),
	stock INT,
	image VARCHAR(255),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)
`);

await connection.query(`CREATE TABLE orders (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT,
	total DECIMAL(10,2),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
`)

await connection.query(`CREATE TABLE order_items (
	id INT AUTO_INCREMENT PRIMARY KEY,
	order_id INT,
	product_ID INT,
	quantity INT,
	price DECIMAL(10,2)
	);
`)

await connection.query(`CREATE TABLE refresh_tokens (
	id VARCHAR(36) PRIMARY KEY,
	user_id VARCHAR(36),
	token TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)
`);

console.log("🔥 DB y tablas creadas");
process.exit();
}

initDB();