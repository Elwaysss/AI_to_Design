<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useMachine } from '@xstate/vue'
import { designModuleMachine } from '../machines/designModuleMachine'
import { loadProductSpecSync } from '../lib/loadProductSpec'
import { exportDesignPackage, fetchPreviewVars } from '../lib/previewTokens'
import StyleCatalog from '../components/design/StyleCatalog.vue'
import StylePreviewPanel from '../components/design/StylePreviewPanel.vue'
import type { StyleCatalog as StyleCatalogType, StyleSelection, StyleTab } from '../types/style-preset'

const spec = loadProductSpecSync()
const catalog = ref<StyleCatalogType | null>(null)
const { snapshot, send } = useMachine(designModuleMachine)

onMounted(async () => {
  const res = await fetch('/api/design/catalog')
  catalog.value = await res.json()
})

watch(
  () => snapshot.value.context.selection,
  async (selection) => {
    if (!selection) return
    try {
      const data = await fetchPreviewVars(selection.tab, selection.slug, selection.nameZh)
      send({ type: 'PREVIEW_LOADED', vars: data.preview })
    } catch (err) {
      send({
        type: 'PREVIEW_FAILED',
        message: err instanceof Error ? err.message : '预览加载失败'
      })
    }
  }
)

function onSwitchTab(tab: StyleTab) {
  send({ type: 'SWITCH_TAB', tab })
}

function onSelect(selection: StyleSelection) {
  send({ type: 'SELECT_STYLE', selection })
}

function onConfirm() {
  const ctx = snapshot.value.context
  if (!ctx.selection) return
  send({ type: 'CONFIRM' })
  exportDesignPackage({
    kind: ctx.selection.tab,
    slug: ctx.selection.slug,
    displayNameZh: ctx.selection.nameZh,
    supplementNotes: ctx.supplementNotes
  })
    .then((result) => send({ type: 'EXPORT_DONE', result }))
    .catch((err) =>
      send({
        type: 'EXPORT_FAILED',
        message: err instanceof Error ? err.message : '导出失败'
      })
    )
}
</script>

<template>
  <div class="design-module">
    <header class="design-module__header">
      <div>
        <p class="design-module__phase">第二阶段 · 交互与界面设计</p>
        <h1>交互与界面设计</h1>
        <p class="design-module__product">
          当前演示产品：<strong>{{ spec.productName }}</strong>
          <span class="design-module__badge">内置 Spec 夹具</span>
        </p>
      </div>
    </header>

    <div class="design-module__layout">
      <aside class="design-module__sidebar">
        <StyleCatalog
          v-if="catalog"
          :active-tab="snapshot.context.activeTab"
          :aesthetic="catalog.aesthetic"
          :brand="catalog.brand"
          :selection="snapshot.context.selection"
          @switch-tab="onSwitchTab"
          @select="onSelect"
        />

        <label class="design-module__notes">
          <span>补充说明（可选）</span>
          <textarea
            rows="4"
            placeholder="例如：专业、克制、面向企业、不要表情符号"
            :value="snapshot.context.supplementNotes"
            @input="send({ type: 'EDIT_NOTES', value: ($event.target as HTMLTextAreaElement).value })"
          />
        </label>

        <button
          type="button"
          class="design-module__confirm"
          :disabled="!snapshot.context.selection || snapshot.context.exporting"
          @click="onConfirm"
        >
          {{ snapshot.context.exporting ? '正在导出…' : '确认风格' }}
        </button>
      </aside>

      <section class="design-module__preview">
        <StylePreviewPanel
          :selection="snapshot.context.selection"
          :preview-mode="snapshot.context.previewMode"
          :preview-vars="snapshot.context.previewVars"
          :loading="snapshot.context.loadingPreview"
          @apply-to-product="send({ type: 'APPLY_TO_PRODUCT' })"
          @back-to-sample="send({ type: 'BACK_TO_SAMPLE' })"
        />
      </section>
    </div>

    <div v-if="snapshot.context.error" class="design-module__toast" role="alert">
      {{ snapshot.context.error }}
      <button type="button" @click="send({ type: 'DISMISS_ERROR' })">关闭</button>
    </div>

    <div v-if="snapshot.context.exportResult" class="design-module__success">
      <h3>设计规范已导出</h3>
      <p>输出目录：<code>{{ snapshot.context.exportResult.outputDir }}</code></p>
      <ul>
        <li v-for="file in snapshot.context.exportResult.files" :key="file">{{ file }}</li>
      </ul>
      <p class="design-module__success-hint">
        运行 <code>npm run design:validate</code> 可验证 DESIGN.md；示例页位于
        <code>output/demo-saas/src/pages/DashboardExamplePage.vue</code>
      </p>
    </div>
  </div>
</template>

<style scoped>
.design-module {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
}

.design-module__header {
  margin-bottom: 1.5rem;
}

.design-module__phase {
  margin: 0 0 0.25rem;
  font-size: 0.8125rem;
  color: var(--dp-muted, #7a7a6f);
}

.design-module__header h1 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
}

.design-module__product {
  margin: 0;
  color: var(--dp-muted, #7a7a6f);
}

.design-module__badge {
  margin-left: 0.5rem;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  background: #f1f1eb;
  font-size: 0.75rem;
}

.design-module__layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 1.5rem;
  align-items: start;
}

.design-module__sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.design-module__notes span {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
}

.design-module__notes textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--dp-border, #e2e2da);
  border-radius: 8px;
  font: inherit;
  resize: vertical;
}

.design-module__confirm {
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  background: var(--dp-primary, #2e6cb8);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.design-module__confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.design-module__preview {
  min-height: 560px;
}

.design-module__toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  max-width: 420px;
  padding: 1rem;
  background: #7e2a1c;
  color: #fff;
  border-radius: 10px;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.design-module__toast button {
  border: 1px solid #fff;
  background: transparent;
  color: #fff;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}

.design-module__success {
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: #f1f1eb;
  border: 1px solid #e2e2da;
}

.design-module__success h3 {
  margin: 0 0 0.5rem;
}

.design-module__success ul {
  margin: 0.5rem 0;
  padding-left: 1.25rem;
}

.design-module__success-hint {
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  color: var(--dp-muted, #7a7a6f);
}

@media (max-width: 960px) {
  .design-module__layout {
    grid-template-columns: 1fr;
  }
}
</style>
