# Store Rating App

Full-stack web app where users rate stores (1-5). Three roles: Admin, Normal User, Store Owner.

## Tech Stack
- Backend: Express.js + PostgreSQL
- Frontend: React (plain CSS, no UI library)
- Auth: JWT

## Project Structure
```
store-rating-app/
  backend/
  frontend/
```

## Setup

### 1. Database
Create a PostgreSQL database, then run the schema:
```bash
psql -U postgres -c "CREATE DATABASE store_rating_db;"
psql -U postgres -d store_rating_db -f backend/db/schema.sql
```
This also inserts a default admin login: `admin@example.com` / `Admin@123`

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env with your DB credentials and a JWT secret
npm run dev
```
Runs on http://localhost:5000

### 3. Frontend
```bash
cd frontend
npm install
npm start
```
Runs on http://localhost:3000

## Notes
- Admin can add users of any role (admin/user/owner) and stores, and assign a store to an owner.
- Normal users sign up themselves (always role = 'user').
- Store owner accounts must be created by admin, and linked to a store via the "Add Store" form (choose owner from dropdown).
- Validation rules: Name 20-60 chars, Address max 400 chars, Password 8-16 chars with 1 uppercase + 1 special char.
