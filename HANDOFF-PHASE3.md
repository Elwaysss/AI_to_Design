# Session Handoff — Phase 3 Progress (2026-06-03)



> **For the next AI agent**: read [HANDOFF.md](HANDOFF.md) → [HANDOFF-PHASE2.md](HANDOFF-PHASE2.md) → **this file** → [AGENTS.md](AGENTS.md).

> User: **Elwaysss**, solo dev, 中文交流. Workspace: `F:\AI Design Paradigm` → GitHub `Elwaysss/AI_to_Design`.



---



## 1. 当前 main 状态



```

0d2c591  feat(supabase): add npm run supabase:init and wire login auth  ← local main HEAD

9b9f0d5  Merge pull request #8 feat/design-from-brand-import

```



| 任务 | 状态 |

|---|---|

| P3.1 Template + `npm run init` | ✅ merged PR #5 |

| P3.2 Chromatic + color bump | ✅ merged PR #6 |

| P3.3 Playwright Test Agents | ✅ merged PR #7 |

| P3.5 `npm run design:from` | ✅ merged PR #8 |

| P3.6 `npm run supabase:init` | ✅ merged (`0d2c591`) |

| P3.7 `npm run vercel:init` | ✅ 已实现（`scripts/vercel-init.mjs`） |

| P3.8 动态 dev 端口 | ✅ `scripts/lib/dev-port.mjs` + vite/playwright 同步 |

| P3.9 personal playbook | 用户目录外 — 见 `docs/phase4/personal-playbook-template.md` |



**Phase 3 脚手架项已全部落地。** 下一步：**Phase 4 product-001**（见 [`docs/phase4/PRODUCT-001.md`](docs/phase4/PRODUCT-001.md)）。



---



## 2. 新增脚本与约定



| 命令 | 作用 |

|---|---|

| `npm run supabase:init` | 链接/创建 Supabase，写 `.env.local`，可选 apply `supabase/schema.sql` |

| `npm run vercel:init` | `vercel link`、写 `vercel.json`、同步 `VITE_*` 到 Vercel env |

| `npm run dev:port` | 打印当前包名对应的 dev 端口（`ai-design-paradigm` → **5264**） |

| `npm run design:validate` | 仅本地 `scripts/validate-design.mjs`（不再 npx `@google/design.md`） |



多产品并行：`npm run dev` 在各 fork 上使用不同端口（`5173 + hash(name) % 1000`）。Playwright `webServer.url` 与 Vite 自动对齐。



---



## 3. 第二个 XState 示例



- [`src/machines/onboardingMachine.ts`](src/machines/onboardingMachine.ts) — welcome → choosingTheme → complete

- [`src/components/OnboardingPanel.vue`](src/components/OnboardingPanel.vue) — App 内 LoginForm 下方展示

- [`tests/e2e/onboarding.spec.ts`](tests/e2e/onboarding.spec.ts)



---



## 4. Test Agents 制度化



见 [`docs/test-agents-workflow.md`](docs/test-agents-workflow.md)：新屏必须 Planner → Generator → 人工审 locator；Healer 仅修 locator 漂移。



---



## 5. 本地验证 checklist



```powershell

git checkout main

npm run tokens:build

npm run design:validate

npx vue-tsc -b

$env:CI = "1"

npm run test:e2e -- --project=chromium   # 6 passed, 1 skipped (seed)

Remove-Item Env:CI

npm run dev:port   # 5264 for this repo

```



### e2e 超时坑



若全 30s timeout → `$env:CI='1'` 或 `taskkill` 占端口的 node 进程。端口不再是固定 5173，用 `npm run dev:port` 确认。



---



## 6. MCP 状态



| MCP | 状态 |

|---|---|

| **playwright-test** | ✅ |

| **mermaid** | ✅ |

| **stately** | ❌ npm 404 — 用 [stately.ai](https://stately.ai) 粘贴 machine 文件 |



---



## 7. Phase 4 入口



1. GitHub → **Use this template** → 新 repo  

2. `npm install` → `npm run init` → `npm run design:from`（可选）  

3. `npm run supabase:init` → `npm run vercel:init`  

4. 按 [`docs/phase4/PRODUCT-001.md`](docs/phase4/PRODUCT-001.md) 跟踪工期与 ROI  



---



## 8. 新窗口开场白



> 读 `HANDOFF.md`、`HANDOFF-PHASE2.md`、`HANDOFF-PHASE3.md`。main 含 P3.1–P3.8。Phase 4：fork template 做 product-001，用 `docs/phase4/PRODUCT-001.md` 记天数。



---



*End of Phase 3 handoff — updated 2026-06-03.*

