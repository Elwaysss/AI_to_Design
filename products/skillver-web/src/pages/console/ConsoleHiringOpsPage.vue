<script setup lang="ts">
import PageHeading from '../../components/ui/PageHeading.vue'

const stats = [
  { label: '终面 PASS 率', value: '68%' },
  { label: 'R1 活跃 bid', value: '12' },
  { label: 'R2 活跃 bid', value: '5' }
]
</script>

<template>
  <div>
    <PageHeading title="招聘撮合看板" />
    <div class="mt-6 grid gap-4 sm:grid-cols-3">
      <div v-for="s in stats" :key="s.label" class="rounded-card sv-card p-4">
        <p class="text-sm text-gray-500">{{ s.label }}</p>
        <p class="mt-1 text-2xl font-semibold text-primary">{{ s.value }}</p>
      </div>
    </div>
  </div>
</template>
