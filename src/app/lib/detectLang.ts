type Lang = "fr" | "nl" | "en";

const SUPPORTED: Lang[] = ["fr", "nl", "en"];
const STORAGE_KEY = "yontl_lang";

const FLANDERS = new Set([
  "Antwerp", "Antwerpen", "East Flanders", "Oost-Vlaanderen",
  "West Flanders", "West-Vlaanderen", "Flemish Brabant", "Vlaams-Brabant", "Limburg",
]);
const WALLONIA = new Set([
  "Hainaut", "Liège", "Lüttich", "Luxembourg", "Namur", "Walloon Brabant", "Brabant Wallon",
]);

function pathLang(): Lang | null {
  const segment = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  return SUPPORTED.includes(segment as Lang) ? (segment as Lang) : null;
}

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
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts.length === 0 || (parts.length === 1 && SUPPORTED.includes(parts[0] as Lang))) {
    window.history.replaceState({}, "", `/${lang}/${window.location.hash || ""}`);
  }
}

export function detectLangSync(): Lang {
  return pathLang() ?? getSavedLang() ?? browserLang();
}

export function detectLangAsync(onDetected: (lang: Lang) => void): void {
  if (pathLang() || getSavedLang()) return;
  const browser = browserLang();

  fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3500) })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((geo: { country_code?: string; region?: string }) => {
      const country = geo.country_code ?? "";
      const region = geo.region ?? "";
      let detected: Lang;
      if (country === "BE") {
        if (FLANDERS.has(region)) detected = "nl";
        else if (WALLONIA.has(region)) detected = "fr";
        else detected = browser === "nl" || browser === "fr" ? browser : "fr";
      } else detected = browser;
      onDetected(detected);
    })
    .catch(() => {});
}
