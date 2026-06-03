<script setup lang="ts">
import { RouterView } from 'vue-router'
import ConsoleSideNav from '../components/shell/ConsoleSideNav.vue'
</script>

<template>
  <div class="flex min-h-screen neo-bg">
    <ConsoleSideNav />
    <main class="min-w-0 flex-1 p-6">
      <RouterView />
    </main>
  </div>
</template>
