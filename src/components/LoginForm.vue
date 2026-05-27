<script setup lang="ts">
/**
 * LoginForm.vue — Phase 2 entry component.
 *
 * Wires the framework-agnostic XState v5 actor `loginMachine` into a Vue 3 SFC
 * via `@xstate/vue`'s `useMachine`. All visual values come from Style Dictionary
 * tokens surfaced as Tailwind v4 utilities in `src/style.css`.
 *
 * State map (see DESIGN.md § 4 + src/machines/loginMachine.ts):
 *   idle        — form editable, submit disabled until `looksValid` guard passes
 *   submitting  — invoke authenticate (600 ms stub); spinner copy on the CTA
 *   failure     — error message in role=alert; "Try again" sends RETRY -> idle
 *   success     — final state; replaces the form with a confirmation panel
 */
import { useMachine } from '@xstate/vue';
import { loginMachine } from '../machines/loginMachine';

const { snapshot, send } = useMachine(loginMachine);

const onEmailInput = (event: Event) =>
  send({ type: 'EDIT_EMAIL', value: (event.target as HTMLInputElement).value });

const onPasswordInput = (event: Event) =>
  send({ type: 'EDIT_PASSWORD', value: (event.target as HTMLInputElement).value });

const onSubmit = () => send({ type: 'SUBMIT' });

const onRetry = () => send({ type: 'RETRY' });
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-surface-canvas px-6 py-16">
    <section
      class="w-full max-w-md rounded-xl border border-border-subtle bg-surface-paper p-8 shadow-raised"
      aria-labelledby="login-heading"
    >
      <div v-if="snapshot.matches('success')" class="space-y-3 text-center">
        <h1 id="login-heading" class="font-display text-2xl font-semibold text-text-primary">
          Signed in
        </h1>
        <p class="text-sm text-text-muted">Welcome back. You are now signed in.</p>
      </div>

      <form v-else class="space-y-6" @submit.prevent="onSubmit">
        <header class="space-y-2">
          <h1 id="login-heading" class="font-display text-2xl font-semibold text-text-primary">
            Sign in
          </h1>
          <p class="text-sm text-text-muted">
            Welcome back. Please enter your details.
          </p>
        </header>

        <div class="space-y-4">
          <div class="space-y-2">
            <label for="login-email" class="block text-sm font-medium text-text-primary">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              :value="snapshot.context.email"
              :aria-invalid="snapshot.matches('failure')"
              class="block h-10 w-full rounded-md border border-border-default bg-surface-paper px-3 text-text-primary placeholder:text-text-muted hover:border-border-strong focus:outline-none"
              @input="onEmailInput"
            />
          </div>

          <div class="space-y-2">
            <label for="login-password" class="block text-sm font-medium text-text-primary">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autocomplete="current-password"
              placeholder="At least 6 characters"
              :value="snapshot.context.password"
              :aria-invalid="snapshot.matches('failure')"
              class="block h-10 w-full rounded-md border border-border-default bg-surface-paper px-3 text-text-primary placeholder:text-text-muted hover:border-border-strong focus:outline-none"
              @input="onPasswordInput"
            />
          </div>
        </div>

        <div
          v-if="snapshot.matches('failure')"
          role="alert"
          class="space-y-3 rounded-md border border-feedback-danger bg-surface-sunken p-3"
        >
          <p class="text-sm text-feedback-danger">
            {{ snapshot.context.error || 'Something went wrong. Please try again.' }}
          </p>
          <button
            type="button"
            class="text-sm font-medium text-text-primary underline-offset-2 hover:underline"
            @click="onRetry"
          >
            Try again
          </button>
        </div>

        <button
          type="submit"
          :disabled="!snapshot.can({ type: 'SUBMIT' })"
          :aria-busy="snapshot.matches('submitting')"
          class="block h-12 w-full rounded-md bg-brand-primary px-6 font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ snapshot.matches('submitting') ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </section>
  </main>
</template>
