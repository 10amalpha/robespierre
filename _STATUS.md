# Robespierre — 10AMPRO Collective Intelligence Dashboard

## Quick Context
WhatsApp group engagement analytics for 10AMPRO community. Opus AI-graded scoring across three pillars (Network, Intelligence, Capital) with panican detection, personas, highlights, and network visualization. Named after the group's enforcement culture ("guillotina"). Cerebro is the AI brain.

## Live
- **URL**: https://robespierre.vercel.app
- **Repo**: github.com/10amalpha/robespierre
- **Version**: V6.3 (Opus Deep-Graded, Zero Pending)
- **Last Deploy**: April 7, 2026
- **Members**: 129 (34 zombies, 87 Opus-graded)

## Current Data
| | s1 | s2 (CURRENT) |
|--|-----|------|
| **Period** | Nov 16 '25 → Feb 21 '26 | Feb 22 → Apr 7 '26 |
| **Days** | 96 | 44 |
| **Messages** | 1,989 | 8,082 |
| **Links** | 452 | 1,828 |
| **Grading** | Opus AI (full messages) | Opus AI (full messages) |

Group activity **4x'd** from s1 to s2.

## Architecture
```
robespierre/
  data/
    members.json    ← 129 members, Opus-graded pillars + personas + highlights + panic
    meta.json       ← 2 snapshots, pillar defs, source stats, 15 group highlights
  app/
    page.js         ← 5-tab UI, mobile-responsive
    layout.js       ← viewport, theme-color, PWA
```

## Opus AI Pipeline
- **Model**: Claude Opus 4 (full messages, not sampled)
- **Rubric**: Ecosystem-aware — understands podcast, Substacks, what "alpha" means in 10AMPRO
- **Scoring**: HARSH and DIFFERENTIATED (only 2 members above 90)
- **Cost**: ~$8.40 per full run (10 batches, 87 members, 10K+ messages)
- **Output per member**: 3 pillar scores, panic score + evidence quotes, bio, tags, role, best contribution
- **Zero manual overrides** — all scores are 100% Opus judgment

## Three Pillars
| Pillar | Weight | What Opus Evaluates |
|--------|--------|---------------------|
| 🔗 Network | 25% | Connects people? Intros? Bridges opportunities? @mentions meaningfully? |
| 🧠 Intelligence | 40% | Original analysis? Quality sources? Frameworks? Changes how others think? |
| 💰 Capital | 35% | Specific positions? Entry points? "I bought X because Y"? Conviction? |

**Composite** = weighted pillars × engagement multiplier (0.6–1.0 based on msg count)

## Key Results

### 🏆 Top 10 Composite
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

### Score Distribution
| Range | Count | Note |
|-------|-------|------|
| 90+ | 2 | Only Hernán + Arias |
| 80-89 | 2 | Camilo Gomez + Guillermo |
| 70-79 | 9 | |
| 60-69 | 11 | |
| 50-59 | 18 | |
| 40-49 | 20 | |
| 30-39 | 14 | |
| <30 | 11 | |

### 🚨 Panicans (Opus Evidence)
| Member | P | Role | Key Evidence |
|--------|---|------|-------------|
| Pablo Velez Mejia | 78 | Emotional Retail Trader | "Hood 72! 😰 Hims 16.40!", "BTC y SOL cayendo feo!" |
| Jorge Saldarriaga | 60 | panic-trader | "Iran has just hit a missile in to my account!!!" |
| Lucas Jaramillo | 58 | Social Connector | "No entré a mi cuenta por 3 meses", "Claude me dice que salga de TESLA" |
| Andred Angel | 45 | contrarian observer | "Bull trap. In my opinion", "Se los dije..." |
| Ricardo Espinal | 45 | political-commentator | "Iran preparado para alargar la guerra" |
| Felo | 40 | political-commentator | "Yo veo todas las posibilidades que gane Cepeda" |
| + 9 more at 30-39 | | |

### 💎 Best Of (Top 15 Contributions)
| ★ | Type | Member | Contribution |
|---|------|--------|-------------|
| 10 | 🛠️ | Arias | Built homeland.net.co replacing analyst teams with Claude |
| 10 | 💡 | Arias | "Con Claude ya no necesito equipo" — fired analysts for AI |
| 10 | 💰 | Hernán | "Si yo fuera un agente portfolio" — AI agents reshaping economy |
| 10 | 🧠 | Hernán | Iran → oil → China → Treasury bills → BRICS analysis |
| 10 | 🔗 | Hernán | 200+ quality sources connecting macro to specific plays |
| 10 | 💰 | Guillermo | Published "Epistemic Wealth" book |
| 10 | 🧠 | Simón | HIMS institutional ownership: 748 holders, 94.68% float |
| 9 | 💰 | Arias | HIMS vs Big Pharma: network effects + FCF/share |
| 9 | 🧠 | Arias | MSTR debt/Bitcoin thesis with entry points + Sharpe ratio |
| 9 | 🛠️ | Camilo G | Built MacroPulse market monitoring system |
| 9 | 🧠 | Camilo G | Anthropic leaked code → agent orchestration analysis |
| 9 | 🔗 | Fede | Connected LatAm fintechs with LSEG opportunities |
| 9 | 🧠 | Nico | MSTR BTC Yield valuation framework |
| 9 | 💡 | Gabriel | LLMs becoming the OS layer insight |
| 9 | 🛠️ | Hernán | Built hedonicum.pro — AI wine recommendation engine |

### Source Stats (s2)
| Source | Count | Δ from s1 |
|--------|-------|-----------|
| X/Twitter | 1,245 | +65% |
| Substack | 132 | +86% |
| YouTube | 128 | -15% |
| TikTok | 40 | +186% ⚠️ |
| Instagram | 26 | +63% |
| Bloomberg/Reuters/FT | 7 | +75% |

## 5 Tabs — All Complete

### 🧠 Intel
- Three Pillars overview (group averages + weights)
- **Top 10 per pillar** in 3 horizontal columns
- 🌐 Network Node Map (force-directed, hover/click)
- 💎 Best Of — 15 Opus-selected top contributions
- System Health gauges + KPI grid

### 💡 Insights
- Pillar Diagnosis (per-pillar strong/weak + insight)
- Founder Dependency
- Pillar-Based Actions (5 plays)

### 📈 Progress
- Snapshot timeline (s1 + s2)
- Baseline metrics with targets + ✓/✗
- Tier distribution
- What s2 reveals (8 tracked dimensions)

### ⚔️ Robes
- Execution stats (4 cards)
- Crimes Against CI (3 types)
- **🚨 Cerebro Panican Analysis** — Opus-powered cards with severity badges, bios, evidence quotes from actual messages, verdicts
- Source Quality bars
- Zombies, Deserters, Death Row
- Pillar-based Redemption

### 👥 Members
- Sort by: Composite, 🔗, 🧠, 💰, Msgs, Links, Inactive
- Cards: radar chart, pillar bars, panic bar, persona (bio + platforms + tags + role), highlights (top 3), trajectory

## Mobile Responsive
Viewport meta, theme-color, PWA-capable, 14px padding, scrollable tabs, flex-wrap everywhere, canvas responsive.

## Member Detection
From chat system messages (no screenshots needed): 35 added, 19 removed, 9 left, 24 new active in s2, 6 went silent.

## Version History
| Version | Date | Key Change |
|---------|------|------------|
| V4 | Feb 21 | Production — 4 tabs, single score |
| V5.0 | Apr 7 | Metrics ledger — data/UI split |
| V5.1-5.7 | Apr 7 | Three pillars, panicans, node map, personas, progress, highlights |
| V6.0 | Apr 7 | First Opus run (Sonnet, sampled) |
| V6.2 | Apr 7 | **Opus deep grading** — full messages, ecosystem rubric, harsh differentiation |
| V6.3 | Apr 7 | Panican evidence cards, Best Of populated, 3-column leaderboards, zero pending |

## TODO
- [ ] Quarterly Opus re-run (~July 2026)
- [ ] Real @mention edges for Node Map
- [ ] Trend charts on Progress tab (pillar averages over time)
- [ ] Build Robespierre bot (KIMI on Mac Mini)
