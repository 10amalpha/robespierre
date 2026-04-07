# Robespierre — 10AMPRO Collective Intelligence Dashboard

## Quick Context
WhatsApp group engagement analytics for 10AMPRO community. AI-graded scoring across three pillars (Network, Intelligence, Capital) with panican detection, personas, highlights, and network visualization. Built with Sonnet 4 analysis of actual message content — not proxy math.

## Live
- **URL**: https://robespierre.vercel.app
- **Repo**: github.com/10amalpha/robespierre
- **Version**: V6.0 (Opus AI-Graded, Mobile Responsive)
- **Last Deploy**: April 7, 2026
- **Vercel Project**: `prj_h7LiqacKcqwQcae368ZXoMyQ7aeL`
- **Team**: `team_nPG5TrnRZyVuclmm6dZL1AcX`

## Current Data
| | s1 | s2 (CURRENT) |
|--|-----|------|
| **Period** | Nov 16 '25 → Feb 21 '26 | Feb 22 → Apr 7 '26 |
| **Days** | 96 | 44 |
| **Messages** | 1,989 | 8,082 |
| **Links** | 452 | 1,828 |
| **Members** | 126 | 131 |
| **Grading** | Sonnet 4 AI | Sonnet 4 AI |

Group activity **4x'd** from s1 to s2. 35 members added, 19 removed, 9 left. Detected automatically from chat system messages (no screenshots needed).

## Architecture
```
robespierre/
  data/
    members.json    ← 131 members, AI-graded pillars + personas + highlights + panic
    meta.json       ← 2 snapshots, pillar defs, source stats, highlight types, rules
  app/
    page.js         ← 5-tab UI (~1150 lines), mobile-responsive
    layout.js       ← viewport meta, theme-color, PWA-capable
```

### Three Pillars (AI-Graded by Sonnet 4)
| Pillar | Weight | Measures |
|--------|--------|----------|
| 🔗 Network | 25% | Connecting people, intros, deal flow, @mentions |
| 🧠 Intelligence | 40% | Info diet quality, analysis depth, discussion engagement |
| 💰 Capital | 35% | Positions, theses, "I bought X because Y" |

### Scoring
- **Pillar scores** (0-100): AI-graded from actual message content by Sonnet 4
- **Composite**: Weighted pillar blend × engagement multiplier
- **Engagement multiplier**: Scales 0.5→1.0 based on msg count (prevents 15-msg members outranking 1000-msg contributors)
- **Panic Score** (0-100): Fear flooding without thesis. 40=flagged, 60=warning, 80=guillotine
- **Tier**: A=composite 40+, B=15-39, C=1-14, Z=0

### Per-Member Data
Each member stores: tier, composite, pillars {network, intelligence, capital}, panicScore, panicFlags[], persona {bio, tags, role, platforms}, highlights [{type, summary, quality}], history [{snapshot, composite, pillars, tier}], plus activity stats (msgs, links, avgWords, activeDays, activeWeeks, lastActive, daysInactive).

## AI Pipeline
- **API Key**: Stored in project memory (Claude API)
- **Model**: Sonnet 4 (fast, accurate for classification)
- **Process**: Extract msgs per member → batch to API (19 calls) → grade pillars + panic + persona + highlights
- **Cost**: ~$7 per full run (131 members, 10K+ messages)
- **What AI reads**: Actual Spanish/English message content. Understands context, detects theses vs noise, identifies panic patterns.
- **What gets stored**: Only scores, summaries, flags. No raw messages in repo.

## Key Results

### Top 10 Composite
| # | Member | C | 🔗 | 🧠 | 💰 | Msgs |
|---|--------|---|-----|-----|-----|------|
| 1 | Hernán 👑 | 91 | 95 | 92 | 88 | 4,766 |
| 2 | Guillermo Valencia | 87 | 85 | 95 | 80 | 138 |
| 3 | Simón Restrepo | 87 | 85 | 90 | 85 | 67 |
| 4 | Enrique Uribe | 86 | 80 | 90 | 85 | 120 |
| 5 | Fede Suarez | 85 | 85 | 90 | 80 | 340 |
| 6 | Dario Palacio | 85 | 85 | 90 | 80 | 380 |
| 7 | Eduardo Llopis | 85 | 85 | 90 | 80 | 53 |
| 8 | Camilo Ospina Lumm | 84 | 85 | 90 | 75 | 72 |
| 9 | Camilo Botero | 83 | 70 | 90 | 85 | 225 |
| 10 | Andres Felipe Arias | 80 | 78 | 85 | 75 | 1,355 |

### Panicans (10 Flagged)
| Member | Score | Evidence |
|--------|-------|----------|
| Juan Esteban Sanin | 85 | Political paranoia, conspiracy theories |
| Pablo Velez Mejia | 75 | Closes positions on fear, questions every spike |
| German Corredor | 75 | AI anxiety, feels left behind |
| Felo | 75 | Political anxiety |
| Ricardo Espinal | 45 | Geopolitical anxiety |
| Lucas Jaramillo | 40 | Reactive to drops |
| Monica Arango | 40 | "Prefiero no mirar" |
| + 3 more at 40 | | |

### Source Stats (s2)
| Source | s1 | s2 | Δ |
|--------|-----|-----|---|
| X/Twitter | 754 | 1,245 | +65% |
| YouTube | 151 | 128 | -15% |
| Substack | 71 | 132 | +86% |
| Instagram | 16 | 26 | +63% |
| TikTok | 14 | 40 | +186% ⚠️ |
| Bloomberg/Reuters/FT | 4 | 7 | +75% |

## 5 Tabs

### 🧠 Intel
- Three Pillars overview (group avg per pillar + weights)
- **Top 10 per pillar** leaderboards (Network, Intelligence, Capital)
- 🌐 Network Node Map (force-directed canvas graph, hover/click)
- 💎 Best Of highlights (pending group-level population)
- System Health gauges (Knowledge Distribution, S/N, Density, Decentralization)
- KPI grid (Active Brains, Links, Velocity, Depth, 7d Pulse, Dead Weight)

### 💡 Insights
- Pillar Diagnosis (per-pillar strong/weak + actionable insight)
- Founder Dependency (msg share 21%, link share 37%)
- Lurker Ratio, Bus Factor
- Pillar-Based Actions (5 plays)

### 📈 Progress
- Snapshot timeline (s1, s2 with stats)
- Baseline metrics with targets + ✓/✗
- Tier distribution bar chart
- "What s2 Will Reveal" roadmap (8 dimensions)
- When comparing: pillar deltas, tier movements, biggest climbers/drops

### ⚔️ Robes
- Execution stats (Zombies, Tier C, Dormant B, Total Cut)
- Crimes Against CI (3 types)
- 🚨 Panicans (AI-detected, 10 flagged with evidence + Capital cross-ref)
- Source Quality bars
- Zombie list, Deserters, Death Row
- Pillar-based Redemption Path

### 👥 Members
- Tier cards (A/B/C/Z counts)
- Search + filter + **sort by: Composite, 🔗 Network, 🧠 Intelligence, 💰 Capital, Msgs, Links, Inactive**
- Expandable cards: radar triangle, pillar bars, panic bar, engagement metrics, persona (bio + platforms + tags + role), highlights (top 3), trajectory

## Mobile Responsive
- Viewport meta tag (width=device-width, no zoom)
- Theme-color for mobile chrome (#0a0a0f)
- Apple mobile web app capable
- All padding mobile-optimized (14px sides)
- Tab labels shortened, horizontally scrollable
- Cards flex-wrap, radar stacks vertically
- Canvas responsive (600×400, 100% width)
- MinWidth values reduced throughout

## Data Integrity
- 3 duplicate members merged (Hernán/Hernan, Antonio/antonio, Felipe Valencia/valencia)
- Engagement multiplier prevents low-activity score inflation
- Member additions/removals detected from chat system messages
- No screenshots needed — chat export is single source of truth

## Version History
| Version | Date | Changes |
|---------|------|---------|
| V1-V3 | Feb 21 | Initial builds — monolithic JSX |
| V4 | Feb 21 | Production — 4 tabs, single score |
| V5.0 | Apr 7 | Metrics ledger architecture — data/UI split |
| V5.1 | Apr 7 | Three pillars (Network, Intelligence, Capital) |
| V5.2 | Apr 7 | Rate-based scoring (quality > volume) |
| V5.3 | Apr 7 | Panicans detection framework |
| V5.4 | Apr 7 | Network Node Map (force graph) |
| V5.5 | Apr 7 | Member Personas (identity layer) |
| V5.6 | Apr 7 | Progress tab (differential tracking) |
| V5.7 | Apr 7 | Best Of highlights framework |
| V6.0 | Apr 7 | **Sonnet 4 AI grading** — 19 API calls, 74 members graded from actual messages |
| V6.0+ | Apr 7 | Mobile responsive, Top 10 leaderboards, dedup, engagement multiplier |

## TODO
- [ ] Group-level Best Of highlights (top 15 across all members)
- [ ] Real @mention edges for Node Map
- [ ] Trend charts on Progress tab
- [ ] Build Robespierre bot (Mac Mini + KIMI)
- [ ] Quarterly Opus re-run (next: ~July 2026)
- [ ] Consider Opus (instead of Sonnet) for deeper analysis next run

## Related
- Claude Project: `10ampro_robespierre_v4.jsx` + `_chat.txt`
- Claude API key: stored in project memory
- Chat export: `WhatsApp_Chat_-_10ampro_-_CLUB_2.zip` (16,184 lines, Oct 22 '25 → Apr 7 '26)
