# ──────────────────────────────────────────────────────────────────────
# migrate.ps1 — Phase 0 migration script (Option A: flatten)
#
# Moves the leftover non-text assets from AI_to_design\ up to the workspace
# root, then deletes AI_to_design\ entirely. All TEXT files (vite.config.ts,
# tsconfig*.json, package.json, src/App.vue, src/main.ts, HelloWorld.vue,
# index.html, .gitignore) were already written to the new locations by the
# agent — only binary-ish assets and the leftover folder need this script.
#
# Run from F:\AI Design Paradigm:
#     powershell -ExecutionPolicy Bypass -File .\migrate.ps1
# ──────────────────────────────────────────────────────────────────────

$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

Write-Host "==> Phase 0 migration starting from $PSScriptRoot" -ForegroundColor Cyan

# 1. Sanity check — make sure we're at the right place.
if (-not (Test-Path .\AI_to_design)) {
    Write-Host "AI_to_design\ not found. Either migration already ran or you're in the wrong directory." -ForegroundColor Yellow
    exit 0
}
if (-not (Test-Path .\package.json)) {
    Write-Host "package.json not found at workspace root. Did the agent's writes succeed? Aborting." -ForegroundColor Red
    exit 1
}

# 2. Ensure target directories exist.
New-Item -ItemType Directory -Force -Path .\src\assets, .\public | Out-Null

# 3. Move asset files (SVGs, favicon, icons) up to the workspace root.
$assetMoves = @(
    @{ from = '.\AI_to_design\src\assets\vite.svg';  to = '.\src\assets\vite.svg'  },
    @{ from = '.\AI_to_design\src\assets\vue.svg';   to = '.\src\assets\vue.svg'   },
    @{ from = '.\AI_to_design\public\favicon.svg';   to = '.\public\favicon.svg'   },
    @{ from = '.\AI_to_design\public\icons.svg';     to = '.\public\icons.svg'     }
)

foreach ($a in $assetMoves) {
    if (Test-Path $a.from) {
        if (-not (Test-Path $a.to)) {
            Copy-Item -Path $a.from -Destination $a.to -Force
            Write-Host "  moved: $($a.from)  ->  $($a.to)" -ForegroundColor Green
        } else {
            Write-Host "  skipped (target exists): $($a.to)" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "  not found: $($a.from)" -ForegroundColor DarkYellow
    }
}

# 4. Nuke the AI_to_design folder (and its node_modules).
Write-Host "==> Removing AI_to_design\ (this can take ~30s due to node_modules)..." -ForegroundColor Cyan
Remove-Item -Recurse -Force .\AI_to_design

# 5. Wipe the old root node_modules if any leftover from the React-flavored attempt.
if (Test-Path .\node_modules) {
    Write-Host "==> Removing stale root node_modules\ ..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force .\node_modules
}
if (Test-Path .\package-lock.json) {
    Remove-Item -Force .\package-lock.json
}

# 6. Fresh install at the workspace root (postinstall will also build tokens).
Write-Host "==> Running npm install at workspace root..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed. Stop here and inspect the error above." -ForegroundColor Red
    exit $LASTEXITCODE
}

# 7. Smoke test — make sure dist/css/variables.css was generated.
if (Test-Path .\dist\css\variables.css) {
    Write-Host "==> Tokens compiled OK: dist\css\variables.css exists." -ForegroundColor Green
} else {
    Write-Host "==> WARNING: dist\css\variables.css missing. Run 'npm run tokens:build' manually." -ForegroundColor Yellow
}

Write-Host "==> Migration complete." -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "  npm run dev          # see Boston Clay button on http://localhost:5173"
Write-Host "  npm run design:validate"
Write-Host "  git init && git remote add origin https://github.com/Elwaysss/AI_to_Design.git"
