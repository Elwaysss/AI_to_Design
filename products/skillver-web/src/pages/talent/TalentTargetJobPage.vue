<script setup lang="ts">
import PageHeading from '../../components/ui/PageHeading.vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
</script>

<template>
  <div class="mx-auto w-full max-w-3xl px-6 py-8 leading-[1.2]">
    <PageHeading title="目标岗位" />
    <p class="mt-1 text-sm text-gray-500">每账号仅 1 个当前目标岗</p>
    <div class="mt-6 rounded-card sv-card p-6">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="font-medium">Golang 后端开发工程师</h2>
          <p class="text-sm text-gray-500">示例企业 · 上海</p>
        </div>
        <StatusBadge label="已选定" tone="warning" />
      </div>
      <router-link to="/talent/verification" class="sv-btn sv-btn-primary mt-4 inline-flex">
        前往能力核验
      </router-link>
    </div>
  </div>
</template>
