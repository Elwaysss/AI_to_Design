<script setup lang="ts">
import CopilotShell from '../../components/copilot/CopilotShell.vue'
import { enterpriseCopilotSeed } from '../../mocks/copilotSeed'
</script>

<template>
  <CopilotShell
    title="招聘助手"
    subtitle="企业默认 Landing · 无 emoji"
    :seed="enterpriseCopilotSeed"
  />
</template>
