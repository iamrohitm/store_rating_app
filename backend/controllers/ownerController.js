const pool = require("../config/db");

// returns the owner's store, average rating, and list of users who rated it
async function getOwnerDashboard(req, res) {
  const ownerId = req.user.id;

  try {
    const storeResult = await pool.query("SELECT * FROM stores WHERE owner_id = $1", [ownerId]);
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: "No store assigned to this owner" });
    }
    const store = storeResult.rows[0];

    const avgResult = await pool.query(
      "SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0) AS avg_rating FROM ratings WHERE store_id = $1",
      [store.id]
    );

    const ratersResult = await pool.query(
      `SELECT u.id, u.name, u.email, r.rating, r.updated_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = $1
       ORDER BY r.updated_at DESC`,
      [store.id]
    );

    res.json({
      store,
      averageRating: avgResult.rows[0].avg_rating,
      raters: ratersResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching owner dashboard" });
  }
}

module.exports = { getOwnerDashboard };
