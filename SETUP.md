# Local Setup & Verification Checklist

> **Layout** (Option A — flattened): the workspace root `F:\AI Design Paradigm\`
> IS the Git repository. The pre-migration Vite scaffold at `AI_to_design\` will be
> deleted by `migrate.ps1` in step 2.

Run each block in **PowerShell** from `F:\AI Design Paradigm`.

---

## 0. Sanity check the environment

```powershell
cd "F:\AI Design Paradigm"
node -v        # expected: v20.x or v22.x
npm -v         # expected: 10.x+
git --version  # expected: git version 2.40+
```

If `node` is < 20, install LTS from <https://nodejs.org/>.

---

## 1. Verify the third-party reference clones

```powershell
Get-ChildItem -Directory | Select-Object Name
# Expected to include:
#   AI_to_design               <- will be deleted by migrate.ps1
#   awesome-design-md-main     <- reference, gitignored
#   style-dictionary-main      <- reference, gitignored
#   xstate-main                <- reference, gitignored
#   docs / scripts / src / tokens / .github / .cursor   (already in place)
```

The three `*-main\` clones are referenced by `.gitignore` so they stay on
disk for browsing but won't be committed.

---

## 2. Run the migration script

The agent already wrote `vite.config.ts`, `tsconfig*.json`, `package.json`,
`index.html`, `src/main.ts`, `src/App.vue`, and `src/components/HelloWorld.vue`
at the workspace root. The migration script just moves the SVG/PNG assets
that the agent can't safely rewrite, then wipes `AI_to_design\` and reinstalls.

```powershell
powershell -ExecutionPolicy Bypass -File .\migrate.ps1
```

Expected output ends with:

```
==> Tokens compiled OK: dist\css\variables.css exists.
==> Migration complete.
```

If `npm install` fails because of registry / proxy issues, see "troubleshooting"
at the bottom of this file.

---

## 3. Verify @google/design.md availability (the package I wasn't sure exists)

```powershell
npm view @google/design.md version
```

| Result | Meaning | Action |
|---|---|---|
| Prints a version number | Package is real and usable | Nothing — `design:validate` will use the CLI |
| `npm error 404` | Package not on npm under this name | `design:validate` script already falls back to `scripts\validate-design.mjs` |
| Network error | Check `npm config get registry` | Use local fallback above |

---

## 4. Phase 1 smoke test

```powershell
npm run tokens:build
# Expected: Builds files in dist\css\, dist\tailwind\, dist\js\, dist\ios\, dist\android\

npm run design:validate
# Expected: ✔ DESIGN.md passed local validation (XX HEX values, 9 sections).

npm run dev
# Expected: Vite dev server on http://127.0.0.1:<port>  (npm run dev:port)
```

Run `npm run dev:port` for the URL (starter default was 5173; hashed port may differ).
Open that URL. You should see:

- A "Vite + Vue + DESIGN.md" heading in Inter Tight (display font).
- A button with **Boston Clay (#B8422E)** background.
- Hovering darkens it to the `--token-color-brand-primary-hover` variant.

If you see the dark-red button → **Phase 1 token pipeline is live**.

If you see an unstyled button or a default Tailwind blue → see "troubleshooting".

---

## 5. Connect to GitHub remote

```powershell
git init
git branch -M main
git remote add origin https://github.com/Elwaysss/AI_to_Design.git
git add .
git commit -m "chore: bootstrap AI design paradigm (Phase 0/1)"
git push -u origin main
```

If the remote already has commits (e.g. a README created on GitHub):

```powershell
git pull --rebase --allow-unrelated-histories origin main
git push -u origin main
```

After this push, the three CI workflows in `.github/workflows/` will fire on
your next PR. The first push to `main` doesn't trigger most of them (they're
PR-scoped) — open a small test PR to verify.

---

## 6. Verify Cursor sees the MCP servers

1. **Close and reopen Cursor** so the new `.cursor/mcp.json` is loaded.
2. Command palette → **MCP: Show Servers** → both `mermaid` and `stately`
   should be listed and running.
3. In a fresh chat, ask:
   *"Validate this Mermaid diagram and render it as SVG: `graph LR; A-->B`"*.
   The agent should call the `mermaid` tool and return a rendered SVG.

See `docs/mcp-setup.md` for troubleshooting + how to swap in different
Mermaid MCP packages.

---

## 7. Quick token-bump round trip (proves Phase 1 + 3 wiring)

```powershell
# Branch:
git checkout -b design/test-primary-bump

# Edit tokens/base/color.json — change clay.500 from #B8422E to #C04F38.
# Then:
npm run tokens:build
npm run design:validate
npm run dev   # button color should now be a slightly redder #C04F38

git add tokens/base/color.json
git commit -m "design(color): test primary bump"
git push -u origin design/test-primary-bump
```

Open a PR on GitHub. You should see:

- `design.md validate` workflow runs green.
- `token diff` workflow posts a comment showing the HEX delta.
- (Optional) `visual regression` workflow uploads to Chromatic if `CHROMATIC_PROJECT_TOKEN` secret is set.

---

## 8. (Phase 2 prep — not needed for Phase 1 demo)

Reference templates already on disk:

| Need | Where |
|---|---|
| Vue + Vite + XState scaffold | `xstate-main\templates\vue-ts\` |
| Style Dictionary example projects | `style-dictionary-main\examples\` |
| Industry DESIGN.md examples (Notion, Cursor, Supabase, etc.) | `awesome-design-md-main\design-md\` |

When you write a new flow, copy a relevant `*Machine.ts` from
`xstate-main\templates\vue-ts\src\` into `src\machines\` and wire it via
`@xstate/vue`'s `useMachine` composable.

---

## 9. Template repository + `npm run init` (Phase 3)

Use this repo as a **GitHub Template** to spin up new side products.

### Enable template mode (one-time, on the starter repo)

1. GitHub → **Settings** → **General**
2. Check **Template repository**
3. (Optional, later) Rename repo to `ai-design-paradigm-starter`

### Start a new product

```powershell
# On GitHub: "Use this template" → create repo → clone
cd "path\to\your-new-product"
npm install
npm run init
```

The init script asks:

| Prompt | Default | Notes |
|---|---|---|
| Product display name | — | e.g. `Reading List` |
| npm package slug | kebab-case of name | e.g. `reading-list` |
| Brand primary color | `#B8422E` | `#RRGGBB` format |
| Brand template import | skip | Brand slug — runs `npm run design:from <slug>` |
| Remove demo components? | No | Yes or `--strip-demo` for blank shell |

### Import a brand design (`design:from`)

Apply one of ~73 industry DESIGN.md templates from
[voltagent/awesome-design-md](https://github.com/voltagent/awesome-design-md):

```powershell
# List available brands
npm run design:from -- --list

# Import Notion brand (fetches from GitHub if no local clone)
npm run design:from -- notion

# Preview without writing
npm run design:from -- cursor --dry-run

# Overwrite previous import
npm run design:from -- stripe --force
```

Optional offline clone (faster, no network):

```powershell
git clone --depth 1 https://github.com/voltagent/awesome-design-md.git awesome-design-md-main
```

`design:from` rewrites `DESIGN.md`, `tokens/base/color.json`, `tokens/base/typography.json`,
and syncs the login spec brand-primary RGB assertion. Then run `npm run tokens:build`.

You can also import during `npm run init` — when prompted for brand slug, enter e.g. `notion`
instead of `skip`.

Non-interactive example:

```powershell
npm run init -- --name "Reading List" --slug reading-list --color "#2563EB" --force
npm run init -- --name "Reading List" --slug reading-list --color "#2563EB" --strip-demo --force
```

> **PowerShell note:** quote the `--color` value (`"#2563EB"`) — bare `#` starts a comment.

Init rewrites `package.json`, `DESIGN.md`, `tokens/base/color.json`, and `index.html`.
Demo components (LoginForm) are **kept by default**; login spec color assertion is synced.
Use `--strip-demo` to remove demos and write a minimal App shell + smoke spec.

After init succeeds, commit:

```powershell
git add -A
git commit -m "chore: init product scaffold"
```

---

## 10. Supabase Auth (`npm run supabase:init`)

Wire real email/password auth into `loginMachine` via Supabase Auth.

### Link an existing project (most common)

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine).
2. Dashboard → **Project Settings → API** → copy **Project URL** and **anon public** key.
3. Run:

```powershell
npm run supabase:init
# paste URL + anon key when prompted
# optional: personal access token to auto-apply supabase/schema.sql
```

Or non-interactive:

```powershell
npm run supabase:init -- --url "https://xxx.supabase.co" --anon-key "eyJ..." --force
```

### Create a new project via API

Requires a [personal access token](https://supabase.com/dashboard/account/tokens):

```powershell
$env:SUPABASE_ACCESS_TOKEN = "sbp_..."
npm run supabase:init -- --create --name "my-app" --force
```

### After init

| What | Where |
|---|---|
| Env vars | `.env.local` (gitignored) |
| Schema | `supabase/schema.sql` → profiles + RLS |
| Auth logic | `src/lib/authenticateUser.ts` |
| Client | `src/lib/supabaseClient.ts` |

Create a test user: **Dashboard → Authentication → Users → Add user**.

```powershell
npm run dev
# sign in with real credentials
```

E2E tests **keep using the demo stub** (no Supabase needed in CI). Playwright clears `VITE_SUPABASE_*` in `playwright.config.ts`.

Get an access token for schema auto-apply: https://supabase.com/dashboard/account/tokens

---

## 11. Vercel deploy (`npm run vercel:init`)

```powershell
npm run vercel:init
# or non-interactive:
npm run vercel:init -- --yes --force
```

Writes `vercel.json` (Vite SPA), runs `vercel link`, and optionally syncs
`VITE_*` keys from `.env.local` to Vercel production env.

Deploy: `npx vercel --prod`

---

## 12. Dynamic dev port (multi-product parallel)

Each fork gets a stable port from `package.json` `name`:

```powershell
npm run dev:port   # e.g. 5264 for ai-design-paradigm
npm run dev        # binds 127.0.0.1:<port> with strictPort
```

Playwright uses the same port via `playwright.config.ts`. Editing `tokens/**/*.json`
during `npm run dev` triggers automatic `tokens:build` (Vite watch plugin).

---

## 13. Phase 4 — first real product

See [`docs/phase4/PRODUCT-001.md`](docs/phase4/PRODUCT-001.md) for the fork checklist and ROI day-tracking table.

---

## Troubleshooting

### `npm install` errors

- **`ETARGET No matching version`** — your registry doesn't carry one of the
  v4/v5 packages I listed. Run `npm install` again with each package one at a
  time to find the culprit, then drop the version constraint to the loosest
  workable version.
- **Permission denied on `node_modules\.bin\*.ps1`** — Windows execution
  policy. Run PowerShell as Admin once: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`.

### Vite dev server starts but button is unstyled

- Did `npm run tokens:build` actually generate `dist\css\variables.css`? Open
  the file — it should contain `--token-color-brand-primary: #B8422E;`.
- Is `src\style.css` importing both `tailwindcss` and `../dist/css/variables.css`?
- Does the browser dev tools show `--color-brand-primary` resolving on the
  button element? If not, the `@theme` block isn't being processed — verify
  `@tailwindcss/vite` is loaded in `vite.config.ts`.

### `npm run design:validate` fails on the fallback script

- Open `scripts\validate-design.mjs` — check Node ≥ 20 (uses ESM + top-level `await`).
- The fallback expects DESIGN.md to have YAML frontmatter and the 9 named
  sections. If you edited DESIGN.md, make sure section H2 headings still match.

### Cursor doesn't see the MCP servers

- `.cursor\mcp.json` must be at the **repo root** (it is, after migration).
- Restart Cursor *fully* (close all windows) — Cursor only reloads MCP at startup.
- If `mcp-mermaid` 404s, swap to `@modelcontextprotocol/server-mermaid` per
  `docs\mcp-setup.md`.

### Git push rejected

- If the GitHub repo was created with a README, `git pull --rebase --allow-unrelated-histories origin main` first.
- If your account uses 2FA, you'll need a personal access token instead of
  password — use `git credential-manager` or set up SSH.
