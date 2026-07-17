import { useEffect } from "react";

type Lang = "fr" | "nl" | "en";

const SITE_URL = "https://oncioiu-lucian.be";
const OG_IMAGE = "https://images.unsplash.com/photo-1642749776312-aa42ce20c9f5?w=1200&h=630&fit=crop&fm=webp&auto=format";

const SEO_DATA = {
  fr: {
    title: "Oncioiu Lucian-Ionut | Installateur Climatisation Daikin, Samsung, Fujitsu — Belgique",
    description:
      "Installateur indépendant certifié, distributeur agréé Daikin, Samsung & Fujitsu. Climatisation, électricité et batteries domestiques en Belgique. Prix pour tous les budgets — devis gratuit, intervention rapide.",
    keywords:
      "installateur climatisation belgique, daikin belgique, samsung climatisation, fujitsu belgique, électricité belgique, batteries domestiques, devis gratuit climatisation, installateur certifié F-gaz, RGIE, entretien climatisation belgique",
    faq: [
      { q: "Faites-vous des devis gratuits ?", a: "Oui, nous offrons des devis gratuits et des visites sur site sans engagement." },
      { q: "Quelles marques installez-vous ?", a: "Nous sommes distributeur agréé Daikin, Samsung et Fujitsu, et installons également Mitsubishi Electric, Panasonic et LG." },
      { q: "Intervenez-vous dans toute la Belgique ?", a: "Oui, nous couvrons l'ensemble du territoire belge pour tous vos projets de climatisation, électricité et batteries domestiques." },
      { q: "Êtes-vous certifié F-gaz et RGIE ?", a: "Oui, nous sommes certifiés F-gaz pour la manipulation des fluides frigorigènes et conformes RGIE pour toutes les installations électriques." },
      { q: "Installez-vous des unités achetées ailleurs ?", a: "Oui, nous proposons un service d'installation pour les unités de climatisation achetées chez d'autres fournisseurs." },
    ],
  },
  nl: {
    title: "Oncioiu Lucian-Ionut | Airconditioning Installateur Daikin, Samsung, Fujitsu — België",
    description:
      "Zelfstandig gecertificeerd installateur, erkend verdeler van Daikin, Samsung & Fujitsu. Airconditioning, elektriciteit en thuisbatterijen in heel België. Prijzen voor elk budget — gratis offerte, snelle interventie.",
    keywords:
      "airconditioning installateur belgië, daikin belgië, samsung airconditioning, fujitsu belgië, elektriciteit belgië, thuisbatterijen, gratis offerte airconditioning, F-gaz gecertificeerd, AREI, onderhoud airconditioning belgië",
    faq: [
      { q: "Geeft u gratis offertes?", a: "Ja, wij bieden gratis offertes en plaatsbezoeken aan zonder verbintenis." },
      { q: "Welke merken installeert u?", a: "Wij zijn erkend verdeler van Daikin, Samsung en Fujitsu, en installeren ook Mitsubishi Electric, Panasonic en LG." },
      { q: "Werkt u in heel België?", a: "Ja, wij dekken het volledige Belgische grondgebied voor al uw projecten inzake airconditioning, elektriciteit en thuisbatterijen." },
      { q: "Bent u F-gaz en AREI gecertificeerd?", a: "Ja, wij zijn F-gaz gecertificeerd voor de manipulatie van koudemiddelen en conform AREI voor alle elektrische installaties." },
      { q: "Installeert u toestellen die elders zijn aangekocht?", a: "Ja, wij bieden een installatiedienst aan voor airconditioningtoestellen die bij andere leveranciers zijn aangekocht." },
    ],
  },
  en: {
    title: "Oncioiu Lucian-Ionut | Air Conditioning Installer Daikin, Samsung, Fujitsu — Belgium",
    description:
      "Independent certified installer, authorised distributor of Daikin, Samsung & Fujitsu. Air conditioning, electrical installations and home batteries across Belgium. Solutions for every budget — free quote, fast response.",
    keywords:
      "air conditioning installer belgium, daikin belgium, samsung air conditioning, fujitsu belgium, electrical installer belgium, home batteries, free quote air conditioning, F-gas certified, RGIE, air conditioning maintenance belgium",
    faq: [
      { q: "Do you offer free quotes?", a: "Yes, we offer free quotes and on-site visits with no obligation." },
      { q: "Which brands do you install?", a: "We are an authorised distributor of Daikin, Samsung and Fujitsu, and also install Mitsubishi Electric, Panasonic and LG." },
      { q: "Do you cover all of Belgium?", a: "Yes, we cover the entire Belgian territory for all your air conditioning, electrical and home battery projects." },
      { q: "Are you F-gas and RGIE certified?", a: "Yes, we are F-gas certified for refrigerant handling and RGIE compliant for all electrical installations." },
      { q: "Do you install units purchased elsewhere?", a: "Yes, we offer an installation service for air conditioning units purchased from other suppliers." },
    ],
  },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "HVACBusiness", "Electrician"],
      "@id": `${SITE_URL}/#business`,
      name: "Oncioiu Lucian-Ionut",
      alternateName: ["Oncioiu Airconditioning", "Oncioiu Électricité"],
      description:
        "Installateur indépendant certifié, distributeur agréé Daikin, Samsung & Fujitsu. Spécialiste en climatisation, installations électriques et batteries domestiques en Belgique.",
      url: SITE_URL,
      telephone: "+32465140837",
      email: "lucianoncioiuoli@gmail.com",
      image: OG_IMAGE,
      priceRange: "€–€€€",
      currenciesAccepted: "EUR",
      paymentAccepted: "Cash, Bank Transfer",
      address: {
        "@type": "PostalAddress",
        addressCountry: "BE",
        addressRegion: "Belgique",
      },
      areaServed: [
        { "@type": "Country", name: "Belgium" },
        { "@type": "City", name: "Bruxelles" },
        { "@type": "City", name: "Anvers" },
        { "@type": "City", name: "Gand" },
        { "@type": "City", name: "Bruges" },
        { "@type": "City", name: "Liège" },
        { "@type": "City", name: "Namur" },
        { "@type": "City", name: "Charleroi" },
        { "@type": "City", name: "Mons" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday"],
          opens: "09:00",
          closes: "13:00",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        reviewCount: "4",
        bestRating: "5",
        worstRating: "1",
      },
      review: [
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Sophie Lambrecht" },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          datePublished: "2024-11",
          reviewBody: "Excellent travail ! L'installation de la climatisation s'est faite rapidement et proprement. Très professionnel et ponctuel.",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Marc Desmet" },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          datePublished: "2024-10",
          reviewBody: "Devis reçu très rapidement, prix compétitif et travail irréprochable.",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Installation Climatisation Split & Multi-Split", provider: { "@id": `${SITE_URL}/#business` } } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fourniture Climatisation Daikin, Samsung, Fujitsu", provider: { "@id": `${SITE_URL}/#business` } } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Installations Électriques RGIE", provider: { "@id": `${SITE_URL}/#business` } } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Installation Unités Fournies par le Client", provider: { "@id": `${SITE_URL}/#business` } } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Entretien & Maintenance Climatisation", provider: { "@id": `${SITE_URL}/#business` } } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Batteries Domestiques & Stockage Solaire", provider: { "@id": `${SITE_URL}/#business` } } },
        ],
      },
      knowsAbout: ["Daikin", "Samsung", "Fujitsu", "Mitsubishi Electric", "Panasonic", "LG", "F-gaz", "RGIE", "AREI", "Synergrid"],
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Oncioiu Lucian-Ionut",
      inLanguage: ["fr-BE", "nl-BE", "en"],
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  ],
};

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

function setLink(rel: string, href: string, extras: Record<string, string> = {}) {
  const selector = Object.entries(extras).reduce(
    (acc, [k, v]) => `${acc}[${k}="${v}"]`,
    `link[rel="${rel}"]`
  );
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    Object.entries(extras).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.href = href;
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

export default function Seo({ lang }: { lang: Lang }) {
  useEffect(() => {
    const { title, description, keywords } = SEO_DATA[lang];

    document.title = title;
    document.documentElement.lang = lang === "nl" ? "nl-BE" : lang === "fr" ? "fr-BE" : "en";

    // Basic meta
    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMeta("author", "Oncioiu Lucian-Ionut");
    setMeta("geo.region", "BE");
    setMeta("geo.placename", "Belgique");

    // Open Graph
    setMeta("og:type", "website", "property");
    setMeta("og:url", SITE_URL, "property");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:locale", lang === "nl" ? "nl_BE" : lang === "fr" ? "fr_BE" : "en_US", "property");
    setMeta("og:locale:alternate", lang === "fr" ? "nl_BE" : "fr_BE", "property");
    setMeta("og:site_name", "Oncioiu Lucian-Ionut", "property");
    setMeta("og:image", OG_IMAGE, "property");
    setMeta("og:image:width", "1200", "property");
    setMeta("og:image:height", "630", "property");
    setMeta("og:image:type", "image/webp", "property");
    setMeta("og:image:alt", "Oncioiu Lucian-Ionut — Installateur Climatisation & Électricité Belgique", "property");

    // Twitter card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", OG_IMAGE);
    setMeta("twitter:image:alt", "Oncioiu Lucian-Ionut — Installateur Climatisation Belgique");

    // Canonical + hreflang
    setLink("canonical", SITE_URL);
    setLink("alternate", `${SITE_URL}?lang=fr`, { hreflang: "fr-BE" });
    setLink("alternate", `${SITE_URL}?lang=nl`, { hreflang: "nl-BE" });
    setLink("alternate", `${SITE_URL}?lang=en`, { hreflang: "en" });
    setLink("alternate", SITE_URL, { hreflang: "x-default" });

    // JSON-LD
    setJsonLd("sd-localbusiness", STRUCTURED_DATA);
    setJsonLd("sd-faq", buildFaqSchema(lang));
  }, [lang]);

  return null;
}
