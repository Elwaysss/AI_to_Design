<script setup lang="ts">
import PageHeading from '../../components/ui/PageHeading.vue'
</script>

<template>
  <div class="mx-auto w-full max-w-3xl px-6 py-8 leading-[1.2]">
    <PageHeading title="我的报告" />
    <router-link
      to="/talent/reports/rpt_001"
      class="mt-6 block rounded-card sv-card p-4 hover:ring-1 hover:ring-primary"
    >
      <span class="font-medium">7D 战力报告</span>
      <span class="ml-2 text-sm text-gray-500">2026-05-28</span>
    </router-link>
  </div>
</template>
