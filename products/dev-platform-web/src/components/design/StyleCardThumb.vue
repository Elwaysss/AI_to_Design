<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { PreviewVars } from '../../types/style-preset'
import { buildCardThumbHtml, createFallbackPreviewVars } from '../../lib/styleThemes'
import { fetchPreviewVars } from '../../lib/previewTokens'

const props = defineProps<{
  kind: 'aesthetic' | 'brand'
  slug: string
  nameZh: string
  visualStyle?: string[]
}>()

const vars = ref<PreviewVars | null>(null)

const thumbSrcdoc = computed(() => {
  const v =
    vars.value ??
    createFallbackPreviewVars({
      slug: props.slug,
      kind: props.kind,
      visualStyle: props.visualStyle
    })
  return buildCardThumbHtml(v)
})

async function loadVars() {
  try {
    const data = await fetchPreviewVars(props.kind, props.slug, props.nameZh)
    vars.value = data.preview
  } catch {
    /* 缩略图继续用 fallback */
  }
}

onMounted(loadVars)
watch(() => [props.kind, props.slug], loadVars)
</script>

<template>
  <div class="style-card-thumb" aria-hidden="true">
    <iframe
      class="style-card-thumb__frame"
      title=""
      tabindex="-1"
      sandbox="allow-same-origin"
      loading="lazy"
      :srcdoc="thumbSrcdoc"
    />
  </div>
</template>

<style scoped>
.style-card-thumb {
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.625rem;
  pointer-events: none;
  border: 1px solid color-mix(in srgb, var(--dp-text, #171715) 6%, transparent);
}

.style-card-thumb__frame {
  width: 100%;
  height: 72px;
  border: none;
  display: block;
  transform: scale(1);
}
</style>
