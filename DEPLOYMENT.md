# Deployment Guide (Vercel + Supabase)

This application is ready for **One-Click Deployment on Vercel**.

## Step 1: Push to GitHub / GitLab / Bitbucket
Ensure your repository is pushed to your Git provider.

## Step 2: Import Project in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... > Project**.
2. Select your repository (`saint-john`).
3. Vercel will automatically detect **Next.js**.

## Step 3: Configure Environment Variables
In the Vercel deployment screen under **Environment Variables**, add the following:

| Key | Example Value | Notes |
|---|---|---|
| `SUPABASE_URL` | `https://xyzcompany.supabase.co` | Your existing Supabase Project URL |
| `SUPABASE_KEY` | `eyJhbGciOiJKV1QiLC...` | Your Supabase Anon or Service Role key |
| `JWT_SECRET` | `your-secure-custom-jwt-secret-key` | Custom secret string for signing JWT cookies |

## Step 4: Click Deploy!
Vercel will build and host the application globally with serverless functions automatically configured for all API route handlers under `/api/`.

---

## Local Development Verification
To run locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

To verify production build locally:
```bash
npm run build
npm start
```
