# Platform Architecture

## Core Loop

Individuals learn by doing. Their doing becomes content. Their content becomes teaching. The exchange is emergent -- not transactional, not conditional. A stock exchange extracts. A practice exchange enriches.

## The Practice Session

The atomic unit of content is a **session** -- a short, standardized, depersonalized artifact documenting a moment of practice. A session is created from phone photos + voice narration (or text), processed on-device into a captioned slideshow with background music.

### One-Take Capture (Design Principle)

The session creation flow is deliberately low-pressure:
- You get one take. No editing. No re-recording. No previewing your transcript.
- You never see the transcription of your voice. The platform processes it silently.
- No keyboard STT -- voice recording only (or text fallback for accessibility).
- The user does not control the final artifact's appearance beyond approving/rejecting it.

This is a conscious design choice to eliminate digital performance anxiety. If you cannot obsess over your words, you stop trying to be perfect and just document what you did. The standardized format means there is nothing to optimize -- everyone's session looks the same.

### Session Creation Pipeline

1. User captures 3+ photos during or after practice
2. User records voice narration while taking photos (simultaneous capture) or after
3. On-device processing (no server, no data leaves the phone):
   - EXIF metadata stripped
   - Face detection + blur (TensorFlow.js BlazeFace)
   - Background segmentation + dimming (MediaPipe)
   - Voice transcribed to text (Whisper via WebGPU -- transcript never shown to user)
   - Photos composed into captioned slideshow with background music
4. User sees the final standardized artifact, approves or discards (no editing)
5. Upload: depersonalized media + transcript to server

### Standardized Format

Every session looks the same. No personal visual markers, no identifiable voice, consistent style. This:
- Removes the editing barrier (no production anxiety)
- Reduces shame (you are not on camera)
- Eliminates performative content creation
- Reduces cognitive load for viewers (consistent format to learn from)
- Enables pseudonymity at the content level

Think: YouTube Shorts that are helpful, standardized, and depersonalized.

## The Feed

Interest-matched discovery. Chronological within interest categories. Pseudonymous (persistent identity, not tied to real name).

### Feed Signals (no public engagement metrics)

| Signal | Weight | Source |
|--------|--------|--------|
| Topics you contribute sessions about | High | Your own content |
| Saved sessions (silent signal) | Medium-High | Private action, never visible to others |
| Declared interests | Medium-High | Onboarding + manual tuning |
| Circle topics | Medium | Group membership |
| Topic adjacency | Medium | Graph proximity between interests |
| Recency | Baseline | Chronological within each category |

**Save button:** One action, two effects. Tap "save" on a session -- it bookmarks it for you AND signals the algorithm. The creator never knows. Nobody else sees it. No hearts, no thumbs up, no counts. Just "save."

**Consumption budget:** ~20 sessions/day. After that: "Time to practice. Log a session to unlock more." Enforces the practice-exchange loop.

**No public engagement metrics. Ever.** No likes, no view counts, no follower counts, no comments on public content. Hidden signals (saves) exist but are never surfaced to anyone other than the saver.

### Content Discovery

- Search by topic/keyword
- Interest-grouped sections in feed
- "You might explore" adjacent-topic suggestions
- Content is discoverable. People are not (until you share a circle with them).

## Contribution Gate

| Tier | Requirements | Access |
|------|-------------|--------|
| Visitor | None | Sample feed (curated best-of, refreshed weekly) |
| Member | Account created | Full feed, limited to last 48 hours. Can save. Prompted to contribute. |
| Contributor | 1+ session in last 30 days | Full feed, full archive, can join circles |
| Sustained Contributor | 10+ lifetime sessions | Can create circles, participate in governance |

First contribution must take under 5 minutes. Template: "What are you practicing? Show us 3 moments from your session. Tell us what you noticed." Minimum: 3 photos + 50 words or 30 seconds voice.

## Pseudonymity (Not Anonymity)

**Critical distinction:**
- Anonymous = no identity. Every action is disconnected. (4chan model -- leads to toxicity)
- Pseudonymous = persistent identity not tied to legal name. (What we are building)

Every user has a DID -- a persistent cryptographic identity. The DID accumulates contribution history, attestations, learning history. Other users see a consistent identity with a reputation trail. They do not know your name, face, or location unless you choose to reveal that.

Content is **depersonalized** (standardized format, no face, no identifiable voice). The author is **pseudonymous** (persistent DID with portable reputation).

This solves the anonymous platform failure mode: there IS accountability (your reputation is at stake), there just is not doxxability.

## Social Graph

- No friends list. No follows. No social search.
- Connections form ONLY through shared circles.
- You can remove connections but cannot add them outside of shared learning.
- Learning history is the social graph. Every connection carries signal.
- People from successful past circles get weighted in future matching -- invisible, emergent.

## UX Model

### Omnibox-First (v2+)

Single text/voice input handles everything: search, logging, circle discovery. The HouseOps pipeline pattern: natural language input -> intent classification -> action.

### v1: Simpler

- Session creation flow (photos + narration)
- Topic search
- The feed
- Profile (your trail of sessions)

### Four Views (eventual)

1. **Input** (omnibox -- always visible)
2. **Trail** (your chronological documentation -- your journal)
3. **Circle** (your current learning groups)
4. **Curriculum** (AI-synthesized from your trail + your circle's trails)

## Data Architecture

- User-owned encrypted data stores
- Data export on demand (eternity clause -- cannot be removed)
- Content shared in circles follows circle governance
- Health data: private by default, anonymized aggregation only
- Platform does: anonymize, aggregate, provide analysis tools
- Platform does NOT: interpret, recommend, draw conclusions
- Individual's own AI does interpretation. Platform is pipes, not a brain.

## No Subdomains (v1)

Single platform: practice.exchange. All topics coexist. No subdomain split until the community demands it. Health-related content gets stricter privacy defaults within the same platform (configured per-session or per-circle, not per-subdomain).

When the community grows large enough for distinct governance needs (e.g., health practitioners wanting different rules than woodworkers), THEN fork into subdomains. Not before.

## Citizen Science / n-of-1

Same infrastructure as learning. A "class of 1" IS an n-of-1 trial.

- Standardized outcome tracking templates
- Baseline measurement before intervention
- Confound tracking (sleep, stress, diet, exercise)
- AI assists structure but does not interpret
- Group data: circle opts in, data anonymized, individuals analyze independently, bring conclusions to group for debate
- Platform is a library, not a laboratory -- no IRB trigger