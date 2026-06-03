<script setup lang="ts">
import { ref } from 'vue'
import ChatMessage from './ChatMessage.vue'
import type { CopilotMessage } from '../../mocks/copilotSeed'

const props = defineProps<{
  title: string
  subtitle: string
  seed: CopilotMessage[]
  allowEmoji?: boolean
}>()

const messages = ref<CopilotMessage[]>([...props.seed])
const draft = ref('')

function send() {
  const text = draft.value.trim()
  if (!text) return
  messages.value.push({ id: String(Date.now()), role: 'user', content: text })
  draft.value = ''
  messages.value.push({
    id: String(Date.now() + 1),
    role: 'assistant',
    content: '收到。Glassmorphism Pro 皮肤 + V2.1 流程原型。'
  })
}
</script>

<template>
  <div class="flex h-full min-h-[calc(100vh-0px)] flex-col glass-bg p-3 pl-0">
    <header class="glass-panel mb-3 px-6 py-4">
      <h1 class="sv-h1">{{ title }}</h1>
      <p class="sv-h3 mt-1">{{ subtitle }}</p>
    </header>

    <div class="glass-panel mx-3 mb-3 flex-1 overflow-y-auto px-6 py-4" role="log" aria-live="polite">
      <div class="mx-auto flex max-w-3xl flex-col gap-3">
        <ChatMessage v-for="m in messages" :key="m.id" :message="m" :allow-emoji="allowEmoji" />
        <slot name="cards" />
      </div>
    </div>

    <footer class="glass-panel mx-3 mb-3 px-6 py-4">
      <form class="mx-auto flex max-w-3xl gap-2" @submit.prevent="send">
        <input
          v-model="draft"
          type="text"
          class="glass-input h-10 flex-1 rounded-button px-4 text-sm leading-[1.2]"
          placeholder="输入消息…"
          aria-label="消息输入"
        />
        <button type="submit" class="sv-btn sv-btn-primary">发送</button>
      </form>
    </footer>
  </div>
</template>
