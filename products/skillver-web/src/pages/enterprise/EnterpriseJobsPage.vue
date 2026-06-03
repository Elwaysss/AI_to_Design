<script setup lang="ts">
import PageHeading from '../../components/ui/PageHeading.vue'
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-6 py-8 leading-[1.2]">
    <div class="flex items-center justify-between">
      <PageHeading title="岗位管理" />
      <button type="button" class="sv-btn sv-btn-primary">发布岗位</button>
    </div>
    <router-link
      to="/enterprise/jobs/job_001"
      class="mt-6 block rounded-card sv-card p-4 hover:ring-1 hover:ring-primary"
    >
      RAG 应用开发工程师 · 招聘中
    </router-link>
  </div>
</template>
