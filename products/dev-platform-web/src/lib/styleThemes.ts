import type { BrandHeroArchetype, PreviewVars } from '../types/style-preset'
import { buildComponentShowcaseCss } from './sampleShowcase'

/** 视觉主题档案 — 决定布局/边框/阴影/字重，而不只是 HEX */
export type ThemeProfile =
  | 'glassmorphism'
  | 'neobrutalism'
  | 'brutalism'
  | 'editorial'
  | 'minimal'
  | 'futuristic'
  | 'neon'
  | 'cosmic'
  | 'neumorphism'
  | 'gradient'
  | 'luxury'
  | 'friendly'
  | 'material'
  | 'shadcn'
  | 'corporate'
  | 'professional'
  | 'clean'
  | 'elegant'
  | 'retro'
  | 'brand'
  | 'default'

export interface StyleTheme {
  profile: ThemeProfile
  bodyBg: string
  bodyExtraCss: string
  wrapExtraCss: string
  h1Css: string
  leadCss: string
  cardCss: string
  cardStrongCss: string
  ctaCss: string
  gridGap: string
  thumbMarkup: string
  /** 样例页额外 CSS（hero band、分色卡片等） */
  sampleCss?: string
  /** 样例页 hero 区 HTML */
  sampleHeroHtml?: string
  /** 品牌 hero 原型，供产品预览 class */
  brandArchetype?: BrandHeroArchetype
}

const SLUG_PROFILE: Record<string, ThemeProfile> = {
  glassmorphism: 'glassmorphism',
  neobrutalism: 'neobrutalism',
  brutalism: 'brutalism',
  editorial: 'editorial',
  minimal: 'minimal',
  futuristic: 'futuristic',
  neon: 'neon',
  cosmic: 'cosmic',
  neumorphism: 'neumorphism',
  gradient: 'gradient',
  luxury: 'luxury',
  friendly: 'friendly',
  material: 'material',
  shadcn: 'shadcn',
  corporate: 'corporate',
  professional: 'professional',
  clean: 'clean',
  elegant: 'elegant',
  retro: 'retro',
  colorful: 'gradient',
  vibrant: 'neon',
  dramatic: 'luxury',
  spacious: 'minimal',
  contemporary: 'clean',
  modern: 'clean',
  creative: 'gradient',
  flat: 'minimal',
  paper: 'editorial',
  sketch: 'brutalism',
  dithered: 'retro'
}

/** 卡片缩略图用的兜底主色（API 未返回前） */
export const SLUG_FALLBACK_PRIMARY: Record<string, string> = {
  glassmorphism: '#1856FF',
  neobrutalism: '#FACC15',
  brutalism: '#000000',
  editorial: '#171715',
  minimal: '#171715',
  futuristic: '#22D3EE',
  neon: '#E879F9',
  cosmic: '#8B5CF6',
  neumorphism: '#64748B',
  gradient: '#EC4899',
  luxury: '#C9A962',
  friendly: '#F97316',
  material: '#6750A4',
  shadcn: '#18181B',
  corporate: '#1D4ED8',
  professional: '#2563EB',
  clean: '#0EA5E9',
  elegant: '#78716C',
  retro: '#DC2626',
  notion: '#5645D4',
  stripe: '#635BFF',
  linear: '#5E6AD2',
  figma: '#A259FF',
  spotify: '#1DB954',
  slack: '#611F69',
  vercel: '#000000',
  shopify: '#008060',
  intercom: '#286EFA',
  cursor: '#007AFF',
  apple: '#0071E3',
  monday: '#FF3D57',
  miro: '#FFD02F',
  github: '#FF6363',
  discord: '#5865F2',
  dropbox: '#18BFFF',
  asana: '#FF584A',
  google: '#4285F4',
  meta: '#0668E1',
  airtable: '#18BFFF',
  raycast: '#FF6363',
  zapier: '#FF4A00',
  supabase: '#3ECF8E'
}

const BRAND_ARCHETYPE_FALLBACK: Record<string, BrandHeroArchetype> = {
  stripe: 'gradient-mesh',
  notion: 'pastel-cards',
  linear: 'dark-dev',
  slack: 'aubergine-soft',
  spotify: 'immersive-dark',
  vercel: 'dark-dev',
  cursor: 'dark-dev',
  figma: 'colorful',
  miro: 'colorful',
  shopify: 'light-clean',
  intercom: 'light-clean',
  apple: 'light-clean',
  monday: 'colorful',
  github: 'dark-dev',
  raycast: 'dark-dev',
  discord: 'aubergine-soft',
  dropbox: 'light-clean',
  airtable: 'light-clean',
  asana: 'colorful',
  google: 'light-clean',
  meta: 'light-clean',
  zapier: 'colorful',
  supabase: 'dark-dev'
}

export function resolveThemeProfile(vars: Pick<PreviewVars, 'slug' | 'visualStyle' | 'kind'>): ThemeProfile {
  if (vars.kind === 'brand') return 'brand'
  const slug = vars.slug?.toLowerCase()
  if (slug && SLUG_PROFILE[slug]) return SLUG_PROFILE[slug]

  const tags = (vars.visualStyle ?? []).join(' ').toLowerCase()
  if (/glass|liquidglass/.test(tags)) return 'glassmorphism'
  if (/neobrutal/.test(tags)) return 'neobrutalism'
  if (/brutal/.test(tags)) return 'brutalism'
  if (/editorial|typography|publication/.test(tags)) return 'editorial'
  if (/minimal|clean|light/.test(tags)) return 'minimal'
  if (/neon|cyber/.test(tags)) return 'neon'
  if (/cosmic|immersive/.test(tags)) return 'cosmic'
  if (/futuristic|dark/.test(tags)) return 'futuristic'
  if (/neumorph|soft/.test(tags)) return 'neumorphism'
  if (/gradient|colorful/.test(tags)) return 'gradient'
  if (/luxury|premium/.test(tags)) return 'luxury'
  if (/friendly|warm/.test(tags)) return 'friendly'
  if (/material/.test(tags)) return 'material'
  if (/shadcn|developer/.test(tags)) return 'shadcn'
  if (/corporate|professional/.test(tags)) return 'corporate'
  if (/elegant/.test(tags)) return 'elegant'
  return 'default'
}

function brandButtonCss(vars: PreviewVars): string {
  const radius = vars.buttonRadius ?? vars.radius
  const pad = vars.buttonPadding ?? '0.75rem 1.25rem'
  const upper = vars.buttonUppercase
    ? `text-transform:uppercase;letter-spacing:${vars.buttonLetterSpacing ?? '0.08em'};`
    : ''
  return `padding:${pad};border-radius:${radius};${upper}`
}

function brandCardCss(vars: PreviewVars, base: string): string {
  const radius = vars.cardRadius ?? vars.radius
  const border = vars.cardBorder ? `border:${vars.cardBorder};` : ''
  const shadow = vars.cardShadow ? `box-shadow:${vars.cardShadow};` : ''
  return `${base} border-radius:${radius}; ${border} ${shadow}`
}

function brandCardTintCss(vars: PreviewVars): string {
  if (!vars.cardTints?.length) return ''
  return vars.cardTints
    .slice(0, 3)
    .map((t, i) => `.grid .card:nth-child(${i + 1}){background:${t};border-color:color-mix(in srgb,${t} 70%,#000);}`)
    .join('\n')
}

function resolveBrandStyleTheme(vars: PreviewVars): StyleTheme {
  const arch: BrandHeroArchetype = vars.heroArchetype ?? BRAND_ARCHETYPE_FALLBACK[vars.slug] ?? 'light-clean'
  const p = vars.primary
  const dark = vars.dark
  const btn = brandButtonCss(vars)
  const h1Base = `font-weight:${vars.displayFontWeight ?? '700'};letter-spacing:${vars.displayLetterSpacing ?? '-0.02em'};`

  switch (arch) {
    case 'gradient-mesh':
      return {
        profile: 'brand',
        brandArchetype: arch,
        bodyBg: '#ffffff',
        bodyExtraCss: `
          background-image:
            linear-gradient(180deg, transparent 42%, #fff 42%),
            radial-gradient(ellipse 90% 70% at 15% 8%, #f5e9d4 0%, transparent 55%),
            radial-gradient(ellipse 80% 60% at 55% 5%, #ffb366 0%, transparent 50%),
            radial-gradient(ellipse 70% 55% at 85% 12%, #b9b9f9 0%, transparent 48%),
            radial-gradient(ellipse 60% 50% at 40% 18%, #533afd33 0%, transparent 45%),
            linear-gradient(180deg, #faf5ff 0%, #fff 45%);
          background-color: #fff;`,
        wrapExtraCss: 'padding-top:3rem;',
        h1Css: `font-size:2.75rem;font-weight:300;letter-spacing:-0.04em;line-height:1.05;color:#0d253d;`,
        leadCss: 'color:#64748d;font-weight:300;font-size:1rem;',
        cardCss: brandCardCss(vars, `background:#f5e9d4;border:1px solid #e3e8ee;padding:1.75rem 1.5rem;`),
        cardStrongCss: 'font-size:1.75rem;font-weight:300;color:#0d253d;',
        ctaCss: `${btn} background:${p};color:#fff;font-weight:500;box-shadow:0 2px 8px color-mix(in srgb,${p} 30%, transparent);`,
        gridGap: '1rem',
        thumbMarkup: stripeThumb(p),
        sampleCss: `.cta-row{display:flex;gap:.75rem;align-items:center;flex-wrap:wrap;}
          .cta-secondary{background:#fff;color:${p};border:1px solid #e3e8ee;font-weight:500;text-decoration:none;padding:${vars.buttonPadding ?? '0.75rem 1.25rem'};border-radius:${vars.buttonRadius ?? '9999px'};}
          .hero-mesh{height:120px;margin:-2.5rem -1.5rem 2rem;border-radius:0;background:linear-gradient(90deg,#f5e9d4,#ffb366,#b9b9f9,${p});opacity:.35;}`
      }

    case 'dark-dev':
      return {
        profile: 'brand',
        brandArchetype: arch,
        bodyBg: vars.background,
        bodyExtraCss: `
          background-image:
            radial-gradient(ellipse 60% 40% at 80% 0%, color-mix(in srgb, ${p} 18%, transparent), transparent 55%),
            linear-gradient(180deg, ${vars.background}, color-mix(in srgb, ${vars.background} 85%, #000));`,
        wrapExtraCss: '',
        h1Css: `${h1Base} font-size:2rem;color:${vars.text};`,
        leadCss: `color:${vars.textMuted};font-size:.9375rem;`,
        cardCss: brandCardCss(vars, `background:color-mix(in srgb, ${vars.surface} 92%, ${p});border:1px solid color-mix(in srgb, ${vars.text} 12%, transparent);padding:1.25rem;`),
        cardStrongCss: `color:${vars.text};font-size:1.5rem;font-weight:600;`,
        ctaCss: `${btn} background:${p};color:#fff;font-weight:500;`,
        gridGap: '.875rem',
        thumbMarkup: darkDevThumb(p),
        sampleCss: `.wrap{border-left:1px solid color-mix(in srgb,${vars.text} 8%, transparent);padding-left:2rem;}
          .card strong{font-variant-numeric:tabular-nums;}`
      }

    case 'navy-hero':
      return {
        profile: 'brand',
        brandArchetype: arch,
        bodyBg: '#ffffff',
        bodyExtraCss: '',
        wrapExtraCss: '',
        h1Css: `${h1Base} font-size:2.25rem;color:#fff;`,
        leadCss: 'color:rgba(255,255,255,.82);',
        cardCss: brandCardCss(vars, `background:#fff;border:1px solid #E8E8E3;padding:1.5rem;`),
        cardStrongCss: `color:#37352F;font-size:1.625rem;font-weight:600;`,
        ctaCss: `${btn} background:#fff;color:${vars.heroAccent ?? '#19202E'};font-weight:600;`,
        gridGap: '1rem',
        thumbMarkup: navyHeroThumb(vars.heroAccent ?? '#19202E'),
        sampleHeroHtml: `<div class="hero-navy"><div class="wrap hero-inner"><h1 style="margin:0">品牌样例</h1><p class="lead" style="margin:.5rem 0 0">深海军蓝 hero + 浅色卡片 — Notion 式营销气质</p></div></div>`,
        sampleCss: `
          .hero-navy{background:${vars.heroAccent ?? '#19202E'};margin:-2.5rem -1.5rem 2rem;padding:3rem 1.5rem 2.5rem;}
          .hero-inner{padding:0!important;max-width:960px;margin:0 auto;}
          .hero-navy + .wrap h1,.hero-navy + .wrap > .lead{display:none;}
          ${brandCardTintCss(vars)}`
      }

    case 'pastel-cards':
      return {
        profile: 'brand',
        brandArchetype: arch,
        bodyBg: '#FFFFFF',
        bodyExtraCss: '',
        wrapExtraCss: '',
        h1Css: `${h1Base} font-size:2.125rem;color:#37352F;`,
        leadCss: 'color:#787774;font-size:1rem;',
        cardCss: brandCardCss(vars, `background:#fff;border:1px solid #E8E8E3;padding:1.5rem;`),
        cardStrongCss: 'color:#37352F;font-size:1.5rem;font-weight:600;',
        ctaCss: `${btn} background:${p};color:#fff;font-weight:500;`,
        gridGap: '1rem',
        thumbMarkup: pastelThumb(vars.cardTints ?? ['#FBF3DB', '#FAEBEC', '#E7F3F8']),
        sampleCss: brandCardTintCss(vars)
      }

    case 'immersive-dark':
      return {
        profile: 'brand',
        brandArchetype: arch,
        bodyBg: vars.background,
        bodyExtraCss: `background:linear-gradient(180deg, ${vars.background} 0%, #000 100%);`,
        wrapExtraCss: '',
        h1Css: `${h1Base} font-size:2.5rem;font-weight:700;color:#fff;`,
        leadCss: 'color:#b3b3b3;',
        cardCss: brandCardCss(vars, `background:#181818;border:none;padding:1.5rem;box-shadow:0 8px 24px rgba(0,0,0,.45);`),
        cardStrongCss: `color:#fff;font-size:1.75rem;font-weight:700;`,
        ctaCss: `${btn} background:${p};color:#000;font-weight:700;`,
        gridGap: '1rem',
        thumbMarkup: spotifyThumb(p),
        sampleCss: `.card span{color:#b3b3b3;} .cta{color:#000!important;}`
      }

    case 'aubergine-soft':
      return {
        profile: 'brand',
        brandArchetype: arch,
        bodyBg: '#FFFCFA',
        bodyExtraCss: `
          background-image:
            radial-gradient(ellipse 70% 50% at 0% 0%, #F4EFFA 0%, transparent 55%),
            linear-gradient(180deg, #FFFCFA, #F8F5F5);`,
        wrapExtraCss: '',
        h1Css: `${h1Base} font-size:2rem;color:#1D1C1D;`,
        leadCss: 'color:#616061;',
        cardCss: brandCardCss(vars, `background:#fff;border:1px solid #E8E8E8;padding:1.25rem;border-radius:${vars.cardRadius ?? '12px'};`),
        cardStrongCss: `color:${p};font-size:1.5rem;font-weight:700;`,
        ctaCss: `${btn} background:${p};color:#fff;font-weight:600;`,
        gridGap: '1rem',
        thumbMarkup: slackThumb(p),
        sampleCss: `.cta-row .cta-secondary{border:1px solid #E8E8E8;background:#fff;color:#1D1C1D;border-radius:${vars.buttonRadius ?? '9999px'};padding:${vars.buttonPadding ?? '0.75rem 1.25rem'};text-decoration:none;font-weight:600;}`
      }

    case 'colorful':
      return {
        profile: 'brand',
        brandArchetype: arch,
        bodyBg: '#FAFAFA',
        bodyExtraCss: `
          background-image:
            radial-gradient(circle at 10% 20%, color-mix(in srgb, ${p} 25%, transparent), transparent 35%),
            radial-gradient(circle at 90% 10%, #FFD02F44, transparent 30%);`,
        wrapExtraCss: '',
        h1Css: `${h1Base} font-size:2rem;`,
        leadCss: '',
        cardCss: brandCardCss(vars, `background:#fff;border:2px solid color-mix(in srgb, ${p} 25%, transparent);padding:1.25rem;`),
        cardStrongCss: `color:${p};font-size:1.625rem;font-weight:700;`,
        ctaCss: `${btn} background:${p};color:#fff;font-weight:700;`,
        gridGap: '1rem',
        thumbMarkup: colorfulThumb(p),
        sampleCss: `.grid .card:nth-child(1){border-color:${p};}
          .grid .card:nth-child(2){border-color:#FFD02F;background:color-mix(in srgb,#FFD02F 12%,#fff);}
          .grid .card:nth-child(3){border-color:#0ACF83;background:color-mix(in srgb,#0ACF83 10%,#fff);}`
      }

    case 'light-clean':
    default:
      return {
        profile: 'brand',
        brandArchetype: arch === 'light-clean' ? arch : 'light-clean',
        bodyBg: vars.background,
        bodyExtraCss: dark
          ? ''
          : 'background:linear-gradient(180deg,color-mix(in srgb,var(--primary) 5%,#fff),var(--bg));',
        wrapExtraCss: '',
        h1Css: `${h1Base} font-size:2rem;`,
        leadCss: '',
        cardCss: brandCardCss(vars, `background:var(--surface);border:1px solid color-mix(in srgb,var(--primary) 15%,transparent);padding:1.25rem;`),
        cardStrongCss: `color:var(--primary);font-size:1.625rem;font-weight:700;`,
        ctaCss: `${btn} background:var(--primary);color:${vars.ctaText ?? (dark ? vars.background : '#fff')};font-weight:600;box-shadow:0 4px 14px color-mix(in srgb,var(--primary) 30%,transparent);`,
        gridGap: '1rem',
        thumbMarkup: lightCleanThumb(vars)
      }
  }
}

export function resolveStyleTheme(vars: PreviewVars): StyleTheme {
  if (vars.kind === 'brand') return resolveBrandStyleTheme(vars)

  const profile = resolveThemeProfile(vars)
  const p = vars.primary
  const dark = vars.dark

  switch (profile) {
    case 'glassmorphism':
      return {
        profile,
        bodyBg: '#0c1222',
        bodyExtraCss: `
          background-image:
            radial-gradient(ellipse 80% 60% at 10% 15%, color-mix(in srgb, var(--primary) 55%, transparent), transparent 55%),
            radial-gradient(ellipse 70% 50% at 90% 10%, rgba(14,165,233,.4), transparent 50%),
            linear-gradient(155deg, #0a0f1a, #121a2e 45%, #1a1040);
          background-attachment: fixed;`,
        wrapExtraCss: '',
        h1Css: 'font-size:2.25rem;font-weight:700;letter-spacing:-0.02em;text-shadow:0 0 40px color-mix(in srgb, var(--primary) 35%, transparent);',
        leadCss: 'opacity:.85;',
        cardCss: `
          background: rgba(255,255,255,.08);
          backdrop-filter: blur(22px) saturate(170%);
          -webkit-backdrop-filter: blur(22px) saturate(170%);
          border: 1px solid rgba(255,255,255,.22);
          box-shadow: 0 8px 32px rgba(0,0,0,.28);
          border-radius: 16px;`,
        cardStrongCss: 'color:#fff;',
        ctaCss: `
          box-shadow: 0 0 24px color-mix(in srgb, var(--primary) 45%, transparent);
          border-radius: 12px;`,
        gridGap: '1.25rem',
        thumbMarkup: glassThumb()
      }

    case 'neobrutalism':
      return {
        profile,
        bodyBg: '#FFFDF5',
        bodyExtraCss: 'background-image: repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,.03) 39px, rgba(0,0,0,.03) 40px);',
        wrapExtraCss: '',
        h1Css: 'font-size:2.5rem;font-weight:900;text-transform:uppercase;letter-spacing:-0.04em;line-height:1;',
        leadCss: 'font-weight:600;border-left:4px solid #000;padding-left:1rem;',
        cardCss: `
          background:#fff;border:3px solid #000;border-radius:0;
          box-shadow:5px 5px 0 #000;transform:translate(-2px,-2px);`,
        cardStrongCss: 'font-size:2rem;font-weight:900;',
        ctaCss: `
          background:var(--primary);color:#000;border:3px solid #000;border-radius:0;
          box-shadow:4px 4px 0 #000;font-weight:800;text-transform:uppercase;`,
        gridGap: '1.25rem',
        thumbMarkup: neoThumb(p)
      }

    case 'brutalism':
      return {
        profile,
        bodyBg: '#E8E8E8',
        bodyExtraCss: '',
        wrapExtraCss: 'font-family: "Courier New", monospace;',
        h1Css: 'font-family:Arial,sans-serif;font-size:2rem;font-weight:400;text-decoration:underline;',
        leadCss: 'font-size:.95rem;',
        cardCss: 'background:#fff;border:2px solid #000;border-radius:0;box-shadow:none;',
        cardStrongCss: 'font-family:monospace;font-size:1.75rem;',
        ctaCss: 'background:#0000EE;color:#fff;border-radius:0;text-decoration:underline;font-family:monospace;',
        gridGap: '0',
        thumbMarkup: brutalThumb()
      }

    case 'editorial':
      return {
        profile,
        bodyBg: '#FAF8F5',
        bodyExtraCss: '',
        wrapExtraCss: 'max-width:720px;',
        h1Css: 'font-size:3.25rem;font-weight:600;line-height:1.05;letter-spacing:-0.03em;font-family:Georgia,"Times New Roman",serif;',
        leadCss: 'font-size:1.125rem;line-height:1.75;font-family:Georgia,serif;color:var(--muted);',
        cardCss: `
          background:transparent;border:none;border-bottom:1px solid color-mix(in srgb, var(--text) 15%, transparent);
          border-radius:0;padding:1.5rem 0;`,
        cardStrongCss: 'font-family:Georgia,serif;font-size:2.5rem;font-weight:400;',
        ctaCss: `
          background:transparent;color:var(--text);border:1px solid var(--text);border-radius:0;
          padding:.875rem 2rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;font-size:.8125rem;`,
        gridGap: '0',
        thumbMarkup: editorialThumb()
      }

    case 'minimal':
      return {
        profile,
        bodyBg: '#FFFFFF',
        bodyExtraCss: '',
        wrapExtraCss: 'padding-top:4rem;',
        h1Css: 'font-size:1.75rem;font-weight:500;letter-spacing:-0.01em;',
        leadCss: 'font-size:.9375rem;max-width:28rem;',
        cardCss: 'background:#fff;border:1px solid #EFEFEF;border-radius:2px;box-shadow:none;padding:2rem 1.5rem;',
        cardStrongCss: 'font-size:1.25rem;font-weight:500;',
        ctaCss: 'background:var(--text);color:#fff;border-radius:2px;font-weight:500;font-size:.875rem;padding:.625rem 1.25rem;',
        gridGap: '2rem',
        thumbMarkup: minimalThumb()
      }

    case 'neon':
      return {
        profile,
        bodyBg: '#050508',
        bodyExtraCss: `
          background-image:
            radial-gradient(circle at 20% 30%, rgba(232,121,249,.15), transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(34,211,238,.12), transparent 45%);`,
        wrapExtraCss: '',
        h1Css: `color:${p};text-shadow:0 0 20px ${p},0 0 40px color-mix(in srgb, ${p} 50%, transparent);font-size:2.25rem;font-weight:800;`,
        leadCss: 'color:#94a3b8;',
        cardCss: `
          background:rgba(15,15,25,.8);border:1px solid color-mix(in srgb, ${p} 60%, transparent);
          box-shadow:0 0 16px color-mix(in srgb, ${p} 25%, transparent), inset 0 0 20px rgba(255,255,255,.02);
          border-radius:8px;`,
        cardStrongCss: `color:${p};text-shadow:0 0 12px color-mix(in srgb, ${p} 60%, transparent);`,
        ctaCss: `
          background:transparent;color:${p};border:2px solid ${p};border-radius:4px;
          box-shadow:0 0 20px color-mix(in srgb, ${p} 40%, transparent);text-transform:uppercase;letter-spacing:.06em;`,
        gridGap: '1rem',
        thumbMarkup: neonThumb(p)
      }

    case 'cosmic':
    case 'futuristic':
      return {
        profile,
        bodyBg: '#0B1020',
        bodyExtraCss: `
          background-image:
            radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.35), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,.25), transparent),
            radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, ${p} 30%, transparent), transparent),
            linear-gradient(180deg,#0b1020,#151b30);`,
        wrapExtraCss: '',
        h1Css: 'font-size:2rem;font-weight:700;background:linear-gradient(135deg,#fff,color-mix(in srgb,var(--primary) 80%,#fff));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;',
        leadCss: 'color:#94a3b8;',
        cardCss: `
          background:linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.02));
          border:1px solid rgba(255,255,255,.1);border-radius:12px;
          box-shadow:0 4px 24px rgba(0,0,0,.4);`,
        cardStrongCss: 'font-size:1.75rem;font-weight:700;',
        ctaCss: `background:linear-gradient(135deg,${p},color-mix(in srgb,${p} 60%,#6366f1));border-radius:8px;box-shadow:0 4px 20px color-mix(in srgb,${p} 35%, transparent);`,
        gridGap: '1rem',
        thumbMarkup: cosmicThumb(p)
      }

    case 'neumorphism':
      return {
        profile,
        bodyBg: '#E4E9F0',
        bodyExtraCss: '',
        wrapExtraCss: '',
        h1Css: 'font-size:1.75rem;font-weight:600;color:#4a5568;',
        leadCss: 'color:#718096;',
        cardCss: `
          background:#E4E9F0;border:none;border-radius:20px;
          box-shadow:8px 8px 16px #c8cdd4,-8px -8px 16px #fff;`,
        cardStrongCss: 'color:#2d3748;font-size:1.5rem;',
        ctaCss: `
          background:#E4E9F0;color:#4a5568;border:none;border-radius:16px;
          box-shadow:6px 6px 12px #c8cdd4,-6px -6px 12px #fff;font-weight:600;`,
        gridGap: '1.5rem',
        thumbMarkup: neoMorphThumb()
      }

    case 'gradient':
      return {
        profile,
        bodyBg: '#6366F1',
        bodyExtraCss: `
          background-image:linear-gradient(135deg,#6366f1 0%,#ec4899 50%,#f97316 100%);`,
        wrapExtraCss: '',
        h1Css: 'font-size:2.25rem;font-weight:800;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.15);',
        leadCss: 'color:rgba(255,255,255,.88);',
        cardCss: `
          background:rgba(255,255,255,.92);border:none;border-radius:20px;
          box-shadow:0 12px 40px rgba(0,0,0,.15);backdrop-filter:blur(8px);`,
        cardStrongCss: 'background:linear-gradient(135deg,var(--primary),#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-size:1.75rem;',
        ctaCss: 'background:#fff;color:#6366f1;border-radius:999px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.12);',
        gridGap: '1rem',
        thumbMarkup: gradientThumb()
      }

    case 'luxury':
      return {
        profile,
        bodyBg: '#141210',
        bodyExtraCss: '',
        wrapExtraCss: '',
        h1Css: `font-family:Georgia,serif;font-size:2.5rem;font-weight:400;color:${p};letter-spacing:.04em;`,
        leadCss: 'color:#a8a29e;font-family:Georgia,serif;font-style:italic;',
        cardCss: `
          background:linear-gradient(180deg,#1c1917,#141210);border:1px solid color-mix(in srgb, ${p} 35%, transparent);
          border-radius:4px;box-shadow:0 8px 32px rgba(0,0,0,.5);`,
        cardStrongCss: `color:${p};font-family:Georgia,serif;font-size:2rem;font-weight:400;`,
        ctaCss: `
          background:transparent;color:${p};border:1px solid ${p};border-radius:0;
          letter-spacing:.12em;text-transform:uppercase;font-size:.8125rem;padding:.875rem 2rem;`,
        gridGap: '1.25rem',
        thumbMarkup: luxuryThumb(p)
      }

    case 'friendly':
      return {
        profile,
        bodyBg: '#FFF7ED',
        bodyExtraCss: '',
        wrapExtraCss: '',
        h1Css: 'font-size:2rem;font-weight:700;color:#9a3412;',
        leadCss: 'color:#78716c;',
        cardCss: `
          background:#fff;border:2px solid #fed7aa;border-radius:20px;
          box-shadow:0 4px 0 #fdba74;`,
        cardStrongCss: 'color:#ea580c;font-size:1.75rem;',
        ctaCss: 'background:var(--primary);color:#fff;border-radius:999px;font-weight:700;box-shadow:0 4px 0 color-mix(in srgb,var(--primary) 70%,#000);',
        gridGap: '1rem',
        thumbMarkup: friendlyThumb(p)
      }

    case 'material':
      return {
        profile,
        bodyBg: '#FFFBFE',
        bodyExtraCss: '',
        wrapExtraCss: '',
        h1Css: 'font-size:2rem;font-weight:500;color:#1c1b1f;',
        leadCss: 'color:#49454f;',
        cardCss: `
          background:#fff;border:none;border-radius:12px;
          box-shadow:0 1px 2px rgba(0,0,0,.12),0 2px 6px rgba(0,0,0,.08);`,
        cardStrongCss: 'font-size:1.75rem;font-weight:500;color:#1c1b1f;',
        ctaCss: `
          background:var(--primary);color:#fff;border-radius:999px;font-weight:500;
          box-shadow:0 1px 3px rgba(0,0,0,.2),0 4px 8px color-mix(in srgb,var(--primary) 30%, transparent);`,
        gridGap: '1rem',
        thumbMarkup: materialThumb(p)
      }

    case 'shadcn':
      return {
        profile,
        bodyBg: '#FAFAFA',
        bodyExtraCss: '',
        wrapExtraCss: '',
        h1Css: 'font-size:1.875rem;font-weight:600;letter-spacing:-0.025em;',
        leadCss: 'color:#71717a;font-size:.9375rem;',
        cardCss: `
          background:#fff;border:1px solid #e4e4e7;border-radius:8px;
          box-shadow:0 1px 2px rgba(0,0,0,.04);`,
        cardStrongCss: 'font-size:1.5rem;font-weight:600;letter-spacing:-0.02em;',
        ctaCss: 'background:#18181b;color:#fafafa;border-radius:6px;font-weight:500;font-size:.875rem;',
        gridGap: '.75rem',
        thumbMarkup: shadcnThumb()
      }

    default:
      return {
        profile: 'default',
        bodyBg: vars.background,
        bodyExtraCss: dark ? '' : '',
        wrapExtraCss: '',
        h1Css: 'font-size:2rem;font-weight:700;',
        leadCss: '',
        cardCss: `background:var(--surface);border:1px solid color-mix(in srgb,var(--text) 10%,transparent);border-radius:var(--radius);`,
        cardStrongCss: 'font-size:1.5rem;font-weight:700;',
        ctaCss: 'background:var(--primary);border-radius:var(--radius);',
        gridGap: '1rem',
        thumbMarkup: defaultThumb(p)
      }
  }
}

function glassThumb() {
  return `<div class="t t-glass"><div class="t-bar"></div><div class="t-row"><span class="t-pill"></span><span class="t-pill sm"></span></div></div>`
}
function neoThumb(p: string) {
  return `<div class="t t-neo" style="--tp:${p}"><div class="t-box"></div><div class="t-box sm"></div></div>`
}
function brutalThumb() {
  return `<div class="t t-brutal"><div class="t-line"></div><div class="t-mono">A/a</div></div>`
}
function editorialThumb() {
  return `<div class="t t-edit"><div class="t-serif">Ag</div><div class="t-rule"></div></div>`
}
function minimalThumb() {
  return `<div class="t t-min"><div class="t-dot"></div><div class="t-line-thin"></div></div>`
}
function neonThumb(p: string) {
  return `<div class="t t-neon" style="--tp:${p}"><div class="t-glow"></div></div>`
}
function cosmicThumb(p: string) {
  return `<div class="t t-cosmic" style="--tp:${p}"><div class="t-orbit"></div></div>`
}
function neoMorphThumb() {
  return `<div class="t t-nmorph"><div class="t-soft"></div></div>`
}
function gradientThumb() {
  return `<div class="t t-grad"><div class="t-card-float"></div></div>`
}
function luxuryThumb(p: string) {
  return `<div class="t t-lux" style="--tp:${p}"><div class="t-gold"></div></div>`
}
function friendlyThumb(p: string) {
  return `<div class="t t-warm" style="--tp:${p}"><div class="t-round"></div></div>`
}
function materialThumb(p: string) {
  return `<div class="t t-mat" style="--tp:${p}"><div class="t-elev"></div></div>`
}
function shadcnThumb() {
  return `<div class="t t-sh"><div class="t-zinc"></div><div class="t-zinc sm"></div></div>`
}
/** 浅色 SaaS 工作台缩略图 — 侧栏 + 统计卡 + CTA，与 GenericPreviewPage 骨架一致 */
function lightCleanThumb(vars: PreviewVars) {
  const fallback = SLUG_FALLBACK_PRIMARY[vars.slug] ?? vars.primary
  const accent =
    /^#(000000|181[Dd]26|0{6})$/i.test(vars.primary) ? fallback : vars.primary
  return `<div class="t t-lightclean" style="--tp:${accent};--tb:${vars.background};--ts:${vars.surface}"><div class="t-side"></div><div class="t-body"><div class="t-title"></div><div class="t-row"><div class="t-card"></div><div class="t-card"></div></div><div class="t-cta"></div></div></div>`
}
function stripeThumb(p: string) {
  return `<div class="t t-stripe" style="--tp:${p}"><div class="t-mesh"></div><div class="t-pill-sm"></div></div>`
}
function darkDevThumb(p: string) {
  return `<div class="t t-darkdev" style="--tp:${p}"><div class="t-panel"></div><div class="t-accent"></div></div>`
}
function navyHeroThumb(navy: string) {
  return `<div class="t t-navy" style="--tn:${navy}"><div class="t-band"></div><div class="t-card-mini"></div></div>`
}
function pastelThumb(tints: string[]) {
  const c = tints.slice(0, 3).join(',')
  return `<div class="t t-pastel" style="--tints:${c}"><span></span><span></span><span></span></div>`
}
function spotifyThumb(p: string) {
  return `<div class="t t-spotify" style="--tp:${p}"><div class="t-pill-cta"></div></div>`
}
function slackThumb(p: string) {
  return `<div class="t t-slack" style="--tp:${p}"><div class="t-lav"></div><div class="t-pill"></div></div>`
}
function colorfulThumb(p: string) {
  return `<div class="t t-colorful" style="--tp:${p}"><div class="t-multi"></div></div>`
}
function defaultThumb(p: string) {
  return `<div class="t t-def" style="--tp:${p}"><div class="t-block"></div></div>`
}

/** 卡片缩略图 + 样例页共用的主题 CSS */
export function buildThemeStylesheet(vars: PreviewVars, theme: StyleTheme): string {
  const ctaColor =
    theme.profile === 'neobrutalism' ? '#000' : (vars.ctaText ?? (vars.dark ? '#FFFFFF' : '#FFFFFF'))
  const textOnSurface = vars.textOnSurface ?? vars.text
  const textMutedOnSurface = vars.textMutedOnSurface ?? vars.textMuted
  const gridGap = vars.spacingGrid ?? theme.gridGap
  const wrapPad = vars.spacingWrap ?? '2.5rem 1.5rem'
  const elevationRaised = vars.elevationRaised ?? vars.elevationCard ?? vars.cardShadow ?? '0 1px 2px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.06)'
  const elevationFlat = vars.elevationFlat ?? '0 0 0 1px rgba(23,23,21,0.06)'
  const fontSizeBody = vars.fontSizeBody ?? '16px'
  const fontSizeCaption = vars.fontSizeCaption ?? '13px'
  const bodyFeature = vars.fontFeatureStylistic ? `font-feature-settings:${vars.fontFeatureStylistic};` : ''
  const tabularFeature = vars.fontFeatureTabular ? `font-feature-settings:${vars.fontFeatureTabular};font-variant-numeric:tabular-nums;` : ''

  return `
    :root {
      --primary: ${vars.primary};
      --primary-hover: ${vars.primaryHover};
      --bg: ${theme.bodyBg};
      --surface: ${vars.surface};
      --text: ${vars.text};
      --muted: ${vars.textMuted};
      --text-on-surface: ${textOnSurface};
      --text-muted-on-surface: ${textMutedOnSurface};
      --cta-text: ${ctaColor};
      --radius: ${vars.cardRadius ?? vars.radius};
      --spacing-grid: ${gridGap};
      --spacing-section: ${vars.spacingSection ?? '3rem'};
      --elevation-flat: ${elevationFlat};
      --elevation-raised: ${elevationRaised};
      --font-body: ${vars.fontBody};
      --font-size-body: ${fontSizeBody};
      --font-size-caption: ${fontSizeCaption};
    }
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh;
      overflow-x: clip;
      font-family: ${vars.fontBody};
      font-size: ${fontSizeBody};
      color: var(--text);
      background: ${theme.bodyBg};
      ${bodyFeature}
      ${theme.bodyExtraCss}
    }
    .wrap { max-width: 960px; margin: 0 auto; padding: ${wrapPad}; ${theme.wrapExtraCss} }
    h1 { font-family: ${vars.fontDisplay}; margin: 0 0 0.5rem; ${theme.h1Css} }
    p.lead { color: var(--muted); margin: 0 0 2rem; max-width: 36rem; line-height: 1.6; font-size: ${fontSizeBody}; ${theme.leadCss} }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: ${gridGap}; margin-bottom: ${vars.spacingSection ?? '2rem'}; }
    .card {
      padding: 1.25rem;
      box-shadow: var(--elevation-raised);
      color: var(--text-on-surface);
      ${theme.cardCss}
    }
    .card strong {
      display: block; margin-bottom: 0.25rem;
      color: var(--text-on-surface);
      ${tabularFeature}
      ${theme.cardStrongCss}
    }
    .card span { color: var(--text-muted-on-surface); font-size: ${fontSizeCaption}; }
    .cta {
      display: inline-block; padding: 0.75rem 1.25rem; text-decoration: none; font-weight: 600;
      background: var(--primary); color: ${ctaColor}; ${theme.ctaCss}
    }
    .cta:hover { background: var(--primary-hover); filter: brightness(1.05); }
    ${buildComponentShowcaseCss(vars)}
    ${theme.sampleCss ?? ''}
    @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }

    /* 卡片缩略图 */
    .style-thumb { height: 72px; border-radius: 8px; overflow: hidden; margin-bottom: .625rem; position: relative; }
    .style-thumb .t { width: 100%; height: 100%; position: relative; }
    .t-glass { background: linear-gradient(135deg,#0c1222,#1a1040); }
    .t-glass .t-bar { height: 14px; margin: 12px; border-radius: 8px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2); backdrop-filter: blur(8px); }
    .t-glass .t-row { display: flex; gap: 6px; padding: 0 12px; }
    .t-glass .t-pill { flex: 1; height: 28px; border-radius: 8px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15); }
    .t-glass .t-pill.sm { flex: .6; }
    .t-neo { background: #fffdf5; padding: 10px; display: flex; gap: 8px; }
    .t-neo .t-box { flex: 1; height: 100%; background: #fff; border: 2px solid #000; box-shadow: 3px 3px 0 #000; }
    .t-neo .t-box.sm { flex: .55; background: color-mix(in srgb, var(--tp) 35%, #fff); }
    .t-brutal { background: #e8e8e8; padding: 10px; font-family: monospace; }
    .t-brutal .t-line { height: 10px; background: #000; margin-bottom: 8px; }
    .t-brutal .t-mono { font-size: 18px; font-weight: 700; }
    .t-edit { background: #faf8f5; padding: 12px; }
    .t-edit .t-serif { font-family: Georgia, serif; font-size: 28px; line-height: 1; color: #171715; }
    .t-edit .t-rule { height: 1px; background: #d6d3d1; margin-top: 10px; width: 70%; }
    .t-min { background: #fff; padding: 14px; }
    .t-min .t-dot { width: 8px; height: 8px; border-radius: 50%; background: #171715; margin-bottom: 12px; }
    .t-min .t-line-thin { height: 1px; background: #efefef; width: 80%; }
    .t-neon { background: #050508; display: grid; place-items: center; }
    .t-neon .t-glow { width: 60%; height: 36px; border: 1px solid var(--tp); box-shadow: 0 0 12px var(--tp); border-radius: 4px; }
    .t-cosmic { background: radial-gradient(circle at 50% 30%, color-mix(in srgb,var(--tp) 40%,#0b1020),#0b1020); }
    .t-cosmic .t-orbit { position: absolute; inset: 18px; border: 1px solid rgba(255,255,255,.12); border-radius: 50%; }
    .t-nmorph { background: #e4e9f0; display: grid; place-items: center; }
    .t-nmorph .t-soft { width: 70%; height: 40px; border-radius: 14px; background: #e4e9f0; box-shadow: 5px 5px 10px #c8cdd4,-5px -5px 10px #fff; }
    .t-grad { background: linear-gradient(135deg,#6366f1,#ec4899); padding: 12px; }
    .t-grad .t-card-float { height: 100%; background: rgba(255,255,255,.9); border-radius: 10px; }
    .t-lux { background: #141210; display: grid; place-items: center; }
    .t-lux .t-gold { width: 50%; height: 2px; background: var(--tp); box-shadow: 0 0 8px var(--tp); }
    .t-warm { background: #fff7ed; padding: 12px; }
    .t-warm .t-round { width: 70%; height: 36px; background: #fff; border: 2px solid #fed7aa; border-radius: 16px; box-shadow: 0 3px 0 #fdba74; }
    .t-mat { background: #fffbfe; padding: 12px; }
    .t-mat .t-elev { height: 100%; background: #fff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,.12); }
    .t-sh { background: #fafafa; padding: 10px; display: flex; flex-direction: column; gap: 6px; }
    .t-sh .t-zinc { height: 14px; background: #fff; border: 1px solid #e4e4e7; border-radius: 4px; }
    .t-sh .t-zinc.sm { height: 22px; }
    .t-brand { background: linear-gradient(180deg,color-mix(in srgb,var(--tp) 8%,var(--td)),var(--td)); display: grid; place-items: center; }
    .t-brand .t-mark { width: 28px; height: 28px; border-radius: 8px; background: var(--tp); }
    .t-stripe { background: #fff; position: relative; overflow: hidden; }
    .t-stripe .t-mesh { position: absolute; inset: 0 0 40%; background: linear-gradient(90deg,#f5e9d4,#ffb366,#b9b9f9,var(--tp)); opacity: .55; }
    .t-stripe .t-pill-sm { position: absolute; bottom: 10px; left: 12px; width: 48px; height: 14px; border-radius: 999px; background: var(--tp); }
    .t-darkdev { background: #0a0a0a; padding: 10px; }
    .t-darkdev .t-panel { height: 28px; background: #161616; border-radius: 6px; border: 1px solid #2a2a2a; margin-bottom: 6px; }
    .t-darkdev .t-accent { height: 10px; width: 40%; background: var(--tp); border-radius: 4px; opacity: .8; }
    .t-navy { background: #fff; }
    .t-navy .t-band { height: 55%; background: var(--tn); }
    .t-navy .t-card-mini { margin: -8px 10px 0; height: 28px; background: #FBF3DB; border-radius: 6px; border: 1px solid #E8E8E3; }
    .t-pastel { background: #fff; display: flex; gap: 4px; padding: 10px; align-items: stretch; }
    .t-pastel span { flex: 1; border-radius: 6px; border: 1px solid #E8E8E3; }
    .t-pastel span:nth-child(1){background:#FBF3DB}.t-pastel span:nth-child(2){background:#FAEBEC}.t-pastel span:nth-child(3){background:#E7F3F8}
    .t-spotify { background: #121212; display: grid; place-items: center; }
    .t-spotify .t-pill-cta { width: 56px; height: 18px; border-radius: 999px; background: var(--tp); }
    .t-slack { background: #F4EFFA; padding: 10px; }
    .t-slack .t-lav { height: 20px; background: #fff; border-radius: 8px; margin-bottom: 6px; border: 1px solid #E8E8E8; }
    .t-slack .t-pill { height: 14px; width: 50%; border-radius: 999px; background: var(--tp); }
    .t-colorful { background: #fafafa; padding: 10px; }
    .t-colorful .t-multi { height: 100%; border-radius: 8px; background: linear-gradient(135deg,var(--tp),#FFD02F,#0ACF83); opacity: .35; border: 2px solid var(--tp); }
    .t-def { background: color-mix(in srgb,var(--tp) 8%,#fafaf7); padding: 12px; }
    .t-def .t-block { height: 100%; background: #fff; border-radius: 6px; border-left: 4px solid var(--tp); }
    .t-lightclean { display: flex; height: 100%; background: var(--tb, #fafaf7); }
    .t-lightclean .t-side { width: 30%; background: var(--ts, #fff); border-right: 1px solid color-mix(in srgb, var(--tp) 14%, transparent); }
    .t-lightclean .t-body { flex: 1; padding: 8px 8px 6px; display: flex; flex-direction: column; gap: 5px; position: relative; }
    .t-lightclean .t-title { height: 7px; width: 52%; border-radius: 2px; background: color-mix(in srgb, var(--tp) 55%, #171715); opacity: .9; }
    .t-lightclean .t-row { display: flex; gap: 4px; flex: 1; min-height: 0; }
    .t-lightclean .t-card { flex: 1; background: var(--ts, #fff); border-radius: 4px; border: 1px solid color-mix(in srgb, var(--tp) 12%, transparent); box-shadow: 0 1px 2px rgba(0,0,0,.04); }
    .t-lightclean .t-cta { position: absolute; top: 6px; right: 8px; width: 20px; height: 9px; border-radius: 3px; background: var(--tp); }
  `
}

export function buildCardThumbHtml(vars: PreviewVars): string {
  const theme = resolveStyleTheme(vars)
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>${buildThemeStylesheet(vars, theme)}</style></head><body style="margin:0;overflow:hidden"><div class="style-thumb">${theme.thumbMarkup}</div></body></html>`
}

/** API 返回前，用 slug + visualStyle 生成可辨认的缩略图变量 */
export function createFallbackPreviewVars(input: {
  slug: string
  kind: 'aesthetic' | 'brand'
  visualStyle?: string[]
}): PreviewVars {
  const primary = SLUG_FALLBACK_PRIMARY[input.slug] ?? (input.kind === 'brand' ? '#5645D4' : '#3B82F6')
  const profile = resolveThemeProfile({
    slug: input.slug,
    kind: input.kind,
    visualStyle: input.visualStyle ?? []
  })
  const darkProfiles: ThemeProfile[] = ['glassmorphism', 'neon', 'cosmic', 'futuristic', 'luxury']
  const dark = darkProfiles.includes(profile)
  const brandArch: BrandHeroArchetype | undefined =
    input.kind === 'brand' ? (BRAND_ARCHETYPE_FALLBACK[input.slug] ?? 'light-clean') : undefined
  const isDarkBrand =
    brandArch === 'dark-dev' || brandArch === 'immersive-dark' || dark
  return {
    slug: input.slug,
    kind: input.kind,
    visualStyle: input.visualStyle ?? [],
    primary,
    primaryHover: primary,
    background:
      brandArch === 'immersive-dark' ? '#121212' : brandArch === 'dark-dev' ? '#0F172A' : dark ? '#0F172A' : '#FAFAF7',
    surface:
      brandArch === 'immersive-dark' ? '#181818' : brandArch === 'dark-dev' ? '#1E293B' : dark ? '#1E293B' : '#FFFFFF',
    text: isDarkBrand ? '#F1F5F9' : '#171715',
    textMuted: isDarkBrand ? '#94A3B8' : '#7A7A6F',
    success: '#2F7D52',
    warning: '#C8861B',
    danger: primary,
    fontBody: "'Inter', system-ui, sans-serif",
    fontDisplay: profile === 'editorial' || profile === 'luxury'
      ? "Georgia, 'Times New Roman', serif"
      : profile === 'brutalism'
        ? "'Courier New', monospace"
        : "'Inter Tight', system-ui, sans-serif",
    radius: profile === 'neobrutalism' || profile === 'brutalism' ? '0px' : brandArch === 'gradient-mesh' || input.slug === 'stripe' ? '9999px' : '12px',
    dark: isDarkBrand,
    glass: profile === 'glassmorphism',
    heroArchetype: brandArch,
    buttonPill: brandArch === 'gradient-mesh' || brandArch === 'aubergine-soft' || brandArch === 'immersive-dark',
    buttonRadius: brandArch === 'gradient-mesh' ? '9999px' : '8px',
    cardRadius: '12px'
  }
}
