# Intelligent Cache Prediction and Replacement System
> College Operating Systems Project-Based Learning (PBL)

A full-stack simulation and analytics platform for comparing classical OS page/cache replacement algorithms (FIFO, LRU, LFU, Belady Optimal) and predictive caching strategies.

---

## Tech Stack
- **Frontend**: React.js, React Router, Axios, Lucide Icons, Vite
- **Backend**: Node.js, Express.js, dotenv, cors
- **Database**: MySQL (`mysql2` connection pool)
- **API Protocol**: RESTful JSON

---

## Project Structure

```
intelligent-cache-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MySQL Connection Pool
│   │   ├── controllers/
│   │   │   └── health.controller.js
│   │   ├── middlewares/
│   │   │   └── errorHandler.js  # 404 and 500 error handlers
│   │   ├── models/              # Reserved for simulation / trace schemas
│   │   ├── routes/
│   │   │   ├── api.router.js    # Master router
│   │   │   └── health.router.js # Health check router
│   │   ├── services/            # Reserved for replacement & ML algorithms
│   │   └── server.js            # Express server entry point
│   ├── .env.example
│   ├── .env
│   ├── schema.sql               # MySQL database & table definitions
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, Footer, StatusBadge
│   │   ├── pages/               # Home, NotFound
│   │   ├── services/
│   │   │   └── api.js           # Central Axios configuration
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Getting Started

### 1. Database Setup (MySQL)
Ensure your MySQL server is running.
Create the database and schema using `backend/schema.sql`:
```bash
mysql -u root -p < backend/schema.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend runs on **http://localhost:5000**
- Health check: `http://localhost:5000/api/health`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on **http://localhost:3000**