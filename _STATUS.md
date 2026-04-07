# 10AMPRO Club — Collective Intelligence Dashboard

> 💰 Open Source Capital · 🧠 Collective Intelligence · 🔗 Network Sharing
> The three pillars to belong. Powered by Cerebro.

## Live
- **URL**: https://club.10am.pro
- **Fallback**: https://robespierre.vercel.app
- **Repo**: github.com/10amalpha/robespierre
- **Version**: V7.2 (Opus Deep-Graded, Guillotine Timer, Pay to Stay)
- **Last Deploy**: April 7, 2026
- **Vercel**: `prj_h7LiqacKcqwQcae368ZXoMyQ7aeL` / `team_nPG5TrnRZyVuclmm6dZL1AcX`

## Architecture
```
robespierre/
  data/
    members.json    ← 129 members, Opus-graded + savedBy/savedUntil fields
    meta.json       ← snapshots, pillar defs, source stats, highlights, token config
  app/
    page.js         ← 5-tab UI, mobile-responsive, guillotine timer
    layout.js       ← viewport, PWA, favicon, manifest
  public/
    logo.jpg, icons, manifest.json (from mercados.10am.pro)
```

## Data: 2 Snapshots
| | s1 | s2 (CURRENT) |
|--|-----|------|
| **Period** | Nov 16 '25 → Feb 21 '26 | Feb 22 → Apr 7 '26 |
| **Days** | 96 | 44 |
| **Messages** | 1,989 | 8,082 |
| **Links** | 452 | 1,828 |
| **Members** | 129 (87 Opus-graded, 34 zombies) |

## Opus AI Pipeline (Cerebro)
- **Model**: Claude Opus 4 (`claude-opus-4-20250514`) — full messages, not sampled
- **Rubric**: Ecosystem-aware (podcast, Substacks, what "alpha" means)
- **10 batches**, 87 members, ~$8.40 total
- **HARSH differentiation**: only 2 members above 90
- **Zero manual overrides** — 100% Opus judgment
- **Output**: pillars, panic + evidence quotes, bio, tags, role, highlights

## Three Pillars
| Pillar | Weight | Measures |
|--------|--------|----------|
| 💰 Open Source Capital | 35% | Positions, theses, "I bought X because Y" |
| 🧠 Collective Intelligence | 40% | Original analysis, quality sources, frameworks |
| 🔗 Network Sharing | 25% | Connecting people, intros, bridging opportunities |

**Composite** = weighted pillars × engagement multiplier (0.6–1.0)
**Panic** (0-100): Fear without thesis. 30=watch, 50=warning, 70=removal

## 🏆 Top 10 Composite
| # | Member | C | 🔗 | 🧠 | 💰 | Role (Opus) |
|---|--------|---|-----|-----|-----|-------------|
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

**Score Distribution**: 90+: 2 · 80-89: 2 · 70-79: 9 · 60-69: 11 · 50-59: 18 · 40-49: 20 · 30-39: 14 · <30: 11

## 🚨 Panicans (Opus Evidence)
| Member | P | Evidence |
|--------|---|----------|
| Pablo Velez Mejia | 78 | "Hood 72! 😰 Hims 16.40!", "BTC y SOL cayendo feo!" |
| Jorge Saldarriaga | 60 | "Iran has just hit a missile in to my account!!!" |
| Lucas Jaramillo | 58 | "No entré a mi cuenta por 3 meses" |
| + 12 more at 30-49 | | with evidence quotes |

## ⏰ Guillotine Timer + Pay to Stay (V7.0-7.2)

### How It Works
- Every **Zombie** (34) and **Remove** (12) member has a **10-day countdown timer**
- Timer displays as a **launch-style countdown** on the card face: `9d 3hrs 5min`
- Glowing progress bar drains from orange → red as time runs out
- Each member's timer varies based on their inactivity period
- **Click their name** → expands to show WHY Cerebro flagged them

### Pay to Stay
- Cost: **10,000 $10AMPRO** tokens to reset the timer
- Orange gradient **"Pay 10,000"** button with 10AMPRO logo on every flagged card
- Currently links to Solscan token page (wallet connect in next step)
- Burns address shown on card: `🔥 EGEYg4...UezG`
- **Anyone can pay on behalf of another member** (sponsorship model)

### Saved State
- When someone pays: timer stops, card shows **"🛡️ Saved from removal"**
- Wallet address of savior displayed + clickable to Solscan
- Green progress bar (full)

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

## 💎 Best Of (15 Opus Highlights)
| ★ | Member | Contribution |
|---|--------|-------------|
| 10 | Arias | Built homeland.net.co replacing analyst teams with Claude |
| 10 | Hernán | "Si yo fuera un agente portfolio" — AI agents reshaping economy |
| 10 | Guillermo | Published "Epistemic Wealth" book |
| 10 | Simón | HIMS institutional ownership: 748 holders at 94.68% |
| 9 | Camilo G | Built MacroPulse market monitoring system |
| 9 | Nico | MSTR BTC Yield valuation framework |
| + 9 more | |

## 5 Tabs — All Complete
1. **🧠 Intel** — Pillars, Top 10 (3 horizontal columns), Node Map, Best Of, Health, KPIs
2. **💡 Insights** — Pillar Diagnosis, Founder Dependency, Actions
3. **📈 Progress** — Snapshots, baselines, tier distribution
4. **⚔️ Standards** — Club Standards, Violations, 🚨 Cerebro Panican Analysis (evidence cards), Sources, Zombies, Deserters, Re-Entry
5. **👥 Members** — Sort/filter, expandable cards with radar + pillars + panic + persona + highlights + **guillotine timer** (Z/C only)

## Version History
| Version | Date | Key Change |
|---------|------|------------|
| V4 | Feb 21 | Production — 4 tabs, single score |
| V5.0-5.7 | Apr 7 | Ledger, pillars, panicans, node map, personas, progress, highlights |
| V6.0 | Apr 7 | First AI run (Sonnet, sampled — too flat) |
| V6.2 | Apr 7 | **Opus deep grading** — full messages, harsh differentiation |
| V6.3 | Apr 7 | Panican evidence cards, Best Of, 3-column leaderboards, zero pending |
| V6.3+ | Apr 7 | **Rebrand**: Robespierre → 10AM CLUB, club.10am.pro live |
| V7.0 | Apr 7 | Guillotine Timer + Pay to Stay (10,000 $10AMPRO) |
| V7.2 | Apr 7 | **Launch-style countdown** + actionable Pay button on card face |

## TODO
- [ ] **Wallet connect** (Phantom/Backpack) for Pay to Stay button
- [ ] **On-chain verification** API route (check Solana for transfers to burn address)
- [ ] Quarterly Opus re-run (~July 2026)
- [ ] Real @mention edges for Node Map
- [ ] Trend charts on Progress tab
- [ ] Build Cerebro bot (KIMI on Mac Mini)
