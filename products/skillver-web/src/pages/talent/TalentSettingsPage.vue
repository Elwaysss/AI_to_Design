<script setup lang="ts">
import PageHeading from '../../components/ui/PageHeading.vue'
</script>

<template>
  <div class="mx-auto w-full max-w-2xl px-6 py-8 leading-[1.2]">
    <PageHeading title="账户设置" />
    <form class="mt-6 space-y-4 rounded-card sv-card p-6">
      <label class="block text-sm font-medium" for="bio">工作/实习经历</label>
      <textarea id="bio" rows="4" class="w-full rounded-button border border-gray-300 p-3 text-sm" />
      <button type="button" class="sv-btn sv-btn-primary">保存</button>
    </form>
  </div>
</template>
