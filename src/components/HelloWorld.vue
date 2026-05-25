<script setup lang="ts">
import { ref } from 'vue'
import viteLogo from '../assets/vite.svg'
import vueLogo from '../assets/vue.svg'

const count = ref(0)
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
    <div class="flex items-center gap-8">
      <a href="https://vite.dev" target="_blank" rel="noopener">
        <img :src="viteLogo" class="h-24 w-24" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank" rel="noopener">
        <img :src="vueLogo" class="h-24 w-24" alt="Vue logo" />
      </a>
    </div>

    <h1 class="font-display text-4xl font-semibold text-text-primary">
      Vite + Vue + DESIGN.md
    </h1>

    <p class="max-w-prose text-center text-text-secondary">
      Edit <code class="font-mono">src/components/HelloWorld.vue</code> to test HMR.
      The button below is colored by
      <code class="font-mono">color.brand.primary</code>
      from <code class="font-mono">DESIGN.md</code> — if you see Boston Clay,
      the token pipeline is live.
    </p>

    <button
      type="button"
      class="rounded-md bg-brand-primary px-4 py-2 text-text-inverse transition-colors hover:bg-brand-primary-hover"
      @click="count++"
    >
      Get started — count is {{ count }}
    </button>
  </main>
</template>
