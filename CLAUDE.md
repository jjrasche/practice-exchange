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
- Contribution is the price of admission, not money
- Pseudonymous by default (DID identity, not anonymous)
- Content is depersonalized (standardized format, face blur, no identifiable voice)
- Federation-ready architecture but single-node for v1-v2

## Key Concepts
- **Session:** atomic content unit -- depersonalized slideshow from photos + narration
- **Circle:** small learning group with a social contract (meetings, deadlines, tasks)
- **Trail:** your chronological documentation of sessions
- **Save:** private bookmark that feeds your personal algorithm (silent signal)
- **Contribution gate:** must contribute to consume (visitor -> member -> contributor -> sustained)

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
- `docs/protocol.md` -- Personal neuroplasticity protocol (user zero content)
