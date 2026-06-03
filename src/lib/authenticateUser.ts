/**
 * Login authenticate actor — Supabase Auth when configured, demo stub otherwise.
 *
 * CI / Playwright force empty env vars in playwright.config.ts so e2e always
 * uses the stub (fail@example.com → failure, anything else → success).
 */
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';

export type AuthenticateInput = { email: string; password: string };
export type AuthenticateResult = { ok: true };

/** Demo stub used when Supabase env is absent (starter template + CI). */
async function authenticateStub(input: AuthenticateInput): Promise<AuthenticateResult> {
  await new Promise((r) => setTimeout(r, 600));
  if (input.email.toLowerCase().includes('fail')) {
    throw new Error('Invalid credentials. Please try again.');
  }
  if (!input.email.includes('@')) throw new Error('Invalid email');
  if (input.password.length < 6) throw new Error('Password too short');
  return { ok: true };
}

/** Real Supabase email/password sign-in. */
async function authenticateSupabase(input: AuthenticateInput): Promise<AuthenticateResult> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password
  });

  if (error) {
    throw new Error(error.message);
  }

  return { ok: true };
}

export async function authenticateUser(input: AuthenticateInput): Promise<AuthenticateResult> {
  if (isSupabaseConfigured()) {
    return authenticateSupabase(input);
  }
  return authenticateStub(input);
}
