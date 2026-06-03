<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="px-6 py-8">
    <h1 class="font-display text-2xl font-semibold text-text-primary">{{ title }}</h1>
    <p class="mt-2 text-sm text-text-muted">Console 模块 UI 占位 — 接运营后台 API 后替换。</p>
  </div>
</template>
