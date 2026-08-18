-- ================================================================
-- SUPABASE MIGRATION: PAIZO Branded Section Schema
-- ================================================================

-- 1. Table for PAIZO Custom Design Requests (ديزاينات وتنفيذ ++)
CREATE TABLE IF NOT EXISTS paizo_design_requests (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "eventName" TEXT,
    description TEXT NOT NULL,
    "targetDate" TEXT,
    notes TEXT,
    status TEXT DEFAULT 'تحت المراجعة',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Table for Dynamic PAIZO Games (if managed by admin in future)
CREATE TABLE IF NOT EXISTS paizo_games (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    "titleArabic" TEXT NOT NULL,
    image TEXT,
    category TEXT,
    "shortDescription" TEXT,
    "fullDescription" TEXT,
    players TEXT,
    duration TEXT,
    materials TEXT,
    rules JSONB DEFAULT '[]'::jsonb,
    steps JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Row Level Security (RLS) Policies for paizo_design_requests
ALTER TABLE paizo_design_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public) to submit design requests
DROP POLICY IF EXISTS "Anyone can submit PAIZO design requests" ON paizo_design_requests;
CREATE POLICY "Anyone can submit PAIZO design requests" 
ON paizo_design_requests 
FOR INSERT 
WITH CHECK (true);

-- Allow full access to admins/service role for managing requests
DROP POLICY IF EXISTS "Admins have full access to PAIZO design requests" ON paizo_design_requests;
CREATE POLICY "Admins have full access to PAIZO design requests" 
ON paizo_design_requests 
FOR ALL 
USING (true) 
WITH CHECK (true);
