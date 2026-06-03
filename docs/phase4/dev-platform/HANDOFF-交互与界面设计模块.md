# 会话交接 — 交互与界面设计模块

> **给下一个窗口 / AI 助手：请先读本文，再按需读代码。**  
> 更新时间：**2026-06-03**（进度已保存至 git）  
> 用户：**Elwaysss**，中文交流。仓库：`F:\AI Design Paradigm` → GitHub `Elwaysss/AI_to_Design`。

---

## 1. 当前状态（MVP 已落地）

**产品路径**：`products/dev-platform-web/`（Vite + Vue 3 + XState）

| 能力 | 状态 |
|------|------|
| 双 Tab（美学 18 + 品牌 22） | ✅ |
| 两步预览（样例 iframe → 工作台 GenericPreviewPage） | ✅ |
| 导出 DESIGN.md + tokens + Dashboard 示例页 | ✅ |
| 22 品牌 reference brief + 金样页模板 | ✅ |
| 审美 lint（10 条，**仅 CLI**，UI 已隐藏） | ✅ |
| 对比度 normalize（深色品牌 / 玻璃拟态） | ✅ |

**约束仍有效**：不修改 Paradigm 根 `DESIGN.md`、`tokens/`、`src/App.vue`。

---

## 2. 本窗口已完成（2026-06-03）

### 品牌与预览
- **22 品牌** 全部扩展为金样（`style-presets/reference-briefs.json` + `pageRecipes.ts`）
- 品牌 catalog **去掉「类似」** 前缀（`Notion` 而非 `类似 Notion`）
- UI **去掉「金样」徽章** 与 **审美检查面板**（后台仍可用 `npm run aesthetic:validate-golden`）
- **Notion** 样例页排版修复（hero 负边距导致横向溢出、kicker 对比度）
- **Shopify / Dropbox** 左侧缩略图与右侧预览对齐（heroArchetype 与 canvas 亮度 reconcile）
- **深色品牌**（Linear 等）产品预览分层用色：`textOnSurface` / `ctaText`（`preview-color-normalize.mjs`）
- **玻璃拟态** 应用到产品：暗色 canvas + 浅色字（`previewThemeAlign.ts` + `theme-glassmorphism` CSS）

### 关键文件

| 用途 | 路径 |
|------|------|
| 设计模块 UI | `products/dev-platform-web/src/pages/DesignModulePage.vue` |
| 产品预览 | `products/dev-platform-web/src/components/preview/GenericPreviewPage.vue` |
| 品牌样例页 | `products/dev-platform-web/src/lib/pageRecipes.ts` |
| 主题 / 缩略图 | `products/dev-platform-web/src/lib/styleThemes.ts` |
| 预览 CSS 变量 | `products/dev-platform-web/src/lib/previewTokens.ts` |
| 美学主题对齐 | `products/dev-platform-web/src/lib/previewThemeAlign.ts` |
| 对比度 normalize | `scripts/lib/preview-color-normalize.mjs` |
| 品牌 hero 推断 | `scripts/lib/brand-preview-extract.mjs` |
| 审美 lint | `scripts/lib/aesthetic-lint.mjs` |
| 金样 brief | `style-presets/reference-briefs.json` |
| 风格 catalog | `style-presets/catalog.json` |

---

## 3. 本地验证

```powershell
cd products/dev-platform-web
npm install
npm run dev

# 另开终端
cd products/dev-platform-web
npm run build

# 仓库根目录
node scripts/validate-aesthetic-golden.mjs   # 22 品牌 aesthetic lint
npm run design:validate                       # 若已配置
```

---

## 4. 已知注意点

- Windows PowerShell 链式命令用 `;` 不用 `&&`
- 预览 API 仅返回 `{ preview }`，不含 aestheticLint（UI 不需要）
- 部分品牌 catalog slug 与 awesome-design-md 源 slug 不同（如 `dropbox` → `airtable`），见 `scripts/lib/brand-source.mjs` `BRAND_ALIASES`
- `aesthetic:validate-golden` 在 `products/dev-platform-web/package.json`：`npm run aesthetic:validate-golden`

---

## 5. 建议下一窗口优先项（可选）

1. 其他美学风格（neon / cosmic / futuristic）产品预览对比度 spot-check
2. 样例 iframe 与产品预览在更多品牌上的视觉 parity
3. 导出示例页与 GenericPreviewPage 样式进一步统一
4. 若用户要推远程：`git push`（当前 commit 在 local main）

---

## 6. 新窗口建议开场白

```
请读 docs/phase4/dev-platform/HANDOFF-交互与界面设计模块.md

继续 dev-platform-web 交互与界面设计模块；MVP 已在 products/dev-platform-web。
约束：不影响 Paradigm 根模板。
```

---

*End of handoff — 交互与界面设计模块.*
