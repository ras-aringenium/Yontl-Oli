export type GalleryCategory = "ac" | "electrical" | "batteries";

export interface GalleryItem {
  id: number;
  cat: GalleryCategory;
  img: string;
  alt: string;
}

export interface ReviewItem {
  name: string;
  initials: string;
  bg: string;
  rating: number;
  date: string;
  text: string;
  reply: string;
}

export interface SiteData {
  companyName: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  hours: string;
  heroImage: string;
  heroCerts: string[];
  brands: string[];
  serviceImages: string[];
  galleryItems: GalleryItem[];
  reviews: ReviewItem[];
}

export const DEFAULT_DATA: SiteData = {
  companyName: "Oncioiu Lucian-Ionut",
  phone: "+32 470 123 456",
  email: "lucianoncioiuoli@gmail.com",
  whatsapp: "https://wa.me/32465140837",
  address: "Belgique",
  hours: "Lun–Ven 8h00–18h00\nSam 9h00–13h00",
  heroImage:
    "https://images.unsplash.com/photo-1642749776312-aa42ce20c9f5?w=1920&h=1080&fit=crop&fm=webp&auto=format",
  heroCerts: ["RGIE", "F-gaz", "Synergrid", "Agréé Fabricant"],
  brands: ["Daikin", "Samsung", "Fujitsu", "Mitsubishi Electric", "Panasonic", "LG"],
  serviceImages: [
    "https://images.unsplash.com/photo-1642749776312-aa42ce20c9f5?w=800&h=500&fit=crop&fm=webp&auto=format",
    "https://images.unsplash.com/photo-1762341123870-d706f257a12e?w=800&h=500&fit=crop&fm=webp&auto=format",
    "https://images.unsplash.com/photo-1528817466667-942353411fee?w=800&h=500&fit=crop&fm=webp&auto=format",
    "https://images.unsplash.com/photo-1732395805034-e0bf859665e5?w=800&h=500&fit=crop&fm=webp&auto=format",
    "https://images.unsplash.com/photo-1660330590022-9f4ff56b63f6?w=800&h=500&fit=crop&fm=webp&auto=format",
    "https://images.unsplash.com/flagged/photo-1566838616631-f2618f74a6a2?w=800&h=500&fit=crop&fm=webp&auto=format",
  ],
  galleryItems: [
    { id: 1, cat: "ac", img: "https://images.unsplash.com/photo-1698479603408-1a66a6d9e80f?w=700&h=480&fit=crop&fm=webp&auto=format", alt: "Installation climatisation multi-split Daikin — Belgique" },
    { id: 2, cat: "electrical", img: "https://images.unsplash.com/photo-1520700325158-0537038a4c46?w=700&h=900&fit=crop&fm=webp&auto=format", alt: "Rénovation tableau électrique conforme RGIE — Belgique" },
    { id: 3, cat: "batteries", img: "https://images.unsplash.com/flagged/photo-1566838616631-f2618f74a6a2?w=700&h=480&fit=crop&fm=webp&auto=format", alt: "Installation batteries de stockage solaire domestique — Belgique" },
    { id: 4, cat: "ac", img: "https://images.unsplash.com/photo-1642749776312-aa42ce20c9f5?w=700&h=480&fit=crop&fm=webp&auto=format", alt: "Pose unité extérieure climatisation Samsung sur toiture — Belgique" },
    { id: 5, cat: "electrical", img: "https://images.unsplash.com/photo-1528817466667-942353411fee?w=700&h=900&fit=crop&fm=webp&auto=format", alt: "Installation système électrique résidentiel certifié RGIE" },
    { id: 6, cat: "batteries", img: "https://images.unsplash.com/photo-1655300256335-beef51a914fe?w=700&h=480&fit=crop&fm=webp&auto=format", alt: "Système photovoltaïque avec batteries domestiques — autoconsommation Belgique" },
    { id: 7, cat: "ac", img: "https://images.unsplash.com/photo-1635604866833-70844856de75?w=700&h=700&fit=crop&fm=webp&auto=format", alt: "Réseau de climatisation professionnel Fujitsu multi-split" },
    { id: 8, cat: "electrical", img: "https://images.unsplash.com/photo-1521386455230-4ceaa25b72be?w=700&h=480&fit=crop&fm=webp&auto=format", alt: "Appareillage électrique moderne — installation conforme normes belges" },
  ],
  reviews: [
    { name: "Sophie Lambrecht", initials: "SL", bg: "#0F3D66", rating: 5, date: "Nov 2024", text: "Excellent travail ! L'installation de la climatisation s'est faite rapidement et proprement. Très professionnel et ponctuel. Je recommande vivement.", reply: "Merci Sophie pour votre confiance ! Nous espérons vous satisfaire encore longtemps." },
    { name: "Marc Desmet", initials: "MD", bg: "#16A34A", rating: 5, date: "Oct 2024", text: "Devis reçu très rapidement, prix compétitif et travail irréprochable. Mon tableau électrique a été entièrement rénové en une seule journée.", reply: "Merci Marc ! Toujours un plaisir de travailler pour des clients aussi agréables." },
    { name: "Isabelle Vander", initials: "IV", bg: "#7C3AED", rating: 5, date: "Sep 2024", text: "Service au top ! Installation de la batterie domestique parfaitement réalisée. Explications claires sur le fonctionnement. Tarifs honnêtes.", reply: "Merci Isabelle ! N'hésitez pas à nous contacter pour l'entretien annuel." },
    { name: "Thomas Dubois", initials: "TD", bg: "#EA580C", rating: 5, date: "Août 2024", text: "Intervention rapide pour mon unité de climatisation achetée ailleurs. Aucun problème, travail soigné et prix raisonnable. Très satisfait.", reply: "Merci Thomas ! On est là pour simplifier votre quotidien." },
  ],
};
