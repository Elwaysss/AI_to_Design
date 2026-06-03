<script setup lang="ts">
import type { VerificationBadgeTone } from '../../types/verification'

defineProps<{
  label: string
  tone: VerificationBadgeTone | 'neutral'
}>()

const toneClass: Record<string, string> = {
  warning: 'text-status-warning glass-input',
  orange: 'text-status-orange glass-input',
  success: 'text-status-success glass-input',
  error: 'text-status-error glass-input',
  lock: 'text-status-lock glass-input',
  neutral: 'text-status-neutral glass-input'
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-button px-2 py-0.5 text-xs font-medium leading-[1.2]"
    :class="toneClass[tone] ?? toneClass.neutral"
  >
    {{ label }}
  </span>
</template>
