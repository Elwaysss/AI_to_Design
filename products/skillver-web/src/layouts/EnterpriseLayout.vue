<script setup lang="ts">
import { RouterView } from 'vue-router'
import EnterpriseSidebar from '../components/shell/EnterpriseSidebar.vue'
</script>

<template>
  <div class="flex min-h-screen neo-bg">
    <EnterpriseSidebar />
    <main class="flex min-h-screen min-w-0 flex-1 flex-col">
      <RouterView />
    </main>
  </div>
</template>
