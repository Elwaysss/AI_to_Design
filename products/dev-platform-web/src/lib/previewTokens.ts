import type { PreviewVars } from '../types/style-preset'
import { buildComponentShowcaseHtml } from './sampleShowcase'
import {
  buildGoldenRecipeCss,
  buildGoldenSampleBody,
  isGoldenBrand
} from './pageRecipes'
import { buildThemeStylesheet, resolveStyleTheme } from './styleThemes'
import { alignPreviewVarsToTheme } from './previewThemeAlign'
import { loadExportPack, loadPreviewVars, usesBakedData, loadDesignCatalog } from './designStaticData'
import { downloadExportPack } from './downloadExportPack'

export { loadDesignCatalog }

export interface PreviewApiResponse {
  preview: PreviewVars
}

/** CSS custom properties for preview surfaces (iframe + product page). */
export function previewVarsToCss(vars: PreviewVars): Record<string, string> {
  const theme = resolveStyleTheme(vars)
  const aligned = alignPreviewVarsToTheme(vars, theme)
  const css: Record<string, string> = {
    '--preview-primary': aligned.primary,
    '--preview-primary-hover': aligned.primaryHover,
    '--preview-background': theme.bodyBg,
    '--preview-surface': aligned.surface,
    '--preview-text': aligned.text,
    '--preview-text-muted': aligned.textMuted,
    '--preview-success': aligned.success,
    '--preview-warning': aligned.warning,
    '--preview-danger': aligned.danger,
    '--preview-font-body': aligned.fontBody,
    '--preview-font-display': aligned.fontDisplay,
    '--preview-radius': aligned.cardRadius ?? aligned.radius,
    '--preview-button-radius': aligned.buttonRadius ?? aligned.radius,
    '--preview-theme': theme.profile,
    '--preview-brand-archetype': theme.brandArchetype ?? aligned.heroArchetype ?? '',
    '--preview-hero-accent': aligned.heroAccent ?? aligned.primary,
    '--preview-spacing-grid': aligned.spacingGrid ?? '1rem',
    '--preview-spacing-section': aligned.spacingSection ?? '3rem',
    '--preview-elevation-flat': aligned.elevationFlat ?? '0 0 0 1px rgba(23,23,21,0.06)',
    '--preview-elevation-raised': aligned.elevationRaised ?? aligned.elevationCard ?? '0 1px 2px rgba(0,0,0,.06)',
    '--preview-font-mono': aligned.fontMono ?? "'JetBrains Mono', ui-monospace, monospace",
    '--preview-font-size-body': aligned.fontSizeBody ?? '16px',
    '--preview-font-size-caption': aligned.fontSizeCaption ?? '13px',
    '--preview-text-on-surface': aligned.textOnSurface ?? aligned.text,
    '--preview-text-muted-on-surface': aligned.textMutedOnSurface ?? aligned.textMuted,
    '--preview-cta-text': aligned.ctaText ?? (aligned.dark ? '#FFFFFF' : '#FFFFFF'),
    '--color-brand-primary': aligned.primary,
    '--color-brand-primary-hover': aligned.primaryHover,
    '--color-surface-canvas': theme.bodyBg,
    '--color-surface-paper': aligned.surface,
    '--color-text-primary': aligned.text,
    '--color-text-muted': aligned.textMuted,
    '--color-text-inverse': aligned.ctaText ?? (aligned.dark ? '#FFFFFF' : '#FFFFFF'),
    '--font-family-body': aligned.fontBody,
    '--font-family-display': aligned.fontDisplay
  }
  aligned.cardTints?.slice(0, 3).forEach((t, i) => {
    css[`--preview-card-tint-${i}`] = t
  })
  return css
}

export function applyPreviewVars(el: HTMLElement, vars: PreviewVars) {
  const css = previewVarsToCss(vars)
  for (const [key, value] of Object.entries(css)) {
    el.style.setProperty(key, value)
  }
  const theme = resolveStyleTheme(vars)
  el.dataset.theme = theme.profile
  if (theme.brandArchetype) el.dataset.brandArchetype = theme.brandArchetype
  else delete el.dataset.brandArchetype
}

/** 风格样例页 — 品牌用页面品类模板，其余用通用壳 */
export function buildSampleHtml(vars: PreviewVars, title: string): string {
  const theme = resolveStyleTheme(vars)
  const aligned = alignPreviewVarsToTheme(vars, theme)
  const goldenExtra = isGoldenBrand(vars.slug) ? buildGoldenRecipeCss(vars.slug) : ''
  const styles = buildThemeStylesheet(aligned, theme) + goldenExtra

  if (vars.kind === 'brand' && isGoldenBrand(vars.slug)) {
    const body = buildGoldenSampleBody(vars, title)
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — 品牌样例</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono&display=swap" rel="stylesheet" />
  <style>${styles}</style>
</head>
<body data-theme="${theme.profile}" data-brand="${theme.brandArchetype ?? ''}">
  ${body}
</body>
</html>`
  }

  const label = vars.kind === 'brand'
    ? `${theme.brandArchetype ?? vars.heroArchetype ?? 'brand'} · 品牌样例`
    : `${theme.profile} · 风格样例`
  const secondaryCta =
    vars.kind === 'brand' && vars.secondaryCtaStyle !== 'none'
      ? vars.sampleSecondaryButton
        ? `<a class="sample-secondary" href="#" style="background:${vars.sampleSecondaryButton.background};color:${vars.sampleSecondaryButton.color};border:${vars.sampleSecondaryButton.border};border-radius:${vars.sampleSecondaryButton.borderRadius};padding:${vars.sampleSecondaryButton.padding};text-decoration:none;font-weight:600;">了解更多</a>`
        : `<a class="cta-secondary" href="#">了解更多</a>`
      : ''
  const ctaRow = secondaryCta ? `<div class="cta-row"><a class="cta" href="#">开始体验</a>${secondaryCta}</div>` : `<a class="cta" href="#">开始体验</a>`

  const showcase = buildComponentShowcaseHtml(vars)
  const leadText = vars.kind === 'brand'
    ? '间距节奏、阴影层级、组件样板与 tabular/mono 字体均来自 awesome-design-md 的 spacing / elevation / components / typography。'
    : '感受这种风格的排版、边框、阴影与按钮气质——而不只是换了一个主色。'

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — 风格样例</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet" />
  <style>${styles}</style>
</head>
<body data-theme="${theme.profile}" data-brand="${theme.brandArchetype ?? ''}">
  ${theme.sampleHeroHtml ?? ''}
  <div class="wrap">
    <p style="margin:0 0 .5rem;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);opacity:.85">${label}</p>
    <h1>${title}</h1>
    <p class="lead">${leadText}</p>
    <div class="grid">
      <div class="card"><strong>24%</strong><span>转化率提升</span></div>
      <div class="card"><strong>1.2k</strong><span>活跃用户</span></div>
      <div class="card"><strong>98%</strong><span>满意度</span></div>
    </div>
    ${ctaRow}
    ${showcase}
  </div>
</body>
</html>`
}

/** Fetch mapped preview vars (dev API or baked static data). */
export async function fetchPreviewVars(
  kind: 'aesthetic' | 'brand',
  slug: string,
  _displayNameZh?: string
): Promise<PreviewApiResponse> {
  const preview = await loadPreviewVars(kind, slug)
  return { preview }
}

export async function exportDesignPackage(payload: {
  kind: 'aesthetic' | 'brand'
  slug: string
  displayNameZh?: string
  supplementNotes?: string
}): Promise<{ outputDir: string; files: string[]; downloaded?: boolean }> {
  if (usesBakedData()) {
    const pack = await loadExportPack(payload.kind, payload.slug)
    const filename = `${pack.outputDir}-${payload.kind}-${payload.slug}.zip`
    await downloadExportPack(pack, {
      supplementNotes: payload.supplementNotes,
      filename
    })
    return { outputDir: pack.outputDir, files: pack.fileList, downloaded: true }
  }

  const res = await fetch('/api/design/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, productSlug: 'demo-saas' })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Export failed (${res.status})`)
  }
  return res.json()
}
