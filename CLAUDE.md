# practice.exchange

## Overview
Federated learning infrastructure where individuals learn by doing, their doing becomes content, and their content becomes teaching. Not a product -- communal infrastructure. A stock exchange extracts. A practice exchange enriches.

## Stack
- Frontend: React (PWA) -- no app store, distributed via URL
- Backend: Supabase (auth, Postgres, storage)
- Media: Cloudflare R2 + CDN
- On-Device ML: TensorFlow.js, Whisper via WebGPU, MediaPipe
- Server AI: Single endpoint for LLM script cleanup
- Domain: practice.exchange (purchased 2026-04-03)

## Architecture Principles
- Open source everything: code, matching algorithm, financials
- Patron-funded (Wikipedia model), no extraction, no VCs
- Platform as pipes, not a brain -- no platform-level AI interpretation
- Sharing is the pedagogy -- teaching what you practiced is how you learn it
- Pseudonymous by default (DID identity, not anonymous)
- Content is depersonalized (standardized format, face blur, no identifiable voice)
- Federation-ready architecture but single-node for v1-v2

## Key Concepts
- **Session:** atomic unit of practice -- photos + narration, depersonalized into a standardized artifact. What you put on the exchange.
- **Circle:** time-bound learning cohort with a social contract (start date, end date, meetings, shared accountability). Not a community -- a cohort.
- **Save:** private bookmark that feeds your personal algorithm. The only signal. Visible to no one.
- **Contribution model:** sharing is the pedagogy, not a toll. Teaching what you practiced is how you internalize it. Tiers: visitor -> member -> contributor -> sustained.

## Commands
- TBD -- project is in early concept/architecture phase, no code yet

## References
- `~/.claude/references/coding-standards.md` -- Read before writing any code
- `docs/architecture.md` -- Platform architecture, feed design, content pipeline, one-take capture
- `docs/one-pager.md` -- Project summary
- `docs/governance.md` -- Constitutional framework, eternity clauses, fractal governance
- `docs/identity.md` -- DID implementation, social recovery, key rotation path
- `docs/development-plan.md` -- MVP through v3 roadmap with cost projections
- `docs/social-contracts.md` -- Circle social contract data model, templates, JSON schema
- `docs/moderation.md` -- Automated moderation pipeline, CLIP coherence, gardener model
