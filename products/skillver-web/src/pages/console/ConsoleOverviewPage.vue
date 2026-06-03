<script setup lang="ts">
import PageHeading from '../../components/ui/PageHeading.vue'

const stats = [
  { label: '今日核验会话', value: '12' },
  { label: '待 KAE 复核', value: '3' },
  { label: '活跃企业', value: '28' },
  { label: '内测邀请码', value: '156' }
]
</script>

<template>
  <div class="leading-[1.2]">
    <PageHeading title="概览看板" />
    <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="s in stats" :key="s.label" class="rounded-card sv-card p-4">
        <p class="text-sm text-gray-500">{{ s.label }}</p>
        <p class="mt-1 text-2xl font-semibold text-primary">{{ s.value }}</p>
      </div>
    </div>
  </div>
</template>
