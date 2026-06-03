<script setup lang="ts">
import PageHeading from '../../components/ui/PageHeading.vue'
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-6 py-8 leading-[1.2]">
    <PageHeading title="人才管理" />
    <p class="mt-1 text-sm text-gray-500">仅展示已通过核验入库的人才</p>
    <router-link
      to="/enterprise/talents/talent_001"
      class="mt-6 block rounded-card sv-card p-4"
    >
      候选人 A · 7D 综合 82
    </router-link>
  </div>
</template>
