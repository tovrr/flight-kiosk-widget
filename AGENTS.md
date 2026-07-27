# AGENTS.md — Flight Kiosk Widget

**Purpose:** Single source of truth for AI agents working on this repository.

## What this is

A self-service **flight-booking kiosk** for physical shops — runs fullscreen on a tablet
in kiosk mode. Customers search flights, compare prices, and book via Travelpayouts affiliate.
Partner shops are tracked via `?ref=` in the URL.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **QR:** `react-qr-code`
- **Icons:** `lucide-react`
- **Affiliate:** Travelpayouts widget + marker system
- **CI:** GitHub Actions (lint → test → build + secret guard)

## Golden rule (ADR-0004: reality over docs)

Verify every doc claim against code and `git log`. Code wins.

## Commands

| Action | Command |
|--------|---------|
| Dev | `npm run dev` |
| Build | `npm run build` |
| Test | `npm run test` |
| Lint | `npm run lint` |

## Critical constraints

1. **Kiosk-first UI** — fullscreen, zero scroll, high contrast (`#FFE800` / `#0A0A0A`)
2. **Tablet-first** — designed for iPad in kiosk mode, not mobile or desktop
3. **Tracking is sacred** — `?ref=` param is the business core; never break it
4. **No navigation menus** — single-purpose booking flow only
5. **No middleware** — static-first rendering

## Workflow

- Branch from `staging`, PR to `staging`
- One PR = one scope (Boss Rule #14)
- CI must be green before requesting review
- Never self-merge
