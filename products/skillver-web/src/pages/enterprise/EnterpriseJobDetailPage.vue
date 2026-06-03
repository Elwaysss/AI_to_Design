<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PageHeading from '../../components/ui/PageHeading.vue'
</script>

<template>
  <div class="mx-auto w-full max-w-3xl px-6 py-8 leading-[1.2]">
    <PageHeading title="岗位详情" level="h2" />
    <p class="text-sm text-gray-500">{{ $route.params.jobId }}</p>
    <RouterLink to="/enterprise/talent-matching" class="sv-btn sv-btn-primary mt-6 inline-flex">
      查看入库人才
    </RouterLink>
  </div>
</template>
