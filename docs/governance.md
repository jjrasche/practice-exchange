# Governance Framework

## Principle

Governance is fractal. Same pattern at every scale: rules with thresholds, parameters, enforcement code, a process for change, and automated execution. Moderation is standard and universal. Governance structures are configurable per circle.

## Eternity Clauses (immutable -- cannot be changed even with 100% vote)

1. **Fork rights** -- any member can leave with their data, always
2. **Data export on demand** -- your data is yours, always
3. **Guardian sovereignty** -- no one can be compelled to approve key recovery
4. **Governance transparency** -- all rules, votes, and outcomes are public
5. **Open financials** -- platform costs and funding visible to all
6. **Amendment threshold direction** -- can only move upward, never downward

These are enforced in the codebase, not in configuration. The platform code will not allow their removal regardless of any vote.

## Constitutional Amendment Threshold (scales with membership)

| Members | Threshold | Quorum |
|---------|-----------|--------|
| 2-10 | 80% | 80% |
| 11-50 | 85% | 80% |
| 51-200 | 90% | 80% |
| 201-1000 | 93% | 80% |
| 1000+ | 95% | 80% |

Formula: `threshold = min(0.95, 0.75 + 0.05 * log10(members))`

Changing the amendment threshold itself requires 95% vote with 95% quorum minimum. Threshold can only increase, never decrease.

## Decision Types (defaults -- configurable per circle within ranges)

| Decision Type | Default Threshold | Default Quorum | Rationale |
|---------------|-------------------|----------------|-----------|
| Content flagging/removal | Simple majority (50%+1) | 33% | Routine, reversible |
| Rule change | 2/3 (67%) | 50% | Serious but adjustable |
| Member removal | 3/4 (75%) | 67% | Hard to reverse, needs legitimacy |
| Constitutional amendment | Scaling (80-95%) | 80% | Foundational stability |
| Fork | Unilateral | None | Exit right, eternity clause |

## Circle Governance

Circles can modify thresholds within constitutional bounds:

| Decision Type | Circle Range |
|---------------|-------------|
| Content removal | 33%-67% |
| Rule change | 50%-80% |
| Member removal | 67%-90% |
| Fork | Unilateral (immutable) |
| Quorum (routine) | 20%-50% |
| Quorum (serious) | 33%-75% |

## Moderation Architecture

Moderation is universal -- same rules everywhere. Governance is fractal and domain-specific.

1. **Deterministic rules** (handle 90%): coded, transparent, auditable, run autonomously
2. **AI edge cases** (handle 9%): flags ambiguous content, requires human review before action
3. **Community governance** (handle 1%): votes on novel situations, outcomes codified into new deterministic rules
4. **Goal**: move everything to deterministic rules over time through the governance model

All moderation rules are open source. Users can read the code that governs them.

## Roles

Two roles only:

- **Member** -- learning participant, governance participant
- **Guardian** -- key recovery role (relationship between individuals, not a platform role)

No admins. No moderators. No instructors. Governance is collective. Moderation is rule-based. Teaching is peer-to-peer.

## Revenue Model

- Patron-funded (Wikipedia model)
- Open financials -- every dollar in, every dollar out, visible to all members
- Target cost: ~$0.02-0.08/user/month at scale (depending on AI processing architecture)
- No subscriptions, no paywalls, no extraction
- No VC funding (incompatible with eternity clauses and mission)
- Funding path: self-funded (year 0-2) -> Are.na model small donations (year 2-4) -> foundation grants (year 4+)
- Annual fundraising with transparent cost breakdown

## Platform Seed Constitution

To be drafted. Should be under 10 rules beyond the eternity clauses. Enforced in code, not configuration. First 100 users operate under a provisional constitution with lower amendment thresholds.