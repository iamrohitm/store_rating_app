  -- Store Rating App - Database Schema

  DROP TABLE IF EXISTS ratings CASCADE;
  DROP TABLE IF EXISTS stores CASCADE;
  DROP TABLE IF EXISTS users CASCADE;

  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user', 'owner')),
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, store_id)
  );

  -- default admin login: admin@example.com / Admin@123
  -- password below is bcrypt hash for "Admin@123"
  INSERT INTO users (name, email, password, address, role)
  VALUES (
    'System Administrator Account',
    'admin@example.com',
    '$2a$10$3euPcmQFCiblsZeEu5s7p.9OVHgeHyOoJz9BUUwPBjXbP.dqggEDW',
    'Admin Office',
    'admin'
  );
