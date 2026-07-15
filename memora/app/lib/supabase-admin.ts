import { createClient } from '@supabase/supabase-js'

// Admin client using the SERVICE ROLE key — bypasses RLS entirely.
// NEVER import this in client components or expose this key with a
// NEXT_PUBLIC_ prefix. Server-only usage (API routes, cron jobs).
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
