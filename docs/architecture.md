# Platform Architecture

## Core Concept

Individuals learn by doing. Their doing becomes content. Their content becomes teaching. The exchange is emergent — not transactional, not conditional. You practice in a shared space, and the byproduct of your practice enriches others.

## How It Works

1. **Omnibox input**: One text/voice input handles everything — "I want to learn soil blocking" or "log: transplanted seedlings, 80% survival" or "show me who's growing food in Zone 6a"
2. **Trails**: Your private documentation stream. Journal of what you're learning and doing. Private by default, shared with your circle when you choose.
3. **Discovery**: Browse others' published trails by topic. You find content, not people. No profiles, no follower counts, no engagement metrics.
4. **Silent signals**: Private bookmarks feed YOUR matching algorithm only. Nobody sees what you bookmarked. The system uses them to improve your matches.
5. **Classes of 1**: Commit to a curriculum (social contract with yourself). Predefined formats, customizable. Track your progress.
6. **Circle formation**: Opt in to find others on the same path. Anonymized at first. Send offers to build a learning circle. Governance kicks in when the circle forms.

## Subdomain Architecture

practice.exchange is the umbrella. Subdomains are fields of practice:

| Subdomain | Field | Privacy Default |
|-----------|-------|----------------|
| food.practice.exchange | Agriculture, gardening, food systems | Standard |
| health.practice.exchange | Physical health, n-of-1 trials, biomarkers | Strict |
| mind.practice.exchange | Mental health, cognition, breathwork, mindfulness | Strict |
| energy.practice.exchange | Energy systems, sustainability | Standard |
| shelter.practice.exchange | Building, construction, home systems | Standard |
| water.practice.exchange | Water systems, conservation | Standard |
| move.practice.exchange | Transport, mobility, fitness | Standard |
| code.practice.exchange | Software, programming | Standard |
| make.practice.exchange | Fabrication, woodworking, crafts | Standard |
| care.practice.exchange | Childcare, eldercare, community care | Strict |
| govern.practice.exchange | Governance, civics, democratic participation | Standard |
| money.practice.exchange | Personal finance, economics | Strict |

Education is not a subdomain — education IS the platform. Everything on practice.exchange is education.

Launch with: food + health only. User zero content for both exists (soil blocking, neuroplasticity protocol).

## UX Model (from HouseOps)

- Always-visible omnibox (natural language -> intent classification -> action)
- Four views: Input, Trail (journal), Circle (cohort), Curriculum (AI-synthesized)
- No feed. Discovery is search-driven, relevance-matched to your interests, chronological. Not engagement-optimized.
- No view counts, no likes, no engagement metrics. Ever.
- Contribution required: you must document your own practice to browse others'. This is the admission price.

## Identity Layer

- DID-based authentication (did:web initially, own PLC directory at scale)
- Private key on user's device only. Platform never sees it.
- Social recovery: 5 guardians, 3-of-5 threshold (Shamir's Secret Sharing)
- Guardian heartbeat: 30-day inactivity warning, prompt to replace
- Every action cryptographically signed
- Pseudonymous by default. DID reveals nothing personal unless user attaches credentials.
- Contribution history IS reputation — no separate score. Your signed actions are your standing.

## Social Graph

- No friends list. No follows. No social search.
- Connections form ONLY through shared circles (curricula).
- You can remove connections but cannot add them outside of shared learning.
- Learning history is the social graph. Every connection carries signal.
- People you've had successful circles with get weighted in future matching — invisible to you, emergent from the system.

## Data Architecture

- User-owned encrypted data stores
- Data export on demand (eternity clause — cannot be removed)
- Content shared in circles follows circle governance
- Health/mind subdomains: private by default, anonymized aggregation only
- Platform does: anonymize, aggregate, provide analysis tools
- Platform does NOT: interpret, recommend, draw conclusions
- Individual's own AI does interpretation. Platform is pipes, not a brain.

## Citizen Science / n-of-1

- Same infrastructure as learning. Class of 1 IS an n-of-1 trial.
- Standardized outcome tracking templates (not "I feel good" but validated scales)
- Baseline measurement before intervention
- Confound tracking (sleep, stress, diet, exercise)
- AI assists structure ("want me to set up tracking for your protocol?") but does not interpret
- Group data: cohort opts in, data anonymized, individuals analyze independently, bring conclusions to group for debate
- Platform is a library, not a laboratory — no IRB trigger
