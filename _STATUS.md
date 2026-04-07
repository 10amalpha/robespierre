# 10AMPRO Club — Collective Intelligence Dashboard

> 💰 Open Source Capital · 🧠 Collective Intelligence · 🔗 Network Sharing
> The three pillars to belong. Powered by Cerebro.

## Live
- **URL**: https://club.10am.pro (CNAME → cname.vercel-dns.com, pending DNS propagation)
- **Fallback**: https://robespierre.vercel.app
- **Repo**: github.com/10amalpha/robespierre
- **Version**: V6.3 (Opus Deep-Graded, Club Rebrand, Zero Pending)
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
| **Members** | 129 (87 Opus-graded, 34 zombies) |
| **Grading** | Claude Opus 4 — full messages, not sampled |

Group activity **4x'd** from s1 to s2. Member changes detected automatically from chat system messages (no screenshots needed): 35 added, 19 removed, 9 left.

## Architecture
```
robespierre/
  data/
    members.json    ← 129 members, Opus-graded pillars + personas + highlights + panic
    meta.json       ← 2 snapshots, pillar defs, source stats, 15 group highlights
  app/
    page.js         ← 5-tab UI, mobile-responsive
    layout.js       ← viewport, PWA, favicon
  public/
    logo.jpg        ← 10AMPRO logo (from mercados.10am.pro)
    icon-192x192.png, icon-512x512.png, apple-touch-icon.png
    manifest.json   ← PWA manifest
```

## Opus AI Pipeline (Cerebro)
- **Model**: Claude Opus 4 (`claude-opus-4-20250514`)
- **Input**: FULL messages per member (not sampled or truncated)
- **Rubric**: Ecosystem-aware — understands podcast, Substacks, what "alpha" means in 10AMPRO
- **Scoring**: HARSH and DIFFERENTIATED (only 2 members above 90, real spread from 93 to single digits)
- **Cost**: ~$8.40 per full run (10 batches, 87 members)
- **Output**: 3 pillar scores, panic score + evidence quotes, bio, tags, role, highlights
- **Zero manual overrides** — 100% Opus judgment from reading actual messages

## Three Pillars
| Pillar | Weight | What Opus Evaluates |
|--------|--------|---------------------|
| 💰 Open Source Capital | 35% | Positions, theses, "I bought X because Y", conviction |
| 🧠 Collective Intelligence | 40% | Original analysis, quality sources, frameworks, depth |
| 🔗 Network Sharing | 25% | Connecting people, intros, bridging opportunities |

**Composite** = weighted pillars × engagement multiplier (0.6–1.0 based on msg count)
**Panic Score** (0-100): Fear flooding without thesis. 30=watch, 50=warning, 70=removal

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
90+: 2 · 80-89: 2 · 70-79: 9 · 60-69: 11 · 50-59: 18 · 40-49: 20 · 30-39: 14 · <30: 11

### 🚨 Panicans (Opus Evidence)
| Member | P | Role | Evidence |
|--------|---|------|----------|
| Pablo Velez Mejia | 78 | Emotional Retail Trader | "Hood 72! 😰 Hims 16.40!", "BTC y SOL cayendo feo!" |
| Jorge Saldarriaga | 60 | panic-trader | "Iran has just hit a missile in to my account!!!" |
| Lucas Jaramillo | 58 | Social Connector | "No entré a mi cuenta por 3 meses" |
| Andred Angel | 45 | contrarian observer | "Bull trap. In my opinion" |
| + 11 more at 30-49 with evidence | | |

### 💎 Best Of (Top 15 Contributions)
| ★ | Type | Member | Contribution |
|---|------|--------|-------------|
| 10 | 🛠️ | Arias | Built homeland.net.co replacing analyst teams with Claude |
| 10 | 💰 | Hernán | "Si yo fuera un agente portfolio" — AI agents reshaping economy |
| 10 | 🧠 | Hernán | Iran → oil → China → Treasury bills → BRICS analysis |
| 10 | 💰 | Guillermo | Published "Epistemic Wealth" book |
| 10 | 🧠 | Simón | HIMS institutional ownership: 748 holders, 94.68% float |
| 9 | 🛠️ | Camilo G | Built MacroPulse market monitoring system |
| 9 | 🧠 | Nico | MSTR BTC Yield valuation framework |
| 9 | 🔗 | Fede | Connected LatAm fintechs with LSEG opportunities |
| + 7 more | | |

### Source Stats (s2)
X/Twitter 1,245 (+65%) · Substack 132 (+86%) · YouTube 128 (-15%) · TikTok 40 (+186% ⚠️) · Instagram 26 · Bloomberg/Reuters/FT 7

## 5 Tabs — All Complete, Zero Pending
1. **🧠 Intel** — Three Pillars, Top 10 per pillar (3 horizontal columns), Network Node Map, 💎 Best Of (15 highlights), System Health, KPIs
2. **💡 Insights** — Pillar Diagnosis, Founder Dependency, Pillar-Based Actions
3. **📈 Progress** — Snapshot timeline, baseline metrics with targets, tier distribution
4. **⚔️ Standards** — Club Standards, Membership Violations, 🚨 Cerebro Panican Analysis (full evidence cards with bios, quotes, verdicts), Source Quality, Zombies, Deserters, Path to Re-Entry
5. **👥 Members** — Sort by Composite/🔗/🧠/💰/Msgs/Links/Inactive, expandable cards with radar, pillars, panic, persona, highlights, trajectory

## Rebrand: Robespierre → 10AM CLUB
- Header: "10AM CLUB" with logo from mercados.10am.pro
- Tagline: "💰 Open Source Capital · 🧠 Collective Intelligence · 🔗 Network Sharing"
- "Powered by Cerebro" subheader
- Tab: "Robespierre" → "Standards"
- "La Guillotina" → "Club Standards"
- "GUILLOTINE" → "REMOVAL"
- "Path to Redemption" → "Path to Re-Entry"
- PWA manifest, favicon, apple-touch-icon all set
- DNS: club.10am.pro CNAME → cname.vercel-dns.com

## Version History
| Version | Date | Key Change |
|---------|------|------------|
| V4 | Feb 21 | Production — 4 tabs, single score |
| V5.0-5.7 | Apr 7 | Ledger architecture, three pillars, panicans, node map, personas, progress, highlights |
| V6.0 | Apr 7 | First Opus run (Sonnet, sampled — too flat, everyone 85-90) |
| V6.2 | Apr 7 | **Opus deep grading** — full messages, ecosystem rubric, harsh differentiation |
| V6.3 | Apr 7 | Panican evidence cards, Best Of populated, 3-column leaderboards, Club rebrand, zero pending |

## TODO
- [ ] Quarterly Opus re-run (~July 2026)
- [ ] Real @mention edges for Node Map
- [ ] Trend charts on Progress tab
- [ ] Build Cerebro bot (KIMI on Mac Mini)
