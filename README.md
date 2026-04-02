# 🚀 CrowUPI — MERN Stack Starter Template

A modern, production-ready PERN (PostgreSQL, Express, React, Node.js) boilerplate with Prisma ORM, JWT auth, Tailwind CSS, and a clean scalable architecture.

---

## 📁 Project Structure

```
CrowUPI/
├── backend/
│   ├── config/          # Prisma client singleton
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth & error middleware
│   ├── prisma/          # Prisma schema & migrations
│   ├── routes/          # Express routes
│   ├── .env.example     # Environment variable template
│   └── server.js        # App entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI (Navbar, Layout)
│   │   ├── pages/       # Page views (Home, Login, etc.)
│   │   ├── utils/       # API helper (Axios instance)
│   │   ├── App.jsx      # Root component with routing
│   │   └── main.jsx     # Vite entry point
│   └── vite.config.js   # Vite + Tailwind + API proxy
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** running locally or a remote connection URI

### 1. Backend

```bash
cd backend
cp .env.example .env          # Edit with your PostgreSQL URI & secrets
npm install
npx prisma migrate dev --name init   # Create tables
npx prisma generate                  # Generate Prisma client
npm run dev                          # Starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev              # Starts on http://localhost:5173
```

---

## 🔐 API Routes

| Method | Endpoint             | Access  | Description          |
| ------ | -------------------- | ------- | -------------------- |
| POST   | `/api/auth/register` | Public  | Register a new user  |
| POST   | `/api/auth/login`    | Public  | Login & get JWT      |
| GET    | `/api/auth/me`       | Private | Get logged-in user   |
| POST   | `/api/auth/logout`   | Private | Logout & clear cookie|

---

## 🧰 Tech Stack

| Layer    | Technology                              |
| -------- | --------------------------------------- |
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend  | Node.js, Express, Prisma ORM            |
| Auth     | JWT, bcryptjs, cookie-parser            |
| Database | PostgreSQL                              |

---

## 📝 Environment Variables

Copy `backend/.env.example` → `backend/.env` and fill in:

| Variable         | Description                               |
| ---------------- | ----------------------------------------- |
| `PORT`           | Server port (default: 5000)               |
| `DATABASE_URL`   | PostgreSQL connection string              |
| `JWT_SECRET`     | Secret key for JWT signing                |
| `JWT_EXPIRES_IN` | Token expiry (default: 7d)                |
| `SESSION_SECRET` | Express session secret                    |
| `CLIENT_URL`     | Frontend URL for CORS                     |

---

## 🗃️ Prisma Commands

```bash
npx prisma migrate dev --name <name>   # Create a new migration
npx prisma migrate deploy              # Apply migrations in production
npx prisma generate                    # Regenerate Prisma client
npx prisma studio                      # Open visual DB editor
```

---

## 📜 License

MIT — use this template for any project.
