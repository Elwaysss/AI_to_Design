<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen flex-col glass-bg">
    <header class="glass-panel mx-4 mt-4 flex h-14 items-center rounded-card px-6">
      <span class="font-semibold text-primary">Skillver</span>
    </header>
    <RouterView />
  </div>
</template>
