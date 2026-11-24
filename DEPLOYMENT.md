# The World Ledger — Deployment Guide

This guide covers all options for deploying **The World Ledger** (ASP.NET Core Web API + React 19 Frontend + Database).

---

## Architecture Overview

- **Frontend**: React 19 + Vite 8 + Tailwind CSS v4 SPA.
- **Backend**: ASP.NET Core Web API (.NET 10).
- **Database Support**: Built-in support for **PostgreSQL**, **Microsoft SQL Server**, and **SQLite** (switchable via `DatabaseProvider` configuration).

---

## Option 1: Cloud Deployment (Vercel + Render + Supabase / Neon) — *Recommended & Free Tier*

### 1. Database Setup (PostgreSQL on Neon or Supabase)
1. Sign up for free at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com).
2. Create a new PostgreSQL database (e.g. `worldledger`).
3. Copy your connection string (e.g., `postgresql://user:password@ep-xyz.neon.tech/worldledger?sslmode=require`).

---

### 2. Backend Deployment (Render / Railway / Fly.io)

#### Using Render (Free Tier):
1. Sign up at [render.com](https://render.com) and link your GitHub repository.
2. Click **New +** → **Web Service**.
3. Choose your repository: `huraira23mughal/The-World-Ledger`.
4. Configure settings:
   - **Name**: `worldledger-api`
   - **Root Directory**: `backend/WorldLedger.API`
   - **Environment**: `Docker` (or `.NET 10`)
   - **Region**: Closest to you (e.g. Frankfurt, Oregon, Singapore)
   - **Instance Type**: `Free`
5. Set Environment Variables:
   - `DatabaseProvider` = `PostgreSql`
   - `ConnectionStrings__DefaultConnection` = `<Your Neon/Supabase Connection String>`
   - `Jwt__Secret` = `<Your 32+ character random secret string>`
   - `Cors__AllowedOrigins__0` = `https://<your-frontend-domain>.vercel.app`
   - `Cors__AllowedOrigins__1` = `http://localhost:5173`
   - `ASPNETCORE_ENVIRONMENT` = `Production`
6. Click **Deploy Web Service**.
7. Once deployed, note down your backend URL (e.g., `https://worldledger-api.onrender.com`).

---

### 3. Frontend Deployment (Vercel)

1. Sign up at [vercel.com](https://vercel.com) and click **Add New Project**.
2. Import `huraira23mughal/The-World-Ledger`.
3. Set **Root Directory** to `frontend`.
4. Vercel will automatically detect **Vite**.
5. Add Environment Variable:
   - `VITE_API_URL` = `https://worldledger-api.onrender.com/api` (replace with your Render backend URL)
6. Click **Deploy**.
7. In Vercel, under **Settings** → **Build & Development**, ensure output directory is `dist`.
8. Once deployed, add your Vercel URL (e.g. `https://the-world-ledger.vercel.app`) to your Render backend's `Cors__AllowedOrigins__0`.

---

## Option 2: Docker Compose Deployment (Single VPS / AWS EC2 / DigitalOcean)

If you have a Linux VPS (Ubuntu/Debian) with Docker and Docker Compose installed:

1. Clone the repository on your server:
   ```bash
   git clone https://github.com/huraira23mughal/The-World-Ledger.git
   cd "The-World-Ledger"
   ```

2. Start all services (PostgreSQL, Backend API, and Nginx Frontend):
   ```bash
   docker compose up -d --build
   ```

3. Verification:
   - Frontend is accessible on `http://YOUR_SERVER_IP:3000`
   - Backend API is accessible on `http://YOUR_SERVER_IP:5000/api`
   - Database runs in container `twl-postgres` with volume persistence.

---

## Option 3: Unified Single-Container Deployment

Because the ASP.NET Core API includes static file serving and fallback routing (`app.MapFallbackToFile("index.html")`), the pre-built frontend in `backend/WorldLedger.API/wwwroot/` can be served directly from the backend container without needing a separate frontend host!

1. Build frontend and place in wwwroot:
   ```powershell
   cd frontend
   npm run build
   Copy-Item -Path "dist\*" -Destination "..\backend\WorldLedger.API\wwwroot\" -Recurse -Force
   ```
2. Build and run backend container:
   ```bash
   cd backend/WorldLedger.API
   docker build -t worldledger .
   docker run -d -p 5000:5000 -e DatabaseProvider=Sqlite worldledger
   ```
3. Visit `http://localhost:5000` to see both frontend and API served from one port.

---

## Production Security Checklist

- [ ] Change `Jwt:Secret` to a cryptographically secure 64-character random key.
- [ ] Change the default Admin password after initial deployment.
- [ ] Configure HTTPS / SSL certificates (automatically handled by Vercel and Render).
- [ ] Verify CORS allowed origins include your production domains.
