# Rollout Roadmap

Phased modular integration strategy for the AI-driven design & engineering pipeline.

```mermaid
gantt
    title AI Design Paradigm — phased rollout
    dateFormat  YYYY-MM-DD
    axisFormat  W%V

    section Phase 0 — Prep
    Pick pilot product            :p0a, 2026-06-01, 3d
    Open vendor accounts          :p0b, after p0a, 4d
    Team alignment session        :p0c, after p0a, 5d

    section Phase 1 — Cognition base (courses 1/4/2)
    Reverse-engineer reference tokens :p1a, 2026-06-08, 7d
    Author DESIGN.md (9 modules)      :p1b, after p1a, 7d
    Wire Git SSOT + design.md CLI CI  :p1c, after p1b, 5d
    Phase-1 acceptance                :milestone, m1, after p1c, 0d

    section Phase 2 — Behavior + reproduction (courses 3/5)
    Model XState actors in Stately    :p2a, after m1, 7d
    Tailwind v4 @theme + @xstate wire :p2b, after p2a, 7d
    AI generation pipeline pilot      :p2c, after p2b, 7d
    Phase-2 acceptance                :milestone, m2, after p2c, 0d

    section Phase 3 — Quality immune system (courses 6/7)
    Playwright + Test Agents          :p3a, after m2, 10d
    Chromatic baselines               :p3b, after m2, 7d
    Token diff + Healer feedback loop :p3c, after p3a, 7d
    Phase-3 acceptance                :milestone, m3, after p3c, 0d

    section Phase 4 — Solidify & scale
    Internal starter template         :p4a, after m3, 7d
    ROI dashboard                     :p4b, after m3, 7d
```

## Acceptance criteria per phase

### Phase 1 — Cognition base
- `DESIGN.md` parses, lints WCAG AA, and is the SSOT in CI.
- `tokens/` compiles to four platforms via Style Dictionary.
- Cursor / Claude Code refuses to default to stock Tailwind palette in test prompts.

### Phase 2 — Behavior + reproduction
- A working MVP screen is built end-to-end by an AI agent in ≤ 60 min, using:
  - tokens from `tokens/**`
  - an XState actor from `src/machines/**`
  - and zero raw HEX / arbitrary px.

### Phase 3 — Quality immune system
- A deliberate primary-color shift triggers:
  - `token-diff` PR comment
  - Chromatic visual diff report
  - Healer-proposed locator patches
- Mean time from regression introduction to detection ≤ 10 minutes in CI.

### Phase 4 — Scale
- A second product team adopts the starter template with < 1 day of onboarding.
- ROI dashboard tracks: gen-to-merge time, AI-generated LOC share, escaped UI bugs, Healer fix rate.

## Owners

| Phase | Lead | Supporting teams |
|---|---|---|
| 0 | Engineering Manager | All |
| 1 | Design Ops | Frontend Platform |
| 2 | Frontend Platform | Design Ops |
| 3 | QA | Frontend Platform, Platform |
| 4 | Engineering Manager | All |
