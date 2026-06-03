<script setup lang="ts">
const props = defineProps<{ kind: 'terms' | 'privacy' | 'about' }>()
const titles = { terms: '用户协议', privacy: '隐私政策', about: '关于我们' }
</script>

<template>
  <article class="mx-auto max-w-2xl px-6 py-12">
    <h1 class="font-display text-3xl font-semibold">{{ titles[kind] }}</h1>
    <p class="mt-4 text-text-secondary">正文占位 — 从法务文档接入。</p>
  </article>
</template>
