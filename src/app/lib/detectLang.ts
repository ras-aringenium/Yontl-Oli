type Lang = "fr" | "nl" | "en";

const SUPPORTED: Lang[] = ["fr", "nl", "en"];
const STORAGE_KEY = "yontl_lang";

// Belgian provinces → language mapping (ipapi.co returns region names)
const FLANDERS = new Set([
  "Antwerp", "Antwerpen", "East Flanders", "Oost-Vlaanderen",
  "West Flanders", "West-Vlaanderen", "Flemish Brabant", "Vlaams-Brabant",
  "Limburg",
]);
const WALLONIA = new Set([
  "Hainaut", "Liège", "Lüttich", "Luxembourg", "Namur",
  "Walloon Brabant", "Brabant Wallon",
]);
// Brussels-Capital Region is neither set → falls back to browser language

function browserLang(): Lang {
  const code = (navigator.language || "").slice(0, 2).toLowerCase();
  return SUPPORTED.includes(code as Lang) ? (code as Lang) : "fr";
}

export function getSavedLang(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && SUPPORTED.includes(v as Lang) ? (v as Lang) : null;
  } catch {
    return null;
  }
}

export function saveManualLang(lang: Lang): void {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
}

// Synchronous: returns the best lang we can determine right now.
// Call this as the useState initialiser so the first render is already correct.
export function detectLangSync(): Lang {
  return getSavedLang() ?? browserLang();
}

// Asynchronous: fires an IP lookup in the background (no GPS, no blocking).
// Calls onDetected once with a potentially better lang. Safe to ignore.
// Skips entirely when a manual preference is already saved.
export function detectLangAsync(onDetected: (lang: Lang) => void): void {
  if (getSavedLang()) return; // manual choice always wins — no network call needed

  const browser = browserLang();

  // HTTPS IP lookup; no GPS permission and no blocking of page rendering.
  fetch("https://ipapi.co/json/", {
    signal: AbortSignal.timeout(3500),
  })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((geo: { country_code?: string; region?: string }) => {
      const country = geo.country_code ?? "";
      const region = geo.region ?? "";
      let detected: Lang;
      if (country === "BE") {
        if (FLANDERS.has(region)) {
          detected = "nl";
        } else if (WALLONIA.has(region)) {
          detected = "fr";
        } else {
          // Brussels or unknown Belgian region: honour browser if fr/nl, else fr
          detected = browser === "nl" || browser === "fr" ? browser : "fr";
        }
      } else {
        detected = browser;
      }
      onDetected(detected);
    })
    .catch(() => {
      // Network failure or timeout — silently fall back, no action needed
    });
}
