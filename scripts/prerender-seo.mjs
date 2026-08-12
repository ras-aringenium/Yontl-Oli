import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const site = "https://oli-nrg.be";

const homes = {
  fr: { title: "Installateur Climatisation & Pompe à Chaleur Belgique | Oli-NRG", desc: "Oli-NRG installe pompes à chaleur, climatisation, électricité, photovoltaïque, batteries et bornes de recharge en Belgique. Devis gratuit.", h1: "Votre spécialiste certifié en Pompes à Chaleur, Électricité, Photovoltaïque, Bornes VE & Maintenance", services: [["pompes-a-chaleur", "Pompes à chaleur"], ["electricite", "Électricité générale"], ["photovoltaique", "Installations photovoltaïques"], ["bornes-recharge", "Bornes de recharge VE"], ["entretien-maintenance", "Entretien, maintenance & dépannage"]] },
  nl: { title: "Airco & Warmtepomp Installateur België | Oli-NRG", desc: "Oli-NRG installeert warmtepompen, airco, elektriciteit, zonnepanelen, thuisbatterijen en EV-laadpalen in België. Gratis offerte.", h1: "Uw gecertificeerde specialist voor Warmtepompen, Elektriciteit, Fotovoltaïsch, EV-Laadpalen & Onderhoud", services: [["warmtepompen", "Warmtepompen"], ["elektriciteit", "Algemene elektriciteit"], ["zonnepanelen", "Fotovoltaïsche installaties"], ["laadpalen", "EV-laadstations"], ["onderhoud", "Onderhoud & herstellingen"]] },
  en: { title: "Air Conditioning & Heat Pump Installer Belgium | Oli-NRG", desc: "Oli-NRG installs heat pumps, air conditioning, electrical systems, solar panels, home batteries and EV chargers across Belgium. Free quote.", h1: "Your certified specialist for Heat Pumps, Electricity, Photovoltaic, EV Charging & Maintenance", services: [["heat-pumps", "Heat pumps"], ["electricity", "General electricity"], ["solar-panels", "Photovoltaic installations"], ["ev-charging", "EV charging stations"], ["maintenance", "Maintenance & repairs"]] },
};

const services = {
  fr: [
    ["pompes-a-chaleur", "Pompes à chaleur & climatisation en Belgique", "Installation de pompes à chaleur air/air et air/eau avec des solutions Daikin, Samsung, Fujitsu et autres grandes marques."],
    ["electricite", "Électricité générale en Belgique", "Travaux électriques résidentiels et professionnels conformes aux normes belges."],
    ["photovoltaique", "Installations photovoltaïques & batteries", "Panneaux solaires avec ou sans batterie domestique pour maisons et petites installations professionnelles."],
    ["bornes-recharge", "Bornes de recharge pour véhicules électriques", "Installation et mise en service de bornes de recharge résidentielles et professionnelles."],
    ["entretien-maintenance", "Entretien, maintenance & dépannage", "Entretien préventif, diagnostics et réparations pour vos installations techniques."],
  ],
  nl: [
    ["warmtepompen", "Warmtepompen & airco in België", "Installatie van lucht/lucht- en lucht/waterwarmtepompen met oplossingen van Daikin, Samsung, Fujitsu en andere grote merken."],
    ["elektriciteit", "Algemene elektriciteit in België", "Elektrische werken voor woningen en professionele gebouwen volgens de Belgische normen."],
    ["zonnepanelen", "Zonnepanelen & thuisbatterijen", "Fotovoltaïsche installaties met of zonder thuisbatterij voor woningen en kleine professionele projecten."],
    ["laadpalen", "Laadpalen voor elektrische voertuigen", "Installatie en indienststelling van laadstations voor thuis en professioneel gebruik."],
    ["onderhoud", "Onderhoud, service & herstellingen", "Preventief onderhoud, diagnose en herstellingen voor technische installaties."],
  ],
  en: [
    ["heat-pumps", "Heat pumps & air conditioning in Belgium", "Installation of air-to-air and air-to-water heat pumps with solutions from Daikin, Samsung, Fujitsu and other leading brands."],
    ["electricity", "General electrical installations in Belgium", "Residential and professional electrical work compliant with Belgian standards."],
    ["solar-panels", "Solar panels & home batteries", "Photovoltaic systems with or without home battery storage for homes and small businesses."],
    ["ev-charging", "EV charging stations in Belgium", "Installation and commissioning of residential and commercial EV charging stations."],
    ["maintenance", "Maintenance, service & repairs", "Preventive maintenance, diagnostics and repairs for technical installations."],
  ],
};

const staticCopy = {
  fr: "Belgique · Devis gratuit · Installation professionnelle",
  nl: "België · Gratis offerte · Professionele installatie",
  en: "Belgium · Free quote · Professional installation",
};

function escapeHtml(s) { return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }
function cleanSeoHead(html) {
  return html
    .replace(/\s*<link[^>]+rel="canonical"[^>]*>/gi, "")
    .replace(/\s*<link[^>]+rel="alternate"[^>]*>/gi, "")
    .replace(/\s*<meta[^>]+name="robots"[^>]*>/gi, "")
    .replace(/\s*<meta[^>]+property="og:(?:title|description|url)"[^>]*>/gi, "");
}
function head(html, lang, title, desc, canonical) {
  return cleanSeoHead(html)
    .replace(/<html lang="[^"]*">/, `<html lang="${lang === "fr" ? "fr-BE" : lang === "nl" ? "nl-BE" : "en"}">`)
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(desc)}" />`)
    .replace("</head>", `<link rel="canonical" href="${canonical}" /><meta name="robots" content="index, follow, max-image-preview:large" /><meta property="og:title" content="${escapeHtml(title)}" /><meta property="og:description" content="${escapeHtml(desc)}" /><meta property="og:url" content="${canonical}" /></head>`);
}
function replaceStaticRoot(html, body) {
  return html.replace(/<div id="root">[\s\S]*?<\/div>/, body);
}
function writeRoute(route, html) {
  const dir = path.join(dist, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

for (const [lang, data] of Object.entries(homes)) {
  const canonical = `${site}/${lang}/`;
  const list = data.services.map(([slug, label]) => `<li><a href="/${lang}/${slug}/">${escapeHtml(label)}</a></li>`).join("");
  const staticBody = `<div id="root"><main style="font-family:Arial,sans-serif;padding:48px;max-width:1000px;margin:auto"><h1>${escapeHtml(data.h1)}</h1><p>${escapeHtml(data.desc)}</p><h2>Services</h2><ul>${list}</ul><p><a href="/${lang}/#contact">Contact · Oli-NRG</a></p></main></div>`;
  let html = replaceStaticRoot(head(template, lang, data.title, data.desc, canonical), staticBody);
  html = html.replace("</head>", `<link rel="alternate" hreflang="fr-BE" href="${site}/fr/"/><link rel="alternate" hreflang="nl-BE" href="${site}/nl/"/><link rel="alternate" hreflang="en" href="${site}/en/"/><link rel="alternate" hreflang="x-default" href="${site}/"/></head>`);
  writeRoute(lang, html);
}

for (const [lang, rows] of Object.entries(services)) {
  rows.forEach(([slug, title, desc], index) => {
    const canonical = `${site}/${lang}/${slug}/`;
    const staticBody = `<div id="root"><main style="font-family:Arial,sans-serif;padding:48px;max-width:1000px;margin:auto"><p><a href="/${lang}/">Oli-NRG</a></p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(desc)}</p><p>${escapeHtml(staticCopy[lang])}</p><p><a href="/${lang}/#contact">Contact Oli-NRG</a></p></main></div>`;
    let html = replaceStaticRoot(head(template, lang, `${title} | Oli-NRG`, desc, canonical), staticBody);
    const keys = ["fr", "nl", "en"];
    const alternates = keys.map(l => `<link rel="alternate" hreflang="${l === "fr" ? "fr-BE" : l === "nl" ? "nl-BE" : "en"}" href="${site}/${l}/${services[l][index][0]}/"/>`).join("");
    html = html.replace("</head>", `${alternates}</head>`);
    writeRoute(path.join(lang, slug), html);
  });
}

console.log("Generated multilingual prerendered SEO routes.");
