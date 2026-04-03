# Social Contracts Data Model

## Research: What Existing Platforms Do

### Platform Analysis

**P2PU Learning Circles** — The closest analog. 6-8 weeks, 90 min/week, 4-12 members. Facilitator (not teacher) organizes logistics. Each meeting has consistent structure: check-in, learning activity, reflection. Facilitator commitment is ~3 hrs/week. Key insight: shorter than 4 weeks does not build group culture; longer than 8 weeks becomes alienating.

**Focusmate** — Paired accountability sessions. 25/50/75-minute durations. You book a slot, get matched with a partner, state your goal, work silently on camera. Late by 2+ minutes = rematched. Reputation builds through showing up. Key insight: the commitment is to *another person*, not to the platform. That is why it works.

**Habitica** — Gamified group quests. Party of 2-30 members fights a boss by completing their own tasks. If you miss your dailies, the boss damages your entire party. Key insight: individual failure has group consequences. This creates mutual accountability without surveillance.

**Strava Group Challenges** — Time-bounded goals (distance, elevation, duration). Types: competitive (leaderboard) or collaborative (group total toward shared goal). Up to 200 participants. Key insight: two modes — "who can do the most" vs. "can we collectively hit X." Both are useful.

**Mastermind Groups** — 5-10 members, weekly or biweekly, 60-90 min. Hot seat rotation (one member gets deep focus each meeting). Round robin for accountability check-ins. Members commit to specific actions each week and report back. Key insight: the hot seat rotation is a scheduling primitive — it distributes attention fairly across time.

**Maven Cohort Courses** — 2-6 weeks, 90-120 min live sessions, ~1 hr/week async work (projects). Structured syllabus with clear weekly expectations. "I do, We do, You do" pedagogy. Key insight: the ratio of sync-to-async time matters. Too much sync = scheduling burden. Too much async = no group cohesion.

**Book Clubs** — Read X chapters by date Y, discuss. Simple recurring cadence. Often dies when people stop reading. Key insight: the simplest possible contract — one recurring deliverable, one recurring meeting.

## Common Elements Across All Platforms

Every group commitment, regardless of domain, decomposes into five atomic components:

### 1. Rhythm (when do we meet?)
A recurring schedule of synchronous gatherings. Could be weekly, biweekly, monthly, or irregular. Has a duration per meeting and a cadence.

### 2. Contribution (what does each person do between meetings?)
Individual work expected between synchronous sessions. Could be: log 3 runs, post 1 update, read 2 chapters, track biomarkers daily, complete a project milestone. Has a type, a quantity, and a frequency.

### 3. Duration (how long does this last?)
Fixed-term (4 weeks, 12 weeks, one weekend) or open-ended. Fixed-term contracts have a renewal mechanism.

### 4. Boundary (who can join/leave and when?)
Membership rules: open enrollment, closed after start, invitation-only. Leave rules: can leave anytime, can leave at end of cycle, leaving has consequences (forfeit attestations?).

### 5. Accountability (what happens when someone does not meet the contract?)
Grace periods, strikes, group vote to remove, automatic removal after N missed contributions, or nothing (honor system). The spectrum runs from "no enforcement" to "your failure hurts the group."

---

## Data Model

### Entity Relationship Overview

```
Circle (group)
  └── SocialContract (the agreement)
        ├── MeetingSchedule (rhythm)
        ├── Obligation[] (what members commit to)
        │     └── ObligationType (enum: session_post, data_log, attendance, project_milestone, custom)
        ├── Milestone[] (group-level checkpoints)
        ├── BoundaryRules (join/leave policy)
        └── AccountabilityRules (enforcement)
  └── Membership[] (who is in the circle)
        └── MemberCommitmentLog[] (tracking fulfillment)
```

### Core Schema (JSON Schema)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "SocialContract",
  "description": "The agreement that members of a learning circle commit to.",
  "type": "object",
  "required": ["circle_id", "version", "status", "duration", "meeting_schedule", "obligations", "boundary_rules", "accountability_rules"],
  "properties": {

    "circle_id": {
      "type": "string",
      "format": "uuid",
      "description": "FK to the circle this contract governs."
    },

    "version": {
      "type": "integer",
      "minimum": 1,
      "description": "Increments on renewal or amendment. Version 1 is the founding contract."
    },

    "status": {
      "type": "string",
      "enum": ["draft", "active", "completed", "dissolved"],
      "description": "Draft while forming, active once all founding members ratify, completed at natural end, dissolved if ended early."
    },

    "created_at": {
      "type": "string",
      "format": "date-time"
    },

    "ratified_at": {
      "type": "string",
      "format": "date-time",
      "description": "When all founding members signed. Null while draft."
    },

    "template_id": {
      "type": ["string", "null"],
      "description": "If created from a template, the template slug. Null if fully custom."
    },

    "duration": {
      "$ref": "#/$defs/Duration"
    },

    "meeting_schedule": {
      "$ref": "#/$defs/MeetingSchedule"
    },

    "obligations": {
      "type": "array",
      "items": { "$ref": "#/$defs/Obligation" },
      "minItems": 1,
      "description": "At least one obligation required. A contract with no expectations is not a contract."
    },

    "milestones": {
      "type": "array",
      "items": { "$ref": "#/$defs/Milestone" },
      "default": [],
      "description": "Optional group-level checkpoints."
    },

    "boundary_rules": {
      "$ref": "#/$defs/BoundaryRules"
    },

    "accountability_rules": {
      "$ref": "#/$defs/AccountabilityRules"
    },

    "renewal": {
      "$ref": "#/$defs/Renewal"
    },

    "custom_fields": {
      "type": "object",
      "description": "Domain-specific extensions. Health circles might store biomarker_types here. Woodworking circles might store tool_requirements.",
      "additionalProperties": true
    }
  },

  "$defs": {

    "Duration": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": {
          "type": "string",
          "enum": ["fixed", "open_ended"],
          "description": "Fixed = defined end date. Open-ended = runs until dissolved."
        },
        "start_date": {
          "type": "string",
          "format": "date"
        },
        "end_date": {
          "type": ["string", "null"],
          "format": "date",
          "description": "Required for fixed, null for open-ended."
        },
        "duration_weeks": {
          "type": ["integer", "null"],
          "minimum": 1,
          "description": "Convenience field. Computed from start/end for fixed. Null for open-ended."
        }
      }
    },

    "MeetingSchedule": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": {
          "type": "string",
          "enum": ["recurring", "fixed_dates", "none"],
          "description": "Recurring = every N days/weeks. Fixed_dates = explicit list. None = async-only circle."
        },
        "cadence": {
          "type": ["object", "null"],
          "description": "For recurring type only.",
          "properties": {
            "every": {
              "type": "integer",
              "minimum": 1
            },
            "unit": {
              "type": "string",
              "enum": ["days", "weeks", "months"]
            },
            "preferred_day": {
              "type": ["string", "null"],
              "enum": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", null],
              "description": "Preferred day of week. Null if unit is days."
            },
            "preferred_time": {
              "type": ["string", "null"],
              "description": "ISO 8601 time (HH:MM). Scheduling is advisory, not enforced by the system."
            }
          }
        },
        "fixed_dates": {
          "type": ["array", "null"],
          "items": {
            "type": "string",
            "format": "date-time"
          },
          "description": "For fixed_dates type only. Explicit list of meeting times."
        },
        "duration_minutes": {
          "type": "integer",
          "minimum": 15,
          "maximum": 480,
          "description": "Expected length of each meeting in minutes."
        },
        "format": {
          "type": "string",
          "enum": ["video_call", "in_person", "async_thread", "hybrid"],
          "description": "How the meeting happens. Platform provides video; in_person is self-organized."
        }
      }
    },

    "Obligation": {
      "type": "object",
      "required": ["id", "type", "description", "cadence"],
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid"
        },
        "type": {
          "type": "string",
          "enum": [
            "session_post",
            "data_log",
            "attendance",
            "project_milestone",
            "peer_feedback",
            "custom"
          ],
          "description": "session_post = publish a practice session. data_log = record tracking data. attendance = show up to meetings. project_milestone = complete a deliverable. peer_feedback = review someone else's work. custom = freeform."
        },
        "description": {
          "type": "string",
          "maxLength": 500,
          "description": "Human-readable description. 'Post 1 gardening session per week' or 'Track 3 biomarkers daily'."
        },
        "cadence": {
          "type": "object",
          "required": ["quantity", "per"],
          "properties": {
            "quantity": {
              "type": "integer",
              "minimum": 1,
              "description": "How many times per period."
            },
            "per": {
              "type": "string",
              "enum": ["day", "week", "month", "contract", "meeting"],
              "description": "'contract' = once total. 'meeting' = once per meeting cycle."
            }
          }
        },
        "is_verifiable": {
          "type": "boolean",
          "default": false,
          "description": "Can the platform automatically verify this? session_post and data_log are verifiable. 'Be kind' is not."
        },
        "verification_method": {
          "type": ["string", "null"],
          "enum": ["platform_activity", "self_report", "peer_confirm", null],
          "description": "How fulfillment is checked. platform_activity = system detects it. self_report = member marks it done. peer_confirm = another member confirms."
        }
      }
    },

    "Milestone": {
      "type": "object",
      "required": ["id", "description", "target_date"],
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid"
        },
        "description": {
          "type": "string",
          "maxLength": 500
        },
        "target_date": {
          "type": "string",
          "format": "date"
        },
        "is_completed": {
          "type": "boolean",
          "default": false
        },
        "completed_at": {
          "type": ["string", "null"],
          "format": "date-time"
        }
      }
    },

    "BoundaryRules": {
      "type": "object",
      "required": ["join_policy", "leave_policy", "min_members", "max_members"],
      "properties": {
        "join_policy": {
          "type": "string",
          "enum": ["open", "approval_required", "invitation_only", "closed"],
          "description": "open = anyone can join. approval_required = existing members vote. invitation_only = must be invited. closed = no new members after start."
        },
        "join_approval_threshold": {
          "type": ["number", "null"],
          "minimum": 0.5,
          "maximum": 1.0,
          "description": "Fraction of existing members who must approve a new member. Only for approval_required."
        },
        "leave_policy": {
          "type": "string",
          "enum": ["anytime", "end_of_cycle", "with_notice"],
          "description": "anytime = immediate. end_of_cycle = at next renewal point. with_notice = must give N days notice."
        },
        "leave_notice_days": {
          "type": ["integer", "null"],
          "minimum": 1,
          "description": "For with_notice policy. How many days notice required."
        },
        "leave_consequence": {
          "type": "string",
          "enum": ["none", "forfeit_attestations", "cooldown"],
          "description": "none = clean exit. forfeit_attestations = lose peer attestations from this circle. cooldown = cannot join new circles for N days."
        },
        "cooldown_days": {
          "type": ["integer", "null"],
          "minimum": 1
        },
        "min_members": {
          "type": "integer",
          "minimum": 2,
          "description": "Circle dissolves if membership drops below this."
        },
        "max_members": {
          "type": "integer",
          "minimum": 2,
          "maximum": 30,
          "description": "Hard cap. P2PU research suggests 4-12 is the sweet spot."
        }
      }
    },

    "AccountabilityRules": {
      "type": "object",
      "required": ["model"],
      "properties": {
        "model": {
          "type": "string",
          "enum": ["honor_system", "grace_period", "strikes", "group_vote"],
          "description": "honor_system = no enforcement. grace_period = soft reminders. strikes = automatic consequences after N misses. group_vote = members decide on each case."
        },
        "grace_period_days": {
          "type": ["integer", "null"],
          "minimum": 1,
          "description": "For grace_period model. Days after deadline before a miss is counted."
        },
        "max_strikes": {
          "type": ["integer", "null"],
          "minimum": 1,
          "description": "For strikes model. Number of missed obligations before consequence."
        },
        "strike_consequence": {
          "type": ["string", "null"],
          "enum": ["warning", "removal_vote", "automatic_removal", null],
          "description": "What happens when max_strikes is reached."
        },
        "removal_vote_threshold": {
          "type": ["number", "null"],
          "minimum": 0.5,
          "maximum": 1.0,
          "description": "For group_vote model or removal_vote consequence. Fraction of members needed to remove."
        }
      }
    },

    "Renewal": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": {
          "type": "string",
          "enum": ["none", "vote", "automatic"],
          "description": "none = contract ends, period. vote = anonymous vote at contract end. automatic = renews unless dissolved."
        },
        "vote_threshold": {
          "type": ["number", "null"],
          "minimum": 0.5,
          "maximum": 1.0,
          "description": "For vote type. Fraction of members who must vote to continue."
        },
        "vote_window_days": {
          "type": ["integer", "null"],
          "minimum": 1,
          "description": "How many days before contract end the renewal vote opens."
        },
        "max_renewals": {
          "type": ["integer", "null"],
          "minimum": 1,
          "description": "Cap on how many times a contract can renew. Null = unlimited."
        }
      }
    }
  }
}
```

### Membership and Tracking (Relational)

These would be separate tables/collections referencing the contract:

```json
{
  "title": "CircleMembership",
  "type": "object",
  "required": ["circle_id", "member_did", "role", "status", "joined_at"],
  "properties": {
    "circle_id": { "type": "string", "format": "uuid" },
    "member_did": { "type": "string", "description": "The member's DID." },
    "role": {
      "type": "string",
      "enum": ["founder", "member"],
      "description": "Two roles only, per governance doc. Founder created the circle but has no extra power after ratification."
    },
    "status": {
      "type": "string",
      "enum": ["active", "left", "removed"]
    },
    "joined_at": { "type": "string", "format": "date-time" },
    "left_at": { "type": ["string", "null"], "format": "date-time" },
    "strikes": { "type": "integer", "default": 0 }
  }
}
```

```json
{
  "title": "ObligationFulfillment",
  "description": "One record per member per obligation per period. The ledger of who did what.",
  "type": "object",
  "required": ["membership_id", "obligation_id", "period_start", "period_end", "status"],
  "properties": {
    "membership_id": { "type": "string", "format": "uuid" },
    "obligation_id": { "type": "string", "format": "uuid" },
    "period_start": { "type": "string", "format": "date" },
    "period_end": { "type": "string", "format": "date" },
    "status": {
      "type": "string",
      "enum": ["pending", "fulfilled", "missed", "excused"],
      "description": "pending = period not over yet. fulfilled = obligation met. missed = period ended without fulfillment. excused = group granted an exception."
    },
    "fulfilled_at": { "type": ["string", "null"], "format": "date-time" },
    "evidence_refs": {
      "type": "array",
      "items": { "type": "string" },
      "description": "References to sessions, data logs, or other artifacts that prove fulfillment."
    },
    "verified_by": {
      "type": ["string", "null"],
      "enum": ["platform", "self", "peer", null]
    }
  }
}
```

---

## Configurability: Where to Draw the Line

The research reveals a clear pattern: **every platform that offers too many options up front gets low adoption.** Focusmate has exactly three session lengths. P2PU recommends 90 min/week for 6-8 weeks as *the* default. Book clubs have one rule: read the chapters.

### The principle: templates are opinionated defaults; customization is available but not required.

**Templated (pick and go):**
- Meeting cadence (weekly, biweekly, monthly)
- Duration (4, 8, 12 weeks, or open-ended)
- Contribution type (post sessions, log data, complete projects)
- Accountability model (honor system, strikes, group vote)

**Customizable (modify after picking a template):**
- Number of contributions per period
- Meeting duration and format
- Join/leave policies
- Strike count and consequences
- Renewal mechanism

**Hidden until needed (advanced settings):**
- Custom obligation types
- Milestone definitions
- Custom fields for domain-specific data
- Leave consequences beyond "none"
- Approval thresholds (uses governance defaults)

### Why this split works

A circle creator picks a template, sees 3-4 things they might want to tweak, and launches. The full schema exists underneath for circles that evolve complex needs over time. The 80/20 rule: 80% of circles will never touch advanced settings. The 20% that do are circles that have already built enough group culture to handle the complexity.

---

## Templates

### 1. Weekly Practice Circle

The default. Covers gardening, cooking, music, coding, crafts — any skill where regular practice is the point.

```json
{
  "template_id": "weekly_practice",
  "name": "Weekly Practice Circle",
  "description": "Meet weekly, share what you practiced. The bread-and-butter circle.",
  "duration": {
    "type": "fixed",
    "duration_weeks": 6
  },
  "meeting_schedule": {
    "type": "recurring",
    "cadence": { "every": 1, "unit": "weeks" },
    "duration_minutes": 60,
    "format": "video_call"
  },
  "obligations": [
    {
      "type": "session_post",
      "description": "Post 1 practice session per week",
      "cadence": { "quantity": 1, "per": "week" },
      "is_verifiable": true,
      "verification_method": "platform_activity"
    },
    {
      "type": "attendance",
      "description": "Attend the weekly meeting",
      "cadence": { "quantity": 1, "per": "meeting" },
      "is_verifiable": true,
      "verification_method": "platform_activity"
    }
  ],
  "milestones": [],
  "boundary_rules": {
    "join_policy": "closed",
    "leave_policy": "anytime",
    "leave_consequence": "none",
    "min_members": 3,
    "max_members": 8
  },
  "accountability_rules": {
    "model": "grace_period",
    "grace_period_days": 2
  },
  "renewal": {
    "type": "vote",
    "vote_threshold": 0.67,
    "vote_window_days": 7
  }
}
```

**Example use:** A 6-week gardening circle. Post 1 update/week showing what you planted, what grew, what died. Meet for 60 min weekly to discuss.

### 2. Tracking Experiment

For health experiments, n-of-1 trials, habit building — anything with daily/regular data logging.

```json
{
  "template_id": "tracking_experiment",
  "name": "Tracking Experiment",
  "description": "Log data regularly, share findings periodically. For health, habits, and self-experiments.",
  "duration": {
    "type": "fixed",
    "duration_weeks": 12
  },
  "meeting_schedule": {
    "type": "recurring",
    "cadence": { "every": 2, "unit": "weeks" },
    "duration_minutes": 60,
    "format": "video_call"
  },
  "obligations": [
    {
      "type": "data_log",
      "description": "Log tracking data daily",
      "cadence": { "quantity": 5, "per": "week" },
      "is_verifiable": true,
      "verification_method": "platform_activity"
    },
    {
      "type": "session_post",
      "description": "Post a summary session with findings monthly",
      "cadence": { "quantity": 1, "per": "month" },
      "is_verifiable": true,
      "verification_method": "platform_activity"
    },
    {
      "type": "attendance",
      "description": "Attend the biweekly check-in",
      "cadence": { "quantity": 1, "per": "meeting" },
      "is_verifiable": true,
      "verification_method": "platform_activity"
    }
  ],
  "milestones": [
    {
      "description": "Baseline period complete (2 weeks of data before intervention)",
      "target_date": "relative:+2w"
    },
    {
      "description": "Mid-point review: is the protocol working?",
      "target_date": "relative:+6w"
    },
    {
      "description": "Final analysis and share-out",
      "target_date": "relative:+12w"
    }
  ],
  "boundary_rules": {
    "join_policy": "closed",
    "leave_policy": "with_notice",
    "leave_notice_days": 7,
    "leave_consequence": "none",
    "min_members": 2,
    "max_members": 6
  },
  "accountability_rules": {
    "model": "strikes",
    "max_strikes": 3,
    "strike_consequence": "warning"
  },
  "renewal": {
    "type": "vote",
    "vote_threshold": 0.67,
    "vote_window_days": 7
  },
  "custom_fields": {
    "tracking_categories": ["biomarkers", "confounds", "interventions"],
    "data_sharing": "anonymized_aggregate_only"
  }
}
```

**Example use:** A 12-week health experiment circle tracking BDNF-related biomarkers. Log HRV, sleep, and mood daily. Meet biweekly to review trends. Anonymized data shared at group level.

### 3. Project Build

For longer commitments with a tangible deliverable — woodworking, coding projects, art series.

```json
{
  "template_id": "project_build",
  "name": "Project Build",
  "description": "Complete a project together over months. Regular progress updates, periodic critique sessions.",
  "duration": {
    "type": "fixed",
    "duration_weeks": 16
  },
  "meeting_schedule": {
    "type": "recurring",
    "cadence": { "every": 1, "unit": "months" },
    "duration_minutes": 90,
    "format": "video_call"
  },
  "obligations": [
    {
      "type": "session_post",
      "description": "Post a progress update every 2 weeks",
      "cadence": { "quantity": 2, "per": "month" },
      "is_verifiable": true,
      "verification_method": "platform_activity"
    },
    {
      "type": "peer_feedback",
      "description": "Give feedback on at least 1 other member's update each month",
      "cadence": { "quantity": 1, "per": "month" },
      "is_verifiable": false,
      "verification_method": "peer_confirm"
    },
    {
      "type": "project_milestone",
      "description": "Complete 1 finished project by circle end",
      "cadence": { "quantity": 1, "per": "contract" },
      "is_verifiable": false,
      "verification_method": "peer_confirm"
    }
  ],
  "milestones": [
    {
      "description": "Project plan shared with circle",
      "target_date": "relative:+2w"
    },
    {
      "description": "Halfway checkpoint — show work in progress",
      "target_date": "relative:+8w"
    },
    {
      "description": "Final show and tell",
      "target_date": "relative:+16w"
    }
  ],
  "boundary_rules": {
    "join_policy": "closed",
    "leave_policy": "with_notice",
    "leave_notice_days": 14,
    "leave_consequence": "forfeit_attestations",
    "min_members": 3,
    "max_members": 8
  },
  "accountability_rules": {
    "model": "group_vote",
    "removal_vote_threshold": 0.75
  },
  "renewal": {
    "type": "none"
  }
}
```

**Example use:** A 16-week woodworking circle. Each member builds one piece of furniture. Post progress photos biweekly. Monthly 90-min critique session with hot-seat rotation. Peer attestations at the end for completed projects.

### 4. Ongoing Practice Group

For activities without a natural endpoint — running, meditation, language practice. Low commitment, easy to sustain.

```json
{
  "template_id": "ongoing_practice",
  "name": "Ongoing Practice Group",
  "description": "No end date. Low-commitment rhythm for sustained practice. Show up, log your work, keep going.",
  "duration": {
    "type": "open_ended"
  },
  "meeting_schedule": {
    "type": "recurring",
    "cadence": { "every": 2, "unit": "weeks" },
    "duration_minutes": 45,
    "format": "video_call"
  },
  "obligations": [
    {
      "type": "session_post",
      "description": "Log at least 3 practice activities per week",
      "cadence": { "quantity": 3, "per": "week" },
      "is_verifiable": true,
      "verification_method": "platform_activity"
    }
  ],
  "milestones": [],
  "boundary_rules": {
    "join_policy": "approval_required",
    "join_approval_threshold": 0.5,
    "leave_policy": "anytime",
    "leave_consequence": "none",
    "min_members": 2,
    "max_members": 12
  },
  "accountability_rules": {
    "model": "honor_system"
  },
  "renewal": {
    "type": "automatic"
  }
}
```

**Example use:** An open-ended running group. Log 3 runs/week. Biweekly 45-min video check-in. New members need approval from half the group. Leave anytime, no penalty.

### 5. Intensive Workshop

One-time, short, high-intensity. A weekend build, a hackathon, a blitz.

```json
{
  "template_id": "intensive_workshop",
  "name": "Intensive Workshop",
  "description": "Short burst. One weekend or a few days. Build something together, then done.",
  "duration": {
    "type": "fixed",
    "duration_weeks": 1
  },
  "meeting_schedule": {
    "type": "fixed_dates",
    "fixed_dates": [],
    "duration_minutes": 180,
    "format": "hybrid"
  },
  "obligations": [
    {
      "type": "attendance",
      "description": "Attend all scheduled sessions",
      "cadence": { "quantity": 1, "per": "meeting" },
      "is_verifiable": true,
      "verification_method": "platform_activity"
    },
    {
      "type": "project_milestone",
      "description": "Contribute to the group deliverable",
      "cadence": { "quantity": 1, "per": "contract" },
      "is_verifiable": false,
      "verification_method": "peer_confirm"
    }
  ],
  "milestones": [
    {
      "description": "Workshop complete — final artifact shared",
      "target_date": "relative:+1w"
    }
  ],
  "boundary_rules": {
    "join_policy": "invitation_only",
    "leave_policy": "anytime",
    "leave_consequence": "none",
    "min_members": 2,
    "max_members": 15
  },
  "accountability_rules": {
    "model": "honor_system"
  },
  "renewal": {
    "type": "none"
  }
}
```

**Example use:** A weekend "build a raised bed" workshop. Two 3-hour sessions on Saturday and Sunday. Everyone brings materials, builds together, documents the process.

---

## Validation Against Requirements

| Scenario | Template | Key obligations | Duration | Notes |
|----------|----------|----------------|----------|-------|
| 4-week gardening circle | Weekly Practice (modified to 4 weeks) | 1 session/week, weekly attendance | Fixed, 4 weeks | Simplest case |
| 12-week health experiment | Tracking Experiment | 5 data logs/week, 1 summary/month, biweekly attendance | Fixed, 12 weeks | Uses custom_fields for biomarker types |
| Semester woodworking | Project Build (modified to 20 weeks) | 2 updates/month, 1 feedback/month, 1 project total | Fixed, 16-20 weeks | Peer attestation at completion |
| Open-ended running group | Ongoing Practice | 3 sessions/week | Open-ended | Honor system, approval to join |
| Weekend workshop | Intensive Workshop | Attend all sessions, contribute to deliverable | Fixed, 1 week | Fixed dates, invitation-only |

---

## Design Decisions and Rationale

**Why obligations are an array, not a single field.** Real circles have multiple expectations: show up AND post updates AND give feedback. Each obligation has its own cadence, verification method, and type. A single "commitment" field cannot represent "log data daily, post monthly, meet biweekly."

**Why accountability is a spectrum, not a binary.** Focusmate works with pure social pressure. Habitica works with mechanical consequences. Mastermind groups work with peer accountability. The model enum (honor_system, grace_period, strikes, group_vote) covers this spectrum. Most circles will use honor_system or grace_period. Strikes and group_vote exist for circles that evolve enough trust to want stronger enforcement.

**Why renewal is explicit.** P2PU found that circles longer than 8 weeks become alienating. The renewal mechanism lets a circle run 6 weeks, vote to continue, and start a fresh contract. This prevents the "we committed to 6 months and now half the group has ghosted" failure mode. Each renewal creates a new contract version — a natural checkpoint.

**Why boundary rules include leave consequences.** Leaving is always allowed (eternity clause: fork rights). But a circle can decide that leaving mid-contract means you do not get peer attestations from that circle. This is not punitive — it is honest. If you leave a woodworking circle at week 3, the remaining members cannot attest to your woodworking capabilities. The consequence is informational, not punitive.

**Why max_members caps at 30.** P2PU data: 4-12 is optimal. Mastermind groups: 5-10. Beyond 12, group dynamics shift from peer accountability to audience. 30 is the Habitica party cap and a reasonable upper bound for any "circle" (a word that implies intimacy).

**Why the schema has custom_fields.** Health circles need to specify which biomarkers to track. Gardening circles might specify climate zones. Coding circles might specify tech stack. Rather than trying to anticipate every domain, custom_fields is an open object that domain-specific templates can populate. The platform does not interpret these — it stores and displays them.

---

## Sources

- [P2PU Meeting Structure](https://docs.p2pu.org/methodology/learning-circle-structure)
- [P2PU Learning Circle Checklist](https://docs.p2pu.org/methodology/learning-circle-checklist)
- [Focusmate Science](https://www.focusmate.com/science/)
- [Focusmate CHADD Review](https://chadd.org/attention-article/focusmate-virtual-coworking/)
- [Habitica Party Wiki](https://habitica.fandom.com/wiki/Party)
- [Habitica Quests Wiki](https://habitica.fandom.com/wiki/Quests)
- [Strava Group Challenges](https://support.strava.com/hc/en-us/articles/360061360791-Group-Challenges)
- [Maven Course Events](https://help.maven.com/en/articles/5597433-your-course-events)
- [Mastermind Group Structure](https://mastermindbetter.com/groups/group-formation-structure/building-a-better-mastermind-group-essential-structure-format-agenda/)
- [Circle.so Mastermind Guide](https://circle.so/blog/mastermind-groups)
