# 10AMPRO Club — Collective Intelligence Dashboard

> 💰 Open Source Capital · 🧠 Collective Intelligence · 🔗 Network Sharing
> The three pillars to belong. Powered by Cerebro.

## Live
- **URL**: https://club.10am.pro
- **Fallback**: https://robespierre.vercel.app
- **Repo**: github.com/10amalpha/robespierre
- **Version**: V8.5 (Mobile-responsive, data cleanup, privacy scrub)
- **Last Deploy**: April 8, 2026
- **Vercel**: `prj_h7LiqacKcqwQcae368ZXoMyQ7aeL` / `team_nPG5TrnRZyVuclmm6dZL1AcX`

## Architecture
```
robespierre/
  data/
    members.json    ← 127 members, Opus-graded + savedBy/savedUntil fields
    meta.json       ← snapshots, pillars, sources, highlights, token config (decimals: 9)
  app/
    page.js         ← 5-tab UI, wallet connect, on-chain pay, guillotine timers
    layout.js       ← viewport, PWA, favicon, manifest
    api/
      verify-saves/
        route.js    ← Solana RPC verification — dual-search burn wallet + ATA, memo parsing
  public/
    logo.jpg, icons, manifest.json
```

## Data
| | s1 | s2 (CURRENT) |
|--|-----|------|
| **Period** | Nov 16 '25 → Feb 21 '26 | Feb 22 → Apr 7 '26 |
| **Days** | 96 | 44 |
| **Messages** | 1,989 | 8,082 |
| **Links** | 452 | 1,828 |
| **Members** | 127 (87 Opus-graded, 34 zombies) |

### Data Merges
- Pablo Velez Mejia / PVM Pablo → merged (V6.3)
- Rafael Troconis Llave → Rafael Troconis (V8.4, combined 45 msgs, 4 links)
- Amalia Uribe Gustavo Villa Gumroad → Amalia Uribe (V8.5, combined 13 msgs, 3 links)

### Privacy Scrubs
- Paul Gomez: all Ford references removed (V8.5) — bio, tags, highlights scrubbed to protect employment

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

## ⏰ Guillotine Timer + Pay to Stay

### How It Works
- **46 members** on the chopping block (34 Zombies + 12 Remove)
- **10-day countdown** from audit date (Apr 7, 2026) — same for everyone
- Timer displays inline on every Z/C card: `Stop the timer: ⏰ 9d 8hrs 35min [Pay 10,000]`
- Click member name → expands to show WHY Cerebro flagged them

### Header Tally (always visible)
- **🪓 N** pending to be axed (big red number, updates as saves come in)
- **🛡️ N** saved (green, appears when someone pays)
- **⏰ Xd Xh Xm** beheading countdown (orange)
- **Buy $10AMPRO** button → Jupiter exchange link
- **Connect Wallet** button → Phantom/Backpack
- Visible on ALL tabs — constant pressure

### Pay to Stay
- Cost: **10,000 $10AMPRO** tokens per member
- Orange gradient button with 10AMPRO logo on every flagged card
- **Phantom/Backpack wallet connect** → SPL transfer → on-chain confirmation
- **Anyone can pay on behalf of another member** (sponsorship)
- Paid members show 🛡️ Saved badge with wallet + tx link

### On-Chain Architecture (V8.0–8.4)
- **No database needed** — the blockchain IS the database
- **RPC**: Helius mainnet (`mainnet.helius-rpc.com`) with API key
- **Client-side wallet**: Direct `window.solana` detection (Phantom/Backpack), no heavy adapter libraries
- **Transaction flow**: User clicks Pay → wallet connect → build SPL transfer + memo → `signAndSendTransaction` → confirm
- **Memo format**: `SAVE:MemberName` — identifies which member the payment covers
- **Verification API** (`/api/verify-saves`): Dual-search — scans BOTH burn wallet address AND derived ATA for transactions. Survives ATA closures after token burns. Parses all instructions (including inner). Add `?debug=1` to see raw tx data.
- **Merge strategy**: On-chain saves override static `members.json` data at render time via `mergedD`
- **Caching**: API `force-dynamic` (never cached by Vercel CDN), client fetches with `cache: "no-store"`
- **Optimistic UI**: After successful payment, local state updates immediately before API refetch
- **Token decimals**: 9 (confirmed on-chain — standard for pump.fun tokens)
- **Buffer polyfill**: `window.Buffer = Buffer` for `@solana/web3.js` browser compatibility
- **Dependencies**: `@solana/web3.js`, `@solana/spl-token`, `buffer`, `bs58`

### Saved Member Visibility (V8.1)
- **Members tab**: 🛡️ Saved filter button shows only saved Z/C members
- **Members tab**: Green "Saved" counter card appears when saves exist
- **Members tab**: Saved Z/C members visible in ALL tier filters (not hidden)
- **Standards tab**: Zombie list shows saved members in green with 🛡️ prefix
- **Standards tab**: Deserter list shows "Saved" label for saved members
- **Member card**: Saved Z/C → 🛡️ shield + truncated wallet + Solscan tx link

### Token Config (meta.json)
```json
{
  "name": "10AMPRO",
  "mint": "6P5McDuhznaedKjnCvfe9iEjtCfVLyZhSqe93TZtawky",
  "burnAddress": "EGEYg4GYbfdUpEeL6RByTSTiuZYckNJ1EwUGACY6UezG",
  "costToStay": 10000,
  "decimals": 9,
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
| V8.0 | Apr 7 | **On-Chain Pay to Stay** — Phantom/Backpack wallet, SPL transfer, memo tagging, verification API |
| V8.1 | Apr 7 | **Saved Visibility** — 🛡️ Saved filter, badges in zombie/remove lists, saved counter card |
| V8.2 | Apr 7 | **Working E2E** — Helius RPC, 9 decimals, signAndSendTransaction, inner ix memo scan |
| V8.3 | Apr 7 | **Production Ready** — dual-search (wallet+ATA), cache-busting, cross-browser consistency |
| V8.4 | Apr 8 | **Polish** — font sizes +2px (mercados sizing), Buy $10AMPRO button, "beheading countdown" copy, Rafael Troconis merge (128 members) |
| V8.5 | Apr 8 | **Mobile-responsive** — stacked header, card timer on own row, Amalia Uribe merge, Paul Gomez Ford scrub (127 members) |

## TODO — Part 2: On-Chain ✅ COMPLETE
- [x] Phantom/Backpack wallet connect
- [x] SPL token transfer (10K $10AMPRO → burn address)
- [x] On-chain verification API (`/api/verify-saves`)
- [x] Memo system (`SAVE:MemberName`)
- [x] Auto-merge on-chain saves with static data
- [x] 🛡️ Saved badges, filter, counter
- [x] Signing state + error/success banners
- [x] Token decimals: 9
- [x] Helius RPC (public RPC blocked)
- [x] signAndSendTransaction (Phantom recommended)
- [x] Debug mode (`?debug=1`)
- [x] Dual-search (wallet + ATA, survives burns)
- [x] Cache-busting (force-dynamic + no-store)
- [x] Cross-browser consistency
- [x] Buy $10AMPRO → Jupiter link
- [x] Font sizes bumped to mercados standard
- [ ] Real-time timer ticking every second

## TODO — Other
- [ ] Quarterly Opus re-run (~July 2026)
- [ ] Real @mention edges for Node Map
- [ ] Trend charts on Progress tab
- [ ] Build Cerebro bot (KIMI on Mac Mini)
