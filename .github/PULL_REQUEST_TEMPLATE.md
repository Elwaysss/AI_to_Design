## What changed
<!-- 1–2 sentences. Why, not what. -->

## Affected layers (check all that apply)
- [ ] `DESIGN.md` (which section?)
- [ ] `tokens/base/**`
- [ ] `tokens/semantic/**`
- [ ] `tokens/components/**`
- [ ] `src/machines/**`
- [ ] `src/components/**`
- [ ] Tests / CI

## Affected components / screens
<!--
If you touched any token, list every component that consumes it.
Use the token-diff comment that the bot will post for assistance.
-->

## Verification
- [ ] `npm run design:validate` passes
- [ ] `npm run tokens:build` passes
- [ ] `npm run test:e2e` passes locally
- [ ] Chromatic visual diff reviewed (or PR has no UI impact)
- [ ] CODEOWNER reviewer on every touched directory

## Notes for reviewers
<!-- Optional. Migration steps, deprecations, breaking changes. -->
