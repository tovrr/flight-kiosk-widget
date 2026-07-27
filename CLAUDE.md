# Contexte IA — Flight Kiosk Widget

## Règles strictes

- **Règle 1** : Ne jamais commiter directement sur `main`. Toujours feature branch → PR → `staging`.
- **Règle 2** : Le tracking `?ref=` est le cœur du business. Toute modif front-end doit le préserver.
- **Règle 3** : UI kiosque : plein écran, zéro scroll, contraste fort (#FFE800 / #0A0A0A).
- **Règle 4** : Travelpayouts marker = `NEXT_PUBLIC_TRAVELPAYOUTS_MARKER`. En CI, `000000` placeholder.

## Architecture

- `components/TravelWidget.js` — widget Travelpayouts avec marker
- `components/KioskQR.js` — QR code de continuité (conserve `?ref=`)
- `lib/useShopRef.js` — lecture + persistance du `?ref=`
- `lib/config.js` — `buildMarker()` injecte le ref dans le marker

## Build

```bash
npm run lint && npm test && npm run build
```
