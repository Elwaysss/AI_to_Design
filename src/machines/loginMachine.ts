/**
 * loginMachine — XState v5 actor for the login flow.
 *
 * This is the *canonical example* of how every multi-step UI flow in this repo
 * should be modeled. The actor itself is framework-agnostic; Vue 3 components
 * consume it via `useMachine` from `@xstate/vue` (see src/components/LoginForm.vue
 * for the canonical wiring). See AGENTS.md § "Hard Rules".
 *
 * Visualize / edit at https://stately.ai by pasting this definition into the
 * Stately Studio import dialog.
 */
import { setup, assign, fromPromise } from 'xstate';

type LoginContext = {
  email: string;
  password: string;
  error: string | null;
  attempts: number;
};

type LoginEvent =
  | { type: 'EDIT_EMAIL'; value: string }
  | { type: 'EDIT_PASSWORD'; value: string }
  | { type: 'SUBMIT' }
  | { type: 'RETRY' }
  | { type: 'RESET' };

/**
 * Replace this stub with your real auth call. Kept inline so the file is
 * self-contained for the starter kit.
 *
 * Demo failure path: any email containing the substring "fail" is rejected
 * so the `failure` state is reachable from the UI without bypassing the
 * `looksValid` guard. The two defensive length / format checks below are
 * therefore dead code under the current guard but kept as a server-side
 * belt-and-suspenders example for when this stub is replaced.
 */
const authenticate = fromPromise<{ ok: true }, { email: string; password: string }>(
  async ({ input }) => {
    await new Promise((r) => setTimeout(r, 600));
    if (input.email.toLowerCase().includes('fail')) {
      throw new Error('Invalid credentials. Please try again.');
    }
    if (!input.email.includes('@')) throw new Error('Invalid email');
    if (input.password.length < 6) throw new Error('Password too short');
    return { ok: true };
  }
);

export const loginMachine = setup({
  types: {} as { context: LoginContext; events: LoginEvent },
  actors: { authenticate },
  actions: {
    setEmail: assign(({ context, event }) =>
      event.type === 'EDIT_EMAIL' ? { email: event.value } : context
    ),
    setPassword: assign(({ context, event }) =>
      event.type === 'EDIT_PASSWORD' ? { password: event.value } : context
    ),
    setError: assign(({ event }) => ({
      error: 'error' in event && event.error instanceof Error ? event.error.message : 'Unknown error'
    })),
    clearError: assign({ error: () => null }),
    bumpAttempts: assign(({ context }) => ({ attempts: context.attempts + 1 }))
  },
  guards: {
    looksValid: ({ context }) =>
      /.+@.+\..+/.test(context.email) && context.password.length >= 6
  }
}).createMachine({
  id: 'login',
  initial: 'idle',
  context: { email: '', password: '', error: null, attempts: 0 },
  states: {
    idle: {
      on: {
        EDIT_EMAIL:    { actions: ['setEmail', 'clearError'] },
        EDIT_PASSWORD: { actions: ['setPassword', 'clearError'] },
        SUBMIT:        { target: 'submitting', guard: 'looksValid' }
      }
    },
    submitting: {
      entry: 'bumpAttempts',
      invoke: {
        src: 'authenticate',
        input: ({ context }) => ({ email: context.email, password: context.password }),
        onDone:   { target: 'success' },
        onError:  { target: 'failure', actions: 'setError' }
      }
    },
    failure: {
      on: {
        RETRY: 'idle',
        RESET: { target: 'idle', actions: assign({ email: '', password: '', error: null, attempts: 0 }) }
      }
    },
    success: { type: 'final' }
  }
});

export type LoginMachine = typeof loginMachine;
