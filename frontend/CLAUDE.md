# The Memoir Project (Clio)

## Stack
Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4.
(A prior version of this file and a task doc under `docs/` claimed Vite +
React 18 + Tailwind v3 — that was incorrect; the repo has always been
scaffolded with Next.js. Ignore that claim if you see it elsewhere.)

## Design tokens
cream background / terracotta accent / warm charcoal text.
Tailwind v4 has no `tailwind.config.js` — tokens are defined as CSS custom
properties inside the `@theme` block in `src/app/globals.css` and consumed
as utilities by name (bg-cream, bg-terracotta, text-charcoal, etc.). Never
hardcode hex values in a screen component.

## UX principles
- Deferred auth: users are never forced to create an account until the
  final onboarding step.
- Anonymous session preservation: onboarding progress persists via an
  anonymous/local session, not a user ID.
- No gamification: no badges, streaks, confetti, percentage-complete.
- Grief-appropriate pacing: copy is gentle and unhurried, never urgent.

## Git workflow
Commit at reasonable checkpoints with clear, scoped messages. Do not push
to remote until a full batch of work is verified complete and the app
builds/runs locally without errors.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
