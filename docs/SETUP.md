# AgroAI Setup & Local Development Guide

## Prerequisites
1. **Node.js**: v20+ LTS installed (`node -v`)
2. **npm**: v10+ installed (`npm -v`)
3. **Supabase Account**: (Free tier) at [supabase.com](https://supabase.com)
4. **Google AI Studio Account**: (Free tier) for Gemini API key at [aistudio.google.com](https://aistudio.google.com)

---

## 1. Clone & Install Dependencies

From the project root:

```bash
# Install root, server, and client dependencies
npm run install:all
```

Alternatively:
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

---

## 2. Configure Database in Supabase

1. Open your Supabase Dashboard and navigate to the **SQL Editor**.
2. Open the file `supabase/migrations/001_initial_schema.sql` located in this repository.
3. Paste the entire SQL script and click **RUN**.
   - This creates all 10 tables: `profiles`, `farms`, `crop_recommendations`, `soil_reports`, `fertilizer_advisories`, `irrigation_advisories`, `disease_reports`, `cultivation_calendars`, `chat_conversations`, `chat_messages`.
   - Sets up automatic triggers for `updated_at`.
   - Enables Row Level Security (RLS) on all tables with user ownership policies.
   - Configures the private Supabase Storage bucket `crop-images`.

---

## 3. Environment Variables Configuration

### Server (`server/.env`)
Copy `server/.env.example` to `server/.env`:
```ini
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Supabase Credentials (from Supabase Dashboard -> Project Settings -> API)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Gemini API (from https://aistudio.google.com/)
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.5-flash
```

### Client (`client/.env`)
Copy `client/.env.example` to `client/.env`:
```ini
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 4. Run Locally

Open two terminal tabs:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

Or from the root directory:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser. You can register a new account or click **Continue as Demo Farmer** for instant local exploration!

