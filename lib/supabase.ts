import { createClient } from "@supabase/supabase-js"

// Public client — used in frontend components only for auth/anon access
// This respects Row Level Security (RLS)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-only client — used exclusively in API routes
// CAUTION: This bypasses all RLS policies. Never import in client components.
export function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
