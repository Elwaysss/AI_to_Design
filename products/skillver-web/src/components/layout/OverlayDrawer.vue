<script setup lang="ts">
defineProps<{ open: boolean; title: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-md"
      role="presentation"
      @click.self="emit('close')"
    >
      <aside
        class="glass-panel-strong h-full w-[min(480px,80vw)] overflow-y-auto border-l border-white/10 p-6"
        style="backdrop-filter: blur(32px) saturate(200%)"
        role="dialog"
        :aria-label="title"
      >
        <div class="mb-4 flex items-center justify-between">
          <h2 class="sv-h2">{{ title }}</h2>
          <button type="button" class="rounded-button px-2 py-1 text-sm text-slate-400 glass-nav-item" @click="emit('close')">
            关闭
          </button>
        </div>
        <slot />
      </aside>
    </div>
  </Teleport>
</template>
