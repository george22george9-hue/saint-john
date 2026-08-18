-- ================================================================
-- SUPABASE MIGRATION: Dynamic Activities & Inquiries Status Upgrade
-- ================================================================
-- Execution instructions:
-- 1. Copy this entire script.
-- 2. Open your Supabase Dashboard -> SQL Editor.
-- 3. Paste and click "Run".
-- ================================================================

-- 1. Create dynamic_activities table if it does not exist
CREATE TABLE IF NOT EXISTS dynamic_activities (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT DEFAULT 'نشاط',
    content TEXT,
    date TEXT,
    time TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Safely add status column to existing inquiries table (preserves all data)
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'تحت المراجعة';

-- 3. Row Level Security (RLS) Policies for dynamic_activities
ALTER TABLE dynamic_activities ENABLE ROW LEVEL SECURITY;

-- Allow public users to view active dynamic activities
DROP POLICY IF EXISTS "Public dynamic activities are viewable by everyone" ON dynamic_activities;
CREATE POLICY "Public dynamic activities are viewable by everyone" 
ON dynamic_activities 
FOR SELECT 
USING (is_active = true);

-- Allow full access for admins / service role
DROP POLICY IF EXISTS "Admins have full access to dynamic activities" ON dynamic_activities;
CREATE POLICY "Admins have full access to dynamic activities" 
ON dynamic_activities 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. Row Level Security (RLS) Policies for inquiries
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public users to submit inquiries
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON inquiries;
CREATE POLICY "Anyone can submit inquiries" 
ON inquiries 
FOR INSERT 
WITH CHECK (true);

-- Allow full access for admins / service role
DROP POLICY IF EXISTS "Admins have full access to inquiries" ON inquiries;
CREATE POLICY "Admins have full access to inquiries" 
ON inquiries 
FOR ALL 
USING (true) 
WITH CHECK (true);
