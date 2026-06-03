<script setup lang="ts">
import { RouterView } from 'vue-router'
import TalentWorkbenchSidebar from '../components/shell/TalentWorkbenchSidebar.vue'
</script>

<template>
  <div class="flex min-h-screen neo-bg">
    <TalentWorkbenchSidebar />
    <main class="flex min-h-screen min-w-0 flex-1 flex-col">
      <RouterView />
    </main>
  </div>
</template>
