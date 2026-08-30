# Restaurant OS

A production-ready SaaS operating system for modern food service operations, featuring secure multi-tenant Authentication, a digital Menu Builder, dynamic QR Code generators, and public-facing guest menus.

Current Version: **v0.3.0**

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Ant Design, TanStack Query, React Router DOM, Zustand.
- **Backend**: Node.js, Express.js, TypeScript, PostgreSQL, Prisma ORM, JWT (Access & Refresh tokens), Multer local file uploads, Helmet, CORS, Rate Limiting, Compression.

---

## 📁 Project Structure

```
ROS/
├── backend/            # Express REST API (TypeScript)
│   ├── prisma/         # Database schemas and migrations
│   └── src/            # Core business modules and routes
├── frontend/           # React Single Page App (TypeScript + Vite)
│   ├── public/         # Static favicons and files
│   └── src/            # Routes, pages, layouts and stores
└── README.md           # Documentation
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database instance

### 1. Database Setup
Ensure PostgreSQL is running locally, and create a database (e.g., `restaurant_os`).

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Configure your local database URL and secrets inside `.env`:
   ```env
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/restaurant_os?schema=public
   JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
   CORS_ORIGINS=http://localhost:5173
   PUBLIC_BASE_URL=http://localhost:5173
   ```
4. Run Prisma database migrations to apply the tables:
   ```bash
   npx prisma migrate dev
   ```
5. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```
   The backend will start listening on port `5000`.

### 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   The frontend will open in your browser at `http://localhost:5173`.

---

## 📦 Deployment Instructions

### Frontend Deployment (Vercel)
Vercel handles React SPA client-side routing rewrites using the configured [`vercel.json`](./frontend/vercel.json) file.
1. Sign in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** → **Project** and import your Git repository.
3. Configure the **Root Directory** as `frontend`.
4. Build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Configure Environment Variables:
   - `VITE_API_URL`: The production URL of your Render backend API (e.g. `https://api.ros.algorithyum.in`).
6. Click **Deploy**.

### Backend Deployment (Render)
1. Sign in to your [Render Dashboard](https://render.com).
2. Create a new **Web Service** and link your Git repository.
3. Set the **Root Directory** as `backend`.
4. Configure environment:
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx prisma migrate deploy && node dist/server.js`
5. Configure Environment Variables:
   - `DATABASE_URL`: Production PostgreSQL connection string (Render Database URL).
   - `PORT`: Automatically set by Render.
   - `NODE_ENV`: `production`
   - `CORS_ORIGINS`: Comma-separated allowed origins (e.g., `https://restaurantos.vercel.app`).
   - `PUBLIC_BASE_URL`: The production URL of your frontend (e.g., `https://restaurantos.vercel.app`).
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`: Secure production secrets.
6. Click **Deploy**.

---

## 🩹 Troubleshooting

### 1. SPA routing throws 404 on page reload
- **Vercel**: Handled automatically by the rewrite rules in [`vercel.json`](./frontend/vercel.json).
- **Local Dev Server**: Vite handles SPA reloads automatically. If using a custom Nginx reverse proxy locally, ensure `try_files $uri $uri/ /index.html;` is active.

### 2. Express rate-limit blocks all requests behind load balancers
- Express is configured with `app.set('trust proxy', 1)`. This tells the rate-limiter to look at the `X-Forwarded-For` header instead of the proxy IP, ensuring customers' real IPs are rate-limited.

### 3. Images block or fail cross-origin loading (CORS)
- Backend Helmet configuration is explicitly set to `crossOriginResourcePolicy: { policy: 'cross-origin' }`. This enables different origins (like Vercel domain) to load media assets directly from Render's uploads server.
