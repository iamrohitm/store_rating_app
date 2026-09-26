const pool = require("../config/db");

// list stores with search by name/address, includes overall rating + this user's rating
async function getStoresForUser(req, res) {
  const { name, address } = req.query;
  const userId = req.user.id;

  try {
    const conditions = [];
    const values = [userId];

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`s.name ILIKE $${values.length}`);
    }
    if (address) {
      values.push(`%${address}%`);
      conditions.push(`s.address ILIKE $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT s.id, s.name, s.address,
        COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS overall_rating,
        (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = $1) AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      ${whereClause}
      GROUP BY s.id
      ORDER BY s.name ASC
    `;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stores" });
  }
}

// submit a new rating or update existing one (upsert)
async function submitRating(req, res) {
  const userId = req.user.id;
  const { storeId } = req.params;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const storeCheck = await pool.query("SELECT id FROM stores WHERE id = $1", [storeId]);
    if (storeCheck.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    const result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id)
       DO UPDATE SET rating = $3, updated_at = NOW()
       RETURNING *`,
      [userId, storeId, rating]
    );

    res.json({ message: "Rating saved", rating: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving rating" });
  }
}

module.exports = { getStoresForUser, submitRating };
