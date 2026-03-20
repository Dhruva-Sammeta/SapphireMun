import { createClient, SupabaseClient } from "@supabase/supabase-js"

// Lazy-initialized public client — avoids crashing at build time
// when env vars are not yet available (e.g. Vercel build step).
let _supabase: SupabaseClient | null = null

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _supabase
}

// Kept for backwards compat — lazy getter behind a proxy-like export
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop]
  },
})

// Server-only client — used exclusively in API routes
// CAUTION: This bypasses all RLS policies. Never import in client components.
export function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
