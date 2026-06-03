/**
 * Align preview token text/surface with aesthetic theme canvas (e.g. glassmorphism dark UI).
 */
import type { PreviewVars } from '../types/style-preset'
import type { StyleTheme } from './styleThemes'

function isDarkHex(hex: string): boolean {
  if (!hex?.startsWith('#') || hex.length < 7) return false
  const h = hex.slice(1)
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

function elevatedSurfaceFromCanvas(canvas: string): string {
  const h = canvas.slice(1)
  const r = Math.min(255, parseInt(h.slice(0, 2), 16) + 18)
  const g = Math.min(255, parseInt(h.slice(2, 4), 16) + 18)
  const b = Math.min(255, parseInt(h.slice(4, 6), 16) + 20)
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`.toUpperCase()
}

export function alignPreviewVarsToTheme(vars: PreviewVars, theme: StyleTheme): PreviewVars {
  if (vars.kind === 'brand') return vars

  const canvas = theme.bodyBg
  if (!isDarkHex(canvas)) return vars

  // Theme renders on dark canvas but mapped tokens may still be light-theme ink.
  if (vars.dark && !isDarkHex(vars.text)) return vars

  const surface = elevatedSurfaceFromCanvas(canvas)
  return {
    ...vars,
    dark: true,
    background: canvas,
    surface,
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    textOnSurface: '#F1F5F9',
    textMutedOnSurface: '#94A3B8',
    ctaText: vars.ctaText ?? '#FFFFFF'
  }
}
