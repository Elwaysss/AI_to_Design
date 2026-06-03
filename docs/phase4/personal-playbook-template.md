# Personal Playbook Template (P3.9)

Copy to `~/dev/personal-playbook.md` (outside any git repo). Update after each
session that cost > 30 minutes of debugging.

## AI model preferences

| Task | Preferred model | Notes |
|---|---|---|
| UI + tokens | | |
| XState machines | | |
| CI / scripts | | |

## Prompt snippets

### New screen

```
Read AGENTS.md and DESIGN.md §1–4. Use tokens only. Flow has N states — use src/machines/….
Ship component + tests/e2e spec. No raw HEX.
```

## Lessons that bit me twice

| Date | Symptom | Fix |
|---|---|---|
| | Vite "ready" but port empty on Windows | `host: 127.0.0.1`, `strictPort: true` |
| | e2e 30s timeout | `$env:CI='1'` or kill zombie node on `npm run dev:port` |
| | GHA `secrets` in step `if:` | Hoist to job `env:` |

## Cross-product notes

| Product slug | Dev port | Supabase project | Vercel project |
|---|---|---|---|
| ai-design-paradigm | 5264 | | starter only |
