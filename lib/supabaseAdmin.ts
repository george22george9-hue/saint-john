import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Server-side execution guard
if (typeof window !== 'undefined') {
  throw new Error(
    'lib/supabaseAdmin.ts MUST NEVER be imported or executed in client components or browser code.'
  );
}

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  '';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isServiceRoleConfigured(): boolean {
  return Boolean(serviceRoleKey && serviceRoleKey.trim().length > 0);
}

if (!supabaseUrl) {
  console.warn('[SupabaseAdmin] SUPABASE_URL environment variable is missing.');
}

if (!serviceRoleKey) {
  console.error(
    '[SupabaseAdmin] PERMISSION WARNING: SUPABASE_SERVICE_ROLE_KEY is not defined in server environment variables. Privileged Storage and Database operations require SUPABASE_SERVICE_ROLE_KEY to bypass RLS policies.'
  );
}

// Dedicated server-only Supabase client for privileged admin operations
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  serviceRoleKey || 'unconfigured-service-role-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
