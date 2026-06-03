<script setup lang="ts">
import { useMachine } from '@xstate/vue';
import { onboardingMachine } from '../machines/onboardingMachine';

const { snapshot, send } = useMachine(onboardingMachine);

const state = () => snapshot.value.value;
</script>

<template>
  <section
    class="mt-8 w-full max-w-md rounded-lg border border-neutral-200 bg-surface-paper p-6 shadow-sm"
    aria-labelledby="onboarding-heading"
  >
    <h2 id="onboarding-heading" class="font-display text-xl text-text-primary">
      Quick setup
    </h2>
    <p class="mt-1 text-sm text-text-muted">
      Example second flow — modeled with <code class="font-mono text-xs">onboardingMachine</code>.
    </p>

    <div v-if="state() === 'welcome'" class="mt-4 space-y-3">
      <label class="block text-sm font-medium text-text-secondary" for="onboarding-name">
        Display name
      </label>
      <input
        id="onboarding-name"
        type="text"
        class="w-full rounded-md border border-neutral-200 bg-surface-canvas px-3 py-2 text-text-primary"
        :value="snapshot.context.displayName"
        @input="send({ type: 'EDIT_NAME', value: ($event.target as HTMLInputElement).value })"
      />
      <button
        type="button"
        class="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-text-inverse disabled:opacity-50"
        :disabled="snapshot.context.displayName.trim().length < 2"
        @click="send({ type: 'CONTINUE' })"
      >
        Continue
      </button>
    </div>

    <div v-else-if="state() === 'choosingTheme'" class="mt-4 space-y-3">
      <p class="text-sm text-text-secondary">Pick a theme</p>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-md border border-neutral-200 px-3 py-2 text-sm"
          :class="snapshot.context.themeChoice === 'light' ? 'ring-2 ring-brand-primary' : ''"
          @click="send({ type: 'PICK_THEME', value: 'light' })"
        >
          Light
        </button>
        <button
          type="button"
          class="rounded-md border border-neutral-200 px-3 py-2 text-sm"
          :class="snapshot.context.themeChoice === 'dark' ? 'ring-2 ring-brand-primary' : ''"
          @click="send({ type: 'PICK_THEME', value: 'dark' })"
        >
          Dark
        </button>
      </div>
      <div class="flex gap-2">
        <button type="button" class="text-sm text-text-muted" @click="send({ type: 'BACK' })">
          Back
        </button>
        <button
          type="button"
          class="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-text-inverse disabled:opacity-50"
          :disabled="!snapshot.context.themeChoice"
          @click="send({ type: 'CONTINUE' })"
        >
          Finish
        </button>
      </div>
    </div>

    <div v-else class="mt-4">
      <p class="text-sm text-feedback-success">
        Welcome, {{ snapshot.context.displayName }} ({{ snapshot.context.themeChoice }} theme).
      </p>
      <button type="button" class="mt-3 text-sm text-brand-primary" @click="send({ type: 'FINISH' })">
        Start over
      </button>
    </div>
  </section>
</template>
