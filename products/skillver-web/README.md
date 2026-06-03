# Skillver Web — V2.1

UI/UE 以 **`skillver test.md`（V2.1 白皮书）** 为唯一规范，已移除此前双主题 / Neo / Style-Dictionary 驱动的换肤实验。

## 启动

```bash
cd products/skillver-web
npm install
npm run dev
```

样式 SSOT：`src/style.css`（**Glassmorphism Pro**：渐变底 + `glass-panel` + `#1856FF`）+ `DESIGN.md`。

## 规范文档

- 工程契约：`DESIGN.md`
- 完整矩阵：`docs/phase4/skillver/V2.1-CANONICAL.md`（从桌面白皮书同步）

## 三端壳层

| 端 | 侧栏宽 | 默认首页 |
|----|--------|----------|
| 人才 | 288px | `/talent` 求职助手 |
| 企业 | 240px | `/enterprise` 招聘助手 |
| Console | — | 表格看板，无 Copilot |

## 演示

- 首页 → 人才/企业登录
- `/login/platform` → 运营或 Super Admin（KAE 菜单）
- 核验页底部「演示」按钮切换 6 种状态变体
- 沟通页顶部切换终面联动状态
