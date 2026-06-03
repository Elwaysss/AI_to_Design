# Components

Token-driven Vue 3 SFCs. See `DESIGN.md` § 4 and `tokens/components/` for variants.

| Component | Machine | E2E spec | Notes |
|---|---|---|---|
| `LoginForm.vue` | `loginMachine.ts` | `tests/e2e/login.spec.ts` | Canonical auth demo |
| `OnboardingPanel.vue` | `onboardingMachine.ts` | `tests/e2e/onboarding.spec.ts` | Second multi-step flow |
| `HelloWorld.vue` | — | — | Phase 1 token smoke reference (not routed in App) |

New screens: add machine (if ≥ 3 transitions) + component + Playwright spec per `AGENTS.md`.
