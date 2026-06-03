# dev-platform-web — 交互与界面设计模块 MVP

软件开发平台第二阶段：选风格 → 两步预览 → 导出 DESIGN.md / tokens / 示例页。

## 开发

```bash
cd products/dev-platform-web
npm install
npm run dev
```

打开根路由 `/` 进入设计模块。预览 API 仅在 `npm run dev` 下可用。

## 导出

界面点击「确认风格」，或 CLI：

```bash
# 美学
node ../../scripts/skill-to-design.mjs glassmorphism --notes "专业、克制"

# 验证（输出在 output/demo-saas/，不碰 Paradigm 根模板）
npm run design:validate
```

## 结构

| 路径 | 说明 |
|------|------|
| `src/pages/DesignModulePage.vue` | 主界面（双标签 + 预览 + 确认） |
| `src/components/preview/GenericPreviewPage.vue` | 夹具工作台预览 |
| `src/fixtures/generic-product-spec.json` | 演示 SaaS Spec |
| `output/demo-saas/` | 导出产物（DESIGN.md、tokens、示例页） |

根目录 `style-presets/catalog.json` 为风格卡片数据源。

## 依赖

- `awesome-design-skills-main/` — 美学 SKILL.md
- `awesome-design-md-main/`（可选）— 品牌 DESIGN.md；无本地克隆时走 GitHub API
