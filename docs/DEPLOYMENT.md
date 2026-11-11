# Production Deployment Guide: AgroAI

## 1. Supabase Database & Storage Deployment
1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor.
3. Verify that the private bucket `crop-images` is created under Storage.
4. Retrieve your Project URL, anon key, and service_role key from **Project Settings -> API**.

---

## 2. Backend Deployment (Render / Railway / Fly.io)

### Render Setup
1. Create a **New Web Service** connected to your repository.
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://your-frontend-domain.vercel.app`
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY`: `your-anon-key`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your-service-role-key`
   - `GEMINI_API_KEY`: `your-gemini-key`
   - `GEMINI_MODEL`: `gemini-2.5-flash`

---

## 3. Frontend Deployment (Vercel)

### Vercel Setup
1. Import repository in [vercel.com](https://vercel.com).
2. Framework Preset: **Vite**
3. Root Directory: `client`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend-domain.onrender.com/api/v1`
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your-anon-key`

---

## 4. Production Security Checklist
- [x] Gemini API key is strictly isolated on the backend server.
- [x] Helmet security headers and CORS allowlist are active.
- [x] Row Level Security (RLS) policies guard all 10 database tables.
- [x] Uploaded image magic-bytes verification blocks executable files.
- [x] Rate limiting defends against brute-force and API quota flooding.

