// Tiny built-in i18n — no library. UI strings are keyed by NEXT_PUBLIC_LOCALE so
// a fork can translate the kiosk by only setting an env var (falls back to `en`).
// The brand name itself is not translated (it's set via BRAND_PREFIX/SUFFIX).
import { LOCALE } from "./config";

const DICT = {
  en: {
    "attract.subtitle": "Book your flight at the best price, right here.",
    "attract.cta": "Touch to start",
    "main.heading": "Book your flight",
    "main.headingAccent": "in a flash.",
    "main.subtitle": "Compare and book at the best price, right here.",
    "popular.flights": "Popular flights",
    "footer.tagline": "Partner booking terminal",
    "qr.continue": "Continue on mobile",
    "offline.title": "Service temporarily unavailable",
    "offline.body":
      "Check the connection, or scan the QR code to continue on your phone.",
    "offline.retry": "Retry",
    "error.title": "Something went wrong",
    "error.cta": "Touch to restart",
  },
  fr: {
    "attract.subtitle": "Réservez votre vol au meilleur prix, ici et maintenant.",
    "attract.cta": "Touchez pour commencer",
    "main.heading": "Réservez votre vol",
    "main.headingAccent": "en un flash.",
    "main.subtitle": "Comparez et réservez au meilleur prix, ici et maintenant.",
    "popular.flights": "Vols populaires",
    "footer.tagline": "Borne de réservation partenaire",
    "qr.continue": "Continuer sur mobile",
    "offline.title": "Service momentanément indisponible",
    "offline.body":
      "Vérifiez la connexion, ou scannez le QR code pour continuer sur votre mobile.",
    "offline.retry": "Réessayer",
    "error.title": "Une erreur est survenue",
    "error.cta": "Touchez pour recommencer",
  },
  nl: {
    "attract.subtitle": "Boek je vlucht aan de beste prijs, hier en nu.",
    "attract.cta": "Raak aan om te starten",
    "main.heading": "Boek je vlucht",
    "main.headingAccent": "in een flits.",
    "main.subtitle": "Vergelijk en boek aan de beste prijs, hier en nu.",
    "popular.flights": "Populaire vluchten",
    "footer.tagline": "Partner boekingsterminal",
    "qr.continue": "Ga verder op mobiel",
    "offline.title": "Dienst tijdelijk niet beschikbaar",
    "offline.body":
      "Controleer de verbinding, of scan de QR-code om verder te gaan op je telefoon.",
    "offline.retry": "Opnieuw",
    "error.title": "Er is iets misgegaan",
    "error.cta": "Raak aan om opnieuw te starten",
  },
};

const strings = DICT[LOCALE] || DICT.en;

/**
 * Translate a UI key for the configured locale (fallback: English, then the key).
 * @param {string} key
 * @returns {string}
 */
export function t(key) {
  return strings[key] ?? DICT.en[key] ?? key;
}
