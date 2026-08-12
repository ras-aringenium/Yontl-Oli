import { useEffect } from "react";

type Lang = "fr" | "nl" | "en";
type ServiceKey = "heat-pumps" | "electricity" | "solar" | "ev-charging" | "maintenance";

const SITE = "https://oli-nrg.be";

const SERVICE_SLUGS: Record<Lang, Record<ServiceKey, string>> = {
  fr: { "heat-pumps": "pompes-a-chaleur", electricity: "electricite", solar: "photovoltaique", "ev-charging": "bornes-recharge", maintenance: "entretien-maintenance" },
  nl: { "heat-pumps": "warmtepompen", electricity: "elektriciteit", solar: "zonnepanelen", "ev-charging": "laadpalen", maintenance: "onderhoud" },
  en: { "heat-pumps": "heat-pumps", electricity: "electricity", solar: "solar-panels", "ev-charging": "ev-charging", maintenance: "maintenance" },
};

const CONTENT: Record<Lang, Record<ServiceKey, { title: string; lead: string; body: string[]; cta: string }>> = {
  fr: {
    "heat-pumps": { title: "Pompes à chaleur & climatisation en Belgique", lead: "Installation de pompes à chaleur air/air et air/eau, avec des solutions Daikin, Samsung, Fujitsu et autres grandes marques.", body: ["Étude de votre projet, dimensionnement et installation professionnelle.", "Installation de matériel fourni par Oli-NRG ou, après vérification technique, de matériel acheté par le client.", "Entretien, diagnostic et dépannage disponibles."], cta: "Demander un devis gratuit" },
    electricity: { title: "Électricité générale en Belgique", lead: "Travaux électriques résidentiels et professionnels conformes aux normes belges.", body: ["Nouvelles installations, rénovation de tableaux et câblage.", "Mise en conformité RGIE, dépannage et réparations.", "Solutions adaptées aux rénovations comme aux nouveaux projets."], cta: "Demander un devis gratuit" },
    solar: { title: "Installations photovoltaïques & batteries", lead: "Panneaux solaires avec ou sans batterie domestique pour maisons et petites installations professionnelles.", body: ["Nouvelles installations, extensions et modernisation de systèmes existants.", "Solutions de stockage et intégration avec les équipements électriques de votre bâtiment.", "Étude technique avant installation."], cta: "Demander un devis gratuit" },
    "ev-charging": { title: "Bornes de recharge pour véhicules électriques", lead: "Installation et mise en service de bornes de recharge résidentielles et professionnelles.", body: ["Dimensionnement selon votre installation électrique et votre véhicule.", "Installation propre et sécurisée avec contrôle de compatibilité.", "Solutions pour maison, entreprise et parking privé."], cta: "Demander un devis gratuit" },
    maintenance: { title: "Entretien, maintenance & dépannage", lead: "Entretien préventif, diagnostics et réparations pour vos installations techniques.", body: ["Pompes à chaleur et climatisation.", "Électricité, photovoltaïque, batteries et bornes VE.", "Interventions planifiées et diagnostic avant réparation."], cta: "Demander une intervention" },
  },
  nl: {
    "heat-pumps": { title: "Warmtepompen & airco in België", lead: "Installatie van lucht/lucht- en lucht/waterwarmtepompen met oplossingen van Daikin, Samsung, Fujitsu en andere grote merken.", body: ["Projectanalyse, dimensionering en professionele installatie.", "Installatie van materiaal geleverd door Oli-NRG of, na technische controle, door de klant aangekocht materiaal.", "Onderhoud, diagnose en herstellingen beschikbaar."], cta: "Vraag een gratis offerte" },
    electricity: { title: "Algemene elektriciteit in België", lead: "Elektrische werken voor woningen en professionele gebouwen volgens de Belgische normen.", body: ["Nieuwe installaties, renovatie van verdeelkasten en bekabeling.", "AREI-conformiteit, depannage en herstellingen.", "Oplossingen voor renovatie en nieuwbouw."], cta: "Vraag een gratis offerte" },
    solar: { title: "Zonnepanelen & thuisbatterijen", lead: "Fotovoltaïsche installaties met of zonder thuisbatterij voor woningen en kleine professionele projecten.", body: ["Nieuwe installaties, uitbreidingen en upgrades van bestaande systemen.", "Opslagoplossingen en integratie met de elektrische installatie.", "Technische controle vóór installatie."], cta: "Vraag een gratis offerte" },
    "ev-charging": { title: "Laadpalen voor elektrische voertuigen", lead: "Installatie en indienststelling van laadstations voor thuis en professioneel gebruik.", body: ["Dimensionering volgens uw elektrische installatie en voertuig.", "Veilige en verzorgde installatie met compatibiliteitscontrole.", "Oplossingen voor woning, bedrijf en privéparking."], cta: "Vraag een gratis offerte" },
    maintenance: { title: "Onderhoud, service & herstellingen", lead: "Preventief onderhoud, diagnose en herstellingen voor technische installaties.", body: ["Warmtepompen en airconditioning.", "Elektriciteit, zonnepanelen, batterijen en EV-laadpalen.", "Geplande interventies en diagnose vóór reparatie."], cta: "Vraag een interventie" },
  },
  en: {
    "heat-pumps": { title: "Heat pumps & air conditioning in Belgium", lead: "Installation of air-to-air and air-to-water heat pumps with solutions from Daikin, Samsung, Fujitsu and other leading brands.", body: ["Project assessment, sizing and professional installation.", "Equipment supplied by Oli-NRG or customer-supplied equipment after a technical check.", "Maintenance, diagnostics and repairs available."], cta: "Request a free quote" },
    electricity: { title: "General electrical installations in Belgium", lead: "Residential and professional electrical work compliant with Belgian standards.", body: ["New installations, panel upgrades and wiring.", "RGIE/AREI compliance, troubleshooting and repairs.", "Solutions for renovation and new projects."], cta: "Request a free quote" },
    solar: { title: "Solar panels & home batteries", lead: "Photovoltaic systems with or without home battery storage for homes and small businesses.", body: ["New systems, extensions and upgrades of existing installations.", "Storage solutions and integration with your building's electrical system.", "Technical assessment before installation."], cta: "Request a free quote" },
    "ev-charging": { title: "EV charging stations in Belgium", lead: "Installation and commissioning of residential and commercial EV charging stations.", body: ["Sizing based on your electrical installation and vehicle.", "Safe, clean installation with compatibility checks.", "Solutions for homes, businesses and private parking."], cta: "Request a free quote" },
    maintenance: { title: "Maintenance, service & repairs", lead: "Preventive maintenance, diagnostics and repairs for technical installations.", body: ["Heat pumps and air conditioning.", "Electrical systems, solar, batteries and EV chargers.", "Planned interventions and diagnosis before repair."], cta: "Request service" },
  },
};

function resolveRoute(): { lang: Lang; key: ServiceKey } | null {
  const [langRaw, slug] = window.location.pathname.split("/").filter(Boolean);
  if (!(["fr", "nl", "en"] as string[]).includes(langRaw)) return null;
  const lang = langRaw as Lang;
  const entry = (Object.entries(SERVICE_SLUGS[lang]) as [ServiceKey, string][]).find(([, value]) => value === slug);
  return entry ? { lang, key: entry[0] } : null;
}

export function isServiceRoute(): boolean { return resolveRoute() !== null; }

export default function ServicePage() {
  const route = resolveRoute();
  if (!route) return null;
  const { lang, key } = route;
  const content = CONTENT[lang][key];
  const canonical = `${SITE}/${lang}/${SERVICE_SLUGS[lang][key]}/`;

  useEffect(() => {
    document.documentElement.lang = lang === "fr" ? "fr-BE" : lang === "nl" ? "nl-BE" : "en";
    document.title = `${content.title} | Oli-NRG`;
    const desc = content.lead;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = desc;
    document.querySelectorAll('link[rel="canonical"]').forEach((n) => n.remove());
    const canonicalLink = document.createElement("link"); canonicalLink.rel = "canonical"; canonicalLink.href = canonical; document.head.appendChild(canonicalLink);
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((n) => n.remove());
    (["fr", "nl", "en"] as Lang[]).forEach((l) => {
      const link = document.createElement("link"); link.rel = "alternate"; link.hreflang = l === "fr" ? "fr-BE" : l === "nl" ? "nl-BE" : "en"; link.href = `${SITE}/${l}/${SERVICE_SLUGS[l][key]}/`; document.head.appendChild(link);
    });
  }, [canonical, content.lead, content.title, key, lang]);

  const labels = { fr: { home: "Accueil", services: "Services", contact: "Contact", back: "Voir tous les services" }, nl: { home: "Home", services: "Diensten", contact: "Contact", back: "Bekijk alle diensten" }, en: { home: "Home", services: "Services", contact: "Contact", back: "View all services" } }[lang];

  return <div className="min-h-screen bg-[#F4F6F9] text-gray-800">
    <header className="bg-[#0F3D66] text-white"><div className="max-w-5xl mx-auto px-5 py-5 flex items-center justify-between gap-4"><a href={`/${lang}/`} className="font-bold text-xl">Oli-NRG</a><nav className="flex items-center gap-4 text-sm"><a href={`/${lang}/`}>{labels.home}</a><a href={`/${lang}/#services`}>{labels.services}</a><a href={`/${lang}/#contact`}>{labels.contact}</a></nav></div></header>
    <main>
      <section className="bg-[#0F3D66] text-white"><div className="max-w-5xl mx-auto px-5 py-20"><p className="text-green-300 font-bold uppercase tracking-widest text-xs mb-4">Oli-NRG · Belgium</p><h1 className="text-4xl md:text-5xl font-bold max-w-4xl leading-tight">{content.title}</h1><p className="mt-6 text-lg text-white/75 max-w-3xl leading-relaxed">{content.lead}</p><div className="mt-8 flex flex-wrap gap-3"><a href={`/${lang}/#contact`} className="bg-[#16A34A] text-white font-bold px-6 py-3 rounded-xl">{content.cta}</a><a href="https://wa.me/32465140837" className="bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl">WhatsApp</a></div></div></section>
      <section className="max-w-5xl mx-auto px-5 py-14"><div className="grid md:grid-cols-3 gap-5">{content.body.map((p) => <div key={p} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"><p className="leading-relaxed">{p}</p></div>)}</div><div className="mt-10"><a href={`/${lang}/#services`} className="font-bold text-[#0F3D66]">← {labels.back}</a></div></section>
    </main>
    <footer className="bg-[#0F3D66] text-white/60"><div className="max-w-5xl mx-auto px-5 py-8 flex flex-wrap justify-between gap-4"><span>© {new Date().getFullYear()} Oli-NRG</span><div className="flex gap-3">{(["fr", "nl", "en"] as Lang[]).map((l) => <a key={l} href={`/${l}/${SERVICE_SLUGS[l][key]}/`} className={l === lang ? "text-white font-bold uppercase" : "uppercase"}>{l}</a>)}</div></div></footer>
  </div>;
}
