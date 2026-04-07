# Robespierre — Project Status

## Current State
- v4 deployed with 4 tabs (Intelligence, Insights, Robespierre, Members)
- 126 total members: 66 Tier A, 12 Tier B, 9 Tier C, 39 Zombies
- Data period: Nov 16 2025 → Feb 21 2026 (96 days)
- Source: WhatsApp chat export + member list screenshots

## Key Metrics
- Founder dependency: 29% msgs, 52% links (CRITICAL)
- 39 zombies (zero posts ever)
- 53 total to cut (42% of group)
- Source quality: 754 X, 151 YT, 71 Substack, 16 IG, 14 TikTok

## Next Steps
- Polish UI/UX
- Add signal freshness scoring (detect "viejo/old/repetido" flags)
- IG/TikTok penalty (-2 per link, gordo Barato exempt)
- Ingest new WhatsApp exports for trend tracking
- Build Robespierre bot (Mac Mini + KIMI vision)

## Architecture
- Next.js 14 App Router
- Single page component: app/page.js
- All data embedded in component (no API yet)
- Vercel deployment via GitHub push
