import { useEffect } from "react";

type Lang = "fr" | "nl" | "en";

const SITE_URL = "https://oli-nrg.be";
const BRAND = "Oli-NRG";
const OWNER = "Oncioiu Lucian-Ionut";
const OG_IMAGE = "https://images.unsplash.com/photo-1642749776312-aa42ce20c9f5?w=1200&h=630&fit=crop&fm=webp&auto=format";

const SEO_DATA = {
  fr: {
    title: "Installateur Climatisation & Pompe à Chaleur Belgique | Oli-NRG",
    description: "Oli-NRG installe pompes à chaleur, climatisation, électricité, photovoltaïque, batteries et bornes de recharge en Belgique. Devis gratuit.",
    keywords: "installateur climatisation belgique, pompe à chaleur belgique, électricien belgique, panneaux solaires, batterie domestique, borne recharge voiture électrique, Daikin, Samsung, Fujitsu",
    faq: [
      { q: "Faites-vous des devis gratuits ?", a: "Oui, les devis et visites sur site sont gratuits et sans engagement." },
      { q: "Quelles marques installez-vous ?", a: "Nous travaillons notamment avec Daikin, Samsung et Fujitsu et pouvons également installer du matériel fourni par le client après vérification technique." },
      { q: "Intervenez-vous dans toute la Belgique ?", a: "Oui, nous réalisons des projets dans toute la Belgique selon le type et la taille de l’intervention." },
    ],
  },
  nl: {
    title: "Airco & Warmtepomp Installateur België | Oli-NRG",
    description: "Oli-NRG installeert warmtepompen, airco, elektriciteit, zonnepanelen, thuisbatterijen en EV-laadpalen in België. Gratis offerte.",
    keywords: "airco installateur belgië, warmtepomp installateur, elektricien belgië, zonnepanelen installateur, thuisbatterij, laadpaal installateur, Daikin, Samsung, Fujitsu",
    faq: [
      { q: "Zijn offertes gratis?", a: "Ja, offertes en plaatsbezoeken zijn gratis en vrijblijvend." },
      { q: "Welke merken installeren jullie?", a: "Wij werken onder meer met Daikin, Samsung en Fujitsu en kunnen ook door de klant aangekocht materiaal installeren na technische controle." },
      { q: "Werken jullie in heel België?", a: "Ja, afhankelijk van het type en de omvang van het project werken wij in heel België." },
    ],
  },
  en: {
    title: "Air Conditioning & Heat Pump Installer Belgium | Oli-NRG",
    description: "Oli-NRG installs heat pumps, air conditioning, electrical systems, solar panels, home batteries and EV chargers across Belgium. Free quote.",
    keywords: "air conditioning installer belgium, heat pump installer belgium, electrician belgium, solar panels belgium, home battery, EV charger installer, Daikin, Samsung, Fujitsu",
    faq: [
      { q: "Do you offer free quotes?", a: "Yes, quotations and on-site visits are free and without obligation." },
      { q: "Which brands do you install?", a: "We work with brands including Daikin, Samsung and Fujitsu and can also install customer-supplied equipment after a technical check." },
      { q: "Do you work across Belgium?", a: "Yes, depending on the type and size of the project we operate across Belgium." },
    ],
  },
} as const;

function languagePath(lang: Lang): string {
  return `/${lang}/`;
}

function currentCanonical(lang: Lang): string {
  const path = window.location.pathname;
  if (path === "/" || path === "") return `${SITE_URL}${languagePath(lang)}`;
  return `${SITE_URL}${path.endsWith("/") ? path : `${path}/`}`;
}

function buildStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "HVACBusiness", "Electrician"],
        "@id": `${SITE_URL}/#business`,
        name: BRAND,
        legalName: OWNER,
        alternateName: ["Oli NRG", OWNER],
        url: SITE_URL,
        telephone: "+32465140837",
        email: "lucianoncioiuoli@gmail.com",
        image: OG_IMAGE,
        priceRange: "€€",
        address: { "@type": "PostalAddress", addressCountry: "BE" },
        areaServed: { "@type": "Country", name: "Belgium" },
        knowsAbout: ["Daikin", "Samsung", "Fujitsu", "F-gas", "RGIE", "AREI", "Synergrid"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Oli-NRG Services",
          itemListElement: [
            "Heat pumps and air conditioning",
            "General electrical installations",
            "Photovoltaic installations and home batteries",
            "EV charging stations",
            "Maintenance and repairs",
          ].map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name, provider: { "@id": `${SITE_URL}/#business` } },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND,
        inLanguage: ["fr-BE", "nl-BE", "en"],
        publisher: { "@id": `${SITE_URL}/#business` },
      },
    ],
  };
}

function buildFaqSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SEO_DATA[lang].faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function replaceLink(rel: string, href: string, extras: Record<string, string> = {}) {
  const selector = extras.hreflang ? `link[rel="${rel}"][hreflang="${extras.hreflang}"]` : `link[rel="${rel}"]`;
  document.querySelectorAll(selector).forEach((node) => node.remove());
  const el = document.createElement("link");
  el.rel = rel;
  el.href = href;
  Object.entries(extras).forEach(([key, value]) => el.setAttribute(key, value));
  document.head.appendChild(el);
}

function ensureLink(rel: string, href: string, extras: Record<string, string> = {}) {
  const selector = `link[rel="${rel}"][href="${href}"]`;
  if (document.querySelector(selector)) return;
  const el = document.createElement("link");
  el.rel = rel;
  el.href = href;
  Object.entries(extras).forEach(([key, value]) => el.setAttribute(key, value));
  document.head.appendChild(el);
}

function setJsonLd(id: string, data: object) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export default function Seo({ lang, heroImageUrl }: { lang: Lang; heroImageUrl?: string }) {
  useEffect(() => {
    const { title, description, keywords } = SEO_DATA[lang];
    const canonical = currentCanonical(lang);

    document.title = title;
    document.documentElement.lang = lang === "nl" ? "nl-BE" : lang === "fr" ? "fr-BE" : "en";

    ensureLink("preconnect", "https://fonts.googleapis.com");
    ensureLink("preconnect", "https://fonts.gstatic.com", { crossorigin: "anonymous" });

    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMeta("author", OWNER);
    setMeta("geo.region", "BE");

    setMeta("og:type", "website", "property");
    setMeta("og:url", canonical, "property");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:locale", lang === "nl" ? "nl_BE" : lang === "fr" ? "fr_BE" : "en_GB", "property");
    setMeta("og:site_name", BRAND, "property");
    setMeta("og:image", OG_IMAGE, "property");
    setMeta("og:image:alt", `${BRAND} — energy installation specialist in Belgium`, "property");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", OG_IMAGE);

    replaceLink("canonical", canonical);
    replaceLink("alternate", `${SITE_URL}/fr/`, { hreflang: "fr-BE" });
    replaceLink("alternate", `${SITE_URL}/nl/`, { hreflang: "nl-BE" });
    replaceLink("alternate", `${SITE_URL}/en/`, { hreflang: "en" });
    replaceLink("alternate", `${SITE_URL}/`, { hreflang: "x-default" });

    if (heroImageUrl) ensureLink("preload", heroImageUrl, { as: "image" });

    setJsonLd("sd-localbusiness", buildStructuredData());
    setJsonLd("sd-faq", buildFaqSchema(lang));
  }, [lang, heroImageUrl]);

  return null;
}
