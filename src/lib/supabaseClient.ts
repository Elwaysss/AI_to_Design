/**
 * Supabase browser client — singleton for auth and data access.
 * Env vars are written by `npm run supabase:init` into `.env.local`.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/** True when Vite env has both Supabase credentials. */
export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && key);
}

/** Lazily create the Supabase client (throws if env is missing). */
export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error(
      'Supabase is not configured. Run `npm run supabase:init` or set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.'
    );
  }

  client = createClient(url, anonKey);
  return client;
}
