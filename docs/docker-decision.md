# Docker — When Do You Actually Need It?

The strategy report recommends Docker for "rendering consistency". Below is
the honest, opinionated answer about whether **you** need it right now.

## TL;DR

| Scenario | Need Docker? |
|---|---|
| You run visual regression entirely on Chromatic + GitHub Actions | ❌ No |
| You want pixel-exact reproducibility of failing CI runs *locally* | ✅ Yes |
| You want to self-host the browser farm to avoid sending screenshots to a SaaS | ✅ Yes |
| You're on Windows and CI runs on Ubuntu, and you keep hitting font-rendering drift on local snapshots | ✅ Yes |
| You're early-stage, solo, just trying to ship | ❌ No — defer |

For your current setup (Windows + Chromatic + GitHub Actions), **you do not
need Docker today**. Chromatic runs the actual screenshot comparison on their
cloud, against a normalized rendering environment they control. The only thing
your local machine does is drive Playwright; rendering differences between
your Win11 machine and Chromatic's Ubuntu workers are absorbed by Chromatic's
own anti-flake layer.

## When the answer flips to "yes"

You'll feel the pain — don't preempt it. The signal is one or more of:

1. **A test passes on your machine but fails in CI** because of font rasterizer
   differences (Windows DirectWrite vs Linux FreeType). At that point you want
   to be able to run the same browser image locally to reproduce.
2. **You're processing sensitive screenshots** and can't send them off-prem.
   You'd self-host Chromatic alternatives (Storybook test runner, Lost-Pixel,
   etc.) inside your own Docker registry.
3. **Multiple devs / CI runners** must produce byte-identical screenshots so
   you can promote baselines across machines.

## What to install when the time comes

```powershell
# 1. Docker Desktop for Windows — needs WSL2 enabled.
winget install --id Docker.DockerDesktop -e

# 2. Pull Playwright's pinned image (matches the binaries used by --with-deps).
docker pull mcr.microsoft.com/playwright:v1.50.0-jammy

# 3. Run your test suite inside it.
docker run --rm `
  -v "F:\AI Design Paradigm\AI_to_design:/work" `
  -w /work `
  mcr.microsoft.com/playwright:v1.50.0-jammy `
  npx playwright test
```

The image bundles the exact Chromium / WebKit binaries Playwright was built
against, which kills 90 % of the "renders differently on my laptop" class of
bugs.

## What to NOT do

- Don't dockerize the Vite dev server. HMR through bind mounts on Windows is
  slow and offers no consistency win.
- Don't dockerize Cursor or the MCP servers. They're meant to be local agents
  with native IDE integration.
- Don't pin a Playwright image version that drifts from your `@playwright/test`
  npm version. Keep them in lockstep (script: `npm ls @playwright/test`).

## Conclusion

Skip Docker until a real regression forces the issue. The starter kit's CI
runs on Ubuntu runners which is already a controlled environment, and
Chromatic handles the cross-platform rendering reconciliation.

Revisit this doc when you can answer "yes" to at least one of the
*"When the answer flips to yes"* bullets above.
