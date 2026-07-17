import { ArrowLeft, Mail, Phone } from "lucide-react";
import { detectLangSync } from "./lib/detectLang";

type Lang = "fr" | "nl" | "en";
type LegalKind = "legal" | "privacy" | "terms";

type Section = { title: string; paragraphs: string[] };

type LegalCopy = {
  pageTitle: Record<LegalKind, string>;
  back: string;
  updated: string;
  sections: Record<LegalKind, Section[]>;
};

const BUSINESS = {
  name: "Lucian-Ionuț Oncioiu",
  enterprise: "BE 1022.079.003",
  address: "Kardinaal Mercierstraat 52, 1000 Bruxelles, Belgique",
  email: "lucianoncioiuoli@gmail.com",
  phone: "+32 465 14 08 37",
};

const COPY: Record<Lang, LegalCopy> = {
  fr: {
    pageTitle: {
      legal: "Mentions légales",
      privacy: "Politique de confidentialité",
      terms: "Conditions générales d’utilisation",
    },
    back: "Retour au site",
    updated: "Dernière mise à jour : 18 juillet 2026",
    sections: {
      legal: [
        {
          title: "Éditeur du site",
          paragraphs: [
            `${BUSINESS.name}, entrepreneur personne physique, inscrit à la Banque-Carrefour des Entreprises sous le numéro ${BUSINESS.enterprise}.`,
            `Adresse officielle : ${BUSINESS.address}.`,
            `E-mail : ${BUSINESS.email} — Téléphone : ${BUSINESS.phone}.`,
            "OLI-NRG est le nom utilisé sur ce site pour présenter les activités. Il n'est pas présenté comme une dénomination commerciale enregistrée.",
          ],
        },
        {
          title: "Objet du site",
          paragraphs: [
            "Ce site présente des services d'installation, d'entretien et de dépannage dans les domaines des pompes à chaleur, de l'électricité générale, des installations photovoltaïques, des batteries et des bornes de recharge.",
            "Le site est informatif. Il ne permet ni paiement en ligne, ni création de compte client, ni conclusion automatique d'un contrat.",
          ],
        },
        {
          title: "Demandes de devis",
          paragraphs: [
            "L'envoi d'un formulaire ou d'un message constitue uniquement une demande d'information ou de devis. Il ne vaut ni commande, ni acceptation d'une offre, ni engagement contractuel.",
            "Un contrat éventuel ne prend naissance qu'après accord explicite des parties sur une offre, un devis ou un bon de commande distinct.",
          ],
        },
        {
          title: "Propriété intellectuelle",
          paragraphs: [
            "Les textes, éléments graphiques, photographies et autres contenus du site ne peuvent pas être reproduits ou réutilisés sans autorisation, sauf lorsque le contenu appartient clairement à un tiers ou lorsque la loi l'autorise.",
          ],
        },
        {
          title: "Responsabilité",
          paragraphs: [
            "Les informations sont fournies de bonne foi et peuvent évoluer. Elles ne remplacent pas une visite technique, un devis ou un conseil adapté à l'installation du client.",
            "L'éditeur ne garantit pas l'absence permanente d'interruptions, d'erreurs techniques ou de liens externes indisponibles.",
          ],
        },
      ],
      privacy: [
        {
          title: "Responsable du traitement",
          paragraphs: [
            `${BUSINESS.name}, ${BUSINESS.enterprise}, ${BUSINESS.address}.`,
            `Contact pour toute question relative aux données personnelles : ${BUSINESS.email} ou ${BUSINESS.phone}.`,
          ],
        },
        {
          title: "Données collectées",
          paragraphs: [
            "Lorsque vous utilisez le formulaire, nous pouvons traiter votre nom, votre adresse e-mail, votre numéro de téléphone, le service demandé et le contenu de votre message.",
            "Le site ne crée pas de compte client et ne collecte pas de données de paiement.",
          ],
        },
        {
          title: "Finalités et base juridique",
          paragraphs: [
            "Les données sont utilisées pour répondre à votre demande, préparer ou suivre un devis, organiser une visite et assurer les échanges précontractuels demandés par vous.",
            "Le traitement repose sur les mesures précontractuelles prises à votre demande et, lorsque nécessaire, sur l'intérêt légitime à gérer les demandes reçues et à assurer le suivi administratif.",
          ],
        },
        {
          title: "Transmission et prestataires",
          paragraphs: [
            "Le formulaire utilise EmailJS pour transmettre le message. Les données peuvent donc être traitées techniquement par EmailJS dans le cadre de la fourniture de ce service.",
            "Les données ne sont pas vendues. Elles ne sont communiquées à d'autres destinataires que lorsque cela est nécessaire à la demande, imposé par la loi ou autorisé par vous.",
          ],
        },
        {
          title: "Durée de conservation",
          paragraphs: [
            "Les demandes et échanges associés sont conservés pendant un maximum de 24 mois, sauf lorsqu'une durée plus longue est nécessaire pour respecter une obligation légale, établir une preuve ou gérer un contrat effectivement conclu.",
          ],
        },
        {
          title: "Cookies et mesure d'audience",
          paragraphs: [
            "À la date de la présente politique, le site n'utilise pas Google Analytics ni Meta Pixel.",
            "Des éléments strictement nécessaires au fonctionnement du site peuvent être utilisés, par exemple pour mémoriser la langue choisie. Ils ne sont pas utilisés à des fins de publicité comportementale.",
          ],
        },
        {
          title: "Vos droits",
          paragraphs: [
            `Vous pouvez demander l'accès, la rectification ou l'effacement de vos données, ainsi que la limitation ou l'opposition au traitement lorsque les conditions légales sont réunies. Envoyez votre demande à ${BUSINESS.email}.`,
            "Vous pouvez également introduire une plainte auprès de l'Autorité de protection des données belge.",
          ],
        },
      ],
      terms: [
        {
          title: "Champ d'application",
          paragraphs: [
            "Les présentes conditions régissent uniquement l'utilisation de ce site et les demandes d'information ou de devis envoyées par son intermédiaire.",
            "Les conditions applicables à une intervention, une vente ou une installation seront précisées dans le devis, l'offre, le bon de commande ou le contrat concerné.",
          ],
        },
        {
          title: "Absence de contrat en ligne",
          paragraphs: [
            "L'utilisation du formulaire, un appel ou un message WhatsApp ne constitue pas une commande ferme. Aucun contrat n'est conclu automatiquement par le site.",
            "Les prix, délais, marques, disponibilités et caractéristiques techniques ne deviennent contraignants qu'après confirmation écrite dans un document commercial accepté par les parties.",
          ],
        },
        {
          title: "Devis et visites",
          paragraphs: [
            "Les demandes sont évaluées en fonction des informations disponibles. Une visite technique peut être nécessaire avant l'établissement ou la confirmation du devis.",
            "Sauf mention contraire communiquée au client, la demande initiale de devis ne crée aucune obligation d'accepter ou d'exécuter les travaux.",
          ],
        },
        {
          title: "Matériel fourni par le client",
          paragraphs: [
            "L'installation d'un équipement acheté ou fourni par le client peut être acceptée sur demande, après contrôle de compatibilité, de conformité, de sécurité, de documentation et d'état du matériel.",
            "L'installateur peut refuser un équipement inadapté, incomplet, endommagé, non conforme ou dont l'installation ne peut pas être réalisée dans des conditions professionnelles et sûres. Les garanties sur le matériel fourni par le client restent en principe à charge du vendeur ou du fabricant, sauf accord écrit différent.",
          ],
        },
        {
          title: "Contenus et disponibilité",
          paragraphs: [
            "Les informations du site peuvent être adaptées sans préavis. Les photographies, marques et exemples ont une valeur illustrative et ne constituent pas une offre ferme.",
            "L'accès au site peut être interrompu pour maintenance, mise à jour ou raison technique.",
          ],
        },
        {
          title: "Droit applicable",
          paragraphs: [
            "L'utilisation du site est soumise au droit belge. Les règles impératives de protection du consommateur restent pleinement applicables.",
          ],
        },
      ],
    },
  },
  nl: {
    pageTitle: {
      legal: "Juridische informatie",
      privacy: "Privacybeleid",
      terms: "Algemene gebruiksvoorwaarden",
    },
    back: "Terug naar de website",
    updated: "Laatst bijgewerkt: 18 juli 2026",
    sections: {
      legal: [
        {
          title: "Uitgever van de website",
          paragraphs: [
            `${BUSINESS.name}, natuurlijke persoon / eenmanszaak, ingeschreven in de Kruispuntbank van Ondernemingen onder nummer ${BUSINESS.enterprise}.`,
            `Officieel adres: ${BUSINESS.address}.`,
            `E-mail: ${BUSINESS.email} — Telefoon: ${BUSINESS.phone}.`,
            "OLI-NRG is de naam die op deze website wordt gebruikt om de activiteiten voor te stellen. De naam wordt niet voorgesteld als een geregistreerde handelsnaam.",
          ],
        },
        {
          title: "Doel van de website",
          paragraphs: [
            "Deze website stelt installatie-, onderhouds- en herstellingsdiensten voor warmtepompen, algemene elektriciteit, fotovoltaïsche installaties, batterijen en laadstations voor.",
            "De website is informatief. Er zijn geen online betalingen, klantenaccounts of automatisch gesloten overeenkomsten.",
          ],
        },
        {
          title: "Offerteaanvragen",
          paragraphs: [
            "Het verzenden van een formulier of bericht is uitsluitend een aanvraag om informatie of een offerte. Het geldt niet als bestelling, aanvaarding van een aanbod of contractuele verbintenis.",
            "Een eventuele overeenkomst ontstaat pas nadat beide partijen uitdrukkelijk akkoord zijn gegaan met een afzonderlijke offerte, aanbieding of bestelbon.",
          ],
        },
        {
          title: "Intellectuele eigendom",
          paragraphs: [
            "Teksten, grafische elementen, foto's en andere website-inhoud mogen niet zonder toestemming worden gereproduceerd of hergebruikt, behalve wanneer de inhoud duidelijk aan een derde toebehoort of de wet dit toestaat.",
          ],
        },
        {
          title: "Aansprakelijkheid",
          paragraphs: [
            "De informatie wordt te goeder trouw verstrekt en kan wijzigen. Zij vervangt geen technisch bezoek, offerte of advies dat op de installatie van de klant is afgestemd.",
            "De uitgever garandeert niet dat de website permanent vrij is van onderbrekingen, technische fouten of onbeschikbare externe links.",
          ],
        },
      ],
      privacy: [
        {
          title: "Verwerkingsverantwoordelijke",
          paragraphs: [
            `${BUSINESS.name}, ${BUSINESS.enterprise}, ${BUSINESS.address}.`,
            `Contact voor vragen over persoonsgegevens: ${BUSINESS.email} of ${BUSINESS.phone}.`,
          ],
        },
        {
          title: "Verzamelde gegevens",
          paragraphs: [
            "Wanneer u het formulier gebruikt, kunnen wij uw naam, e-mailadres, telefoonnummer, de gevraagde dienst en de inhoud van uw bericht verwerken.",
            "De website maakt geen klantenaccounts aan en verzamelt geen betaalgegevens.",
          ],
        },
        {
          title: "Doeleinden en rechtsgrond",
          paragraphs: [
            "De gegevens worden gebruikt om uw aanvraag te beantwoorden, een offerte op te stellen of op te volgen, een bezoek te organiseren en de door u gevraagde precontractuele communicatie te voeren.",
            "De verwerking is gebaseerd op precontractuele maatregelen die op uw verzoek worden genomen en, waar nodig, op het gerechtvaardigde belang om ontvangen aanvragen en de administratieve opvolging te beheren.",
          ],
        },
        {
          title: "Doorgifte en dienstverleners",
          paragraphs: [
            "Het formulier gebruikt EmailJS om het bericht te verzenden. De gegevens kunnen daarom technisch door EmailJS worden verwerkt voor de levering van deze dienst.",
            "De gegevens worden niet verkocht. Ze worden alleen met andere ontvangers gedeeld wanneer dit noodzakelijk is voor uw aanvraag, wettelijk verplicht is of door u is toegestaan.",
          ],
        },
        {
          title: "Bewaartermijn",
          paragraphs: [
            "Aanvragen en bijbehorende communicatie worden maximaal 24 maanden bewaard, tenzij een langere periode nodig is om een wettelijke verplichting na te leven, bewijs te bewaren of een werkelijk gesloten overeenkomst te beheren.",
          ],
        },
        {
          title: "Cookies en bezoekersmeting",
          paragraphs: [
            "Op de datum van dit beleid gebruikt de website geen Google Analytics en geen Meta Pixel.",
            "Strikt noodzakelijke elementen kunnen worden gebruikt voor de werking van de website, bijvoorbeeld om de gekozen taal te onthouden. Ze worden niet gebruikt voor gedragsgerichte reclame.",
          ],
        },
        {
          title: "Uw rechten",
          paragraphs: [
            `U kunt verzoeken om inzage, verbetering of verwijdering van uw gegevens en, wanneer de wettelijke voorwaarden vervuld zijn, om beperking van of bezwaar tegen de verwerking. Stuur uw aanvraag naar ${BUSINESS.email}.`,
            "U kunt ook een klacht indienen bij de Belgische Gegevensbeschermingsautoriteit.",
          ],
        },
      ],
      terms: [
        {
          title: "Toepassingsgebied",
          paragraphs: [
            "Deze voorwaarden regelen uitsluitend het gebruik van de website en de aanvragen om informatie of offertes die via de website worden verzonden.",
            "De voorwaarden voor een interventie, verkoop of installatie worden vermeld in de betrokken offerte, aanbieding, bestelbon of overeenkomst.",
          ],
        },
        {
          title: "Geen online overeenkomst",
          paragraphs: [
            "Het gebruik van het formulier, een telefoongesprek of een WhatsApp-bericht vormt geen definitieve bestelling. Via de website wordt niet automatisch een overeenkomst gesloten.",
            "Prijzen, termijnen, merken, beschikbaarheden en technische kenmerken zijn pas bindend na schriftelijke bevestiging in een commercieel document dat door beide partijen is aanvaard.",
          ],
        },
        {
          title: "Offertes en bezoeken",
          paragraphs: [
            "Aanvragen worden beoordeeld op basis van de beschikbare informatie. Een technisch bezoek kan nodig zijn voordat de offerte wordt opgesteld of bevestigd.",
            "Tenzij anders aan de klant meegedeeld, creëert een eerste offerteaanvraag geen verplichting om de werken te aanvaarden of uit te voeren.",
          ],
        },
        {
          title: "Materiaal van de klant",
          paragraphs: [
            "De installatie van apparatuur die door de klant werd aangekocht of geleverd, kan op aanvraag worden aanvaard na controle van compatibiliteit, conformiteit, veiligheid, documentatie en toestand van het materiaal.",
            "De installateur kan ongeschikt, onvolledig, beschadigd of niet-conform materiaal weigeren, evenals materiaal dat niet professioneel en veilig kan worden geïnstalleerd. Garanties voor materiaal dat door de klant werd geleverd, blijven in beginsel ten laste van de verkoper of fabrikant, tenzij schriftelijk anders overeengekomen.",
          ],
        },
        {
          title: "Inhoud en beschikbaarheid",
          paragraphs: [
            "Informatie op de website kan zonder voorafgaande kennisgeving worden aangepast. Foto's, merken en voorbeelden zijn illustratief en vormen geen bindend aanbod.",
            "De toegang tot de website kan worden onderbroken wegens onderhoud, updates of technische redenen.",
          ],
        },
        {
          title: "Toepasselijk recht",
          paragraphs: [
            "Het gebruik van de website is onderworpen aan het Belgische recht. Dwingende regels inzake consumentenbescherming blijven volledig van toepassing.",
          ],
        },
      ],
    },
  },
  en: {
    pageTitle: {
      legal: "Legal notice",
      privacy: "Privacy policy",
      terms: "Website terms of use",
    },
    back: "Back to the website",
    updated: "Last updated: 18 July 2026",
    sections: {
      legal: [
        {
          title: "Website operator",
          paragraphs: [
            `${BUSINESS.name}, sole proprietor, registered with the Belgian Crossroads Bank for Enterprises under number ${BUSINESS.enterprise}.`,
            `Official address: ${BUSINESS.address}.`,
            `Email: ${BUSINESS.email} — Telephone: ${BUSINESS.phone}.`,
            "OLI-NRG is the name used on this website to present the activities. It is not represented as a registered trade name.",
          ],
        },
        {
          title: "Purpose of the website",
          paragraphs: [
            "This website presents installation, maintenance and repair services relating to heat pumps, general electrical work, photovoltaic installations, batteries and EV charging stations.",
            "The website is informational. It does not provide online payments, customer accounts or automatic contract formation.",
          ],
        },
        {
          title: "Quotation requests",
          paragraphs: [
            "Submitting a form or message is only a request for information or a quotation. It is not an order, acceptance of an offer or contractual commitment.",
            "Any agreement is formed only after both parties expressly agree to a separate quotation, offer or purchase order.",
          ],
        },
        {
          title: "Intellectual property",
          paragraphs: [
            "Texts, graphics, photographs and other website content may not be reproduced or reused without permission, except where the content clearly belongs to a third party or the law permits such use.",
          ],
        },
        {
          title: "Liability",
          paragraphs: [
            "Information is provided in good faith and may change. It does not replace a technical inspection, quotation or advice tailored to the customer's installation.",
            "The operator does not guarantee that the website will always be free from interruptions, technical errors or unavailable external links.",
          ],
        },
      ],
      privacy: [
        {
          title: "Data controller",
          paragraphs: [
            `${BUSINESS.name}, ${BUSINESS.enterprise}, ${BUSINESS.address}.`,
            `Contact for personal-data questions: ${BUSINESS.email} or ${BUSINESS.phone}.`,
          ],
        },
        {
          title: "Data collected",
          paragraphs: [
            "When you use the form, we may process your name, email address, telephone number, requested service and message content.",
            "The website does not create customer accounts and does not collect payment information.",
          ],
        },
        {
          title: "Purposes and legal basis",
          paragraphs: [
            "The data is used to answer your request, prepare or follow up a quotation, arrange a visit and conduct the pre-contractual communication requested by you.",
            "Processing is based on pre-contractual steps taken at your request and, where necessary, on the legitimate interest in managing received requests and related administration.",
          ],
        },
        {
          title: "Service providers and disclosure",
          paragraphs: [
            "The form uses EmailJS to transmit the message. The data may therefore be technically processed by EmailJS for the delivery of that service.",
            "Personal data is not sold. It is shared with other recipients only when necessary for your request, required by law or authorised by you.",
          ],
        },
        {
          title: "Retention",
          paragraphs: [
            "Requests and related correspondence are retained for no more than 24 months, unless a longer period is necessary to comply with a legal obligation, preserve evidence or manage a contract that was actually concluded.",
          ],
        },
        {
          title: "Cookies and audience measurement",
          paragraphs: [
            "As of the date of this policy, the website does not use Google Analytics or Meta Pixel.",
            "Strictly necessary elements may be used to operate the website, for example to remember the selected language. They are not used for behavioural advertising.",
          ],
        },
        {
          title: "Your rights",
          paragraphs: [
            `You may request access to, correction or deletion of your data and, where the legal conditions are met, restriction of or objection to processing. Send requests to ${BUSINESS.email}.`,
            "You may also lodge a complaint with the Belgian Data Protection Authority.",
          ],
        },
      ],
      terms: [
        {
          title: "Scope",
          paragraphs: [
            "These terms govern only use of the website and requests for information or quotations sent through it.",
            "Terms applicable to an intervention, sale or installation will be set out in the relevant quotation, offer, purchase order or contract.",
          ],
        },
        {
          title: "No online contract",
          paragraphs: [
            "Using the form, making a call or sending a WhatsApp message does not constitute a firm order. No contract is concluded automatically through the website.",
            "Prices, lead times, brands, availability and technical specifications become binding only after written confirmation in a commercial document accepted by both parties.",
          ],
        },
        {
          title: "Quotations and visits",
          paragraphs: [
            "Requests are assessed on the basis of the information available. A technical visit may be required before a quotation can be issued or confirmed.",
            "Unless otherwise communicated to the customer, an initial quotation request creates no obligation to accept or perform the work.",
          ],
        },
        {
          title: "Customer-supplied equipment",
          paragraphs: [
            "Installation of equipment purchased or supplied by the customer may be accepted on request after checks concerning compatibility, compliance, safety, documentation and condition.",
            "The installer may refuse unsuitable, incomplete, damaged or non-compliant equipment, or equipment that cannot be installed professionally and safely. Warranties relating to customer-supplied equipment generally remain with its seller or manufacturer unless otherwise agreed in writing.",
          ],
        },
        {
          title: "Content and availability",
          paragraphs: [
            "Website information may be changed without prior notice. Photographs, brands and examples are illustrative and do not constitute a binding offer.",
            "Access may be interrupted for maintenance, updates or technical reasons.",
          ],
        },
        {
          title: "Applicable law",
          paragraphs: [
            "Use of the website is governed by Belgian law. Mandatory consumer-protection rules remain fully applicable.",
          ],
        },
      ],
    },
  },
};

export default function LegalPage({ kind }: { kind: LegalKind }) {
  const lang = detectLangSync();
  const copy = COPY[lang];

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#12263A]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a
            href="#/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F3D66] hover:underline"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            {copy.back}
          </a>
          <span className="text-sm font-bold text-[#0F3D66]">OLI-NRG</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <h1 className="text-3xl font-bold tracking-tight text-[#0F3D66] sm:text-4xl">
            {copy.pageTitle[kind]}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{copy.updated}</p>

          <div className="mt-10 space-y-9">
            {copy.sections[kind].map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-bold text-[#0F3D66]">{section.title}</h2>
                <div className="mt-3 space-y-3 text-[15px] leading-7 text-slate-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-600">
            <a className="mr-6 inline-flex items-center gap-2 hover:text-[#0F3D66] hover:underline" href={`mailto:${BUSINESS.email}`}>
              <Mail size={16} aria-hidden="true" /> {BUSINESS.email}
            </a>
            <a className="mt-3 inline-flex items-center gap-2 hover:text-[#0F3D66] hover:underline sm:mt-0" href="tel:+32465140837">
              <Phone size={16} aria-hidden="true" /> {BUSINESS.phone}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
