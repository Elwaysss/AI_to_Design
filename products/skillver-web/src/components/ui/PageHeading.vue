<script setup lang="ts">
withDefaults(defineProps<{ title: string; level?: 'h1' | 'h2' }>(), { level: 'h1' })
</script>

<template>
  <component :is="level === 'h2' ? 'h2' : 'h1'" :class="level === 'h2' ? 'sv-h2' : 'sv-h1'">
    {{ title }}
  </component>
</template>
