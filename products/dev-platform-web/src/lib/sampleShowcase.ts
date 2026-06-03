import type { PreviewVars } from '../types/style-preset'

/** P0 组件样板区 HTML — nav / input / badge / secondary + mono/tabular */
export function buildComponentShowcaseHtml(vars: PreviewVars): string {
  if (vars.kind !== 'brand' && !vars.sampleNav) return ''

  const nav = vars.sampleNav
  const input = vars.sampleInput
  const badge = vars.sampleBadge
  const sec = vars.sampleSecondaryButton

  const navStyle = nav
    ? `background:${nav.background};padding:${nav.padding};border-radius:${nav.borderRadius};${nav.border ? `border:${nav.border};` : ''}`
    : ''
  const inputStyle = input
    ? `background:${input.background};border:${input.border};border-radius:${input.borderRadius};padding:${input.padding};height:${input.height};width:100%;max-width:280px;font-family:var(--font-body);font-size:var(--font-size-body);color:var(--text);`
    : ''
  const badgeStyle = badge
    ? `background:${badge.background};color:${badge.color};border-radius:${badge.borderRadius};padding:${badge.padding};font-size:var(--font-size-caption);font-weight:600;display:inline-block;`
    : ''
  const secStyle = sec
    ? `background:${sec.background};color:${sec.color};border:${sec.border};border-radius:${sec.borderRadius};padding:${sec.padding};text-decoration:none;font-weight:600;display:inline-block;`
    : ''

  const tabularStyle = vars.fontFeatureTabular
    ? `font-feature-settings:${vars.fontFeatureTabular};font-variant-numeric:tabular-nums;`
    : ''

  return `
    <section class="showcase">
      <p class="showcase-label">组件样板 · spacing / elevation / typography</p>
      ${nav ? `<nav class="sample-nav" style="${navStyle}"><span class="sample-nav-brand">Demo</span><span class="sample-nav-link">产品</span><span class="sample-nav-link">定价</span></nav>` : ''}
      <div class="showcase-row">
        ${input ? `<input class="sample-input" style="${inputStyle}" placeholder="搜索或输入邮箱…" readonly />` : ''}
        ${badge ? `<span class="sample-badge" style="${badgeStyle}">${badge.label ?? 'New'}</span>` : ''}
      </div>
      <p class="sample-type">
        <code class="sample-mono">order_id: 48291-A</code>
        <span class="sample-tabular" style="${tabularStyle}"> · ¥12,480.00</span>
      </p>
      ${sec ? `<a class="sample-secondary" style="${secStyle}" href="#">次要操作</a>` : ''}
    </section>`
}

/** 样例页组件样板 CSS */
export function buildComponentShowcaseCss(vars: PreviewVars): string {
  const mono = vars.fontMono ?? "'JetBrains Mono', ui-monospace, monospace"
  const bodySize = vars.fontSizeBody ?? '16px'
  const captionSize = vars.fontSizeCaption ?? '13px'
  const stylistic = vars.fontFeatureStylistic
    ? `font-feature-settings:${vars.fontFeatureStylistic};`
    : ''

  return `
    .showcase {
      margin-top: var(--spacing-section, 3rem);
      padding-top: var(--spacing-section, 3rem);
      border-top: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
    }
    .showcase-label {
      margin: 0 0 1rem;
      font-size: ${captionSize};
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
    }
    .sample-nav {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      box-shadow: var(--elevation-flat);
    }
    .sample-nav-brand { font-weight: 600; }
    .sample-nav-link { opacity: 0.65; font-size: ${bodySize}; }
    .showcase-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--spacing-grid, 1rem);
      margin-bottom: 1rem;
    }
    .sample-input { outline: none; }
    .sample-type {
      margin: 0 0 1rem;
      font-size: ${bodySize};
      color: var(--muted);
      ${stylistic}
    }
    .sample-mono {
      font-family: ${mono};
      font-size: ${captionSize};
      background: color-mix(in srgb, var(--text) 6%, transparent);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
    }
    .sample-tabular { color: var(--text); font-weight: 600; }
  `
}
