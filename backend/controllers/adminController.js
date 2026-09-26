const bcrypt = require("bcryptjs");
const pool = require("../config/db");

// dashboard stats: total users, total stores, total ratings
async function getDashboardStats(req, res) {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const stores = await pool.query("SELECT COUNT(*) FROM stores");
    const ratings = await pool.query("SELECT COUNT(*) FROM ratings");

    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalStores: parseInt(stores.rows[0].count),
      totalRatings: parseInt(ratings.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
}

// admin can add a user of any role (admin, user, owner)
async function addUser(req, res) {
  const { name, email, address, password, role } = req.body;
  if (!["admin", "user", "owner"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role`,
      [name, email, hashedPassword, address, role]
    );
    res.status(201).json({ message: "User added", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding user" });
  }
}

// admin can add a store, optionally assigning an owner
async function addStore(req, res) {
  const { name, email, address, owner_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, address, owner_id || null]
    );
    res.status(201).json({ message: "Store added", store: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding store" });
  }
}

// list stores with name/email/address filters + rating, sortable
async function getStores(req, res) {
  const { name, email, address, sortBy = "name", order = "asc" } = req.query;
  const allowedSort = ["name", "email", "address", "rating"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "name";
  const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

  try {
    const conditions = [];
    const values = [];

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`s.name ILIKE $${values.length}`);
    }
    if (email) {
      values.push(`%${email}%`);
      conditions.push(`s.email ILIKE $${values.length}`);
    }
    if (address) {
      values.push(`%${address}%`);
      conditions.push(`s.address ILIKE $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const orderColumn = sortColumn === "rating" ? "rating" : `s.${sortColumn}`;

    const query = `
      SELECT s.id, s.name, s.email, s.address,
        COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      ${whereClause}
      GROUP BY s.id
      ORDER BY ${orderColumn} ${sortOrder}
    `;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stores" });
  }
}

// list users (normal + admin + owner) with filters, sortable
async function getUsers(req, res) {
  const { name, email, address, role, sortBy = "name", order = "asc" } = req.query;
  const allowedSort = ["name", "email", "address", "role"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "name";
  const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

  try {
    const conditions = [];
    const values = [];

    if (name) {
      values.push(`%${name}%`);
      conditions.push(`name ILIKE $${values.length}`);
    }
    if (email) {
      values.push(`%${email}%`);
      conditions.push(`email ILIKE $${values.length}`);
    }
    if (address) {
      values.push(`%${address}%`);
      conditions.push(`address ILIKE $${values.length}`);
    }
    if (role) {
      values.push(role);
      conditions.push(`role = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `
      SELECT id, name, email, address, role
      FROM users
      ${whereClause}
      ORDER BY ${sortColumn} ${sortOrder}
    `;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
}

// view single user detail; if store owner, include their store's rating
async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const userResult = await pool.query(
      "SELECT id, name, email, address, role FROM users WHERE id = $1",
      [id]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = userResult.rows[0];

    if (user.role === "owner") {
      const ratingResult = await pool.query(
        `SELECT COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS rating
         FROM stores s LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id = $1`,
        [id]
      );
      user.rating = ratingResult.rows[0].rating;
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
}

module.exports = { getDashboardStats, addUser, addStore, getStores, getUsers, getUserById };
