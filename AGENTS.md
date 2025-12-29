# AGENTS.md (repo root)

# AGENTS.md

## Scope

READ/WRITE: app/**, README.md, package.json, eslint.config.mjs, next.config.ts, tsconfig.json, postcss.config.mjs, next-env.d.ts
READ-ONLY (only if needed): public/**
IGNORE (never open unless asked): node_modules/**, .next/**, .git/**, .claude/**, package-lock.json

## Workflow

1) Plan only first. No edits until I say "implement".
   Plan must include: files to touch, exact changes, risks, verification commands.
2) Implement small, reviewable diffs. Do not mix refactor + feature in one commit.

## Safety

No destructive commands unless explicitly approved (rm/del, git reset --hard, git clean -fd, rebase, force push).
No new frameworks; avoid new deps.

## Architecture rules

- app/components may import app/data and app/types
- app/data may import app/types
- app/types must not import anywhere

## Reorg constraints

Do not move app/page.tsx or app/layout.tsx unless asked.
If moving/renaming: provide before/after list and update all imports.

## Verify

After changes: npm run lint, then npm run build. If fail: show short error excerpt, fix minimally, re-run.

## Output

Prefer unified diff. Do not paste whole large files unless asked.

## Scope

- Prioritize: app/**, app/components/**, app/data/**, app/types/**, README.md, package.json, next.config.ts
- Ignore unless explicitly requested:
  - node_modules/**, .next/**, .git/**, .claude/**, public/** (assets only), package-lock.json

## Working agreements

- Start with a plan only. Do not edit files until I say "おっけい".
- When implementing: keep changes minimal and reviewable.
- Always show a short checklist of what you will change (files + reasons) before edits.
- After changes: run `npm run lint` and `npm run build` (or explain why not).
