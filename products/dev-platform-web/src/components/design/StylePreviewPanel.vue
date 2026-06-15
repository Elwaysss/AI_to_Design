<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { PreviewMode, PreviewVars, StyleSelection } from '../../types/style-preset'
import { buildSampleHtml } from '../../lib/previewTokens'

const router = useRouter()

const props = defineProps<{
  selection: StyleSelection | null
  previewMode: PreviewMode
  previewVars: PreviewVars | null
  loading: boolean
}>()

const emit = defineEmits<{
  applyToProduct: []
  backToSample: []
}>()

const productPreviewUrl = computed(() => {
  if (!props.selection) return ''
  return router.resolve({
    name: 'preview-dashboard',
    query: { kind: props.selection.tab, slug: props.selection.slug }
  }).href
})

const sampleSrcdoc = computed(() => {
  if (!props.selection || !props.previewVars) return ''
  return buildSampleHtml(props.previewVars, props.selection.nameZh)
})
</script>

<template>
  <div class="style-preview">
    <div class="style-preview__toolbar">
      <div class="style-preview__steps">
        <span :class="{ 'is-active': previewMode === 'sample' }">① 风格样例</span>
        <span :class="{ 'is-active': previewMode === 'product' }">② 应用到产品</span>
      </div>
      <div class="style-preview__actions">
        <button
          v-if="previewMode === 'sample' && selection && previewVars"
          type="button"
          class="btn-primary"
          @click="emit('applyToProduct')"
        >
          应用到我的产品
        </button>
        <button
          v-if="previewMode === 'product'"
          type="button"
          class="btn-ghost"
          @click="emit('backToSample')"
        >
          返回看样例
        </button>
      </div>
    </div>

    <div v-if="!selection" class="style-preview__empty">
      <p>请从左侧选择一种美学风格或品牌参考</p>
    </div>

    <div v-else-if="loading" class="style-preview__empty">
      <p>正在加载预览…</p>
    </div>

    <div v-else-if="!previewVars" class="style-preview__empty">
      <p>预览加载失败，请重选风格</p>
    </div>

    <div v-else class="style-preview__frame-wrap">
      <iframe
        v-if="previewMode === 'sample'"
        :key="`sample-${selection?.slug}`"
        class="style-preview__frame"
        title="风格样例预览"
        sandbox="allow-same-origin"
        :srcdoc="sampleSrcdoc"
      />
      <iframe
        v-else
        :key="`product-${selection?.slug}`"
        class="style-preview__frame"
        title="产品工作台预览"
        :src="productPreviewUrl"
      />
    </div>
  </div>
</template>

<style scoped>
.style-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 480px;
}

.style-preview__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.style-preview__steps {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--dp-muted, #7a7a6f);
}

.style-preview__steps .is-active {
  color: var(--dp-text, #171715);
  font-weight: 600;
}

.style-preview__actions {
  display: flex;
  gap: 0.5rem;
}

.btn-primary {
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  background: var(--dp-primary, #2e6cb8);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.btn-ghost {
  border: 1px solid var(--dp-border, #e2e2da);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  background: #fff;
  cursor: pointer;
}

.style-preview__empty {
  flex: 1;
  display: grid;
  place-items: center;
  border: 1px dashed var(--dp-border, #e2e2da);
  border-radius: 12px;
  color: var(--dp-muted, #7a7a6f);
  background: #fafaf7;
}

.style-preview__frame-wrap {
  flex: 1;
  border: 1px solid var(--dp-border, #e2e2da);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.style-preview__frame {
  width: 100%;
  height: 100%;
  min-height: 520px;
  border: none;
  display: block;
}
</style>
