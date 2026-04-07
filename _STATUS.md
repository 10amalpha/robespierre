# Robespierre — 10AMPRO Collective Intelligence Dashboard

## Quick Context
WhatsApp group engagement analytics for 10AMPRO community. Measures collective intelligence across three pillars: Network Sharing, Collective Intelligence, and Open Source Capital. Identifies dead weight, panicans, and enforces information diet quality. Named after the group's own enforcement culture ("guillotina").

## Live
- **URL**: https://robespierre.vercel.app
- **Repo**: github.com/10amalpha/robespierre
- **Vercel Project**: `prj_h7LiqacKcqwQcae368ZXoMyQ7aeL`
- **Team**: `team_nPG5TrnRZyVuclmm6dZL1AcX`
- **Current Version**: V5.7
- **Last Deploy**: April 7, 2026

## Architecture (V5 — Metrics Ledger + Three Pillars)

### Design Principle
Process the ore, keep only the gold. Raw WhatsApp exports are parsed for metrics then discarded. The repo stores only the graded output — pillar scores, personas, highlights, panic flags, and trajectory history.

### File Structure
```
robespierre/
  data/
    members.json      ← metrics ledger (126 members, per-member pillars + personas + highlights)
    meta.json         ← snapshots, pillar definitions, scoring rules, highlight types, source stats
  app/
    page.js           ← UI (imports from data/, 5 tabs, ~1100 lines)
    layout.js         ← root layout (fonts, meta tags)
  _STATUS.md          ← this file
  package.json        ← Next.js 14, React 18
  next.config.js      ← minimal config
```

### Three Pillars Scoring Model
Every member is scored 0-100 on three dimensions:

| Pillar | Weight | What It Measures |
|--------|--------|-----------------|
| 🔗 Network Sharing | 25% | Connecting people — intros, deal flow, bridging opportunities, expanding group reach |
| 🧠 Collective Intelligence | 40% | Making the group smarter — info diet quality, analysis depth, discussion engagement |
| 💰 Open Source Capital | 35% | Showing your hand — positions, theses, "I bought X because Y", radical transparency |

**Composite** = weighted blend of all three pillars.

**Scoring philosophy**: Rate-based, not volume-based. Quality per unit of activity, not raw counts. Someone with 10 thesis-grade posts scores higher than someone with 100 one-liners.

### Additional Scoring
- **Panic Score** (0-100): Detects "panicans" — members who flood fear without thesis. Thresholds: 40=flagged, 60=warning, 80=guillotine.
- **Engagement metrics**: Volume, Consistency, Recency (legacy scoring, kept for context)
- **Tier thresholds**: A=40+, B=15-39, C=1-14, Z=0 (never posted)

### Per-Member Data Model
```json
{
  "tier": "A",
  "score": 87.9,
  "composite": 68,
  "pillars": { "network": 42, "intelligence": 70, "capital": 85 },
  "pillarComponents": { "network": {...}, "intelligence": {...}, "capital": {...} },
  "msgs": 1476, "links": 510, "avgWords": 18.8,
  "activeDays": 40, "activeWeeks": 8,
  "lastActive": "2026-02-21", "daysInactive": 0,
  "components": { "volume": 30, "consistency": 11.5, "substance": 20, "recency": 25 },
  "panicScore": null,
  "panicFlags": [],
  "persona": {
    "bio": "Founder of 10AMPRO...",
    "platforms": [{ "type": "substack", "url": "https://www.10am.pro", "handle": "10am.pro" }],
    "tags": ["macro", "crypto", "BTC"],
    "role": "Founder & Chief Curator"
  },
  "highlights": [
    { "type": "thesis", "pillar": "capital", "summary": "...", "date": "...", "quality": 9 }
  ],
  "history": [
    { "snapshot": "s1", "score": 87.9, "tier": "A", "composite": 68, "pillars": {...} }
  ]
}
```

### Update Workflow
```
1. Upload WhatsApp chat export
2. Extract messages per member
3. Send to Opus API in batches (~7 calls):
   - Grade 3 pillars (0-100 each) with component scores
   - Detect panic behavior with evidence flags
   - Generate persona (bio, tags, role) from message content
   - Extract top highlights (best thesis, analysis, links, intros)
4. Store results in data/members.json
5. Update snapshot in data/meta.json + groupHighlights
6. git push → Vercel auto-deploys
```

### Opus AI Pipeline (Ready to Run)
- **API Key**: Stored in project memory (Claude API)
- **Model**: Claude Opus 4 for nuanced judgment
- **Estimated cost per full run**: ~$3-4 USD (87 non-zombie members, ~7 batch calls)
- **What Opus does**: Reads actual message content in Spanish/English and grades with real understanding — not proxy math
- **Current state**: Framework built, awaiting new chat export to trigger first Opus run
- **Note**: s1 currently has proxy-math pillar scores. First Opus run should re-grade s1 + grade s2 for clean comparisons.

### Why No Database
Updates ~4x/year. 62KB of JSON. Zero infrastructure, zero cost, instant load. Database only needed when Robespierre bot writes data in real-time.

## Current Snapshot: s1 (Proxy Math — Pending Opus Re-grade)
- **Range**: Nov 16, 2025 → Feb 21, 2026 (96 days)
- **Source**: WhatsApp chat export (9,358 lines) + member list screenshots
- **Pillar scores**: Currently derived from proxy formulas (rate-based). Will be replaced by Opus analysis.

### Numbers
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Total members | 126 | — | — |
| Tier A (Active) | 66 | — | — |
| Tier B (Watch) | 12 | — | — |
| Tier C (Remove) | 9 | — | — |
| Tier Z (Zombie) | 39 | 0 | ✗ |
| 🔗 Network avg | ~44 | >50 | ✗ |
| 🧠 Intelligence avg | ~42 | >50 | ✗ |
| 💰 Capital avg | ~40 | >50 | ✗ |
| Founder msg share | 29% | <15% | ✗ |
| Founder link share | 52% | <20% | ✗ |
| Bus factor | 1 | 5+ | ✗ |
| Dead weight to cut | 53 | 0 | ✗ |

## 5 Tabs

### 🧠 Intelligence
- **Three Pillars of 10AMPRO**: Group averages per pillar with weights and progress bars
- **Top 5 per pillar**: Separate leaderboards for Network, Intelligence, Capital
- **🌐 Network Node Map**: Force-directed canvas graph. Nodes = members (sized by composite, colored by tier). Edges = activity overlap. Hover for pillar tooltip, click to navigate. Founder gets 👑.
- **💎 Best Of**: Top contributions across all members (pending Opus). 7 highlight types: thesis, analysis, alpha link, network intro, market call, insight, tool.
- **System Health Gauges**: Knowledge Distribution, Signal-to-Noise, Network Density, Decentralization
- **KPI Grid**: Active Brains, Knowledge Inputs, Velocity, Depth, 7d Pulse, Dead Weight

### 💡 Insights
- **Pillar Diagnosis**: Per-pillar analysis with strong/weak member counts and actionable insight
- **Founder Dependency**: 4 metric cards (msg share, link share, counts) with targets
- **Insight cards**: Lurker Ratio, Bus Factor
- **Pillar-Based Actions**: 5 actionable plays (Network Challenge, Weekly Curator, Friday Position Thread, Cut dead weight, Quarterly Audit)

### 📈 Progress
- **Single snapshot view**: Baseline metrics with targets and ✓/✗, tier distribution bar chart, "What s2 Will Reveal" roadmap
- **Multi-snapshot view** (when s2+ exists): Pillar progress deltas (▲▼), Tier movements + promotions, Biggest Climbers (top 10), Biggest Drops (top 10)

### ⚔️ Robespierre
- **La Guillotina header**: Pillar-based execution logic
- **Execution stats**: 4 cards (Zombies, Tier C, Dormant B, Total Cut)
- **Crimes Against CI**: 3 offense types with counts
- **🚨 Panicans**: Fear merchant detection. Behavior cards (fear without thesis, red candle reactive, FUD spreader, no follow-up). Flagged members list with panic scores + Capital cross-reference + Opus evidence. Pending analysis state until Opus runs.
- **Source Quality**: Information diet bars (X/Twitter, YouTube, Substack, IG, TikTok, Bloomberg)
- **Zombies, Deserters, Death Row**: Lists with activity stats
- **Redemption Path**: Pillar-based (prove value in at least ONE pillar)

### 👥 Members
- **Tier summary cards** (A/B/C/Z counts)
- **Search + filter + sort**: Sort by Composite, 🔗 Network, 🧠 Intelligence, 💰 Capital, Messages, Links, Inactive
- **Member cards** (collapsed): Name, tier badge, panic badge (if 40+), pillar scores (🔗🧠💰), days ago, composite score
- **Member cards** (expanded): Radar triangle chart, pillar bars, panic bar + evidence, engagement metrics (volume/consistency/recency), stats row, persona (bio, platforms, tags, role), highlights (top 3), trajectory chips

## Personas
17 members pre-seeded with bio, platforms, tags, role from chat context. 109 pending Opus auto-generation. Known platforms: Hernán (10am.pro Substack, @holdmybirra Twitter), Nico Fernandez (Substack), Guillermo Valencia (macrowise Substack), Pablo Velez Mejia (YouTube).

## Signal Quality Rules
- **Good sources** (+1): X/Twitter, YouTube, Substack, Bloomberg, Reuters, FT, arxiv
- **Junk food** (-2): Instagram, TikTok
- **gordo Barato exempt** from junk food penalty (10AMPRO content creator)
- **Stale content** (-1): community flags "viejo/old/repetido"
- Group rule since Jan 21, 2026: "Old/repetido = Guillotina"

## Highlight Types
| Type | Icon | Pillar | Description |
|------|------|--------|-------------|
| thesis | 💰 | Capital | Investment thesis with specific position and reasoning |
| analysis | 🧠 | Intelligence | Deep analytical post on a topic |
| link | 🔗 | Intelligence | High-value external source shared |
| intro | 🤝 | Network | Introduction or connection made between members |
| call | 📣 | Capital | Specific market call with conviction |
| insight | 💡 | Intelligence | Original observation or framework |
| tool | 🛠️ | Network | Tool, resource, or utility shared with the group |

## Version History
| Version | Date | Changes |
|---------|------|---------|
| V1-V3 | Feb 21, 2026 | Initial builds — monolithic JSX with hardcoded data |
| V4 | Feb 21, 2026 | Production release — 4 tabs, single engagement score, full UI |
| V5.0 | Apr 7, 2026 | Metrics ledger architecture — data/UI separation, snapshot system |
| V5.1 | Apr 7, 2026 | Three-pillar scoring system (Network, Intelligence, Capital) |
| V5.2 | Apr 7, 2026 | Rate-based pillar scoring — quality over volume |
| V5.3 | Apr 7, 2026 | Panicans detection framework — fear merchants section |
| V5.4 | Apr 7, 2026 | Network Node Map — force-directed graph on Intelligence tab |
| V5.5 | Apr 7, 2026 | Member Personas — identity layer + profile UI |
| V5.6 | Apr 7, 2026 | Progress tab — differential tracking across snapshots |
| V5.7 | Apr 7, 2026 | Best Of highlights — per-member + group-level top contributions |

## TODO / Next Steps
- [ ] **NEXT**: Run Opus pipeline on chat export (re-grade s1 + process s2)
- [ ] Process new WhatsApp export (awaiting upload)
- [ ] Opus: real pillar scores replacing proxy math
- [ ] Opus: panican detection with evidence
- [ ] Opus: auto-generate 109 pending personas
- [ ] Opus: extract highlights for Best Of feed
- [ ] Opus: @mention graph for real Node Map edges
- [ ] Implement IG/TikTok penalty in scoring model
- [ ] Add "executed date" tracking once members are removed
- [ ] Build Robespierre bot (Mac Mini + KIMI — mentioned in chat Feb 9)

## Related
- Claude Project: `10ampro_robespierre_v4.jsx` + `_chat.txt` (9,358 lines)
- Claude API key: stored in project memory
- Goldfishmemory: `10AMPRO_WhatsApp_CI_Status.docx` in Google Drive (needs updating)
