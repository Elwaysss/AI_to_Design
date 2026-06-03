<script setup lang="ts">
import type { CopilotMessage } from '../../mocks/copilotSeed'

defineProps<{ message: CopilotMessage; allowEmoji?: boolean }>()
</script>

<template>
  <div class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[85%] rounded-card px-4 py-3 text-sm leading-[1.2]"
      :class="
        message.role === 'user'
          ? 'sv-btn-primary border-0 shadow-lg'
          : 'glass-panel-strong text-slate-100'
      "
    >
      <span v-if="message.emoji && allowEmoji" class="mr-1">{{ message.emoji }}</span>
      <span class="whitespace-pre-wrap">{{ message.content }}</span>
    </div>
  </div>
</template>
