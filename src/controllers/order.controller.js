exports.createOrder = async (req, res) => {
	const { cart, total } = req.body;
	const userId = req.user.id;
	const [orderResult] = await pool.query(`
		INSERT INTO orders (user_id, total) VALUES (?,?)`, [userId, total]);
	
	const orderId = orderResult.insertId;

	for (const item of cart) {
		await pool.query(`
			INSERT INTO order_items (order_id, product_id quantity, price) VALUES (?,?,?,?)`,
		[orderId, item.id, item.quantity, item.price]);
	}
	res.json({ message: "Orden creada" });
}