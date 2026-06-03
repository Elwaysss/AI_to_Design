/**
 * Template codegen — dashboard example page using CSS variables from tokens (no hardcoded HEX).
 */

/**
 * @param {{ productName?: string }} mapped
 */
export function generateDashboardExampleVue(mapped) {
  const productName = mapped.productName ?? 'Demo SaaS';
  return `<script setup lang="ts">
const productLabel = ${JSON.stringify(productName)}
const stats = [
  { label: '活跃用户', value: '1,248' },
  { label: '本周任务', value: '86' },
  { label: '完成率', value: '92%' }
]
const activity = ['林晨 更新了产品规格', '阿哲 合并了设计令牌 PR', 'CI 通过了 design:validate']
</script>

<template>
  <div class="example-dashboard">
    <aside class="example-dashboard__sidebar">
      <div class="example-dashboard__logo">{{ productLabel }}</div>
      <nav class="example-dashboard__nav">
        <a class="is-active" href="#">工作台</a>
        <a href="#">项目</a>
        <a href="#">设置</a>
      </nav>
    </aside>
    <div class="example-dashboard__main">
      <header class="example-dashboard__header">
        <h1>工作台</h1>
        <button type="button" class="example-dashboard__cta">新建项目</button>
      </header>
      <section class="example-dashboard__stats">
        <article v-for="stat in stats" :key="stat.label" class="example-dashboard__card">
          <p class="example-dashboard__stat-label">{{ stat.label }}</p>
          <p class="example-dashboard__stat-value">{{ stat.value }}</p>
        </article>
      </section>
      <section class="example-dashboard__content example-dashboard__card">
        <h2>近期活动</h2>
        <ul>
          <li v-for="item in activity" :key="item">{{ item }}</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.example-dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
  background: var(--color-surface-canvas, var(--preview-background, #fafaf7));
  color: var(--color-text-primary, var(--preview-text, #171715));
  font-family: var(--font-family-body, var(--preview-font-body, Inter, system-ui, sans-serif));
}

.example-dashboard__sidebar {
  padding: 1.5rem 1rem;
  background: var(--color-surface-paper, var(--preview-surface, #fff));
  border-right: 1px solid color-mix(in srgb, var(--preview-text, #171715) 12%, transparent);
}

.example-dashboard__logo {
  font-family: var(--font-family-display, var(--preview-font-display, inherit));
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.example-dashboard__nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.example-dashboard__nav a {
  padding: 0.5rem 0.75rem;
  border-radius: var(--preview-radius, 8px);
  color: inherit;
  text-decoration: none;
  opacity: 0.75;
}

.example-dashboard__nav a.is-active,
.example-dashboard__nav a:hover {
  opacity: 1;
  background: color-mix(in srgb, var(--color-brand-primary, var(--preview-primary, #3b82f6)) 12%, transparent);
}

.example-dashboard__main {
  padding: 1.5rem 2rem;
}

.example-dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.example-dashboard__header h1 {
  font-family: var(--font-family-display, var(--preview-font-display, inherit));
  font-size: 1.5rem;
  margin: 0;
}

.example-dashboard__cta {
  border: none;
  border-radius: var(--preview-radius, 8px);
  padding: 0.625rem 1rem;
  background: var(--color-brand-primary, var(--preview-primary, #3b82f6));
  color: var(--color-text-inverse, #fff);
  font-weight: 600;
  cursor: pointer;
}

.example-dashboard__cta:hover {
  background: var(--color-brand-primary-hover, var(--preview-primary-hover, #2563eb));
}

.example-dashboard__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.example-dashboard__card {
  background: var(--color-surface-paper, var(--preview-surface, #fff));
  border-radius: var(--preview-radius, 12px);
  padding: 1.25rem;
  border: 1px solid color-mix(in srgb, var(--preview-text, #171715) 8%, transparent);
}

.example-dashboard__stat-label {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  color: var(--color-text-muted, var(--preview-text-muted, #7a7a6f));
}

.example-dashboard__stat-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.example-dashboard__content h2 {
  margin: 0 0 0.75rem;
  font-size: 1.125rem;
}

.example-dashboard__content ul {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--color-text-secondary, inherit);
}

@media (max-width: 768px) {
  .example-dashboard {
    grid-template-columns: 1fr;
  }
  .example-dashboard__stats {
    grid-template-columns: 1fr;
  }
}
</style>
`;
}
