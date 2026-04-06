# practice.exchange roadmap

## Foundation (no users yet, get the thing running)

### 1. GitHub repo + CI pipeline
- Public repo, push code
- GitHub Actions: build -> Docker -> Playwright -> Lighthouse
- Goal: every push is verified automatically

### 2. Supabase backend
- Auth (email signup via Supabase Auth)
- Schema: users, sessions, interests, saves
- Storage bucket for session media (photos, narration audio)
- Wire SessionCreator onComplete to upload slides
- E2E test: create session -> appears in storage

### 3. Hosting + domain
- Deploy dist/ to Supabase Storage or Cloudflare Pages
- Point practice.exchange at it
- Deploy workflow (manual trigger from GitHub Actions)
- Goal: the app is live at a URL

### 4. Content pipeline
- Depersonalization: face blur (MediaPipe), voice standardization
- Standardized session format from raw slides
- Server AI endpoint for LLM script cleanup (single endpoint)
- Goal: raw capture -> publishable session

## Core product (first users, contribution gate)

### 5. Feed + discovery
- Minimal feed: list sessions by interest
- Save mechanic (private bookmark, feeds personal algorithm)
- Interest tagging on sessions
- Goal: someone can browse and find sessions

### 6. Identity + contribution gate
- DID-based pseudonymous identity
- Social recovery for key rotation
- Contribution gate: visitor -> member -> contributor -> sustained
- Must contribute to consume
- Goal: the platform has a membership model

### 7. Circles (social contracts)
- Small learning groups with social contracts
- Meeting schedules, deadlines, task assignments
- Circle creation, invitation, contract templates
- Goal: people can form learning groups

## Intelligence layer (@practice/observe)

### 8. Capture layer
- Interaction capture (pointer, scroll, visibility, timing)
- Error capture (error boundaries, window.onerror)
- Structural capture (web vitals, Lighthouse scores)
- Supabase schema (observe.* tables)
- React bindings (ObserveProvider)
- Wire into practice.exchange as first consumer

### 9. Factor engine
- Alarm views: completion rate, drop-off, error rate per flow
- Diagnostic views: hesitation, rage clicks, scroll reversals, dead clicks
- Structural views: CLS, LCP, contrast, tap targets
- All materialized as SQL views queryable by AI via Supabase MCP

### 10. Experimentation infrastructure
- Feature flag definitions in Supabase, client-side evaluation
- Deterministic user bucketing for A/B tests
- Exposure tracking
- Component-level variant swapping via standardized vocabulary

## Governance (the platform governs itself)

### 11. User-facing pattern views
- Individual interaction patterns (RLS-secured)
- "Your practice trail" -- how you use the platform
- Goal: users see their own data

### 12. Community governance views
- Aggregated anonymized factors for collective decision-making
- AI surfaces facts, community decides priorities
- Goal: the user base governs the app's direction

### 13. Autonomous experiment loop
- Factor threshold breaches trigger AI diagnostic reports
- AI generates component-level hypotheses + variant code
- Governors approve experiments
- Results measured, shipped or reverted
- Goal: the MAPE-K loop runs

## Build order rationale

1-3 unblock everything (nothing works without a live app with persistence).
4-5 make the app useful to a single user.
6-7 make it a community.
8-9 give AI eyes.
10-13 close the loop.
