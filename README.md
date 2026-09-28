# Store Rating App

A full-stack web application where users can discover stores and submit ratings from **1 to 5 stars**.

The application supports three different roles with role-based access:

* **Admin** – manages users, stores, and store-owner assignments
* **Normal User** – creates an account and rates stores
* **Store Owner** – manages and views information related to their assigned store

## Tech Stack

### Frontend
* React
* JavaScript
* Plain CSS
* React Router

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication
* REST APIs

### Database

* PostgreSQL

---

## Features

### Authentication & Authorization

* JWT-based authentication
* Role-based access control
* Separate permissions for Admin, User, and Store Owner
* Normal users can register themselves
* Admin creates Store Owner and Admin accounts

### Admin

* View and manage users
* Add users with different roles
* Add new stores
* Assign a store to a Store Owner
* View store and user information

### Normal User

* Register and log in
* Browse available stores
* Submit ratings from **1 to 5**
* Update their rating
* View store ratings

### Store Owner

* Log in using an account created by Admin
* Access their assigned store
* View ratings and rating information for their store

---

## Validation Rules

The application includes validation for user and store information:

| Field                | Validation                                          |
| -------------------- | --------------------------------------------------- |
| Name                 | 20–60 characters                                    |
| Address              | Maximum 400 characters                              |
| Password             | 8–16 characters                                     |
| Password requirement | At least 1 uppercase letter and 1 special character |
| Rating               | 1–5                                                 |

---

## Project Structure

```text
store-rating-app/
│
├── backend/
│   ├── db/
│   │   └── schema.sql
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── .env.example
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
└── README.md
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd store-rating-app
```

### 2. Database Setup

Make sure PostgreSQL is installed and running.

Create the database:

```bash
psql -U postgres -c "CREATE DATABASE store_rating_db;"
```

Run the database schema:

```bash
psql -U postgres -d store_rating_db -f backend/db/schema.sql
```

The schema also creates a default admin account:

```text
Email: admin@example.com
Password: Admin@123
```

> For production use, change the default admin credentials and use secure environment variables.

---

### 3. Backend Setup

Go to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL credentials and JWT secret.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:5000
```

---

### 4. Frontend Setup

Open a new terminal and go to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

Frontend will run at:

```text
http://localhost:3000
```

---

## Role Flow

The application follows a simple role-based workflow:

```text
                    ┌─────────────┐
                    │    Admin    │
                    └──────┬──────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        Add Users      Add Stores    Assign Owner
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Store Owner │
                    └─────────────┘

Normal User
     │
     ▼
 Register / Login
     │
     ▼
 Browse Stores
     │
     ▼
 Rate Store (1–5)
```

---

## Authentication Flow

1. User logs in with email and password.
2. Backend validates the credentials.
3. Server generates a JWT.
4. Frontend stores the authentication token.
5. The token is sent with protected API requests.
6. Backend middleware verifies the JWT.
7. Role-based middleware controls access to protected resources.

---

## API Overview

The backend provides REST APIs for:

* Authentication
* User management
* Store management
* Ratings
* Role-based access

Example API structure:

```text
/api/auth
/api/users
/api/stores
/api/ratings
```

The exact endpoints and request formats are available in the backend source code.

---

## Important Notes

* Normal users can create their own accounts.
* Normal user accounts always have the `user` role.
* Admin accounts and Store Owner accounts are created by an Admin.
* A Store Owner is linked to a store by the Admin.
* Users can rate stores using a value between 1 and 5.
* JWT is used to protect authenticated routes.
* PostgreSQL is used for persistent application data.

---

## Future Improvements

Some possible improvements for the project:

* Search and filter stores
* Pagination for users and stores
* Average rating display
* Rating distribution
* Store-owner dashboard with rating statistics
* Admin dashboard with basic analytics
* Password reset functionality
* Better API documentation using Swagger/OpenAPI
* Deployment using services such as Render/Railway/AWS

---

## License

This project is built for learning and portfolio purposes.
