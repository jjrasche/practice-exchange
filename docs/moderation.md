# Moderation Architecture

## Core Insight

The content format IS the primary moderation layer. Structured documentation platforms (Instructables, iNaturalist, Strava) have abuse rates under 0.05%, compared to 1-5% for freeform text platforms. practice.exchange's format eliminates ~80% of abuse categories entirely.

## What the Format Prevents

- Dogpiling / mob harassment (no reply mechanism)
- Brigading (no voting or engagement metrics)
- Doxxing (pseudonymous, faces blurred, no freeform text on public content)
- Flame wars (no comments on public content)
- Misinformation virality (no sharing/repost mechanic, no algorithmic amplification)
- Impersonation (DID-based identity)

## Realistic Attack Vectors

1. **Inappropriate photos disguised as practice** -- NSFW.js + NudeNet catches 95%+
2. **Harmful narration over innocent photos** -- Whisper transcription + Perspective API
3. **Dangerous practice documentation** -- Topic keyword classification + community flagging
4. **Copyright violation** -- EXIF analysis + perceptual hash duplicate detection
5. **CSAM** -- PhotoDNA via NCMEC (legal requirement, non-negotiable)

## Automated Pipeline (runs before content goes live)

```
User creates session
  -> Client-side: NSFW.js screens photos (instant, blocks obvious NSFW)
  -> Upload to server
  -> Server pipeline (async):
      1. NudeNet: second-pass image safety
      2. PhotoDNA: CSAM check (legal requirement)
      3. pHash: duplicate detection across accounts
      4. EXIF analysis: metadata sanity check
      5. Whisper: transcribe audio (if not already transcribed on-device)
      6. Perspective API: toxicity score on transcript
      7. CLIP: photo-narration coherence score (secret weapon)
      8. All pass -> content goes live
      9. Any flag -> held for gardener review
  -> Post-publish: community flag button -> gardener queue
```

## CLIP Coherence Check

practice.exchange's unique moderation advantage. Because sessions have photos AND narration about the same practice, CLIP embeddings can verify internal consistency:
- Garden photos + gardening narration = high coherence = passes
- Random offensive images + gardening narration = low coherence = flagged

Freeform platforms cannot do this. This is only possible because the content format is structured.

## Metadata Heuristics (zero AI cost)

- New account rate limiting: 1 upload in first 24 hours, 3 in first week
- Upload velocity cap per day
- Duplicate detection via perceptual hashing
- EXIF consistency (phone photos have predictable metadata; downloaded images do not)
- Image dimension checks (phone photos vs. screenshots of memes)
- Narration length bounds (30 seconds to 10 minutes is legitimate)

## Community Layer

- Any user can flag content ("this does not look like a practice session")
- 2-3 "gardeners" (not "moderators") from early users review flag queue
- Progressive trust: first 3 uploads from new accounts held for review
- Transparent moderation log: every action is public
- At scale: gardener pool grows with community. Structured format delays the moderation crisis point from ~5K users (freeform platforms) to ~50K+ users.

## Cost

$0. All tools are self-hosted or free tier:
- NSFW.js: client-side JavaScript, free
- NudeNet: self-hosted, free
- PhotoDNA: free via NCMEC for qualifying organizations
- Whisper: runs on-device or self-hosted
- Perspective API: free tier (generous for early scale)
- CLIP: self-hosted, free
- pHash: library, free

## Implementation Priority

1. NSFW.js client-side (day 1 -- blocks obvious stuff before upload)
2. Rate limiting middleware (day 1)
3. Flag button + simple review queue (day 1)
4. PhotoDNA application to NCMEC (start early -- approval takes weeks)
5. NudeNet server-side (week 1)
6. Whisper + Perspective API pipeline (week 1)
7. CLIP coherence check (week 2)
8. Perceptual hashing (week 2)
