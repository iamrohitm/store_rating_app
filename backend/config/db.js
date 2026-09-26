const { Pool } = require("pg");
require("dotenv").config();

// If DATABASE_URL is provided (e.g. from a hosted provider like Neon),
// use that directly with SSL enabled. Otherwise fall back to individual
// DB_* variables for a local Postgres install (no SSL needed locally).
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
    });

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

module.exports = pool;
