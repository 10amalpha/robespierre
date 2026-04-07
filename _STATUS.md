# Robespierre — 10AMPRO Collective Intelligence Dashboard

## Quick Context
WhatsApp group engagement analytics for 10AMPRO community. Measures collective intelligence health, identifies dead weight, enforces information diet quality. Named after the group's own enforcement culture ("guillotina").

## Live
- **URL**: https://robespierre.vercel.app
- **Repo**: github.com/10amalpha/robespierre
- **Vercel Project**: `prj_h7LiqacKcqwQcae368ZXoMyQ7aeL`
- **Team**: `team_nPG5TrnRZyVuclmm6dZL1AcX`
- **Current Version**: V5 (Metrics Ledger Architecture)
- **Last Deploy**: April 7, 2026

## Architecture (V5 — Metrics Ledger)

### Design Principle
Process the ore, keep only the gold. Raw WhatsApp exports are parsed for metrics then discarded. The repo stores only the graded output — scores, tiers, activity metrics, and trajectory history. No chat content, no messages, no timestamps of individual posts.

### File Structure
```
robespierre/
  data/
    members.json      ← metrics ledger (126 members, ~62KB)
    meta.json         ← snapshots registry, scoring rules, source stats
  app/
    page.js           ← UI component (imports from data/, never hardcodes data)
    layout.js         ← root layout (fonts, meta tags)
  _STATUS.md          ← this file
  package.json        ← Next.js 14, React 18
  next.config.js      ← minimal config
```

### Data Layer (`data/`)
- **`members.json`** — The ledger. Keyed by member name. Each entry:
  - Current metrics: tier, score, msgs, links, avgWords, activeDays, activeWeeks, lastActive, daysInactive
  - Score components: volume (0-30), consistency (0-25), substance (0-20), recency (0-25)
  - `isFounder` flag (Hernán Jaramillo)
  - `history[]` array — one entry per snapshot with score + tier. Enables trajectory tracking across audits.
- **`meta.json`** — Group config:
  - `snapshots[]` — registry of all audit periods (id, date range, days, totals)
  - `currentSnapshot` — which snapshot the UI renders
  - `scoring` — model documentation (weights, caps, descriptions)
  - `tierThresholds` — A=40+, B=15-39, C=1-14, Z=0
  - `rules` — junk sources, good sources, zombie threshold
  - `sourceStats` — per-snapshot link source breakdown

### UI Layer (`app/page.js`)
- Imports both JSON files at build time
- Transforms ledger format into flat array for rendering
- All metrics computed dynamically from data (KPIs, gauges, flywheel, leaderboard)
- 4 tabs: Intelligence, Insights, Robespierre, Members
- When `history[]` has 2+ entries: shows delta arrows (▲▼) on member cards and trajectory chips
- When `snapshots` has 2+ entries: shows version badge in header
- No database needed — static JSON at build time = instant load, zero cost

### Update Workflow
```
1. Upload new WhatsApp chat export to Claude
2. Claude parses → computes metrics for new period only
3. Merge into data/members.json:
   - Update cumulative totals (msgs, links, activeDays, etc.)
   - Recalculate scores and tiers
   - Append new entry to each member's history[]
   - Add any new members, flag removed ones
4. Add new snapshot entry to data/meta.json
5. git push → Vercel auto-deploys (page.js untouched)
```

### Why No Database
Robespierre updates ~4x/year (quarterly audits). The data is 62KB of JSON. Adding Supabase/Postgres would mean connection strings, API layers, auth, and a monthly bill — all to serve data that changes once a quarter. JSON-in-git gives: version control for free (every snapshot = a git commit), zero infrastructure, zero cost, fastest possible load time. Database makes sense only if/when: (a) the Robespierre bot writes data in real-time, (b) multiple users trigger updates via UI, or (c) multi-group instances exist.

## Current Snapshot: s1
- **Range**: Nov 16, 2025 → Feb 21, 2026 (96 days)
- **Source**: WhatsApp chat export + member list screenshots
- **Status**: Baseline. Awaiting s2 export for first trajectory comparison.

### Numbers
| Metric | Value | Target |
|--------|-------|--------|
| Total members | 126 | — |
| Tier A (Active) | 66 | — |
| Tier B (Watch) | 12 | — |
| Tier C (Remove) | 9 | — |
| Tier Z (Zombie) | 39 | 0 |
| Founder msg share | 29% | <15% |
| Founder link share | 52% | <20% |
| Knowledge distribution | 63% | >85% |
| Signal-to-noise | 86% | >80% ✓ |
| Network density | 32% | >50% |
| Decentralization | 71% | >85% |
| Bus factor | 1 | 5+ |
| Dead weight to cut | 53 | 0 |

## 4 Tabs
1. **🧠 Intelligence** — System health gauges (Knowledge Distribution, S/N, Network Density, Decentralization), 6 KPI cards, Learning Flywheel (4 progress bars with targets), Top 10 Knowledge Nodes leaderboard (clickable → Members)
2. **💡 Insights** — Founder Dependency deep dive (4 metric cards + analysis text with clickable member names), 6 insight cards (Top 5 Concentration, Lurker Ratio, Signal Quality, Knowledge Input Diversity, Consistency, Bus Factor), 5 Actionable Plays
3. **⚔️ Robespierre** — La Guillotina header, Execution stats (4 cards), Crimes Against CI (3 offense types), Future Guillotine Offenses, Group Information Diet (source bars from meta.json), Zombie list, Tier C Deserters, Death Row (dormant B), Redemption Path
4. **👥 Members** — Tier summary cards, search/filter/sort, expandable member cards with score breakdown (volume/consistency/substance/recency bars), trajectory chips when history > 1 snapshot

## Scoring Model
Engagement Score (0-100):
- **Volume** (0-30): msgs/week × 5, capped at 30
- **Consistency** (0-25): (active weeks / total weeks) × 25
- **Substance** (0-20): (avg words/10) × 10 + (links × 2), capped at 20
- **Recency** (0-25): 25 if <7d, 20 if <14d, 12 if <30d, 5 if <60d, 0 if 60d+
- **Tier thresholds**: A = 40+, B = 15-39, C = 1-14, Z = 0 (never posted)

## Signal Quality Rules
- **Good sources** (+1): X/Twitter, YouTube, Substack, Bloomberg, Reuters, FT, arxiv
- **Junk food** (-2): Instagram, TikTok
- **gordo Barato exempt** from junk food penalty (10AMPRO content creator)
- **Stale content** (-1): community flags "viejo/old/repetido"
- **Self-aware reshare** (-0.5): "perdón si es repetido"
- Group rule since Jan 21, 2026: "Old/repetido = Guillotina"

## Source Quality (s1)
| Source | Links | Verdict |
|--------|-------|---------|
| X/Twitter | 754 | Primary alpha ✓ |
| YouTube | 151 | Deep content ✓ |
| Substack | 71 | Analysis ✓ |
| Instagram | 16 | Junk food ✗ |
| TikTok | 14 | Junk food ✗ (86% gordo Barato — exempt) |
| Bloomberg/Reuters/FT | 4 | Premium ✓ (need more) |

## Known Limitations
- **Emoji reactions not captured**: WhatsApp exports exclude tap-reactions
- **Zero-post members from screenshots only**: Cross-referenced chat export (87 posted) with member list (126 total)
- **No reply-thread analysis**: Export format doesn't capture who replied to whom
- **Duplicate URL detection not yet built**: Can't detect same link shared twice

## Version History
| Version | Date | Changes |
|---------|------|---------|
| V1-V3 | Feb 21, 2026 | Initial builds — monolithic JSX with hardcoded data |
| V4 | Feb 21, 2026 | Production release — 4 tabs, scoring model, full UI |
| V5 | Apr 7, 2026 | Metrics ledger architecture — data/UI separation, history tracking, snapshot system |

## TODO / Next Steps
- [ ] Ingest s2 WhatsApp export (new conversations pending upload)
- [ ] Apply tweaks to scoring/UI (tweaks pending from user)
- [ ] Add signal freshness scoring (detect "viejo/old/repetido" community flags)
- [ ] Implement IG/TikTok penalty in scoring model
- [ ] Cross-tab: clicking zombie names in Robespierre → Members tab
- [ ] Add "executed date" tracking once members are actually removed
- [ ] Build Robespierre bot (Mac Mini + KIMI — mentioned in chat Feb 9)
- [ ] Consider database layer when bot goes live (not before)

## Related
- Claude Project: `10ampro_robespierre_v4.jsx` + `_chat.txt` (WhatsApp export, 9358 lines)
- Goldfishmemory: `10AMPRO_WhatsApp_CI_Status.docx` in Google Drive (needs updating)
