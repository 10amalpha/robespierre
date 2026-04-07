# 10AMPRO Club — Collective Intelligence Dashboard

> 💰 Open Source Capital · 🧠 Collective Intelligence · 🔗 Network Sharing
> The three pillars to belong. Powered by Cerebro.

## Live
- **URL**: https://club.10am.pro
- **Fallback**: https://robespierre.vercel.app
- **Repo**: github.com/10amalpha/robespierre
- **Version**: V7.3 (Opus Deep-Graded, Guillotine Timer, Pay to Stay, Header Tally)
- **Last Deploy**: April 7, 2026
- **Vercel**: `prj_h7LiqacKcqwQcae368ZXoMyQ7aeL` / `team_nPG5TrnRZyVuclmm6dZL1AcX`

## Architecture
```
robespierre/
  data/
    members.json    ← 129 members, Opus-graded + savedBy/savedUntil fields
    meta.json       ← snapshots, pillars, sources, highlights, token config
  app/
    page.js         ← 5-tab UI, mobile-responsive, guillotine timers
    layout.js       ← viewport, PWA, favicon, manifest
  public/
    logo.jpg, icons, manifest.json (from mercados.10am.pro)
```

## Data
| | s1 | s2 (CURRENT) |
|--|-----|------|
| **Period** | Nov 16 '25 → Feb 21 '26 | Feb 22 → Apr 7 '26 |
| **Days** | 96 | 44 |
| **Messages** | 1,989 | 8,082 |
| **Links** | 452 | 1,828 |
| **Members** | 129 (87 Opus-graded, 34 zombies) |

## Opus AI Pipeline (Cerebro)
- **Model**: Claude Opus 4 — full messages, not sampled
- **10 batches**, 87 members, ~$8.40 total
- **HARSH differentiation**: only 2 above 90, real spread to single digits
- **Zero manual overrides** — 100% Opus judgment

## Three Pillars
| Pillar | Weight | Measures |
|--------|--------|----------|
| 💰 Open Source Capital | 35% | Positions, theses, "I bought X because Y" |
| 🧠 Collective Intelligence | 40% | Original analysis, quality sources, frameworks |
| 🔗 Network Sharing | 25% | Connecting people, intros, bridging opportunities |

## 🏆 Top 10
| # | Member | C | 🔗 | 🧠 | 💰 | Role |
|---|--------|---|-----|-----|-----|------|
| 1 | Hernán 👑 | 93 | 95 | 92 | 94 | visionary-founder |
| 2 | Andres Arias | 91 | 95 | 92 | 88 | Alpha Generator & Platform Builder |
| 3 | Camilo Gomez | 85 | 85 | 92 | 78 | AI Infrastructure Pioneer |
| 4 | Guillermo Valencia | 84 | 88 | 92 | 71 | Macro Philosopher & Author |
| 5 | Nico Fernandez | 75 | 75 | 82 | 68 | political-investment analyst |
| 6 | Gabriel Bedoya | 73 | 45 | 85 | 78 | Cultural Futurist & Builder |
| 7 | Camilo Botero | 73 | 68 | 76 | 72 | Tech Venture Analyst |
| 8 | Jon Oleaga | 67 | 62 | 88 | 75 | AI-architect |
| 9 | Fede Suarez | 65 | 75 | 68 | 55 | International Bridge Builder |
| 10 | Agustin Argentino | 65 | 85 | 70 | 45 | tech infrastructure expert |

## ⏰ Guillotine Timer + Pay to Stay (V7.0-7.3)

### How It Works
- **46 members** on the chopping block (34 Zombies + 12 Remove)
- **10-day countdown** from audit date (Apr 7, 2026) — same for everyone
- Timer displays inline on every Z/C card: `Stop the timer: ⏰ 9d 8hrs 35min [Pay 10,000]`
- Click member name → expands to show WHY Cerebro flagged them

### Header Tally (always visible)
- **🪓 46** pending to be axed (big red number)
- **🛡️ X** saved (green, appears when someone pays)
- **⏰ 9d 8h 35m** until cut (orange countdown)
- Visible on ALL tabs — constant pressure

### Pay to Stay
- Cost: **10,000 $10AMPRO** tokens per member
- Orange gradient button with 10AMPRO logo on every flagged card
- Currently links to Solscan token page
- **Anyone can pay on behalf of another member** (sponsorship)
- Paid members **disappear** from Remove/Zombie lists until next audit

### Token Config (meta.json)
```json
{
  "name": "10AMPRO",
  "mint": "6P5McDuhznaedKjnCvfe9iEjtCfVLyZhSqe93TZtawky",
  "burnAddress": "EGEYg4GYbfdUpEeL6RByTSTiuZYckNJ1EwUGACY6UezG",
  "costToStay": 10000,
  "timerDays": 10,
  "chain": "solana"
}
```

### Data Model
- `member.savedBy`: Solana wallet address that paid (null if unpaid)
- `member.savedUntil`: ISO date when protection expires

## 🚨 Panicans (Opus Evidence)
| Member | P | Evidence |
|--------|---|----------|
| Pablo Velez Mejia | 78 | "Hood 72! 😰 Hims 16.40!" |
| Jorge Saldarriaga | 60 | "Iran has just hit a missile in to my account!!!" |
| Lucas Jaramillo | 58 | "No entré a mi cuenta por 3 meses" |
| + 12 more at 30-49 | | with evidence quotes |

## 💎 Best Of (15 Opus Highlights)
★10 Arias: Built homeland.net.co · ★10 Hernán: AI agents analysis · ★10 Guillermo: "Epistemic Wealth" · ★10 Simón: HIMS ownership deep dive · ★9 Camilo G: MacroPulse · ★9 Nico: MSTR BTC Yield · + 9 more

## 5 Tabs — All Complete
1. **🧠 Intel** — Pillars, Top 10 (3 columns), Node Map, Best Of, Health, KPIs
2. **💡 Insights** — Pillar Diagnosis, Founder Dependency, Actions
3. **📈 Progress** — Snapshots, baselines, tier distribution
4. **⚔️ Standards** — Club Standards, Violations, Cerebro Panican Analysis (evidence cards), Sources, Zombies, Re-Entry
5. **👥 Members** — Sort/filter, cards with radar + pillars + panic + persona + highlights + **inline guillotine timer** (Z/C)

## Version History
| Version | Date | Key Change |
|---------|------|------------|
| V4 | Feb 21 | Production — 4 tabs, single score |
| V5.0-5.7 | Apr 7 | Ledger, pillars, panicans, node map, personas, progress, highlights |
| V6.0 | Apr 7 | First AI run (Sonnet — too flat) |
| V6.2 | Apr 7 | **Opus deep grading** — full messages, harsh differentiation |
| V6.3 | Apr 7 | Panican evidence, Best Of, 3-column leaderboards, zero pending |
| V6.3+ | Apr 7 | Rebrand → 10AM CLUB, club.10am.pro live |
| V7.0 | Apr 7 | Guillotine Timer + Pay to Stay (10,000 $10AMPRO) |
| V7.3 | Apr 7 | **Inline timer + header tally** — 🪓46 pending | ⏰9d 8h | 🛡️ saved |

## TODO — Part 2: On-Chain
- [ ] **Phantom/Backpack wallet connect** on Pay button
- [ ] **SPL token transfer** transaction builder (10K $10AMPRO → burn address)
- [ ] **On-chain verification** API route (Solana RPC → check transfers → auto-update savedBy)
- [ ] **Memo/reference** system to match payments to specific members
- [ ] Auto-update members.json when payment confirmed
- [ ] Real-time timer that stops on-chain confirmation

## TODO — Other
- [ ] Quarterly Opus re-run (~July 2026)
- [ ] Real @mention edges for Node Map
- [ ] Trend charts on Progress tab
- [ ] Build Cerebro bot (KIMI on Mac Mini)
