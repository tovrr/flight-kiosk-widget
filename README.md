# Flight Kiosk Widget

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/tovrr/flight-kiosk-widget">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" height="34">
  </a>
  &nbsp;
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-black.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs&logoColor=white" alt="Next.js 16">
  <img src="https://img.shields.io/badge/Travelpayouts-affiliate-ffe800?labelColor=0a0a0a" alt="Travelpayouts affiliate">
</p>

A self-service **flight-booking kiosk** for physical shops — designed to run
fullscreen on a tablet/iPad in kiosk mode. A customer searches for a flight,
compares prices, and books, while the partner shop is tracked via a `?ref=`
in the URL. Monetisation is
**[Travelpayouts](https://www.travelpayouts.com/?marker=749997) affiliate**
(you earn a commission on every booking).

Fork it, plug in your own Travelpayouts IDs, set a brand, and deploy — no code
changes required. Everything is configured through environment variables.

![Flight Kiosk — booking screen with search widget, per-shop tracking badge and mobile-continuity QR](docs/screenshot.png)

<p align="center"><em>Booking screen · the attract screen shown between customers 👇</em></p>

![Flight Kiosk — attract screen](docs/attract.png)

> The widget above is rendered from a mock in this demo; in production the real
> Travelpayouts flight-search form loads in its place.

---

## Features

- **Kiosk mode** — fullscreen, no scroll, locked viewport, tablet-first.
- **Attract screen** ("Touch to start") + **idle reset** between customers.
- **Travelpayouts flight-search widget** with per-shop tracking (`shmarker`),
  no Aviasales logo / "Powered by".
- **Offline fallback** — a clean "service unavailable / retry" card when the
  in-store wifi drops, instead of an empty frame.
- **Mobile-continuity QR** — the customer scans it to finish on their phone,
  keeping the shop `?ref=` intact.
- **Optional "Popular flights"** button to your results / White Label page.
- Fully **rebrandable** (name + colours) via env vars.

---

## How the affiliate model works

1. A shop's kiosk URL carries its name: `https://your-app.com/?ref=shop-name`.
2. That `ref` is stored and folded into the Travelpayouts marker as
   `MARKER.shop-name` (`shmarker`), so every booking is traced to the shop.
3. The customer searches → is redirected to the results page → books with the
   seller. **Travelpayouts pays you the commission** (marker), and you know
   which shop drove it (sub-marker).

---

## Deploy your own

### 1. Get a Travelpayouts account

Sign up at [travelpayouts.com](https://www.travelpayouts.com/?marker=749997).
From the dashboard you need:

- your **marker / Partner ID** → `NEXT_PUBLIC_TRAVELPAYOUTS_MARKER`
- a **"Flights Search Form"** widget → copy its **`trs`** →
  `NEXT_PUBLIC_TP_TRS`
- *(optional)* the **Drive** domain-verification script URL →
  `NEXT_PUBLIC_TP_DRIVE_SRC`
- *(optional)* a **White Label** domain for branded results →
  `NEXT_PUBLIC_TP_SEARCH_URL` / `NEXT_PUBLIC_RESULTS_URL`

### 2. One-click deploy (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tovrr/flight-kiosk-widget)

Set the environment variables (see below) during the import, then deploy.
Because `NEXT_PUBLIC_*` values are baked in at build time, **changing them
later requires a redeploy** (uncheck "Use existing Build Cache").

### 3. Point your kiosk at it

Open the deployed URL with a shop ref, e.g.
`https://your-app.com/?ref=shop-name`, and put the tablet in guided-access /
kiosk mode.

---

## Environment variables

| Variable | Required | Default | Role |
| --- | :---: | --- | --- |
| `NEXT_PUBLIC_TRAVELPAYOUTS_MARKER` | ✅ | `000000` | Your partner marker (base of `shmarker`). Placeholder = no attribution. |
| `NEXT_PUBLIC_TP_TRS` | ✅ | — | Tracking source id of your Flights Search Form widget. |
| `NEXT_PUBLIC_TP_DRIVE_SRC` | | — | Drive domain-verification script URL (injected only if set). |
| `NEXT_PUBLIC_TP_SEARCH_URL` | | — | Host (no protocol) where results open, e.g. your White Label. |
| `NEXT_PUBLIC_BRAND_PREFIX` | | `Flight` | Brand name, first tone (foreground). |
| `NEXT_PUBLIC_BRAND_SUFFIX` | | `Kiosk` | Brand name, second tone (accent). |
| `NEXT_PUBLIC_COLOR_PRIMARY` | | `#0A0A0A` | Widget primary colour. |
| `NEXT_PUBLIC_COLOR_ACCENT` | | `#FFE800` | Widget accent colour. |
| `NEXT_PUBLIC_SITE_URL` | | current origin | Canonical URL for the mobile-continue QR. |
| `NEXT_PUBLIC_RESULTS_URL` | | — | Full URL for the "Popular flights" button (hidden if empty). |
| `NEXT_PUBLIC_LOCALE` | | `en` | Widget / page language. |
| `NEXT_PUBLIC_CURRENCY` | | `usd` | Widget currency. |
| `NEXT_PUBLIC_IDLE_TIMEOUT_MS` | | `90000` | Idle delay before the kiosk resets. |

> ⚠️ These are **identifiers, not secrets** — they ship in the client bundle by
> design. **Never** put a Travelpayouts API token in a `NEXT_PUBLIC_*` variable.

---

## Local development

```bash
cp .env.example .env.local   # fill in your values
npm install
npm run dev                  # http://localhost:3000/?ref=demo-shop
```

The Travelpayouts widget loads its script from `tpwidg.com`; if your network
blocks it you'll see the offline fallback — that's expected locally.

## Customisation

- **Name / colours** → env vars above. To also restyle the app chrome (not just
  the widget), edit the two colours in `app/globals.css` (Tailwind v4 `@theme`
  is static, so it can't read env at runtime).
- **Copy / language** → the on-screen strings live in the components
  (`AttractScreen.js`, `KioskScreen.js`); the widget itself follows
  `NEXT_PUBLIC_LOCALE`.
- **Icon** → replace `app/icon.svg`.

## FAQ

<details>
<summary><strong>How much do I earn?</strong></summary>

Travelpayouts pays you a **commission on each completed booking** made through
your widget. Rates depend on the program and product (flights, hotels, etc.)
and are set by Travelpayouts, not by this template — check your dashboard for
current rates. You keep 100% of your own marker's commissions. On top of that,
the **referral programme** pays you an extra share of the revenue of partners
who signed up through your referral link.
</details>

<details>
<summary><strong>Do customers pay me? Do I handle money or cards?</strong></summary>

**No.** The customer pays the airline or online travel agency directly on the
results/checkout page. You never touch payments, cards, or refunds — so there's
no PCI/payment compliance to worry about. Travelpayouts pays your commission
separately, on their payout schedule.
</details>

<details>
<summary><strong>Can I change the name and colours?</strong></summary>

Yes, with zero code:
- **Name** → `NEXT_PUBLIC_BRAND_PREFIX` + `NEXT_PUBLIC_BRAND_SUFFIX`
- **Widget colours** → `NEXT_PUBLIC_COLOR_PRIMARY` + `NEXT_PUBLIC_COLOR_ACCENT`

To also restyle the app chrome (header bar, buttons), edit the two colour
values in `app/globals.css`. Replace `app/icon.svg` to change the favicon.
</details>

<details>
<summary><strong>Do I need to buy a domain?</strong></summary>

No — the free Vercel subdomain (`your-app.vercel.app`) works out of the box. A
custom domain is only needed if you want branded results via a Travelpayouts
**White Label**, or just a nicer URL on the kiosk.
</details>

<details>
<summary><strong>Can one deployment serve several shops?</strong></summary>

Yes. One deploy handles unlimited shops — each kiosk just opens the URL with its
own `?ref=`, e.g. `/?ref=cafe-central` vs `/?ref=airport-news`. Every booking is
attributed to the right shop through the `shmarker` sub-marker.
</details>

<details>
<summary><strong>What about privacy / GDPR?</strong></summary>

The kiosk stores only the `?ref=` shop code in `localStorage` — no personal
data, no accounts, no tracking cookies of your own. Travelpayouts' own scripts
have their own policy. Add a short privacy notice if your jurisdiction requires
one.
</details>

<details>
<summary><strong>Which languages are supported?</strong></summary>

The widget follows `NEXT_PUBLIC_LOCALE` (e.g. `en`, `fr`, `nl`, `es`…). The few
on-screen strings ("Book your flight…", "Touch to start") live in the
components (`AttractScreen.js`, `KioskScreen.js`) — edit them for full
translation.
</details>

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · `react-qr-code` ·
`lucide-react` · Node 22.

## License

[MIT](LICENSE) — do whatever you want, no warranty.
