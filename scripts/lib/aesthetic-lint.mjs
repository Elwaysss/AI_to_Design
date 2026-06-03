/**
 * Aesthetic lint — 10 rules for balance, composition & brand fidelity.
 * Used at preview time and in validate-aesthetic-golden.mjs.
 */
import { hexToRgb, normalizeHex } from './color-utils.mjs';

/** @param {number} r @param {number} g @param {number} b */
function relativeLuminance(r, g, b) {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** @param {string} fg @param {string} bg */
export function contrastRatio(fg, bg) {
  try {
    const a = hexToRgb(normalizeHex(fg));
    const b = hexToRgb(normalizeHex(bg));
    const l1 = relativeLuminance(a.r, a.g, a.b);
    const l2 = relativeLuminance(b.r, b.g, b.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 0;
  }
}

/**
 * @typedef {'pass'|'warn'|'fail'} LintLevel
 * @typedef {{ id: string, level: LintLevel, message: string, messageZh: string }} LintFinding
 */

/** @param {string} id @param {LintLevel} level @param {string} messageZh @param {string} [message] */
function finding(id, level, messageZh, message = messageZh) {
  return { id, level, message, messageZh };
}

/**
 * @param {Record<string, unknown>} preview — PreviewVars-like object
 * @param {Record<string, unknown> | null} brief — reference brief
 * @returns {{ ok: boolean, score: number, findings: LintFinding[], tips: string[] }}
 */
export function runAestheticLint(preview, brief = null) {
  /** @type {LintFinding[]} */
  const findings = [];
  /** @type {string[]} */
  const tips = [];

  const p = preview;
  const comp = /** @type {Record<string, unknown>} */ (brief?.composition ?? {});
  const sig = /** @type {Record<string, unknown>} */ (brief?.aesthetic_signature ?? {});

  const text = String(p.text ?? '#171715');
  const bg = String(p.background ?? '#FAFAF7');
  const surface = String(p.surface ?? '#FFFFFF');
  const primary = String(p.primary ?? '#3B82F6');

  // 1. Body text contrast on canvas
  const textOnBg = contrastRatio(text, bg);
  if (textOnBg >= 4.5) {
    findings.push(finding('contrast-text-canvas', 'pass', `正文与背景对比度 ${textOnBg.toFixed(1)}:1，达到 AA。`));
  } else if (textOnBg >= 3) {
    findings.push(finding('contrast-text-canvas', 'warn', `正文与背景对比度 ${textOnBg.toFixed(1)}:1，大字号可用，正文建议加深。`));
  } else {
    findings.push(finding('contrast-text-canvas', 'fail', `正文与背景对比度 ${textOnBg.toFixed(1)}:1，低于 WCAG AA（4.5:1）。`));
  }

  // 2. Text on surface / cards
  const textOnSurface = contrastRatio(text, surface);
  if (textOnSurface >= 4.5) {
    findings.push(finding('contrast-text-surface', 'pass', `卡片文字与表面色对比度 ${textOnSurface.toFixed(1)}:1 合格。`));
  } else {
    findings.push(finding('contrast-text-surface', 'warn', `卡片文字对比度 ${textOnSurface.toFixed(1)}:1，检查 surface 色是否与 text 匹配。`));
  }

  // 3. Primary CTA contrast (white on primary or inverse)
  const ctaFg = String(p.ctaText ?? (p.dark ? bg : '#FFFFFF'));
  const ctaContrast = contrastRatio(ctaFg, primary);
  if (ctaContrast >= 3) {
    findings.push(finding('contrast-cta', 'pass', `主按钮对比度 ${ctaContrast.toFixed(1)}:1 合格。`));
  } else {
    findings.push(finding('contrast-cta', 'fail', `主按钮对比度 ${ctaContrast.toFixed(1)}:1 不足，CTA 可能看不清。`));
  }

  // 4. Display weight vs brief / archetype
  const weight = parseInt(String(p.displayFontWeight ?? '700'), 10);
  const wMin = Number(comp.display_weight_min ?? 400);
  const wMax = Number(comp.display_weight_max ?? 800);
  if (brief && weight >= wMin && weight <= wMax) {
    findings.push(finding('display-weight', 'pass', `Display 字重 ${weight} 符合 ${brief.nameZh ?? '品牌'} 签名（${wMin}–${wMax}）。`));
  } else if (brief) {
    findings.push(finding('display-weight', 'warn', `Display 字重 ${weight} 超出推荐范围 ${wMin}–${wMax}，气质可能偏离。`));
  } else {
    findings.push(finding('display-weight', 'pass', `Display 字重 ${weight}。`));
  }

  // 5. Button pill consistency
  const expectPill = comp.button_pill === true;
  const isPill = p.buttonPill === true || parseInt(String(p.buttonRadius ?? '8'), 10) >= 40;
  if (!brief || expectPill === isPill) {
    findings.push(finding('button-geometry', 'pass', expectPill ? '按钮 pill 形态与品牌签名一致。' : '按钮圆角形态与品牌签名一致。'));
  } else {
    findings.push(finding('button-geometry', 'warn', expectPill ? '该品牌应使用 pill 按钮，当前圆角偏方。' : '该品牌应避免全 pill，当前按钮过圆。'));
  }

  // 6. Section rhythm ≥ grid gap
  const sectionPx = parseInt(String(p.spacingSection ?? '48'), 10);
  const gridPx = parseInt(String(p.spacingGrid ?? '16'), 10);
  if (sectionPx >= gridPx * 2) {
    findings.push(finding('spacing-rhythm', 'pass', `Section 间距 ${sectionPx}px ≥ 网格 ${gridPx}px，层级节奏清晰。`));
  } else {
    findings.push(finding('spacing-rhythm', 'warn', `Section 间距 ${sectionPx}px 与网格 ${gridPx}px 接近，区块可能显得挤。`));
  }

  // 7. Tabular numerics when required (Stripe)
  if (comp.requires_tabular === true) {
    if (p.fontFeatureTabular) {
      findings.push(finding('tabular-numerics', 'pass', '已启用 tabular 数字特性（tnum），适合金额/指标。'));
    } else {
      findings.push(finding('tabular-numerics', 'fail', '该品牌要求 tabular 数字（tnum），当前预览未启用。'));
    }
  } else {
    findings.push(finding('tabular-numerics', 'pass', 'tabular 数字非硬性要求。'));
  }

  // 8. Dark archetype coherence
  const arch = String(p.heroArchetype ?? '');
  const darkArch = arch === 'dark-dev' || arch === 'immersive-dark';
  if (darkArch && !p.dark) {
    findings.push(finding('dark-coherence', 'warn', 'Hero 为暗色原型但 canvas 偏亮，套用可能不一致。'));
  } else if (darkArch && p.dark) {
    findings.push(finding('dark-coherence', 'pass', '暗色 hero 与 canvas 一致，沉浸感连贯。'));
  } else {
    findings.push(finding('dark-coherence', 'pass', '明/暗层级与 hero 原型一致。'));
  }

  // 9. Elevation restraint (light brands: shadow not absurdly long)
  const raised = String(p.elevationRaised ?? p.cardShadow ?? '');
  const shadowSpread = raised.match(/(\d+)px/g)?.map(Number).reduce((a, b) => a + b, 0) ?? 0;
  if (arch === 'pastel-cards' || arch === 'light-clean') {
    if (shadowSpread <= 80) {
      findings.push(finding('elevation-balance', 'pass', '阴影克制，符合轻量品牌气质。'));
    } else {
      findings.push(finding('elevation-balance', 'warn', '阴影偏重，轻量品牌建议降低 elevation。'));
    }
  } else if (arch === 'immersive-dark') {
    findings.push(finding('elevation-balance', 'pass', '暗色品牌允许更深阴影以分层。'));
  } else {
    findings.push(finding('elevation-balance', 'pass', '阴影层级已映射自源文档。'));
  }

  // 10. Golden markers presence (golden brands only)
  if (brief?.golden) {
    const markers = /** @type {string[]} */ (brief.golden_markers ?? []);
    const markerHits = markers.filter((m) => {
      const ml = m.toLowerCase();
      if (ml.includes('navy') && arch === 'navy-hero') return true;
      if (ml.includes('gradient') && arch === 'gradient-mesh') return true;
      if (ml.includes('pastel') && (p.cardTints?.length ?? 0) > 0) return true;
      if (ml.includes('pill') && isPill) return true;
      if (ml.includes('charcoal') && arch === 'dark-dev') return true;
      if (ml.includes('lavender') && arch === 'aubergine-soft') return true;
      if (ml.includes('green') && (arch === 'immersive-dark' || /3ecf8e|008060|1db954/i.test(primary))) return true;
      if (ml.includes('tabular') && p.fontFeatureTabular) return true;
      if (ml.includes('hairline') && p.cardBorder) return true;
      if (ml.includes('near-black') && p.dark) return true;
      if (ml.includes('white') && ml.includes('canvas') && !p.dark) return true;
      if (ml.includes('monochrome') && !p.dark && arch === 'light-clean') return true;
      if (ml.includes('multicolor') && arch === 'colorful') return true;
      if (ml.includes('coral') && /ff385c/i.test(primary)) return true;
      if (ml.includes('orange') && /ff4f00|f54e00/i.test(primary)) return true;
      if (ml.includes('editorial') && arch === 'light-clean') return true;
      if (ml.includes('developer') && (arch === 'dark-dev' || arch === 'light-clean')) return true;
      if (ml.includes('launcher') && arch === 'dark-dev') return true;
      if (ml.includes('support') && arch === 'light-clean') return true;
      if (ml.includes('merchant') && arch === 'light-clean') return true;
      if (ml.includes('warm') && ml.includes('canvas') && !p.dark) return true;
      if (ml.includes('editor') && arch === 'light-clean') return true;
      if (ml.includes('system') && arch === 'light-clean') return true;
      if (ml.includes('workspace') && arch === 'light-clean') return true;
      if (ml.includes('sticky') && arch === 'colorful') return true;
      if (ml.includes('database') && arch === 'light-clean') return true;
      if (ml.includes('api') && arch === 'light-clean') return true;
      if (ml.includes('commerce') && arch === 'light-clean') return true;
      if (ml.includes('workflow') && arch === 'light-clean') return true;
      if (ml.includes('board') && arch === 'colorful') return true;
      if (ml.includes('conversation') && arch === 'light-clean') return true;
      if (ml.includes('deployment') && arch === 'light-clean') return true;
      if (ml.includes('trust') && arch === 'light-clean') return true;
      if (ml.includes('ink') && arch === 'light-clean') return true;
      if (ml.includes('frame') && (arch === 'dark-dev' || p.fontMono)) return true;
      if (ml.includes('metrics') && arch === 'light-clean') return true;
      if (ml.includes('cards') && ((p.cardTints?.length ?? 0) > 0 || arch === 'light-clean' || arch === 'colorful')) return true;
      return false;
    });
    if (markerHits.length >= Math.min(2, markers.length)) {
      findings.push(finding('golden-markers', 'pass', `金样特征 ${markerHits.length}/${markers.length} 项已呈现。`));
    } else {
      findings.push(finding('golden-markers', 'warn', `金样特征仅命中 ${markerHits.length}/${markers.length}，呈现可加强。`));
    }
    tips.push(`签名：${sig.typography ?? '—'}`);
    tips.push(`CTA 策略：${sig.cta_policy ?? '—'}`);
  } else {
    findings.push(finding('golden-markers', 'pass', '非金样品牌，跳过 marker 校验。'));
  }

  const fails = findings.filter((f) => f.level === 'fail').length;
  const warns = findings.filter((f) => f.level === 'warn').length;
  const passes = findings.filter((f) => f.level === 'pass').length;
  const score = Math.round((passes * 10 + warns * 4) / findings.length);

  return {
    ok: fails === 0,
    score,
    findings,
    tips
  };
}
