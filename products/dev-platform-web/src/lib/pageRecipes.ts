import type { BrandHeroArchetype, PreviewVars } from '../types/style-preset'
import { buildComponentShowcaseHtml } from './sampleShowcase'

export const GOLDEN_BRAND_SLUGS = [
  'notion',
  'stripe',
  'linear',
  'slack',
  'spotify',
  'figma',
  'airbnb',
  'github',
  'vercel',
  'discord',
  'shopify',
  'dropbox',
  'asana',
  'monday',
  'intercom',
  'cursor',
  'apple',
  'google',
  'miro',
  'airtable',
  'raycast',
  'supabase'
] as const

export type GoldenBrandSlug = (typeof GOLDEN_BRAND_SLUGS)[number]

export function isGoldenBrand(slug: string): slug is GoldenBrandSlug {
  return (GOLDEN_BRAND_SLUGS as readonly string[]).includes(slug)
}

type GoldenCard = { title: string; subtitle: string }

type GoldenRecipeMeta = {
  kicker: string
  lead: string
  cards: GoldenCard[]
  panelTitle?: string
  panelMeta?: string
  panelSub?: string
}

/** 品牌样例页文案与卡片 — 按 catalog slug */
const GOLDEN_META: Record<GoldenBrandSlug, GoldenRecipeMeta> = {
  notion: { kicker: '营销页', lead: '', cards: [] },
  stripe: { kicker: '金融科技营销', lead: '', cards: [] },
  linear: { kicker: '开发者营销', lead: '', cards: [] },
  slack: { kicker: '团队沟通', lead: '', cards: [] },
  spotify: { kicker: '沉浸式媒体', lead: '', cards: [] },
  figma: {
    kicker: '设计协作',
    lead: '白底 canvas + pill CTA + 设计工具级清晰度 — Figma 协作气质',
    cards: [
      { title: 'FigJam', subtitle: '白板协作' },
      { title: 'Design', subtitle: '界面设计' },
      { title: 'Dev Mode', subtitle: '交付开发' }
    ]
  },
  airbnb: {
    kicker: '旅行信任',
    lead: '珊瑚红主色 + 白底 + 信任向卡片 — Airbnb 预订体验',
    cards: [
      { title: '128', subtitle: '今晚可订' },
      { title: '4.92', subtitle: '平均评分' },
      { title: '24h', subtitle: '房东响应' }
    ]
  },
  github: {
    kicker: '开发者平台',
    lead: '近黑 canvas + charcoal 面板 — 开发者工具气质',
    cards: [
      { title: '2.4k', subtitle: 'Stars' },
      { title: '186', subtitle: 'PRs' },
      { title: '99.9%', subtitle: 'CI 通过' }
    ],
    panelMeta: 'repo/main · workflow ci',
    panelTitle: 'Pull Request #842',
    panelSub: 'Review → Merge → Deploy'
  },
  vercel: {
    kicker: '前端部署',
    lead: '黑白极简 + pill CTA — Vercel 部署平台气质',
    cards: [
      { title: '42ms', subtitle: '全球延迟' },
      { title: '99.99%', subtitle: '可用性' },
      { title: '1.2M', subtitle: '月部署' }
    ]
  },
  discord: {
    kicker: '社区沟通',
    lead: '薰衣草 hero 洗 + aubergine pill — 社区实时沟通',
    cards: [
      { title: '# general', subtitle: '128 在线' },
      { title: '# dev', subtitle: '42 未读' },
      { title: '# design', subtitle: '已静音' }
    ]
  },
  shopify: {
    kicker: '商家后台',
    lead: '电商绿 + 浅色 admin canvas — Shopify 商家工作台',
    cards: [
      { title: '¥48.2k', subtitle: '今日 GMV' },
      { title: '326', subtitle: '待发货' },
      { title: '94%', subtitle: '履约率' }
    ]
  },
  dropbox: {
    kicker: '云存储',
    lead: '编辑风 ink 字 + 签名色卡片 — 云存储 productivity',
    cards: [
      { title: '2.4 TB', subtitle: '团队空间' },
      { title: '186', subtitle: '共享文件' },
      { title: '12', subtitle: '协作成员' }
    ]
  },
  asana: {
    kicker: '项目管理',
    lead: '橙色 CTA + 工作流卡片 — Asana 任务自动化',
    cards: [
      { title: '24', subtitle: '进行中' },
      { title: '8', subtitle: '本周到期' },
      { title: '92%', subtitle: '按时完成' }
    ]
  },
  monday: {
    kicker: '工作 OS',
    lead: '多彩看板 + pill CTA — Monday 工作 OS 能量',
    cards: [
      { title: 'Design', subtitle: '12 项' },
      { title: 'Marketing', subtitle: '8 项' },
      { title: 'Sales', subtitle: '5 项' }
    ]
  },
  intercom: {
    kicker: '客户支持',
    lead: '暖色 canvas + 支持蓝 — Intercom 对话产品',
    cards: [
      { title: '42', subtitle: '待回复' },
      { title: '2.1m', subtitle: '平均响应' },
      { title: '96%', subtitle: '满意度' }
    ]
  },
  cursor: {
    kicker: 'AI 编辑器',
    lead: '编辑器 canvas + 橙色点缀 — Cursor AI 专业界面',
    cards: [
      { title: 'Cmd+K', subtitle: 'AI 指令' },
      { title: '12', subtitle: '活跃项目' },
      { title: '4.8x', subtitle: '编码提速' }
    ],
    panelMeta: 'main.ts · L42',
    panelTitle: 'Refactor auth middleware',
    panelSub: 'AI suggestion · Apply diff'
  },
  apple: {
    kicker: '系统产品',
    lead: 'SF 体系 + 大留白 + 蓝色 pill — Apple 系统感',
    cards: [
      { title: 'iCloud', subtitle: '200 GB' },
      { title: 'Family', subtitle: '5 成员' },
      { title: '99.9%', subtitle: '同步率' }
    ]
  },
  google: {
    kicker: 'Workspace',
    lead: 'Material 蓝 + pill CTA — Google Workspace 产品网格',
    cards: [
      { title: 'Drive', subtitle: '2.4 TB' },
      { title: 'Meet', subtitle: '12 会议' },
      { title: 'Gmail', subtitle: '48 未读' }
    ]
  },
  miro: {
    kicker: '协作白板',
    lead: 'Sticky 多色 + pill CTA — Miro 协作画布',
    cards: [
      { title: 'Sprint', subtitle: '24 sticky' },
      { title: 'Retro', subtitle: '12 sticky' },
      { title: 'Roadmap', subtitle: '8 sticky' }
    ]
  },
  airtable: {
    kicker: '表格数据库',
    lead: '白底 + ink 字 + 签名色卡片 — Airtable productivity',
    cards: [
      { title: '1,248', subtitle: '记录数' },
      { title: '12', subtitle: '视图' },
      { title: '8', subtitle: '协作者' }
    ]
  },
  raycast: {
    kicker: 'macOS 启动器',
    lead: '近黑 canvas + charcoal 启动器框 — Raycast 精致 UI',
    cards: [
      { title: '⌘K', subtitle: '快捷入口' },
      { title: '48', subtitle: '扩展' },
      { title: '12ms', subtitle: '唤起延迟' }
    ],
    panelMeta: 'Search · extensions',
    panelTitle: 'Open GitHub PR',
    panelSub: 'Raycast AI · Run command'
  },
  supabase: {
    kicker: '开发者后端',
    lead: 'Postgres 绿 + 开发者 docs 气质 — Supabase BaaS',
    cards: [
      { title: '12', subtitle: '活跃项目' },
      { title: '99.9%', subtitle: 'API 可用' },
      { title: '4.2k', subtitle: 'RPS 峰值' }
    ]
  }
}

const GOLDEN_ARCHETYPE: Record<GoldenBrandSlug, BrandHeroArchetype> = {
  notion: 'navy-hero',
  stripe: 'gradient-mesh',
  linear: 'dark-dev',
  slack: 'aubergine-soft',
  spotify: 'immersive-dark',
  figma: 'light-clean',
  airbnb: 'light-clean',
  github: 'dark-dev',
  vercel: 'light-clean',
  discord: 'aubergine-soft',
  shopify: 'light-clean',
  dropbox: 'light-clean',
  asana: 'light-clean',
  monday: 'colorful',
  intercom: 'light-clean',
  cursor: 'light-clean',
  apple: 'light-clean',
  google: 'light-clean',
  miro: 'colorful',
  airtable: 'light-clean',
  raycast: 'dark-dev',
  supabase: 'light-clean'
}

function tabularStyle(vars: PreviewVars): string {
  return vars.fontFeatureTabular
    ? `font-feature-settings:${vars.fontFeatureTabular};font-variant-numeric:tabular-nums;`
    : ''
}

function navHtml(vars: PreviewVars): string {
  const n = vars.sampleNav
  if (!n) return ''
  return `<nav class="recipe-nav" style="background:${n.background};padding:${n.padding};border-radius:${n.borderRadius};${n.border ? `border:${n.border};` : ''}">
    <span class="recipe-nav-brand">Demo</span>
    <span class="recipe-nav-link">产品</span>
    <span class="recipe-nav-link">定价</span>
    <span class="recipe-nav-link">文档</span>
  </nav>`
}

function ctaRow(vars: PreviewVars): string {
  const sec = vars.sampleSecondaryButton
  const secHtml = sec
    ? `<a class="recipe-cta-secondary" href="#" style="background:${sec.background};color:${sec.color};border:${sec.border};border-radius:${sec.borderRadius};padding:${sec.padding};">了解更多</a>`
    : `<a class="recipe-cta-secondary" href="#">了解更多</a>`
  return `<div class="recipe-cta-row"><a class="cta" href="#">开始体验</a>${secHtml}</div>`
}

function cardsGrid(cards: GoldenCard[], tabular = ''): string {
  return cards
    .map(
      (c) =>
        `<article class="card"><strong style="${tabular}">${c.title}</strong><span>${c.subtitle}</span></article>`
    )
    .join('')
}

function notionBody(vars: PreviewVars, title: string): string {
  const t0 = vars.cardTints?.[0] ?? '#FBF3DB'
  const t1 = vars.cardTints?.[1] ?? '#FAEBEC'
  const t2 = vars.cardTints?.[2] ?? '#E7F3F8'
  const navy = vars.heroAccent ?? '#19202E'
  return `
    <div class="recipe-notion">
      <header class="recipe-notion-hero" style="background:${navy}">
        <div class="wrap recipe-notion-hero__inner">
          <p class="recipe-kicker recipe-notion-kicker">${GOLDEN_META.notion.kicker || '营销页'}</p>
          <h1 class="recipe-notion-title">${title}</h1>
          <p class="lead recipe-notion-lead">海军蓝 hero + pastel 分色卡 + hairline — Notion 式编辑产品气质</p>
        </div>
      </header>
      <div class="wrap recipe-notion-main">
        ${navHtml(vars)}
        <section class="recipe-section recipe-notion-section">
          <h2 class="recipe-h2">为团队而建的 workspace</h2>
          <div class="recipe-notion-cards">
            <article class="card" style="background:${t0}"><strong>文档</strong><span>协作编辑</span></article>
            <article class="card" style="background:${t1}"><strong>项目</strong><span>看板视图</span></article>
            <article class="card" style="background:${t2}"><strong>知识库</strong><span>团队 wiki</span></article>
          </div>
        </section>
        ${ctaRow(vars)}
        ${buildComponentShowcaseHtml(vars)}
      </div>
    </div>`
}

function stripeBody(vars: PreviewVars, title: string): string {
  const tab = tabularStyle(vars)
  return `
    <div class="recipe-stripe">
      <div class="recipe-stripe-mesh" aria-hidden="true"></div>
      <div class="wrap">
        ${navHtml(vars)}
        <p class="recipe-kicker">${GOLDEN_META.stripe.kicker}</p>
        <h1>${title}</h1>
        <p class="lead">Gradient mesh + 300 字重 display + tabular 金额 — Stripe 标志性组合</p>
        <section class="recipe-section recipe-stripe-pricing">
          <article class="card card-cream">
            <p class="recipe-label">Starter</p>
            <p class="recipe-price" style="${tab}">¥0</p>
            <span>每月前 100 笔免费</span>
          </article>
          <article class="card card-featured">
            <p class="recipe-label">Business</p>
            <p class="recipe-price" style="${tab}">¥12,480</p>
            <span>含高级报表与 API</span>
          </article>
          <article class="card card-cream">
            <p class="recipe-label">Enterprise</p>
            <p class="recipe-price" style="${tab}">定制</p>
            <span>专属支持与 SLA</span>
          </article>
        </section>
        ${ctaRow(vars)}
        ${buildComponentShowcaseHtml(vars)}
      </div>
    </div>`
}

function linearBody(vars: PreviewVars, title: string): string {
  const mono = vars.fontMono ?? "'JetBrains Mono', monospace"
  return `
    <div class="recipe-linear">
      <div class="wrap">
        ${navHtml(vars)}
        <p class="recipe-kicker">${GOLDEN_META.linear.kicker}</p>
        <h1>${title}</h1>
        <p class="lead">近黑 canvas + charcoal 面板 + 产品截图框 — Linear 精密气质</p>
        <div class="recipe-linear-panel">
          <div class="recipe-linear-chrome">
            <span></span><span></span><span></span>
          </div>
          <div class="recipe-linear-body">
            <code style="font-family:${mono};font-size:12px;color:var(--muted)">ENG-2847 · cycle 24</code>
            <p style="margin:.75rem 0 0;font-weight:600">Issue 状态流转</p>
            <p style="margin:.25rem 0 0;font-size:14px;color:var(--muted)">从 Backlog → In Progress → Done</p>
          </div>
        </div>
        <div class="grid">${cardsGrid(GOLDEN_META.linear.cards.length ? GOLDEN_META.linear.cards : [
          { title: '12ms', subtitle: 'p99 延迟' },
          { title: '99.9%', subtitle: '可用性' },
          { title: '4.8k', subtitle: '团队在用' }
        ], tabularStyle(vars))}</div>
        ${ctaRow(vars)}
        ${buildComponentShowcaseHtml(vars)}
      </div>
    </div>`
}

function slackBody(vars: PreviewVars, title: string): string {
  return `
    <div class="recipe-slack">
      <div class="recipe-slack-wash" aria-hidden="true"></div>
      <div class="wrap">
        ${navHtml(vars)}
        <p class="recipe-kicker">${GOLDEN_META.slack.kicker}</p>
        <h1>${title}</h1>
        <p class="lead">薰衣草 hero 洗 + aubergine pill CTA — Slack 友好职场气质</p>
        <div class="recipe-slack-cards">
          <article class="card"><strong># product</strong><span>12 条未读</span></article>
          <article class="card card-lavender"><strong># design</strong><span>3 条未读</span></article>
          <article class="card"><strong># eng</strong><span>已静音</span></article>
        </div>
        ${ctaRow(vars)}
        ${buildComponentShowcaseHtml(vars)}
      </div>
    </div>`
}

function spotifyBody(vars: PreviewVars, title: string): string {
  return `
    <div class="recipe-spotify">
      <div class="wrap">
        ${navHtml(vars)}
        <p class="recipe-kicker">${GOLDEN_META.spotify.kicker}</p>
        <h1>${title}</h1>
        <p class="lead">近黑 canvas + 品牌绿 pill + 深色 elevated 卡片</p>
        <div class="recipe-spotify-playlists">
          <article class="card"><strong>每日推荐</strong><span>48 首 · 更新于今天</span></article>
          <article class="card"><strong>Release Radar</strong><span>新发行艺人</span></article>
          <article class="card"><strong>Chill Hits</strong><span>放松流行</span></article>
        </div>
        ${ctaRow(vars)}
        ${buildComponentShowcaseHtml(vars)}
      </div>
    </div>`
}

function lightCleanGoldenBody(slug: GoldenBrandSlug, vars: PreviewVars, title: string): string {
  const meta = GOLDEN_META[slug]
  return `
    <div class="recipe-lightclean recipe-${slug}">
      <div class="wrap">
        ${navHtml(vars)}
        <p class="recipe-kicker">${meta.kicker}</p>
        <h1>${title}</h1>
        <p class="lead">${meta.lead}</p>
        <div class="grid">${cardsGrid(meta.cards, tabularStyle(vars))}</div>
        ${ctaRow(vars)}
        ${buildComponentShowcaseHtml(vars)}
      </div>
    </div>`
}

function darkDevGoldenBody(slug: GoldenBrandSlug, vars: PreviewVars, title: string): string {
  const meta = GOLDEN_META[slug]
  const mono = vars.fontMono ?? "'JetBrains Mono', monospace"
  return `
    <div class="recipe-linear recipe-${slug}">
      <div class="wrap">
        ${navHtml(vars)}
        <p class="recipe-kicker">${meta.kicker}</p>
        <h1>${title}</h1>
        <p class="lead">${meta.lead}</p>
        <div class="recipe-linear-panel">
          <div class="recipe-linear-chrome"><span></span><span></span><span></span></div>
          <div class="recipe-linear-body">
            <code style="font-family:${mono};font-size:12px;color:var(--muted)">${meta.panelMeta ?? 'dev · main'}</code>
            <p style="margin:.75rem 0 0;font-weight:600">${meta.panelTitle ?? 'Product panel'}</p>
            <p style="margin:.25rem 0 0;font-size:14px;color:var(--muted)">${meta.panelSub ?? 'Workflow preview'}</p>
          </div>
        </div>
        <div class="grid">${cardsGrid(meta.cards, tabularStyle(vars))}</div>
        ${ctaRow(vars)}
        ${buildComponentShowcaseHtml(vars)}
      </div>
    </div>`
}

function aubergineGoldenBody(slug: GoldenBrandSlug, vars: PreviewVars, title: string): string {
  const meta = GOLDEN_META[slug]
  return `
    <div class="recipe-slack recipe-${slug}">
      <div class="recipe-slack-wash" aria-hidden="true"></div>
      <div class="wrap">
        ${navHtml(vars)}
        <p class="recipe-kicker">${meta.kicker}</p>
        <h1>${title}</h1>
        <p class="lead">${meta.lead}</p>
        <div class="recipe-slack-cards">${cardsGrid(meta.cards)}</div>
        ${ctaRow(vars)}
        ${buildComponentShowcaseHtml(vars)}
      </div>
    </div>`
}

function colorfulGoldenBody(slug: GoldenBrandSlug, vars: PreviewVars, title: string): string {
  const meta = GOLDEN_META[slug]
  return `
    <div class="recipe-colorful recipe-${slug}">
      <div class="wrap">
        ${navHtml(vars)}
        <p class="recipe-kicker">${meta.kicker}</p>
        <h1>${title}</h1>
        <p class="lead">${meta.lead}</p>
        <div class="recipe-colorful-cards">${cardsGrid(meta.cards)}</div>
        ${ctaRow(vars)}
        ${buildComponentShowcaseHtml(vars)}
      </div>
    </div>`
}

/** 品牌样例页主体 HTML */
export function buildGoldenSampleBody(vars: PreviewVars, title: string): string {
  const slug = vars.slug as GoldenBrandSlug
  if (!isGoldenBrand(slug)) return ''

  switch (slug) {
    case 'notion':
      return notionBody(vars, title)
    case 'stripe':
      return stripeBody(vars, title)
    case 'linear':
      return linearBody(vars, title)
    case 'slack':
      return slackBody(vars, title)
    case 'spotify':
      return spotifyBody(vars, title)
    default: {
      const arch = GOLDEN_ARCHETYPE[slug]
      switch (arch) {
        case 'dark-dev':
          return darkDevGoldenBody(slug, vars, title)
        case 'aubergine-soft':
          return aubergineGoldenBody(slug, vars, title)
        case 'colorful':
          return colorfulGoldenBody(slug, vars, title)
        default:
          return lightCleanGoldenBody(slug, vars, title)
      }
    }
  }
}

const SHARED_GOLDEN_CSS = `
  .recipe-kicker { margin:0 0 .5rem; font-size: var(--font-size-caption); text-transform: uppercase; letter-spacing: .08em; color: var(--muted); opacity: .85; }
  .recipe-h2 { font-family: var(--font-display, inherit); font-size: 1.375rem; font-weight: 600; margin: 0 0 1rem; }
  .recipe-section { margin-bottom: var(--spacing-section, 3rem); }
  .recipe-label { margin: 0 0 .25rem; font-size: var(--font-size-caption); color: var(--muted); text-transform: uppercase; letter-spacing: .06em; }
  .recipe-price { margin: 0 0 .25rem; font-size: 2rem; font-weight: 300; }
  .recipe-nav { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; box-shadow: var(--elevation-flat); }
  .recipe-nav-brand { font-weight: 600; }
  .recipe-nav-link { opacity: .65; font-size: var(--font-size-body); }
  .recipe-cta-row { display: flex; gap: .75rem; flex-wrap: wrap; align-items: center; margin-bottom: 1rem; }
  .recipe-cta-secondary { text-decoration: none; font-weight: 600; }
  .recipe-lightclean h1 { font-size: 2rem; letter-spacing: -0.02em; }
  .recipe-colorful-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: var(--spacing-grid); margin-bottom: var(--spacing-section); }
  .recipe-colorful-cards .card:nth-child(1) { border-color: var(--primary); border-width: 2px; }
  .recipe-colorful-cards .card:nth-child(2) { border-color: #FFD02F; border-width: 2px; background: color-mix(in srgb, #FFD02F 12%, var(--surface)); }
  .recipe-colorful-cards .card:nth-child(3) { border-color: #0ACF83; border-width: 2px; background: color-mix(in srgb, #0ACF83 10%, var(--surface)); }
`

const BESPOKE_GOLDEN_CSS: Partial<Record<GoldenBrandSlug, string>> = {
  notion: `
    .recipe-notion { overflow-x: clip; }
    .recipe-notion-hero {
      margin: 0 0 2rem;
      padding: 2.75rem 0 2.25rem;
      color: #fff;
    }
    .recipe-notion-hero__inner { padding-top: 0; padding-bottom: 0; }
    .recipe-notion-kicker {
      color: rgba(255,255,255,.72);
      opacity: 1;
      letter-spacing: .1em;
    }
    .recipe-notion-title {
      color: #fff;
      font-size: clamp(1.75rem, 4vw, 2.25rem);
      font-weight: 600;
      letter-spacing: -0.02em;
      line-height: 1.15;
      margin: 0 0 .75rem;
    }
    .recipe-notion-lead {
      color: rgba(255,255,255,.85);
      margin: 0;
      max-width: 36rem;
      line-height: 1.6;
    }
    .recipe-notion-main { padding-top: 0; }
    .recipe-notion .recipe-nav {
      width: 100%;
      padding: 0.75rem 1rem;
      margin: 0 0 2rem;
      border: 1px solid #E8E8E3;
      border-radius: var(--radius, 12px);
      background: var(--surface, #fff);
      box-shadow: var(--elevation-flat);
    }
    .recipe-notion-section { margin-bottom: var(--spacing-section, 2rem); }
    .recipe-notion-section .recipe-h2 { margin: 0 0 1.25rem; }
    .recipe-notion-cards {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--spacing-grid, 1rem);
    }
    .recipe-notion-cards .card {
      min-width: 0;
      padding: 1.25rem 1rem;
      border: 1px solid #E8E8E3;
      box-shadow: var(--elevation-flat);
      border-radius: var(--radius, 12px);
    }
    .recipe-notion-cards .card strong {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-on-surface, #37352F);
    }
    @media (max-width: 720px) {
      .recipe-notion-cards { grid-template-columns: 1fr; }
    }
  `,
  stripe: `
    .recipe-stripe { position: relative; }
    .recipe-stripe-mesh { position: absolute; inset: 0 0 55%; background: linear-gradient(90deg,#f5e9d4,#ffb366,#b9b9f9,#533afd); opacity: .35; pointer-events: none; }
    .recipe-stripe .wrap { position: relative; padding-top: 2rem; }
    .recipe-stripe h1 { font-weight: 300; letter-spacing: -0.04em; color: #0d253d; }
    .recipe-stripe-pricing { display: grid; grid-template-columns: repeat(3,1fr); gap: var(--spacing-grid); }
    .recipe-stripe .card-cream { background: #f5e9d4; border: 1px solid #e3e8ee; }
    .recipe-stripe .card-featured { background: #1c1e54; color: #fff; border: none; }
    .recipe-stripe .card-featured span { color: rgba(255,255,255,.75); }
  `,
  linear: `
    .recipe-linear-panel { border: 1px solid color-mix(in srgb, var(--text) 12%, transparent); border-radius: 12px; overflow: hidden; margin-bottom: var(--spacing-section); box-shadow: var(--elevation-raised); }
    .recipe-linear-chrome { display: flex; gap: 6px; padding: 10px 12px; background: color-mix(in srgb, var(--surface) 95%, #000); border-bottom: 1px solid color-mix(in srgb, var(--text) 10%, transparent); }
    .recipe-linear-chrome span { width: 8px; height: 8px; border-radius: 50%; background: color-mix(in srgb, var(--text) 25%, transparent); }
    .recipe-linear-body { padding: 1.25rem; background: var(--surface); }
  `,
  slack: `
    .recipe-slack { position: relative; }
    .recipe-slack-wash { position: absolute; inset: 0 0 60%; background: radial-gradient(ellipse 70% 50% at 0% 0%, #F4EFFA, transparent 55%); pointer-events: none; }
    .recipe-slack .wrap { position: relative; }
    .recipe-slack-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: var(--spacing-grid); margin-bottom: var(--spacing-section); }
    .recipe-slack .card-lavender { background: #f9f0ff; border: 1px solid #e8e8e8; }
  `,
  spotify: `
    .recipe-spotify-playlists { display: grid; grid-template-columns: repeat(3,1fr); gap: var(--spacing-grid); margin-bottom: var(--spacing-section); }
    .recipe-spotify .card { background: #181818; border: none; box-shadow: var(--elevation-raised); }
    .recipe-spotify .card span { color: #b3b3b3; }
    .recipe-spotify .cta { color: #000 !important; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
  `
}

const ARCHETYPE_GOLDEN_CSS: Partial<Record<BrandHeroArchetype, string>> = {
  'dark-dev': BESPOKE_GOLDEN_CSS.linear ?? '',
  'aubergine-soft': BESPOKE_GOLDEN_CSS.slack ?? '',
  colorful: `
    .recipe-colorful h1 { font-weight: 700; letter-spacing: -0.02em; }
  `,
  'light-clean': `
    .recipe-lightclean .lead { max-width: 36rem; line-height: 1.6; }
  `
}

const SLUG_GOLDEN_CSS: Partial<Record<GoldenBrandSlug, string>> = {
  airbnb: `.recipe-airbnb .grid .card strong { color: #FF385C; }`,
  shopify: `.recipe-shopify .grid .card strong { color: var(--primary); }`,
  supabase: `.recipe-supabase .grid .card strong { color: #3ECF8E; }`,
  cursor: `.recipe-cursor .grid .card strong { color: #F54E00; }`,
  asana: `.recipe-asana .cta { background: #FF4F00 !important; }`
}

/** 品牌样例页额外 CSS */
export function buildGoldenRecipeCss(slug: GoldenBrandSlug): string {
  const bespoke = BESPOKE_GOLDEN_CSS[slug]
  const arch = GOLDEN_ARCHETYPE[slug]
  const archCss = ARCHETYPE_GOLDEN_CSS[arch] ?? ''
  const slugCss = SLUG_GOLDEN_CSS[slug] ?? ''
  return SHARED_GOLDEN_CSS + (bespoke ?? archCss) + slugCss
}

/** 产品预览 layout class（GenericPreviewPage） */
export function getProductRecipeClass(slug: string): string {
  if (!isGoldenBrand(slug)) return ''
  return `recipe-product-${slug}`
}

export function getGoldenArchetype(slug: string): BrandHeroArchetype | '' {
  if (!isGoldenBrand(slug)) return ''
  return GOLDEN_ARCHETYPE[slug]
}
