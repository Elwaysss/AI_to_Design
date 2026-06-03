<script setup lang="ts">
import CopilotShell from '../../components/copilot/CopilotShell.vue'
import InteractiveCardWrapper from '../../components/layout/InteractiveCardWrapper.vue'
import { talentCopilotSeed } from '../../mocks/copilotSeed'
</script>

<template>
  <CopilotShell
    title="求职助手"
    subtitle="默认路由 · 对话优先（Career Copilot）"
    :seed="talentCopilotSeed"
    allow-emoji
  >
    <template #cards>
      <InteractiveCardWrapper mode="inline">
        <p class="sv-h2">核验进度快照</p>
        <p class="mt-2 text-sm text-gray-600">内嵌卡片 ~50% 宽 · 随对话流滚动</p>
        <router-link to="/talent/verification" class="mt-2 inline-block text-sm text-primary">
          打开能力核验全页 →
        </router-link>
      </InteractiveCardWrapper>
    </template>
  </CopilotShell>
</template>
