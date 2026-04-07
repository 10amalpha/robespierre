# Robespierre — 10AMPRO Collective Intelligence Dashboard

## Quick Context
WhatsApp group engagement analytics for 10AMPRO community. Measures collective intelligence health, identifies dead weight, enforces information diet quality. Named after the group's own enforcement culture ("guillotina").

## Live
- **URL**: https://robespierre.vercel.app
- **Repo**: github.com/10amalpha/robespierre
- **Vercel Project**: `prj_h7LiqacKcqwQcae368ZXoMyQ7aeL`
- **Team**: `team_nPG5TrnRZyVuclmm6dZL1AcX`

## Architecture (V5 — Metrics Ledger)
- Next.js 14 App Router
- Single page: `app/page.js` ('use client' component)
- **Data layer separated from UI:**
  - `data/members.json` — metrics ledger (126 members, ~62KB)
  - `data/meta.json` — group config, snapshot history, scoring rules, source stats
- UI reads from JSON imports — no hardcoded data in component
- Each member has a `history[]` array tracking score/tier across snapshots
- No backend/API — static data from WhatsApp export analysis
- Fonts: JetBrains Mono (metrics), Inter (text)
- Dark theme (#0a0a0f background)
- No external UI libs — pure inline styles

### Update Workflow
1. Upload new WhatsApp chat export
2. Parse → compute metrics for new period
3. Merge into `data/members.json` (update totals, add history entry, recalculate tiers)
4. Add new snapshot to `data/meta.json`
5. Push → Vercel auto-deploys (UI untouched)

### What Gets Kept vs Thrown Away
- **Kept**: scores, tiers, msg counts, link counts, avg words, active days/weeks, last active, score components, trajectory history
- **Thrown away**: raw chat text, individual messages, timestamps, message content

## Data Period
- **Range**: Nov 16, 2025 → Feb 21, 2026 (96 days)
- **Source**: WhatsApp chat export (_chat.txt) + member list screenshots
- **Export file**: `WhatsApp_Chat_-_10ampro_-___for_Non-learners.zip`

## Current Numbers (Baseline)
| Metric | Value | Target |
|--------|-------|--------|
| Total members | 126 | — |
| Tier A (Active) | 66 | — |
| Tier B (Watch) | 12 | — |
| Tier C (Remove) | 9 | — |
| Tier Z (Zombie) | 39 | 0 |
| Founder msg share | 29% | <15% |
| Founder link share | 52% | <20% |
| Knowledge distribution | 71% | >85% |
| Signal-to-noise | 73% | >80% |
| Network density | 30% | >50% |
| Bus factor | 1 | 5+ |
| Dead weight to cut | 53 | 0 |

## 4 Tabs
1. **🧠 Intelligence** — System health gauges (4 circular metrics), KPI grid (6 cards), Learning Flywheel (4 progress bars with targets), Top 10 Knowledge Nodes (clickable → Members tab)
2. **💡 Insights** — Founder Dependency deep dive (4 metric cards + analysis), 6 insight cards (Top 5 Concentration, Lurker Ratio, Signal Quality, Knowledge Input Diversity, Consistency, Bus Factor), 5 Actionable Plays
3. **⚔️ Robespierre** — Execution stats (4 cards), Crimes Against CI (3 offense types), Future Guillotine Offenses (junk food, stale content, lurking), Group Information Diet (source quality bars), Zombie list (39 purple tags), Deserters (Tier C), Death Row (dormant Tier B), Redemption Path (4 conditions)
4. **👥 Members** — Tier stat cards, search, filter (All/Active/Watch/Remove/Zombie), sort (Score/Messages/Links/Inactive), expandable member cards with score breakdown (volume/consistency/substance/recency bars)

## Scoring Model
Engagement Score (0-100):
- **Volume** (0-30): msgs/week × 5, capped
- **Consistency** (0-25): active weeks / total weeks × 25
- **Substance** (0-20): (avg words/10) × 10 + (links × 2), capped
- **Recency** (0-25): 25 if <7d, 20 if <14d, 12 if <30d, 5 if <60d, 0 if 60d+
- Tier thresholds: A = 40+, B = 15-39, C = <15, Z = 0 (never posted)

## Data Model (D array keys)
```
n  = name
t  = tier (A/B/C/Z)
s  = total score
m  = total messages
l  = links shared
w  = avg words per msg
ad = active days
aw = active weeks
la = last active date
di = days inactive
vs = volume score
cs = consistency score
ss = substance score
rs = recency score
u  = true if founder (Hernán)
```

## Signal Quality Rules (for next audit)
- **Good sources** (+1): X/Twitter, YouTube, Substack, Bloomberg, Reuters, FT, arxiv
- **Junk food** (-2): Instagram, TikTok
- **gordo Barato exempt** from junk food penalty (10AMPRO content creator)
- **Stale content** (-1): community flags "viejo/old/repetido" on a share
- **Self-aware reshare** (-0.5): "perdón si es repetido" shows awareness
- Group rule since Jan 21, 2026: "Old/repetido = Guillotina"

## Source Quality (this period)
| Source | Links | Verdict |
|--------|-------|---------|
| X/Twitter | 754 | Primary alpha ✓ |
| YouTube | 151 | Deep content ✓ |
| Substack | 71 | Analysis ✓ |
| Instagram | 16 | Junk food ✗ |
| TikTok | 14 | Junk food ✗ (86% gordo Barato — exempt) |
| Bloomberg/Reuters/FT | 4 | Premium ✓ (need more) |

## Known Limitations
- **Emoji reactions not captured**: WhatsApp exports exclude tap-reactions. Some "zombies" may be active reactors.
- **Zero-post members from screenshots only**: Cross-referenced chat export (87 who posted) with member list screenshots (126 total). 39 never typed.
- **No reply-thread analysis**: Export format doesn't capture who replied to whom.
- **Single export window**: Need additional exports to track trends.
- **Duplicate URL detection not yet built**: Can't detect same link shared twice.

## TODO / Next Steps
- [ ] Polish UI/UX (current session)
- [ ] Add signal freshness scoring (detect "viejo/old/repetido" community flags)
- [ ] Implement IG/TikTok penalty in scoring model
- [ ] Ingest new WhatsApp exports for trend tracking (before/after guillotine)
- [ ] Track founder dependency delta over time
- [ ] Cross-tab: clicking zombie names in Robespierre → Members tab
- [ ] Add "executed date" tracking once members are actually removed
- [ ] Build Robespierre bot (Mac Mini + KIMI — mentioned in chat Feb 9)
- [ ] Quarterly re-analysis automation

## Related Transcripts
- `/mnt/transcripts/2026-02-21-18-03-03-whatsapp-engagement-analysis.txt` — original analysis
- `/mnt/transcripts/2026-02-21-18-43-02-whatsapp-collective-intelligence-dashboard.txt` — CI dashboard build

## Goldfishmemory
Status doc also saved to Google Drive Goldfishmemory folder as `10AMPRO_WhatsApp_CI_Status.docx` (needs updating with zombie data).
