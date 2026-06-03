<script setup lang="ts">
import type { AestheticPreset, BrandPreset, StyleSelection, StyleTab } from '../../types/style-preset'
import StyleCardThumb from './StyleCardThumb.vue'

defineProps<{
  activeTab: StyleTab
  aesthetic: AestheticPreset[]
  brand: BrandPreset[]
  selection: StyleSelection | null
}>()

const emit = defineEmits<{
  switchTab: [tab: StyleTab]
  select: [selection: StyleSelection]
}>()

function pickAesthetic(item: AestheticPreset) {
  emit('select', { tab: 'aesthetic', id: item.id, slug: item.slug, nameZh: item.nameZh })
}

function pickBrand(item: BrandPreset) {
  emit('select', { tab: 'brand', id: item.id, slug: item.slug, nameZh: item.nameZh })
}
</script>

<template>
  <div class="style-catalog">
    <div class="style-catalog__tabs" role="tablist">
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'aesthetic'"
        :class="{ 'is-active': activeTab === 'aesthetic' }"
        @click="emit('switchTab', 'aesthetic')"
      >
        美学风格
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'brand'"
        :class="{ 'is-active': activeTab === 'brand' }"
        @click="emit('switchTab', 'brand')"
      >
        品牌参考
      </button>
    </div>
    <p class="style-catalog__hint">两个标签页只能选一个主风格（美学与品牌二选一）</p>

    <div v-if="activeTab === 'aesthetic'" class="style-catalog__grid" role="tabpanel">
      <button
        v-for="item in aesthetic"
        :key="item.id"
        type="button"
        class="style-card"
        :class="{ 'is-selected': selection?.tab === 'aesthetic' && selection.id === item.id }"
        @click="pickAesthetic(item)"
      >
        <StyleCardThumb
          kind="aesthetic"
          :slug="item.slug"
          :name-zh="item.nameZh"
          :visual-style="item.visualStyle"
        />
        <span class="style-card__name">{{ item.nameZh }}</span>
        <span class="style-card__summary">{{ item.summaryZh }}</span>
      </button>
    </div>

    <div v-else class="style-catalog__grid" role="tabpanel">
      <button
        v-for="item in brand"
        :key="item.id"
        type="button"
        class="style-card"
        :class="{ 'is-selected': selection?.tab === 'brand' && selection.id === item.id }"
        @click="pickBrand(item)"
      >
        <StyleCardThumb kind="brand" :slug="item.slug" :name-zh="item.nameZh" />
        <span class="style-card__name">{{ item.nameZh }}</span>
        <span class="style-card__summary">{{ item.summaryZh }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.style-catalog__tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.style-catalog__tabs button {
  flex: 1;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--dp-border, #e2e2da);
  border-radius: 8px;
  background: #fff;
  font-weight: 600;
  cursor: pointer;
}

.style-catalog__tabs button.is-active {
  border-color: var(--dp-primary, #2e6cb8);
  background: color-mix(in srgb, var(--dp-primary, #2e6cb8) 8%, #fff);
  color: var(--dp-primary, #2e6cb8);
}

.style-catalog__hint {
  margin: 0 0 1rem;
  font-size: 0.8125rem;
  color: var(--dp-muted, #7a7a6f);
}

.style-catalog__grid {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  max-height: calc(100vh - 320px);
  overflow-y: auto;
  padding-right: 0.25rem;
}

.style-card {
  text-align: left;
  padding: 0.75rem;
  border: 1px solid var(--dp-border, #e2e2da);
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}

.style-card:hover {
  border-color: color-mix(in srgb, var(--dp-primary, #2e6cb8) 40%, #e2e2da);
  transform: translateY(-1px);
}

.style-card.is-selected {
  border-color: var(--dp-primary, #2e6cb8);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--dp-primary, #2e6cb8) 25%, transparent);
}

.style-card__name {
  display: block;
  font-weight: 600;
  margin-bottom: 0.2rem;
  font-size: 0.9375rem;
}

.style-card__summary {
  display: block;
  font-size: 0.75rem;
  color: var(--dp-muted, #7a7a6f);
  line-height: 1.4;
}
</style>
