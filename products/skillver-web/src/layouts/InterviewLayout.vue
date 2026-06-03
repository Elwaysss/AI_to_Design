<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="flex min-h-screen flex-col glass-bg p-3">
    <header class="glass-panel flex items-center justify-between rounded-card px-6 py-3">
      <span class="sv-h1">AI 模拟面试</span>
      <span class="font-mono text-sm leading-[1.2] text-gray-500">{{ route.params.sessionId }}</span>
      <RouterLink to="/talent/verification" class="text-sm text-primary">返回核验</RouterLink>
    </header>
    <RouterView />
  </div>
</template>
