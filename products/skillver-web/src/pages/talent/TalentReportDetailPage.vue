<script setup lang="ts">
import PageHeading from '../../components/ui/PageHeading.vue'
import ReportRadar from '../../components/report/ReportRadar.vue'
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-6 py-8 leading-[1.2]">
    <PageHeading title="7D 能力报告" />
    <p class="sv-h3 mt-1">雷达图仅在报告页展示（核验页不占位）</p>
    <div class="mt-8 flex flex-col gap-8 lg:flex-row">
      <ReportRadar />
      <div class="flex-1 space-y-3 text-sm text-gray-700">
        <p><strong>T 技术熟练度</strong> 78</p>
        <p><strong>L 逻辑严密性</strong> 72</p>
        <p><strong>R 韧性</strong> 67</p>
      </div>
    </div>
  </div>
</template>
