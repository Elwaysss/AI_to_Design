export type StyleTab = 'aesthetic' | 'brand'

export interface AestheticPreset {
  id: string
  slug: string
  nameZh: string
  summaryZh: string
  source: string
  visualStyle: string[]
}

export interface BrandPreset {
  id: string
  slug: string
  nameZh: string
  summaryZh: string
}

export interface StyleCatalog {
  version: string
  updatedAt: string
  aesthetic: AestheticPreset[]
  brand: BrandPreset[]
}

export interface StyleSelection {
  tab: StyleTab
  id: string
  slug: string
  nameZh: string
}

export type BrandHeroArchetype =
  | 'gradient-mesh'
  | 'dark-dev'
  | 'navy-hero'
  | 'pastel-cards'
  | 'immersive-dark'
  | 'aubergine-soft'
  | 'light-clean'
  | 'colorful'

/** 从 awesome-design-md components 提取的单组件样式 */
export interface ComponentSampleStyle {
  background?: string
  color?: string
  border?: string
  borderRadius?: string
  padding?: string
  height?: string
  label?: string
}

/** 从 awesome-design-md YAML / prose 提取的品牌预览 chrome */
export interface BrandPreviewChrome {
  heroArchetype?: BrandHeroArchetype
  resolvedSlug?: string
  buttonRadius?: string
  cardRadius?: string
  buttonPill?: boolean
  buttonPadding?: string
  buttonUppercase?: boolean
  buttonLetterSpacing?: string
  cardBorder?: string
  cardShadow?: string
  cardTints?: string[]
  displayFontWeight?: string
  displayLetterSpacing?: string
  secondaryCtaStyle?: 'outline' | 'ghost' | 'none'
  heroAccent?: string
  /** P0 — spacing rhythm */
  spacingGrid?: string
  spacingWrap?: string
  spacingSection?: string
  /** P0 — elevation layers */
  elevationFlat?: string
  elevationRaised?: string
  elevationHigh?: string
  elevationCard?: string
  /** P0 — typography extras */
  fontMono?: string
  fontSizeBody?: string
  fontSizeCaption?: string
  fontFeatureTabular?: string
  fontFeatureStylistic?: string
  /** P0 — component samples from YAML */
  sampleNav?: ComponentSampleStyle
  sampleInput?: ComponentSampleStyle
  sampleBadge?: ComponentSampleStyle
  sampleSecondaryButton?: ComponentSampleStyle
}

export interface PreviewVars extends BrandPreviewChrome {
  slug: string
  kind: 'aesthetic' | 'brand'
  visualStyle: string[]
  primary: string
  primaryHover: string
  background: string
  surface: string
  text: string
  textMuted: string
  /** 主按钮上的文字色（按 primary 对比度自动选黑/白） */
  ctaText?: string
  /** 卡片/侧栏表面上的正文色 */
  textOnSurface?: string
  /** 卡片/侧栏表面上的辅助色 */
  textMutedOnSurface?: string
  success: string
  warning: string
  danger: string
  fontBody: string
  fontDisplay: string
  radius: string
  dark: boolean
  glass: boolean
}

export type PreviewMode = 'sample' | 'product'

export type LintLevel = 'pass' | 'warn' | 'fail'

export interface LintFinding {
  id: string
  level: LintLevel
  message: string
  messageZh: string
}

export interface AestheticLintResult {
  ok: boolean
  score: number
  findings: LintFinding[]
  tips: string[]
}

export interface ReferenceBrief {
  golden?: boolean
  nameZh?: string
  pageRecipe?: string
  productRecipe?: string
  aesthetic_signature?: Record<string, string>
  composition?: Record<string, unknown>
  anti_patterns?: string[]
  golden_markers?: string[]
}
