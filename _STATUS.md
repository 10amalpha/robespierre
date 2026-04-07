# Robespierre — 10AMPRO Collective Intelligence Dashboard

## Quick Context
WhatsApp group engagement analytics for 10AMPRO community. AI-graded scoring across three pillars (Network, Intelligence, Capital) with panican detection, personas, and highlights. Built with Opus/Sonnet analysis of actual message content.

## Live
- **URL**: https://robespierre.vercel.app
- **Repo**: github.com/10amalpha/robespierre
- **Version**: V6.0 (Opus AI-Graded)
- **Last Deploy**: April 7, 2026
- **Vercel Project**: `prj_h7LiqacKcqwQcae368ZXoMyQ7aeL`
- **Team**: `team_nPG5TrnRZyVuclmm6dZL1AcX`

## Current Data: 2 Snapshots
| | s1 | s2 (CURRENT) |
|--|-----|------|
| **Period** | Nov 16 '25 → Feb 21 '26 | Feb 22 → Apr 7 '26 |
| **Days** | 96 | 44 |
| **Messages** | 1,989 | 8,082 |
| **Links** | 452 | 1,828 |
| **Members** | 126 | 133 |
| **Grading** | Opus AI | Opus AI |

Group activity **4x'd** from s1 to s2. 35 members added, 19 removed, 9 left, 24 new active senders.

## Architecture
```
robespierre/
  data/
    members.json    ← 133 members with AI-graded pillars, personas, highlights, panic scores
    meta.json       ← 2 snapshots, pillar defs, source stats, highlight types, panican rules
  app/
    page.js         ← 5-tab UI (Intel, Insights, Progress, Robespierre, Members)
    layout.js       ← fonts + meta
```

### Three Pillars (AI-Graded by Sonnet 4)
| Pillar | Weight | Measures |
|--------|--------|----------|
| 🔗 Network | 25% | Connecting people, intros, deal flow, @mentions |
| 🧠 Intelligence | 40% | Info diet quality, analysis depth, discussion engagement |
| 💰 Capital | 35% | Positions, theses, "I bought X because Y" |

### Additional Scoring
- **Panic Score** (0-100): Fear flooding without thesis. 40=flagged, 60=warning, 80=guillotine
- **Composite**: Weighted blend of 3 pillars
- **Tier**: A=40+, B=15-39, C=1-14, Z=0

### Opus Pipeline
- **API Key**: Stored in project memory
- **Process**: Extract messages per member → batch to Sonnet 4 API → grade pillars + panic + persona + highlights
- **Last run**: Apr 7, 2026 — 19 API calls, 74 members graded, ~$7 total
- **Output**: Per-member JSON with pillars, panicScore, panicFlags, persona, highlights

## Key Results (s2)

### Top 10 Composite
| # | Member | C | 🔗 | 🧠 | 💰 |
|---|--------|---|-----|-----|-----|
| 1 | Hernán Jaramillo 👑 | 91 | 95 | 92 | 88 |
| 2 | Guillermo Valencia | 87 | 85 | 95 | 80 |
| 3 | Simón Restrepo | 87 | 85 | 90 | 85 |
| 4 | Maria Rios | 87 | 85 | 90 | 85 |
| 5 | Felipe Medina | 87 | 85 | 90 | 85 |
| 6 | Enrique Uribe | 86 | 80 | 90 | 85 |
| 7 | Fede Suarez | 85 | 85 | 90 | 80 |
| 8 | Dario Palacio | 85 | 85 | 90 | 80 |
| 9 | Eduardo Llopis | 85 | 85 | 90 | 80 |
| 10 | Martin Pelaez | 85 | 85 | 90 | 80 |

### Panicans Detected (10)
| Member | Score | Evidence |
|--------|-------|----------|
| Juan Esteban Sanin | 85 | Political paranoia, conspiracy theories |
| Pablo Velez Mejia | 75 | Closes positions on fear, questions every spike |
| German Corredor | 75 | AI anxiety, feels left behind |
| Felo | 75 | Political anxiety |
| Ricardo Espinal | 45 | Geopolitical anxiety |
| Lucas Jaramillo | 40 | Reactive to drops, "borré el 2025 ya" |
| Monica Arango | 40 | "Prefiero no mirar" |
| Rodrigo Londoño | 40 | Job automation concerns |
| Luis Espinoza | 40 | War concerns |
| Peter Alexander | 40 | Bancolombia frustration |

### Source Stats (s2)
| Source | s1 | s2 | Change |
|--------|-----|-----|--------|
| X/Twitter | 754 | 1,245 | +65% |
| YouTube | 151 | 128 | -15% |
| Substack | 71 | 132 | +86% |
| Instagram | 16 | 26 | +63% |
| TikTok | 14 | 40 | +186% |
| Bloomberg/Reuters/FT | 4 | 7 | +75% |

## 5 Tabs
1. **🧠 Intelligence** — Three Pillars overview, Top 5 per pillar, Network Node Map (force graph), 💎 Best Of highlights, System Health gauges, KPI grid
2. **💡 Insights** — Pillar Diagnosis, Founder Dependency, Lurker/Bus Factor, Pillar-Based Actions
3. **📈 Progress** — s1→s2 snapshot timeline, baseline metrics with targets, "What s2 Will Reveal" (or deltas when comparing)
4. **⚔️ Robespierre** — Execution stats, Crimes, 🚨 Panicans (AI-detected), Source Quality, Zombies, Deserters, Death Row, Redemption
5. **👥 Members** — Search/filter/sort (7 options), expandable cards with radar, pillars, panic, persona, highlights, trajectory

## Version History
| Version | Date | Changes |
|---------|------|---------|
| V1-V3 | Feb 21 | Initial builds |
| V4 | Feb 21 | Production — 4 tabs, single score |
| V5.0 | Apr 7 | Metrics ledger architecture |
| V5.1 | Apr 7 | Three pillars |
| V5.2 | Apr 7 | Rate-based scoring |
| V5.3 | Apr 7 | Panicans framework |
| V5.4 | Apr 7 | Network Node Map |
| V5.5 | Apr 7 | Personas |
| V5.6 | Apr 7 | Progress tab |
| V5.7 | Apr 7 | Best Of highlights |
| V6.0 | Apr 7 | **Opus AI grading — full chat analysis** |

## TODO
- [ ] Group-level Best Of highlights (top 15 across all members)
- [ ] Real @mention edges for Node Map (extractable from chat data)
- [ ] Trend charts on Progress tab (pillar averages over time)
- [ ] Build Robespierre bot (Mac Mini + KIMI)
- [ ] Quarterly re-run of Opus pipeline
