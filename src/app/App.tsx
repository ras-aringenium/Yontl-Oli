import { useState, useEffect, useRef, lazy, Suspense, startTransition, Component } from "react";
import type { ReactNode } from "react";
import {
  Zap, Wind, Wrench, Battery, Star, CheckCircle, Phone, Mail, MapPin,
  Clock, MessageCircle, ChevronDown, X, Menu, Globe, ArrowRight,
  Shield, Award, TrendingUp, Settings, Sun, Headphones, Maximize2, Plug,
} from "lucide-react";
import type { SiteData, SocialLinks } from "./types";
import { DEFAULT_DATA } from "./types";
import { fetchSiteData } from "./lib/db";
import type { DbService } from "./lib/db";
import Seo from "./Seo";
import { detectLangSync, detectLangAsync, saveManualLang } from "./lib/detectLang";

const AdminApp = lazy(() => import("./admin/AdminApp"));

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Lang = "fr" | "nl" | "en";
type GalleryFilter = "all" | "ac" | "electrical" | "batteries";

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  fr: {
    nav: { services: "Services", why: "Pourquoi nous", gallery: "Réalisations", reviews: "Avis", certs: "Certifications", contact: "Contact" },
    quote: "Devis gratuit",
    hero: {
      headline: "Votre spécialiste certifié en Pompes à Chaleur, Électricité, Photovoltaïque, Bornes VE & Maintenance",
      sub: "Devis gratuits • Intervention rapide • Installateur certifié",
      brands: "Nous installons les meilleures marques mondiales",
    },
    services: {
      title: "Nos Services",
      sub: "Cinq domaines d'expertise pour votre confort et vos économies d'énergie",
      cta: "Demander un devis",
      customerSupply: "Nous pouvons fournir l'équipement ou installer du matériel déjà acheté par le client, sur demande et après vérification de la compatibilité technique et de la sécurité.",
      items: [
        { title: "Pompes à Chaleur", desc: "Pompes à chaleur air/air (climatisation) et air/eau (eau chaude sanitaire & chauffage). Distributeur agréé Daikin, Samsung et Fujitsu." },
        { title: "Électricité Générale", desc: "Travaux électriques résidentiels et professionnels : nouvelles installations, mise aux normes RGIE, rénovation de tableaux, câblage, dépannage et réparations." },
        { title: "Installations Photovoltaïques", desc: "Panneaux solaires avec ou sans batteries domestiques : nouvelles installations, extensions et mises à niveau de systèmes existants." },
        { title: "Bornes de Recharge VE", desc: "Installation et mise en service de bornes de recharge pour véhicules électriques, résidentielles et professionnelles." },
        { title: "Entretien, Maintenance & Dépannage", desc: "Entretien préventif, diagnostics, dépannage et réparations pour pompes à chaleur, électricité, photovoltaïque, batteries et bornes VE." },
      ],
    },
    why: {
      title: "Pourquoi Nous Choisir", sub: "La qualité et la confiance au cœur de chaque intervention",
      items: [
        { title: "Devis Gratuits", desc: "Visite sur site et devis offerts sans engagement de votre part." },
        { title: "Installateur Certifié", desc: "Nos installations respectent les normes belges en vigueur (RGIE, F-gaz)." },
        { title: "Réponse Rapide", desc: "Intervention planifiée rapidement selon vos disponibilités." },
        { title: "Travail Soigné", desc: "Finitions impeccables et installations durables, garanties." },
        { title: "Prix Transparents", desc: "Devis détaillé avant les travaux. Aucune mauvaise surprise." },
        { title: "Support Après-Vente", desc: "Nous restons disponibles longtemps après chaque installation." },
      ],
    },
    gallery: { title: "Nos Réalisations", sub: "Un aperçu de nos dernières installations professionnelles", all: "Tout", ac: "Climatisation", elec: "Électricité", bat: "Batteries" },
    reviews: { title: "Avis Clients", sub: "Ce que disent nos clients satisfaits", avg: "Note moyenne", count: "avis", reply: "Réponse du propriétaire :" },
    certs: {
      title: "Nos Certifications", sub: "Garanties de qualité, de sécurité et de conformité",
      items: [
        { title: "RGIE / AREI", desc: "Conforme au Règlement Général sur les Installations Électriques. Certification obligatoire pour tout travail électrique en Belgique." },
        { title: "Certification F-gaz", desc: "Habilité à manipuler les fluides frigorigènes. Certification européenne obligatoire pour l'installation et la maintenance des climatisations." },
        { title: "Installateur Agréé", desc: "Reconnu par Daikin, Samsung et Fujitsu comme installateur formé et agréé pour la pose de leurs systèmes." },
        { title: "Synergrid", desc: "Certification pour raccordement d'installations de production décentralisée au réseau électrique belge. Indispensable pour les systèmes PV." },
      ],
    },
    area: { title: "Zone d'Intervention", sub: "Nous intervenons dans toute la Belgique", desc: "Installateur basé en Belgique, nous nous déplaçons sur l'ensemble du territoire pour vos projets de pompes à chaleur, électricité, photovoltaïque, bornes VE et maintenance. Devis et déplacement gratuits." },
    contact: {
      title: "Contactez-Nous", sub: "Devis et visites 100% gratuits — sans engagement",
      free: "Devis gratuits et visites offertes.", freeSub: "Nous nous déplaçons gratuitement pour évaluer votre projet.",
      name: "Nom complet", email: "Adresse e-mail", phone: "Téléphone", service: "Service souhaité", message: "Votre message",
      send: "Envoyer ma demande", wa: "Écrire sur WhatsApp", selectSvc: "Sélectionnez un service…",
      thanks: "Merci ! Nous vous recontacterons très rapidement.",
    },
    footer: { desc: "Votre spécialiste certifié en pompes à chaleur, électricité, photovoltaïque, bornes de recharge VE et maintenance en Belgique.", links: "Liens Rapides", legal: "Légal", privacy: "Politique de confidentialité", terms: "Conditions générales", rights: "Tous droits réservés." },
    mobileBar: { quote: "Devis gratuit", wa: "WhatsApp" },
  },
  nl: {
    nav: { services: "Diensten", why: "Waarom wij", gallery: "Realisaties", reviews: "Beoordelingen", certs: "Certificeringen", contact: "Contact" },
    quote: "Gratis offerte",
    hero: { headline: "Uw gecertificeerde specialist voor Warmtepompen, Elektriciteit, Fotovoltaïsch, EV-Laadpalen & Onderhoud", sub: "Gratis offertes • Snelle interventie • Gecertificeerde installateur", brands: "Wij installeren de beste wereldmerken" },
    services: {
      title: "Onze Diensten",
      sub: "Vijf expertisedomeinen voor uw comfort en energiebesparing",
      cta: "Offerte aanvragen",
      customerSupply: "Wij kunnen de apparatuur leveren of materiaal dat de klant al heeft aangekocht installeren, op aanvraag en na een technische compatibiliteits- en veiligheidscontrole.",
      items: [
        { title: "Warmtepompen", desc: "Lucht/lucht warmtepompen (airconditioning) en lucht/water warmtepompen (sanitair warm water & verwarming). Erkend verdeler van Daikin, Samsung en Fujitsu." },
        { title: "Algemene Elektriciteit", desc: "Elektrische werken voor particulieren en bedrijven: nieuwe installaties, AREI-conformiteit, renovatie verdeelkasten, bekabeling, depannage en herstellingen." },
        { title: "Fotovoltaïsche Installaties", desc: "Zonnepanelen met of zonder thuisbatterijen: nieuwe installaties, uitbreidingen en upgrades van bestaande systemen." },
        { title: "EV-Laadstations", desc: "Installatie en inbedrijfstelling van laadpalen voor elektrische voertuigen, voor particulieren en bedrijven." },
        { title: "Onderhoud, Preventief & Herstellingen", desc: "Preventief onderhoud, diagnoses, depannage en herstellingen voor warmtepompen, elektriciteit, fotovoltaïsch, batterijen en laadstations." },
      ],
    },
    why: {
      title: "Waarom Voor Ons Kiezen", sub: "Kwaliteit en vertrouwen bij elke interventie",
      items: [
        { title: "Gratis Offertes", desc: "Plaatsbezoek en offerte gratis aangeboden, zonder verbintenis." },
        { title: "Gecertificeerde Installateur", desc: "Onze installaties voldoen aan de geldende Belgische normen (AREI, F-gaz)." },
        { title: "Snelle Reactie", desc: "Snel ingepland naar uw beschikbaarheid." },
        { title: "Verzorgd Werk", desc: "Onberispelijke afwerking en duurzame installaties gegarandeerd." },
        { title: "Transparante Prijzen", desc: "Gedetailleerde offerte voor de werken. Geen verrassingen." },
        { title: "After-Sales Support", desc: "Wij blijven beschikbaar lang na elke installatie." },
      ],
    },
    gallery: { title: "Onze Realisaties", sub: "Een overzicht van onze laatste professionele installaties", all: "Alles", ac: "Airconditioning", elec: "Elektriciteit", bat: "Batterijen" },
    reviews: { title: "Klantbeoordelingen", sub: "Wat onze tevreden klanten zeggen", avg: "Gemiddelde beoordeling", count: "beoordelingen", reply: "Reactie van de eigenaar:" },
    certs: {
      title: "Onze Certificeringen", sub: "Garanties van kwaliteit, veiligheid en conformiteit",
      items: [
        { title: "AREI / RGIE", desc: "Conform het Algemeen Reglement op de Elektrische Installaties. Verplichte certificering voor alle elektrische werken in België." },
        { title: "F-gaz Certificering", desc: "Bevoegd voor manipulatie van koudemiddelen. Europese verplichte certificering voor installatie en onderhoud van airconditioningsystemen." },
        { title: "Erkend Installateur", desc: "Erkend door Daikin, Samsung en Fujitsu als opgeleide en geautoriseerde installateur voor hun systemen." },
        { title: "Synergrid", desc: "Certificering voor aansluiting van decentrale productie-installaties op het Belgische elektriciteitsnet. Onmisbaar voor PV-systemen." },
      ],
    },
    area: { title: "Interventiegebied", sub: "Wij werken in heel België", desc: "Als in België gevestigde installateur werken wij door heel België voor uw projecten inzake warmtepompen, elektriciteit, fotovoltaïsch, EV-laadstations en onderhoud. Gratis offerte en plaatsbezoek." },
    contact: {
      title: "Contacteer Ons", sub: "100% gratis offerte en bezoek — zonder verbintenis",
      free: "Gratis offertes en plaatsbezoeken aangeboden.", freeSub: "Wij verplaatsen ons gratis om uw project te evalueren.",
      name: "Volledige naam", email: "E-mailadres", phone: "Telefoon", service: "Gewenste dienst", message: "Uw bericht",
      send: "Verstuur aanvraag", wa: "Schrijven op WhatsApp", selectSvc: "Selecteer een dienst…",
      thanks: "Bedankt! Wij nemen zo snel mogelijk contact op.",
    },
    footer: { desc: "Uw gecertificeerde specialist voor warmtepompen, elektriciteit, fotovoltaïsche installaties, EV-laadstations en onderhoud in België.", links: "Snelle Links", legal: "Juridisch", privacy: "Privacybeleid", terms: "Algemene voorwaarden", rights: "Alle rechten voorbehouden." },
    mobileBar: { quote: "Gratis offerte", wa: "WhatsApp" },
  },
  en: {
    nav: { services: "Services", why: "Why Us", gallery: "Gallery", reviews: "Reviews", certs: "Certifications", contact: "Contact" },
    quote: "Free Quote",
    hero: { headline: "Your certified specialist for Heat Pumps, Electricity, Photovoltaic, EV Charging & Maintenance", sub: "Free quotations • Fast intervention • Certified installer", brands: "We install the world's leading brands" },
    services: {
      title: "Our Services",
      sub: "Five areas of expertise for your comfort and energy savings",
      cta: "Request a Quote",
      customerSupply: "We can supply the equipment, or install equipment already purchased by the customer, upon request and subject to a technical compatibility and safety assessment.",
      items: [
        { title: "Heat Pumps", desc: "Air-to-air heat pumps (air conditioning) and air-to-water heat pumps (domestic hot water & heating). Authorised distributor for Daikin, Samsung and Fujitsu." },
        { title: "General Electricity", desc: "Residential and professional electrical works: new installations, RGIE/AREI compliance, panel upgrades, wiring, troubleshooting and repairs." },
        { title: "Photovoltaic Installations", desc: "Solar panels with or without home batteries: new systems, extensions and upgrades of existing installations." },
        { title: "EV Charging Stations", desc: "Installation and commissioning of electric vehicle charging stations for residential and commercial use." },
        { title: "Service, Maintenance & Repairs", desc: "Preventive maintenance, diagnostics, troubleshooting and repairs for heat pumps, electrical systems, photovoltaic installations, batteries and EV charging stations." },
      ],
    },
    why: {
      title: "Why Choose Us", sub: "Quality and trust at the heart of every intervention",
      items: [
        { title: "Free Quotations", desc: "Site visit and quote offered free of charge, no commitment required." },
        { title: "Certified Installer", desc: "Our installations comply with current Belgian standards (RGIE, F-gas)." },
        { title: "Fast Response", desc: "Quickly scheduled at your convenience." },
        { title: "Professional Workmanship", desc: "Impeccable finishing and durable installations, guaranteed." },
        { title: "Transparent Pricing", desc: "Detailed quote before any work. No surprises." },
        { title: "After-Sales Support", desc: "We remain available long after every installation." },
      ],
    },
    gallery: { title: "Our Projects", sub: "A showcase of our latest professional installations", all: "All", ac: "Air Conditioning", elec: "Electrical", bat: "Batteries" },
    reviews: { title: "Client Reviews", sub: "What our satisfied clients say", avg: "Average rating", count: "reviews", reply: "Owner reply:" },
    certs: {
      title: "Our Certifications", sub: "Guarantees of quality, safety and compliance",
      items: [
        { title: "RGIE / AREI", desc: "Compliant with the General Regulations on Electrical Installations. Mandatory certification for all electrical work in Belgium." },
        { title: "F-gas Certification", desc: "Authorised to handle refrigerants. Mandatory European certification for installation and maintenance of air conditioning systems." },
        { title: "Approved Installer", desc: "Recognised by Daikin, Samsung and Fujitsu as a trained and authorised installer for their systems." },
        { title: "Synergrid", desc: "Certification for connecting decentralised production installations to the Belgian electricity grid. Essential for PV systems." },
      ],
    },
    area: { title: "Service Area", sub: "We operate across Belgium", desc: "As a Belgium-based installer, we travel throughout Belgium for all your heat pump, electrical, photovoltaic, EV charging and maintenance projects. Free quotation and site visit." },
    contact: {
      title: "Contact Us", sub: "100% free quote and site visit — no commitment",
      free: "Free quotations and site visits offered.", freeSub: "We travel to you free of charge to assess your project.",
      name: "Full name", email: "Email address", phone: "Phone", service: "Desired service", message: "Your message",
      send: "Send request", wa: "Write on WhatsApp", selectSvc: "Select a service…",
      thanks: "Thank you! We will get back to you very soon.",
    },
    footer: { desc: "Your certified specialist for heat pumps, electricity, photovoltaic installations, EV charging stations and maintenance in Belgium.", links: "Quick Links", legal: "Legal", privacy: "Privacy Policy", terms: "Terms & Conditions", rights: "All rights reserved." },
    mobileBar: { quote: "Free Quote", wa: "WhatsApp" },
  },
} as const;

// ─── STATIC ICON ARRAYS ───────────────────────────────────────────────────────
// Order matches the 5 categories: Heat Pumps, Electricity, Photovoltaic, EV Charging, Maintenance
const SERVICE_ICONS = [Wind, Zap, Sun, Plug, Wrench];
const WHY_ICONS = [CheckCircle, Shield, Zap, Award, TrendingUp, Headphones];
const CERT_ICONS = [Shield, Sun, Award, CheckCircle];

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const PROVINCES = [
  "Bruxelles / Brussel", "Anvers / Antwerpen", "Gand / Gent", "Bruges / Brugge",
  "Liège / Luik", "Namur / Namen", "Charleroi", "Mons / Bergen",
  "Louvain / Leuven", "Hasselt", "Arlon", "Tournai / Doornik",
];

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({
  lang, setLang, site,
}: { lang: Lang; setLang: (l: Lang) => void; site: SiteData }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const tx = T[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: tx.nav.services, href: "#services" },
    { label: tx.nav.why, href: "#why" },
    { label: tx.nav.gallery, href: "#gallery" },
    { label: tx.nav.reviews, href: "#reviews" },
    { label: tx.nav.certs, href: "#certifications" },
    { label: tx.nav.contact, href: "#contact" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${scrolled ? "bg-[#0F3D66]" : "bg-white/20 backdrop-blur-sm"}`}>
              <Zap size={18} className="text-white" />
            </div>
            <span className={`font-bold text-sm tracking-tight transition-colors ${scrolled ? "text-[#0F3D66]" : "text-white"}`}>
              {site.companyName}
            </span>
          </a>

          <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={`text-sm font-medium transition-colors ${scrolled ? "text-gray-600 hover:text-[#0F3D66]" : "text-white/85 hover:text-white"}`}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20bf5a] transition-colors">
              <MessageCircle size={15} />
              <span className="hidden md:inline">WhatsApp</span>
            </a>
            <a href="#contact"
              className={`hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${scrolled ? "bg-[#0F3D66] text-white hover:bg-[#0c2f50]" : "bg-white text-[#0F3D66] hover:bg-white/90"}`}>
              {tx.quote}
            </a>
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                aria-label="Choisir la langue / Taal kiezen / Choose language"
                aria-expanded={langOpen}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${scrolled ? "text-gray-600 hover:text-[#0F3D66] hover:bg-gray-50" : "text-white/85 hover:text-white hover:bg-white/10"}`}>
                <Globe size={15} />
                <span className="uppercase font-semibold">{lang}</span>
                <ChevronDown size={12} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[140px]">
                  {LANGS.map((l) => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                      aria-pressed={lang === l.code}
                      aria-label={l.label}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${lang === l.code ? "text-[#0F3D66] font-bold bg-blue-50" : "text-gray-700"}`}>
                      <span>{l.flag}</span><span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              className={`lg:hidden p-2 rounded-xl transition-colors ${scrolled ? "text-gray-700 hover:bg-gray-50" : "text-white hover:bg-white/10"}`}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:text-[#0F3D66] transition-colors">
                {link.label}
              </a>
            ))}
            <div className="flex gap-2 pt-3 border-t border-gray-100 mt-2">
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm">
                <MessageCircle size={16} />WhatsApp
              </a>
              <a href="#contact" onClick={() => setMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0F3D66] text-white font-bold text-sm">
                {tx.quote}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection({ lang, site }: { lang: Lang; site: SiteData }) {
  const tx = T[lang];
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0F3D66]">
      {/* LCP element: real <img> so browser can preload and prioritise it */}
      <img
        src={site.heroImage}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="sync"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F3D66]/85 via-[#0F3D66]/65 to-[#0F3D66]/88" />
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center pt-28 pb-12">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-white/90 text-sm font-medium">Belgique • Devis gratuit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.15] mb-6 max-w-4xl mx-auto">
          {tx.hero.headline}
        </h1>
        <p className="text-white/75 text-lg sm:text-xl mb-10 font-medium">{tx.hero.sub}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <a href="#contact"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-[#16A34A] hover:bg-[#15803d] text-white font-bold rounded-2xl text-base transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5">
            {tx.quote}<ArrowRight size={18} />
          </a>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-[#25D366] hover:bg-[#20bf5a] text-white font-bold rounded-2xl text-base transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5">
            <MessageCircle size={18} />WhatsApp
          </a>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 mb-3">
          <p className="text-white/50 text-[10px] uppercase tracking-[0.15em] font-semibold mb-4">Certifications & Qualifications</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {site.heroCerts.map((cert) => (
              <div key={cert} className="flex items-center gap-2 bg-white/15 hover:bg-white/20 transition-colors rounded-xl px-4 py-2.5">
                <Shield size={14} className="text-[#4ADE80]" />
                <span className="text-white text-sm font-semibold">{cert}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl px-6 py-4">
          <p className="text-white/60 text-xs font-semibold mb-3 uppercase tracking-widest">{tx.hero.brands}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            {site.brands.map((brand) => (
              <span key={brand} className="text-white/45 text-sm font-bold tracking-wider hover:text-white/75 transition-colors">{brand}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
type ServiceDisplayItem = {
  title: string;
  desc: string;
  brands: string[];
  showCustomerSupplyNote: boolean;
  imgSrc: string;
};

function ServicesSection({ lang, site, dbServices }: { lang: Lang; site: SiteData; dbServices?: DbService[] }) {
  const tx = T[lang];

  const items: ServiceDisplayItem[] = dbServices && dbServices.length > 0
    ? dbServices.map((s, i) => ({
        title: s[`title_${lang}`] || s.title_fr,
        desc: s[`description_${lang}`] || s.description_fr,
        brands: s.brands ?? [],
        showCustomerSupplyNote: s.show_customer_supply_note ?? false,
        imgSrc: s.image_url || site.serviceImages[i] || "",
      }))
    : tx.services.items.map((s, i) => ({
        title: s.title,
        desc: s.desc,
        brands: [],
        showCustomerSupplyNote: false,
        imgSrc: site.serviceImages[i] || "",
      }));

  return (
    <section id="services" aria-labelledby="services-heading" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-[#16A34A] font-bold text-xs uppercase tracking-[0.15em] mb-3">Services</span>
          <h2 id="services-heading" className="text-3xl sm:text-4xl font-bold text-[#0F3D66] mb-4">{tx.services.title}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{tx.services.sub}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = SERVICE_ICONS[i] || Zap;
            return (
              <div key={i} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#0F3D66]/15 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="h-48 bg-[#EEF2F7] overflow-hidden flex-shrink-0">
                  {item.imgSrc
                    ? <img src={item.imgSrc} alt={`${item.title} — Oncioiu Lucian-Ionut`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center"><Icon size={48} className="text-[#0F3D66]/20" /></div>
                  }
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="w-11 h-11 rounded-xl bg-[#EEF2F7] flex items-center justify-center mb-4">
                    <Icon size={21} className="text-[#0F3D66]" />
                  </div>
                  <h3 className="font-bold text-[#0F3D66] text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.desc}</p>
                  {item.brands.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4" aria-label="Marques">
                      {item.brands.map((brand) => (
                        <span key={brand} className="inline-block px-2.5 py-0.5 rounded-full bg-[#EEF2F7] text-[#0F3D66] text-xs font-semibold border border-[#0F3D66]/10">
                          {brand}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.showCustomerSupplyNote && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 leading-snug">
                      {tx.services.customerSupply}
                    </p>
                  )}
                  <a href="#contact" className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-[#16A34A] hover:text-[#15803d] transition-all group-hover:gap-2.5">
                    {tx.services.cta}<ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── WHY ──────────────────────────────────────────────────────────────────────
function WhySection({ lang }: { lang: Lang }) {
  const tx = T[lang];
  return (
    <section id="why" aria-labelledby="why-heading" className="py-20 lg:py-28 bg-[#F4F6F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-[#16A34A] font-bold text-xs uppercase tracking-[0.15em] mb-3">Avantages</span>
          <h2 id="why-heading" className="text-3xl sm:text-4xl font-bold text-[#0F3D66] mb-4">{tx.why.title}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{tx.why.sub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tx.why.items.map((item, i) => {
            const Icon = WHY_ICONS[i] || CheckCircle;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-[#0F3D66]/15 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-[#0F3D66] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-[#0F3D66] text-base mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────
function GallerySection({ lang, site }: { lang: Lang; site: SiteData }) {
  const tx = T[lang];
  const [filter, setFilter] = useState<GalleryFilter>("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = filter === "all" ? site.galleryItems : site.galleryItems.filter((g) => g.cat === filter);
  const filterOpts: { key: GalleryFilter; label: string }[] = [
    { key: "all", label: tx.gallery.all },
    { key: "ac", label: tx.gallery.ac },
    { key: "electrical", label: tx.gallery.elec },
    { key: "batteries", label: tx.gallery.bat },
  ];

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block text-[#16A34A] font-bold text-xs uppercase tracking-[0.15em] mb-3">Portfolio</span>
          <h2 id="gallery-heading" className="text-3xl sm:text-4xl font-bold text-[#0F3D66] mb-4">{tx.gallery.title}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{tx.gallery.sub}</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {filterOpts.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${filter === f.key ? "bg-[#0F3D66] text-white shadow-md shadow-[#0F3D66]/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="break-inside-avoid mb-4 group cursor-pointer overflow-hidden rounded-2xl bg-gray-100 relative" onClick={() => setLightbox(item.img)}>
              <img src={item.img} alt={item.alt} loading="lazy" decoding="async" className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-[#0F3D66]/0 group-hover:bg-[#0F3D66]/50 transition-all duration-300 flex items-center justify-center">
                <Maximize2 size={30} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {lightbox && (
        <div role="dialog" aria-modal="true" aria-label="Image en plein écran" className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button aria-label="Fermer" className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors" onClick={() => setLightbox(null)}>
            <X size={22} aria-hidden="true" />
          </button>
          <img src={lightbox} alt="Réalisation Oncioiu Lucian-Ionut" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
function ReviewsSection({ lang, site }: { lang: Lang; site: SiteData }) {
  const tx = T[lang];
  const avgRating = site.reviews.length ? (site.reviews.reduce((s, r) => s + r.rating, 0) / site.reviews.length).toFixed(1) : "5.0";
  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="py-20 lg:py-28 bg-[#F4F6F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-[#16A34A] font-bold text-xs uppercase tracking-[0.15em] mb-3">Google Reviews</span>
          <h2 id="reviews-heading" className="text-3xl sm:text-4xl font-bold text-[#0F3D66] mb-4">{tx.reviews.title}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{tx.reviews.sub}</p>
          <div className="inline-flex items-center gap-4 mt-7 bg-white rounded-2xl px-8 py-5 shadow-sm border border-gray-100">
            <span className="text-5xl font-bold text-[#0F3D66]">{avgRating}</span>
            <div className="text-left">
              <div className="flex gap-1 mb-1.5">{[1,2,3,4,5].map((s) => <Star key={s} size={20} className="text-yellow-400 fill-yellow-400" />)}</div>
              <p className="text-gray-500 text-sm">{tx.reviews.avg} • {site.reviews.length} {tx.reviews.count}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {site.reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: r.bg }}>
                  {r.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900">{r.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex gap-0.5">{[1,2,3,4,5].map((s) => <Star key={s} size={13} className="text-yellow-400 fill-yellow-400" />)}</div>
                    <span className="text-gray-400 text-xs">{r.date}</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-[#4285F4] text-sm flex-shrink-0">G</div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">&ldquo;{r.text}&rdquo;</p>
              <div className="bg-[#F4F6F9] rounded-xl p-4">
                <p className="text-xs font-bold text-[#0F3D66] mb-1.5">{tx.reviews.reply}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{r.reply}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CERTIFICATIONS ───────────────────────────────────────────────────────────
function CertificationsSection({ lang }: { lang: Lang }) {
  const tx = T[lang];
  return (
    <section id="certifications" aria-labelledby="certs-heading" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-[#16A34A] font-bold text-xs uppercase tracking-[0.15em] mb-3">Qualifications</span>
          <h2 id="certs-heading" className="text-3xl sm:text-4xl font-bold text-[#0F3D66] mb-4">{tx.certs.title}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{tx.certs.sub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tx.certs.items.map((cert, i) => {
            const Icon = CERT_ICONS[i] || Shield;
            return (
              <div key={i} className="flex flex-col items-center text-center p-7 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-[#0F3D66]/15 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-[#0F3D66] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200">
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-[#0F3D66] text-base mb-3">{cert.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{cert.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICE AREA ─────────────────────────────────────────────────────────────
function ServiceAreaSection({ lang }: { lang: Lang }) {
  const tx = T[lang];
  return (
    <section id="area" aria-labelledby="area-heading" className="py-20 lg:py-28 bg-[#F4F6F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-[#16A34A] font-bold text-xs uppercase tracking-[0.15em] mb-3">Belgique</span>
          <h2 id="area-heading" className="text-3xl sm:text-4xl font-bold text-[#0F3D66] mb-4">{tx.area.title}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{tx.area.sub}</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <defs>
                <linearGradient id="belGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8F0F8" />
                  <stop offset="100%" stopColor="#C8D8EE" />
                </linearGradient>
              </defs>
              <path d="M 65,60 L 135,48 L 200,42 L 265,40 L 330,48 L 390,68 L 422,105 L 438,148 L 438,178 L 418,212 L 398,238 L 368,268 L 320,295 L 272,310 L 225,313 L 178,307 L 135,292 L 100,265 L 72,228 L 60,188 L 60,148 L 68,108 Z"
                fill="url(#belGrad)" stroke="#0F3D66" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M 100,185 L 205,182 L 250,178 L 310,180 L 370,185 L 400,190" stroke="#0F3D66" strokeWidth="1.2" strokeDasharray="8,5" fill="none" opacity="0.35" />
              {[
                { x: 248, y: 178, label: "Bruxelles", r: 7 },
                { x: 280, y: 115, label: "Anvers", r: 6 },
                { x: 158, y: 136, label: "Gand", r: 6 },
                { x: 108, y: 118, label: "Bruges", r: 5 },
                { x: 362, y: 170, label: "Liège", r: 6 },
                { x: 282, y: 238, label: "Namur", r: 5 },
                { x: 210, y: 248, label: "Charleroi", r: 5 },
                { x: 155, y: 265, label: "Mons", r: 4 },
              ].map((city) => (
                <g key={city.label}>
                  <circle cx={city.x} cy={city.y} r={city.r} fill="#0F3D66" opacity={0.9} />
                  <text x={city.x + city.r + 5} y={city.y + 4} style={{ fontSize: 11, fill: "#0F3D66", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>{city.label}</text>
                </g>
              ))}
              <text x="250" y="350" textAnchor="middle" style={{ fontSize: 13, fill: "#16A34A", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>✓ Couverture nationale — Belgique entière</text>
            </svg>
          </div>
          <div>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">{tx.area.desc}</p>
            <div className="grid grid-cols-2 gap-2.5">
              {PROVINCES.map((p) => (
                <div key={p} className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-gray-100 hover:border-[#0F3D66]/20 transition-colors">
                  <CheckCircle size={15} className="text-[#16A34A] flex-shrink-0" />
                  <span className="text-gray-700 text-sm font-medium truncate">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = "service_byldn2h";
const EMAILJS_TEMPLATE_ID = "template_rxz6iih";
const EMAILJS_PUBLIC_KEY = "FdIJ6yDRTvlxvHIOY";

function ContactSection({ lang, site, dbServices }: { lang: Lang; site: SiteData; dbServices?: DbService[] }) {
  const tx = T[lang];
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const serviceNames = dbServices && dbServices.length > 0
    ? dbServices.map((s) => s[`title_${lang}`] || s.title_fr)
    : T[lang].services.items.map((s) => s.title);
  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:border-[#0F3D66] focus:ring-2 focus:ring-[#0F3D66]/10 transition-all placeholder:text-gray-400";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("sending");
    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, { publicKey: EMAILJS_PUBLIC_KEY });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-[#16A34A] font-bold text-xs uppercase tracking-[0.15em] mb-3">Contact</span>
          <h2 id="contact-heading" className="text-3xl sm:text-4xl font-bold text-[#0F3D66] mb-4">{tx.contact.title}</h2>
          <p className="text-gray-500 text-lg">{tx.contact.sub}</p>
        </div>
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#16A34A] flex items-center justify-center mb-5">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#0F3D66] mb-2">{tx.contact.thanks}</h3>
                <button onClick={() => setStatus("idle")} className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline">← Retour</button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-name" className="text-sm font-semibold text-gray-700">{tx.contact.name}</label>
                    <input id="contact-name" name="name" type="text" required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jean Dupont" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="text-sm font-semibold text-gray-700">{tx.contact.email}</label>
                    <input id="contact-email" name="email" type="email" required className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jean@exemple.be" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-phone" className="text-sm font-semibold text-gray-700">{tx.contact.phone}</label>
                    <input id="contact-phone" name="phone" type="tel" className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+32 470 000 000" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-service" className="text-sm font-semibold text-gray-700">{tx.contact.service}</label>
                    <select id="contact-service" name="service" className={inputCls} value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                      <option value="">{tx.contact.selectSvc}</option>
                      {serviceNames.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-sm font-semibold text-gray-700">{tx.contact.message}</label>
                  <textarea id="contact-message" name="message" rows={5} required className={inputCls + " resize-none"} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Décrivez votre projet…" />
                </div>
                {status === "error" && (
                  <p className="text-red-500 text-sm">Une erreur est survenue. Veuillez réessayer ou nous contacter par WhatsApp.</p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button type="submit" disabled={status === "sending"} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0F3D66] hover:bg-[#0c2f50] disabled:opacity-60 text-white font-bold rounded-xl transition-colors">
                    {status === "sending" ? "Envoi en cours…" : <>{tx.contact.send}<ArrowRight size={16} /></>}
                  </button>
                  <a href={site.whatsapp} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#20bf5a] text-white font-bold rounded-xl transition-colors">
                    <MessageCircle size={16} />{tx.contact.wa}
                  </a>
                </div>
              </form>
            )}
          </div>
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-[#0F3D66] rounded-2xl p-6 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                <Award size={20} className="text-white" />
              </div>
              <h3 className="font-bold text-lg mb-1">{tx.contact.free}</h3>
              <p className="text-white/65 text-sm leading-relaxed">{tx.contact.freeSub}</p>
            </div>
            {[
              { Icon: Phone, label: site.phone, sub: "Lun–Sam", href: `tel:${site.phone.replace(/\s/g, "")}` },
              { Icon: Mail, label: site.email, sub: "Réponse sous 24h", href: `mailto:${site.email}` },
              { Icon: MapPin, label: site.address, sub: "Couverture nationale", href: site.social.googleMaps || "#area" },
              { Icon: Clock, label: site.hours, sub: "", href: null },
            ].map((info, i) => {
              const El = info.href ? "a" : "div";
              const props = info.href
                ? { href: info.href, ...(info.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {}) }
                : {};
              return (
                <El key={i} {...props as any} className="flex items-start gap-4 bg-[#F4F6F9] hover:bg-[#EEF2F7] rounded-2xl p-4 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#0F3D66] flex items-center justify-center flex-shrink-0">
                    <info.Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F3D66] text-sm leading-snug whitespace-pre-line">{info.label}</p>
                    {info.sub && <p className="text-gray-500 text-xs mt-0.5">{info.sub}</p>}
                  </div>
                </El>
              );
            })}
            {(site.social.googleBusiness || site.social.googleReview) && (
              <div className="flex flex-col gap-2 pt-1">
                {site.social.googleBusiness && (
                  <a href={site.social.googleBusiness} target="_blank" rel="noopener noreferrer"
                    aria-label="Voir notre fiche Google Business"
                    className="flex items-center gap-3 bg-white border border-gray-200 hover:border-[#4285F4] hover:bg-blue-50 rounded-2xl p-4 transition-colors group">
                    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true" className="flex-shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <div>
                      <p className="font-semibold text-[#0F3D66] text-sm group-hover:text-[#4285F4] transition-colors">Voir sur Google</p>
                      <p className="text-gray-500 text-xs mt-0.5">Notre fiche Business</p>
                    </div>
                  </a>
                )}
                {site.social.googleReview && (
                  <a href={site.social.googleReview} target="_blank" rel="noopener noreferrer"
                    aria-label="Laisser un avis Google"
                    className="flex items-center justify-center gap-2 bg-[#FBBC05] hover:bg-[#f5b301] text-[#0F3D66] font-bold rounded-2xl p-3.5 text-sm transition-colors">
                    <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    Laisser un avis Google
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL ICONS ─────────────────────────────────────────────────────────────
const SOCIAL_DEFS: { key: keyof SocialLinks; label: string; path: string }[] = [
  { key: "facebook",  label: "Facebook",    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { key: "instagram", label: "Instagram",   path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  { key: "twitter",   label: "X / Twitter", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { key: "linkedin",  label: "LinkedIn",    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  { key: "tiktok",    label: "TikTok",      path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
  { key: "youtube",   label: "YouTube",     path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
];

function SocialIconsRow({ social, className = "" }: { social: SocialLinks; className?: string }) {
  const active = SOCIAL_DEFS.filter(({ key }) => !!social[key]);
  if (active.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {active.map(({ key, label, path }) => (
        <a key={key} href={social[key]} target="_blank" rel="noopener noreferrer"
          aria-label={`Visitez notre page ${label}`}
          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" className="text-white/75" aria-hidden="true">
            <path d={path} />
          </svg>
        </a>
      ))}
      {social.googleBusiness && (
        <a href={social.googleBusiness} target="_blank" rel="noopener noreferrer"
          aria-label="Voir notre fiche Google Business"
          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </a>
      )}
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function FooterSection({
  lang, setLang, site,
}: { lang: Lang; setLang: (l: Lang) => void; site: SiteData }) {
  const tx = T[lang];
  const navLinks = [
    { label: tx.nav.services, href: "#services" },
    { label: tx.nav.why, href: "#why" },
    { label: tx.nav.gallery, href: "#gallery" },
    { label: tx.nav.reviews, href: "#reviews" },
    { label: tx.nav.certs, href: "#certifications" },
    { label: tx.nav.contact, href: "#contact" },
  ];

  return (
    <footer className="bg-[#0F3D66] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center"><Zap size={18} className="text-white" /></div>
              <span className="font-bold text-xl">{site.companyName}</span>
            </div>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs mb-6">{tx.footer.desc}</p>
            <SocialIconsRow social={site.social} />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.15em] mb-5 text-white/45">{tx.footer.links}</h4>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}><a href={link.href} className="text-white/65 hover:text-white text-sm transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.15em] mb-5 text-white/45">{tx.footer.legal}</h4>
            <ul className="flex flex-col gap-2.5 mb-7">
              <li><a href="#" className="text-white/65 hover:text-white text-sm transition-colors">{tx.footer.privacy}</a></li>
              <li><a href="#" className="text-white/65 hover:text-white text-sm transition-colors">{tx.footer.terms}</a></li>
            </ul>
            <h4 className="font-bold text-xs uppercase tracking-[0.15em] mb-3 text-white/45">Langue / Taal</h4>
            <div className="flex gap-2">
              {LANGS.map((l) => (
                <button key={l.code} onClick={() => setLang(l.code)}
                  aria-pressed={lang === l.code}
                  aria-label={l.label}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${lang === l.code ? "bg-white text-[#0F3D66]" : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"}`}>
                  {l.code}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/35 text-xs">© {new Date().getFullYear()} {site.companyName}. {tx.footer.rights}</p>
          <div className="flex items-center gap-4">
            <p className="text-white/25 text-xs">Belgique — RGIE · F-gaz · Synergrid</p>
            <a href="#/admin" className="text-white/15 hover:text-white/35 text-xs transition-colors">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── MOBILE ACTION BAR ────────────────────────────────────────────────────────
function MobileActionBar({ lang, site }: { lang: Lang; site: SiteData }) {
  const tx = T[lang];
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.07)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-14">
        <a
          href="#contact"
          aria-label={tx.mobileBar.quote}
          className="flex-1 flex items-center justify-center gap-2 bg-[#0F3D66] text-white text-sm font-bold hover:bg-[#0c2f50] active:bg-[#0b2d4e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
        >
          <MessageCircle size={17} aria-hidden="true" />
          {tx.mobileBar.quote}
        </a>
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={tx.mobileBar.wa}
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white text-sm font-bold hover:bg-[#20bf5a] active:bg-[#1aaa4f] transition-colors border-l border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {tx.mobileBar.wa}
        </a>
      </div>
    </div>
  );
}

// ─── WEBSITE PAGE ─────────────────────────────────────────────────────────────
function WebsitePage() {
  // Initialise synchronously from localStorage or browser language —
  // no flash of wrong language on first render.
  const [lang, setLangRaw] = useState<Lang>(detectLangSync);
  const [siteData, setSiteData] = useState<SiteData>(DEFAULT_DATA);
  const [dbServices, setDbServices] = useState<DbService[]>([]);

  // Persist manual picks and propagate to state.
  const setLang = (l: Lang) => { saveManualLang(l); setLangRaw(l); };

  // Fire IP-based detection once after first render. Uses startTransition so
  // React never throws the "suspended during synchronous input" error.
  useEffect(() => {
    detectLangAsync((detected) => {
      startTransition(() => setLangRaw(detected));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;
    fetchSiteData(lang).then((partial) => {
      if (cancelled) return;
      if (partial.supabaseServices) setDbServices(partial.supabaseServices);
      const { supabaseServices: _, ...rest } = partial as any;
      setSiteData((prev) => ({ ...prev, ...rest }));
    });
    return () => { cancelled = true; };
  }, [lang]);

  return (
    <div className="antialiased">
      <Seo lang={lang} heroImageUrl={siteData.heroImage} />
      <Header lang={lang} setLang={setLang} site={siteData} />
      <main className="pb-14 lg:pb-0">
        <HeroSection lang={lang} site={siteData} />
        <ServicesSection lang={lang} site={siteData} dbServices={dbServices} />
        <WhySection lang={lang} />
        <GallerySection lang={lang} site={siteData} />
        <ReviewsSection lang={lang} site={siteData} />
        <CertificationsSection lang={lang} />
        <ServiceAreaSection lang={lang} />
        <ContactSection lang={lang} site={siteData} dbServices={dbServices} />
      </main>
      <FooterSection lang={lang} setLang={setLang} site={siteData} />
      <MobileActionBar lang={lang} site={siteData} />
    </div>
  );
}

// ─── ERROR BOUNDARY ───────────────────────────────────────────────────────────
class AppErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean; msg: string }> {
  state = { crashed: false, msg: "" };
  static getDerivedStateFromError(e: Error) { return { crashed: true, msg: e.message ?? String(e) }; }
  render() {
    if (this.state.crashed) return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 p-8 text-center">
        <p className="font-bold text-gray-700">Une erreur est survenue</p>
        <p className="text-sm text-gray-400 font-mono max-w-md break-all">{this.state.msg}</p>
        <button onClick={() => { this.setState({ crashed: false, msg: "" }); }} className="px-4 py-2 bg-[#0F3D66] text-white rounded-lg text-sm font-semibold">Réessayer</button>
      </div>
    );
    return this.props.children;
  }
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handler = () => {
      startTransition(() => setHash(window.location.hash));
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const isAdmin = hash === "#/admin" || hash.startsWith("#/admin/");

  return (
    <AppErrorBoundary>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 text-sm">Chargement…</div>}>
        {isAdmin ? <AdminApp /> : <WebsitePage />}
      </Suspense>
    </AppErrorBoundary>
  );
}
