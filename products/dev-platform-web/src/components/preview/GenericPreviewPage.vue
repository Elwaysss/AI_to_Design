<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadProductSpecSync } from '../../lib/loadProductSpec'
import { fetchPreviewVars, applyPreviewVars } from '../../lib/previewTokens'
import { getProductRecipeClass } from '../../lib/pageRecipes'
import { resolveStyleTheme, type ThemeProfile } from '../../lib/styleThemes'
import { alignPreviewVarsToTheme } from '../../lib/previewThemeAlign'
import type { BrandHeroArchetype } from '../../types/style-preset'

const route = useRoute()
const spec = loadProductSpecSync()
const dashboardPage = spec.pages.find((p) => p.id === spec.representativePageId)

const stats = [
  { label: '活跃用户', value: '1,248' },
  { label: '本周任务', value: '86' },
  { label: '完成率', value: '92%' }
]

const activity = ['规格已同步', '设计令牌待确认', '示例页已生成']

const kind = computed(() => String(route.query.kind ?? 'aesthetic'))
const slug = computed(() => String(route.query.slug ?? ''))

const rootRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const themeProfile = ref<ThemeProfile>('default')
const brandArchetype = ref<BrandHeroArchetype | ''>('')

const productRecipeClass = ref('')

async function applyTheme() {
  if (!slug.value || !rootRef.value) return
  loading.value = true
  try {
    const data = await fetchPreviewVars(
      kind.value === 'brand' ? 'brand' : 'aesthetic',
      slug.value
    )
    applyPreviewVars(rootRef.value, data.preview)
    const theme = resolveStyleTheme(data.preview)
    const aligned = alignPreviewVarsToTheme(data.preview, theme)
    themeProfile.value = theme.profile
    brandArchetype.value = theme.brandArchetype ?? data.preview.heroArchetype ?? ''
    productRecipeClass.value = getProductRecipeClass(slug.value)
    if (aligned.dark) rootRef.value.classList.add('is-dark')
    else rootRef.value.classList.remove('is-dark')
  } finally {
    loading.value = false
  }
}

onMounted(applyTheme)
watch(() => [kind.value, slug.value], applyTheme)
</script>

<template>
  <div
    ref="rootRef"
    class="generic-preview"
    :class="[
      `theme-${themeProfile}`,
      brandArchetype ? `brand-${brandArchetype}` : '',
      productRecipeClass,
      { 'is-loading': loading }
    ]"
  >
    <aside class="generic-preview__sidebar">
      <div class="generic-preview__brand">{{ spec.productName }}</div>
      <nav class="generic-preview__nav">
        <a
          v-for="page in spec.pages"
          :key="page.id"
          href="#"
          :class="{ 'is-active': page.id === spec.representativePageId }"
          @click.prevent
        >
          {{ page.title }}
        </a>
      </nav>
    </aside>
    <main class="generic-preview__main">
      <header class="generic-preview__header">
        <div>
          <p class="generic-preview__eyebrow">{{ dashboardPage?.role }}</p>
          <h1>{{ dashboardPage?.title ?? '工作台' }}</h1>
          <p class="generic-preview__summary">{{ dashboardPage?.summary }}</p>
        </div>
        <button type="button" class="generic-preview__cta">新建</button>
      </header>
      <section class="generic-preview__stats">
        <article v-for="stat in stats" :key="stat.label" class="generic-preview__card">
          <p class="label">{{ stat.label }}</p>
          <p class="value">{{ stat.value }}</p>
        </article>
      </section>
      <section class="generic-preview__card generic-preview__activity">
        <h2>近期动态</h2>
        <ul>
          <li v-for="item in activity" :key="item">{{ item }}</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style scoped>
.generic-preview {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100vh;
  background: var(--preview-background, #fafaf7);
  color: var(--preview-text, #171715);
  font-family: var(--preview-font-body, Inter, system-ui, sans-serif);
}

.generic-preview.is-loading {
  opacity: 0.85;
}

.generic-preview__sidebar {
  padding: 1.25rem 1rem;
  background: var(--preview-surface, #fff);
  color: var(--preview-text-on-surface, var(--preview-text, #171715));
  border-right: 1px solid color-mix(in srgb, var(--preview-text-on-surface, var(--preview-text, #171715)) 10%, transparent);
}

.generic-preview__brand {
  font-family: var(--preview-font-display, inherit);
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--preview-text-on-surface, var(--preview-text, #171715));
}

.generic-preview__nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.generic-preview__nav a {
  padding: 0.5rem 0.75rem;
  border-radius: var(--preview-radius, 8px);
  color: inherit;
  text-decoration: none;
  opacity: 0.7;
  font-size: 0.875rem;
}

.generic-preview__nav a.is-active,
.generic-preview__nav a:hover {
  opacity: 1;
  background: color-mix(in srgb, var(--preview-primary, #3b82f6) 12%, transparent);
  color: var(--preview-text-on-surface, var(--preview-text, #171715));
}

.generic-preview__main {
  padding: 1.5rem 2rem;
  color: var(--preview-text, #171715);
}

.generic-preview__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.generic-preview__eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  color: var(--preview-text-muted, #7a7a6f);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.generic-preview__header h1 {
  margin: 0 0 0.25rem;
  font-family: var(--preview-font-display, inherit);
  font-size: 1.5rem;
  color: var(--preview-text, #171715);
}

.generic-preview__summary {
  margin: 0;
  color: var(--preview-text-muted, #7a7a6f);
  font-size: 0.875rem;
}

.generic-preview__cta {
  border: none;
  border-radius: var(--preview-button-radius, var(--preview-radius, 8px));
  padding: 0.625rem 1rem;
  background: var(--preview-primary, #3b82f6);
  color: var(--preview-cta-text, #fff);
  font-weight: 600;
  cursor: pointer;
}

.generic-preview__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--preview-spacing-grid, 1rem);
  margin-bottom: var(--preview-spacing-section, 1.5rem);
}

.generic-preview__card {
  background: var(--preview-surface, #fff);
  color: var(--preview-text-on-surface, var(--preview-text, #171715));
  border-radius: var(--preview-radius, 12px);
  padding: 1.25rem;
  border: 1px solid color-mix(in srgb, var(--preview-text-on-surface, var(--preview-text, #171715)) 8%, transparent);
  box-shadow: var(--preview-elevation-raised, 0 1px 2px rgba(0, 0, 0, 0.06));
}

.generic-preview__card .label {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  color: var(--preview-text-muted-on-surface, var(--preview-text-muted, #7a7a6f));
}

.generic-preview__card .value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--preview-text-on-surface, var(--preview-text, #171715));
}

.generic-preview__activity h2 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  color: var(--preview-text-on-surface, var(--preview-text, #171715));
}

.generic-preview__activity ul {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.875rem;
  color: var(--preview-text-muted-on-surface, var(--preview-text-muted, #7a7a6f));
}

@media (max-width: 768px) {
  .generic-preview {
    grid-template-columns: 1fr;
  }
  .generic-preview__stats {
    grid-template-columns: 1fr;
  }
}

/* 产品预览 — 各主题差异化（与工作台骨架叠加） */
.theme-neobrutalism .generic-preview__card {
  border: 3px solid #000;
  border-radius: 0;
  box-shadow: 4px 4px 0 #000;
}
.theme-neobrutalism .generic-preview__cta {
  border: 3px solid #000;
  border-radius: 0;
  box-shadow: 3px 3px 0 #000;
  color: #000;
  font-weight: 800;
  text-transform: uppercase;
}
.theme-neobrutalism .generic-preview__header h1 {
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.03em;
}

.theme-editorial .generic-preview__header h1 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 2rem;
  font-weight: 400;
}
.theme-editorial .generic-preview__card {
  border: none;
  border-bottom: 1px solid color-mix(in srgb, var(--preview-text) 15%, transparent);
  border-radius: 0;
  background: transparent;
}

.theme-glassmorphism.generic-preview {
  background-color: #0c1222;
  background-image:
    radial-gradient(ellipse 80% 60% at 10% 15%, color-mix(in srgb, var(--preview-primary) 55%, transparent), transparent 55%),
    radial-gradient(ellipse 70% 50% at 90% 10%, rgba(14, 165, 233, 0.4), transparent 50%),
    linear-gradient(155deg, #0a0f1a, #121a2e 45%, #1a1040);
  color: var(--preview-text, #f1f5f9);
}
.theme-glassmorphism .generic-preview__card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: var(--preview-text-on-surface, #f1f5f9);
}
.theme-glassmorphism .generic-preview__card .label {
  color: var(--preview-text-muted-on-surface, #94a3b8);
}
.theme-glassmorphism .generic-preview__card .value,
.theme-glassmorphism .generic-preview__activity h2 {
  color: var(--preview-text-on-surface, #f1f5f9);
}
.theme-glassmorphism .generic-preview__activity ul {
  color: var(--preview-text-muted-on-surface, #94a3b8);
}
.theme-glassmorphism .generic-preview__sidebar {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  color: var(--preview-text-on-surface, #f1f5f9);
  border-right-color: rgba(255, 255, 255, 0.12);
}
.theme-glassmorphism .generic-preview__brand,
.theme-glassmorphism .generic-preview__nav a {
  color: var(--preview-text-on-surface, #f1f5f9);
}
.theme-glassmorphism .generic-preview__main {
  color: var(--preview-text, #f1f5f9);
}
.theme-glassmorphism .generic-preview__eyebrow {
  color: var(--preview-text-muted, #94a3b8);
}
.theme-glassmorphism .generic-preview__header h1 {
  color: var(--preview-text, #f1f5f9);
  text-shadow: 0 0 40px color-mix(in srgb, var(--preview-primary) 35%, transparent);
}
.theme-glassmorphism .generic-preview__summary {
  color: var(--preview-text-muted, #94a3b8);
}

.theme-neon .generic-preview__card {
  box-shadow: 0 0 12px color-mix(in srgb, var(--preview-primary) 20%, transparent);
  border-color: color-mix(in srgb, var(--preview-primary) 40%, transparent);
}
.theme-neon .generic-preview__value,
.theme-neon .generic-preview__card .value {
  color: var(--preview-primary);
  text-shadow: 0 0 8px color-mix(in srgb, var(--preview-primary) 40%, transparent);
}

.theme-neumorphism .generic-preview__card {
  border: none;
  box-shadow: 6px 6px 12px #c8cdd4, -6px -6px 12px #fff;
  background: #e4e9f0;
}
.theme-neumorphism .generic-preview {
  background: #e4e9f0;
}

.theme-brutalism .generic-preview__brand,
.theme-brutalism .generic-preview__header h1 {
  font-family: 'Courier New', monospace;
  text-decoration: underline;
}

.theme-luxury .generic-preview__header h1 {
  font-family: Georgia, serif;
  color: var(--preview-primary);
  letter-spacing: 0.04em;
}

.theme-friendly .generic-preview__card {
  border-radius: 20px;
  border: 2px solid #fed7aa;
  box-shadow: 0 4px 0 #fdba74;
}
.theme-friendly .generic-preview__cta {
  border-radius: 999px;
}

/* 品牌 archetype — 来自 awesome-design-md YAML / prose */
.brand-gradient-mesh .generic-preview__main {
  background-image:
    radial-gradient(ellipse 80% 50% at 20% 0%, #f5e9d4 0%, transparent 50%),
    radial-gradient(ellipse 70% 45% at 80% 5%, #b9b9f9 0%, transparent 45%);
}
.brand-gradient-mesh .generic-preview__cta {
  border-radius: var(--preview-button-radius, 9999px);
  font-weight: 500;
}
.brand-gradient-mesh .generic-preview__card {
  background: #f5e9d4;
  border-color: #e3e8ee;
}

.brand-dark-dev .generic-preview__sidebar {
  background: color-mix(in srgb, var(--preview-surface) 95%, #000);
  border-right-color: color-mix(in srgb, var(--preview-text-on-surface, var(--preview-text)) 12%, transparent);
  color: var(--preview-text-on-surface, var(--preview-text));
}
.brand-dark-dev .generic-preview__card {
  background: color-mix(in srgb, var(--preview-surface) 90%, var(--preview-primary));
  border-color: color-mix(in srgb, var(--preview-text-on-surface, var(--preview-text)) 10%, transparent);
  color: var(--preview-text-on-surface, var(--preview-text));
}
.brand-dark-dev .generic-preview__card .label {
  color: var(--preview-text-muted-on-surface, var(--preview-text-muted));
}
.brand-dark-dev .generic-preview__card .value,
.brand-dark-dev .generic-preview__activity h2 {
  color: var(--preview-text-on-surface, var(--preview-text));
}
.brand-dark-dev .generic-preview__activity ul {
  color: var(--preview-text-muted-on-surface, var(--preview-text-muted));
}
.brand-dark-dev .generic-preview__cta {
  border-radius: var(--preview-button-radius, 8px);
}

.brand-pastel-cards .generic-preview__stats .generic-preview__card:nth-child(1) {
  background: var(--preview-card-tint-0, #fbf3db);
}
.brand-pastel-cards .generic-preview__stats .generic-preview__card:nth-child(2) {
  background: var(--preview-card-tint-1, #faebec);
}
.brand-pastel-cards .generic-preview__stats .generic-preview__card:nth-child(3) {
  background: var(--preview-card-tint-2, #e7f3f8);
}
.brand-pastel-cards .generic-preview__card {
  border-color: #e8e8e3;
}

.brand-navy-hero .generic-preview__header {
  background: var(--preview-hero-accent, #19202e);
  margin: -1.5rem -2rem 1.5rem;
  padding: 2rem 2rem 1.5rem;
  color: #fff;
}
.brand-navy-hero .generic-preview__header h1,
.brand-navy-hero .generic-preview__eyebrow,
.brand-navy-hero .generic-preview__summary {
  color: #fff;
}
.brand-navy-hero .generic-preview__summary {
  opacity: 0.85;
}
.brand-navy-hero .generic-preview__cta {
  background: #fff;
  color: #19202e;
}

.brand-immersive-dark .generic-preview__card {
  background: var(--preview-surface, #181818);
  border: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  color: var(--preview-text-on-surface, var(--preview-text));
}
.brand-immersive-dark .generic-preview__card .label {
  color: var(--preview-text-muted-on-surface, var(--preview-text-muted));
}
.brand-immersive-dark .generic-preview__card .value,
.brand-immersive-dark .generic-preview__activity h2 {
  color: var(--preview-text-on-surface, var(--preview-text));
}
.brand-immersive-dark .generic-preview__activity ul {
  color: var(--preview-text-muted-on-surface, var(--preview-text-muted));
}
.brand-immersive-dark .generic-preview__cta {
  border-radius: var(--preview-button-radius, 9999px);
  color: var(--preview-cta-text, #000);
  font-weight: 700;
}

.brand-aubergine-soft .generic-preview {
  background-image: radial-gradient(ellipse 60% 40% at 0% 0%, #f4effa 0%, transparent 55%);
}
.brand-aubergine-soft .generic-preview__cta {
  border-radius: var(--preview-button-radius, 9999px);
}

.brand-colorful .generic-preview__stats .generic-preview__card:nth-child(1) {
  border-color: var(--preview-primary);
}
.brand-colorful .generic-preview__stats .generic-preview__card:nth-child(2) {
  border-color: #ffd02f;
  background: color-mix(in srgb, #ffd02f 12%, #fff);
}
.brand-colorful .generic-preview__stats .generic-preview__card:nth-child(3) {
  border-color: #0acf83;
  background: color-mix(in srgb, #0acf83 10%, #fff);
}
.brand-colorful .generic-preview__card {
  border-width: 2px;
}

/* 品牌产品套用 — 与工作台骨架叠加 */
.recipe-product-notion .generic-preview__sidebar {
  border-right-color: #e8e8e3;
}
.recipe-product-stripe .generic-preview__header h1 {
  font-weight: 300;
  letter-spacing: -0.03em;
}
.recipe-product-stripe .generic-preview__card .value {
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
}
.recipe-product-linear .generic-preview__sidebar {
  background: color-mix(in srgb, var(--preview-surface) 96%, #000);
}
.recipe-product-linear .generic-preview__card {
  border-color: color-mix(in srgb, var(--preview-text) 12%, transparent);
}
.recipe-product-slack .generic-preview__main {
  background-image: radial-gradient(ellipse 50% 35% at 0% 0%, #f4effa, transparent 55%);
}
.recipe-product-spotify .generic-preview__cta {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
}

/* 品牌产品套用 — 扩展品牌（按 archetype 分组） */
.recipe-product-github .generic-preview__sidebar,
.recipe-product-raycast .generic-preview__sidebar {
  background: color-mix(in srgb, var(--preview-surface) 96%, #000);
}
.recipe-product-github .generic-preview__card,
.recipe-product-raycast .generic-preview__card {
  border-color: color-mix(in srgb, var(--preview-text) 12%, transparent);
}
.recipe-product-discord .generic-preview__main {
  background-image: radial-gradient(ellipse 50% 35% at 0% 0%, #f4effa, transparent 55%);
}
.recipe-product-monday .generic-preview__stats .generic-preview__card:nth-child(1),
.recipe-product-miro .generic-preview__stats .generic-preview__card:nth-child(1) {
  border-color: var(--preview-primary);
  border-width: 2px;
}
.recipe-product-monday .generic-preview__stats .generic-preview__card:nth-child(2),
.recipe-product-miro .generic-preview__stats .generic-preview__card:nth-child(2) {
  border-color: #ffd02f;
  background: color-mix(in srgb, #ffd02f 12%, var(--preview-surface));
}
.recipe-product-monday .generic-preview__stats .generic-preview__card:nth-child(3),
.recipe-product-miro .generic-preview__stats .generic-preview__card:nth-child(3) {
  border-color: #0acf83;
  background: color-mix(in srgb, #0acf83 10%, var(--preview-surface));
}
.recipe-product-airbnb .generic-preview__card .value {
  color: #ff385c;
}
.recipe-product-supabase .generic-preview__card .value {
  color: #3ecf8e;
}
.recipe-product-cursor .generic-preview__card .value {
  color: #f54e00;
}
.recipe-product-vercel .generic-preview__header h1,
.recipe-product-apple .generic-preview__header h1,
.recipe-product-figma .generic-preview__header h1 {
  letter-spacing: -0.03em;
}
.recipe-product-shopify .generic-preview__cta,
.recipe-product-vercel .generic-preview__cta,
.recipe-product-apple .generic-preview__cta,
.recipe-product-google .generic-preview__cta,
.recipe-product-figma .generic-preview__cta,
.recipe-product-monday .generic-preview__cta,
.recipe-product-miro .generic-preview__cta,
.recipe-product-discord .generic-preview__cta {
  border-radius: var(--preview-button-radius, 9999px);
}
</style>
