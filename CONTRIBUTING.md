# Contributing

## Branch Strategy

| Branch prefix | Purpose | Reviewer set |
|---|---|---|
| `main` | Protected, deploy-ready | CODEOWNERS |
| `design/<topic>` | Changes to `DESIGN.md` or `tokens/**` | `@org/design-ops` |
| `feat/<topic>` | Feature work | `@org/frontend-platform` |
| `fix/<topic>` | Bug fix | Affected CODEOWNERS |
| `chore/<topic>` | Tooling / infra | `@org/platform` |

## PR Checklist (also in `.github/PULL_REQUEST_TEMPLATE.md`)

- [ ] You have read `AGENTS.md` and the relevant section of `DESIGN.md`.
- [ ] If you touched `tokens/**` or `DESIGN.md`, you listed affected components & tests.
- [ ] `npm run design:validate` passes locally.
- [ ] `npm run tokens:build` passes locally.
- [ ] `npm run test:e2e` passes locally (or has a known-failing tracked issue).
- [ ] Chromatic visual diff has been reviewed (if any UI changed).
- [ ] At least one CODEOWNER reviewer per touched directory.

## Commit Conventions

Conventional Commits, with extra scopes for the design pipeline:

- `feat(button): add ghost variant`
- `design(color): bump primary-hover contrast to AA`
- `tokens(spacing): introduce 20 px step for compact tables`
- `machines(login): cover OTP timeout transition`
- `fix(card): correct elevation token reference`
- `chore(ci): bump Playwright to 1.51`

## Local Development

```bash
# 1. Install
npm install

# 2. Compile tokens whenever tokens/** or DESIGN.md changes
npm run tokens:build

# 3. Validate semantic dictionary
npm run design:validate

# 4. Run tests
npm run test:e2e
```

## When in doubt

Open an issue with the label `design-ops:question` and tag `@org/design-ops`.
Do **not** force a design change through to unblock a feature — the SSOT must remain coherent.
