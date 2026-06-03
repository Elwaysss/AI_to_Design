<script setup lang="ts">
defineProps<{ mode: 'inline' | 'overlay' | 'full' }>()
</script>

<template>
  <div
    v-if="mode === 'inline'"
    class="my-3 w-full max-w-[50%] min-w-[280px] rounded-card glass-panel p-4 leading-[1.2]"
  >
    <slot />
  </div>
  <div v-else-if="mode === 'full'" class="w-full leading-[1.2]">
    <slot />
  </div>
</template>
