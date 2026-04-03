# Development Plan

## Tech Stack

- **Frontend:** React (PWA) -- service worker for offline, WebGPU for on-device ML
- **Backend:** Supabase (auth, database, storage) -- already connected
- **Media Storage:** Cloudflare R2 (S3-compatible, no egress fees)
- **On-Device ML:** TensorFlow.js (face detection, background segmentation), Whisper via WebGPU (transcription)
- **Server-Side AI:** One API endpoint for LLM script cleanup (GPT-4o-mini or equivalent)
- **Media Composition:** On-device Canvas + WebCodecs (both shipping in all major browsers as of 2025)
- **CDN:** Cloudflare

No app store. PWA distributed via URL. Users add to home screen.

## v1: The Practice Session (MVP)

**Goal:** Prove the content pipeline works and the feed format is compelling.

### Session Creator
- Photo capture (3+ photos minimum)
- Voice narration recording (primary) or text fallback (accessibility)
- One-take capture: no editing, no re-recording, transcript never shown to user
- On-device processing pipeline:
  - EXIF stripping
  - Face detection + blur (TensorFlow.js BlazeFace)
  - Background segmentation + dimming (MediaPipe/DeepLabV3)
  - Transcription (Whisper via WebGPU -- silent, user never sees result)
  - Slideshow composition with captions + background music (Canvas + WebCodecs)
- User sees final standardized artifact, approves or discards (no editing)
- Upload depersonalized artifact to Supabase/R2

### The Feed
- Email auth (Supabase Auth)
- Interest selection at onboarding (pick 3-5 topics from taxonomy)
- Chronological feed grouped by interest
- "Save" button (private, feeds personal algorithm)
- Topic search
- Contribution gate (visitor -> member -> contributor tiers)
- Consumption budget (~20 sessions/day)

### Profile
- Your trail (chronological list of your sessions)
- Your saved sessions
- Your declared interests (editable)

### Infrastructure
- Supabase project: auth, Postgres (users, sessions, interests, saves), storage
- Cloudflare R2: media hosting
- One serverless function: LLM call for transcript-to-script cleanup
- PWA manifest + service worker for offline creation

### What v1 Does NOT Include
- Circles / social contracts / group features
- DID / cryptographic identity (email auth only)
- Social recovery / guardians
- Governance / voting
- Peer attestation / capability passport
- Federation
- Omnibox (simple search + creation flow instead)
- AI voiceover (text captions only)
- Subdomains

## v2: The Circle

**Goal:** Prove the social contract model works for small learning groups.

### Circle Formation
- "Find others practicing this" from your trail or the feed
- Pseudonymous invitations -- you see their contribution history, not their name
- Accept/decline offers to form a circle

### Social Contract
- Configurable commitment: meetings, deadlines, tasks over time
- Templates for common patterns (weekly check-in, monthly project, etc.)
- Duration: defined end date with option to renew
- Private anonymous voting on "do you want to continue?" at contract end
- Circle members see each other's pseudonymous identity

### Peer Attestation
- At circle completion, members can attest each other's demonstrated capabilities
- Attestations are signed and attached to the recipient's profile
- Portable (will become Verifiable Credentials in v3)

### Governance
- Circle-level governance with configurable thresholds
- Content removal, rule changes, member removal votes
- Fork rights always available

### Identity Upgrade
- DID-based identity (did:web, hosted by practice.exchange)
- WebCrypto key generation
- Social recovery guardians (5 guardians, 3-of-5 threshold)
- Guardian heartbeat monitoring

### AI Voiceover (if v1 text captions prove insufficient)
- Generated voice from transcript (OpenAI TTS or self-hosted Piper)
- Standard voice for all sessions (no personal voice)

## v3: The Commons

**Goal:** Decentralize. Make the platform infrastructure, not a product.

### Federation
- Open-source the platform code
- Other nodes can run practice.exchange-compatible instances
- Own PLC directory for DID resolution
- Identity + data portable across nodes
- Cross-node circle formation

### Capability Passport
- Verifiable Credentials (W3C standard) for attestations
- Portable across federated nodes
- Peer-attested, not institution-granted

### Full Governance
- Platform-level constitutional governance
- Per-domain governance (if subdomains emerge from community need)
- Eternity clauses enforced in code
- Scaling amendment thresholds

### Omnibox
- Natural language input for all platform actions
- Intent classification -> routing
- Voice + text input

### AI Agent Protocol
- Personal AI interacts with platform API on behalf of user
- Agent can attend circle meetings, summarize activity, contribute data
- Protocol for AI-to-AI interaction within circles

### Health / n-of-1 Features
- Standardized biomarker tracking templates
- Baseline measurement workflows
- Confound tracking
- Anonymous data aggregation for circle-level analysis
- Analysis tools (statistics, visualization) without platform interpretation

## Cost Projections

### v1 at 100 users
- Supabase free tier
- R2 free tier (10GB storage, 1M requests)
- LLM API: ~$1/month
- Total: ~$0/month (free tiers cover everything)

### v1 at 10,000 users
- Supabase Pro: $25/month
- R2: ~$5/month
- LLM API: ~$20/month
- Total: ~$50/month ($0.005/user)

### v2 at 100,000 users
- Supabase Pro + compute: ~$100/month
- R2 + CDN: ~$200/month
- LLM API: ~$200/month
- TTS (if added): ~$500/month
- Total: ~$1,000/month ($0.01/user)

### v3 at 1,000,000 users
- Self-hosted infrastructure: ~$5,000/month
- AI processing: ~$15,000-25,000/month
- Total: ~$20,000-30,000/month ($0.02-0.03/user)

## Resolved Questions

- [x] **Social contract data model** -- See docs/social-contracts.md. Five atomic components (rhythm, contribution, duration, boundary, accountability). Five templates cover 80% of use cases. Generalized schema with custom_fields for domain-specific extensions.
- [x] **Background music** -- Pre-generated library using Meta's MusicGen (MIT licensed) + curated CC-BY tracks. 200-500 tracks across 10 mood categories. One-time compute cost under $10. Monthly serving cost at scale: $50-200 (CDN only). No subscriptions, no vendor lock-in, ships with the platform.
- [x] **Interest taxonomy** -- Graduated hybrid with topic graph backbone. 15 seed domains (~200 topics), freeform user tags, AI normalization behind the scenes. Graph structure (not tree) enables topic adjacency. No AI needed at launch -- seed taxonomy + freeform tags + manual mapping works for first 1,000 users.
- [x] **Moderation for v1** -- Trust the content format (structured documentation has <0.05% abuse rate). Automated stack: NSFW.js client-side + NudeNet server-side + Whisper+Perspective API for audio + CLIP coherence check + perceptual hashing + rate limiting + PhotoDNA for CSAM. Total cost: $0. Founder reviews flagged content ~5 min/day. See docs/moderation.md.

## Open Questions

- [ ] When does circle governance become complex enough to need its own data model vs. simple config?
- [ ] Contribution gate UX: what does the "time to practice" prompt look like? How aggressive?
- [ ] Topic graph federation: how do topic nodes get DID-anchored identifiers across nodes?
- [ ] Encrypted key backup UX: how does the passphrase flow work without confusing users?