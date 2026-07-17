import { supabase } from "../../../utils/supabase/client";
import type { SiteData, GalleryItem, ReviewItem } from "../types";

type Lang = "fr" | "nl" | "en";

// ─── SUPABASE ROW TYPES ────────────────────────────────────────────────────────
export interface DbBusinessSettings {
  id: string;
  company_name: string;
  contact_email: string;
  phone_number: string;
  whatsapp_number: string;
  address: string;
  opening_hours_fr: string;
  opening_hours_nl: string;
  opening_hours_en: string;
  free_quote_text_fr: string;
  free_quote_text_nl: string;
  free_quote_text_en: string;
  hero_image_url: string;
  updated_at: string;
}

export interface DbService {
  id: string;
  slug: string;
  title_fr: string;
  title_nl: string;
  title_en: string;
  description_fr: string;
  description_nl: string;
  description_en: string;
  image_url: string;
  icon_name: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbGalleryItem {
  id: string;
  service_id: string | null;
  image_url: string;
  title_fr: string;
  title_nl: string;
  title_en: string;
  alt_text_fr: string;
  alt_text_nl: string;
  alt_text_en: string;
  display_order: number;
  active: boolean;
  created_at: string;
  services?: { slug: string } | null;
}

export interface DbReview {
  id: string;
  customer_name: string;
  customer_city: string;
  service_id: string | null;
  rating: number;
  review_text_fr: string;
  review_text_nl: string;
  review_text_en: string;
  owner_reply_fr: string;
  owner_reply_nl: string;
  owner_reply_en: string;
  approved: boolean;
  display_order: number;
  created_at: string;
}

export interface DbCertification {
  id: string;
  name: string;
  logo_url: string;
  description_fr: string;
  description_nl: string;
  description_en: string;
  display_order: number;
  active: boolean;
  created_at: string;
}

export interface DbBrand {
  id: string;
  name: string;
  logo_url: string;
  display_order: number;
  active: boolean;
  created_at: string;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#0F3D66", "#16A34A", "#7C3AED", "#EA580C", "#DC2626", "#0891B2"];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function slugToCategory(slug: string): GalleryItem["cat"] {
  if (slug?.includes("batter") || slug?.includes("solar")) return "batteries";
  if (slug?.includes("electric")) return "electrical";
  return "ac";
}

function formatDate(iso: string, lang: Lang) {
  try {
    return new Date(iso).toLocaleDateString(
      lang === "nl" ? "nl-BE" : lang === "fr" ? "fr-BE" : "en-GB",
      { month: "short", year: "numeric" }
    );
  } catch {
    return "";
  }
}

// ─── PUBLIC FETCH ─────────────────────────────────────────────────────────────
export async function fetchSiteData(lang: Lang): Promise<Partial<SiteData & { supabaseServices: DbService[] }>> {
  try {
    const [
      settingsRes,
      servicesRes,
      galleryRes,
      reviewsRes,
      certsRes,
      brandsRes,
    ] = await Promise.all([
      supabase.from("business_settings").select("*").limit(1).single(),
      supabase.from("services").select("*").eq("active", true).order("display_order"),
      supabase.from("gallery_items").select("*, services(slug)").eq("active", true).order("display_order"),
      supabase.from("reviews").select("*").eq("approved", true).order("display_order"),
      supabase.from("certifications").select("*").eq("active", true).order("display_order"),
      supabase.from("brands").select("*").eq("active", true).order("display_order"),
    ]);

    const result: Partial<SiteData & { supabaseServices: DbService[] }> = {};

    const settings = settingsRes.data as DbBusinessSettings | null;
    if (settings) {
      result.companyName = settings.company_name || undefined;
      result.email = settings.contact_email || undefined;
      result.phone = settings.phone_number || undefined;
      result.whatsapp = settings.whatsapp_number || undefined;
      result.address = settings.address || undefined;
      result.hours = settings[`opening_hours_${lang}`] || settings.opening_hours_fr || undefined;
      if (settings.hero_image_url) result.heroImage = settings.hero_image_url;
    }

    const services = (servicesRes.data ?? []) as DbService[];
    if (services.length > 0) {
      result.supabaseServices = services;
      result.serviceImages = services.map((s) => s.image_url).filter(Boolean);
    }

    const gallery = (galleryRes.data ?? []) as DbGalleryItem[];
    if (gallery.length > 0) {
      result.galleryItems = gallery.map((g, i) => ({
        id: i + 1,
        cat: slugToCategory(g.services?.slug ?? ""),
        img: g.image_url,
        alt: g[`alt_text_${lang}`] || g.alt_text_fr || "",
      }));
    }

    const reviews = (reviewsRes.data ?? []) as DbReview[];
    if (reviews.length > 0) {
      result.reviews = reviews.map((r, i): ReviewItem => ({
        name: r.customer_name,
        initials: initials(r.customer_name),
        bg: AVATAR_COLORS[i % AVATAR_COLORS.length],
        rating: r.rating,
        date: formatDate(r.created_at, lang),
        text: r[`review_text_${lang}`] || r.review_text_fr || "",
        reply: r[`owner_reply_${lang}`] || r.owner_reply_fr || "",
      }));
    }

    const certs = (certsRes.data ?? []) as DbCertification[];
    if (certs.length > 0) {
      result.heroCerts = certs.map((c) => c.name);
    }

    const brands = (brandsRes.data ?? []) as DbBrand[];
    if (brands.length > 0) {
      result.brands = brands.map((b) => b.name);
    }

    return result;
  } catch {
    return {};
  }
}

// ─── ADMIN FETCH (authenticated) ──────────────────────────────────────────────
export async function fetchAllServices() {
  const { data } = await supabase.from("services").select("*").order("display_order");
  return (data ?? []) as DbService[];
}

export async function fetchAllGallery() {
  const { data } = await supabase.from("gallery_items").select("*, services(slug, title_fr)").order("display_order");
  return (data ?? []) as (DbGalleryItem & { services: { slug: string; title_fr: string } | null })[];
}

export async function fetchAllReviews() {
  const { data } = await supabase.from("reviews").select("*, services(title_fr)").order("display_order");
  return (data ?? []) as (DbReview & { services: { title_fr: string } | null })[];
}

export async function fetchAllCertifications() {
  const { data } = await supabase.from("certifications").select("*").order("display_order");
  return (data ?? []) as DbCertification[];
}

export async function fetchAllBrands() {
  const { data } = await supabase.from("brands").select("*").order("display_order");
  return (data ?? []) as DbBrand[];
}

export async function fetchBusinessSettings() {
  const { data } = await supabase.from("business_settings").select("*").limit(1).single();
  return data as DbBusinessSettings | null;
}

// ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────────
export async function uploadImage(
  bucket: string,
  file: File,
  accessToken?: string,
): Promise<{ url: string | null; error: string | null }> {
  const token = accessToken ?? (await supabase.auth.getSession()).data.session?.access_token;
  if (!token) return { url: null, error: "Not authenticated — please log out and log in again." };

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const PROJECT_ID = "moupoiltwhkawnazqkky";
  const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdXBvaWx0d2hrYXduYXpxa2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyOTIxNDAsImV4cCI6MjA5OTg2ODE0MH0.hhvyxHdyXNhHX5qe2daFhQDwRVbSHqq1UR5DrQ33W8U";

  const res = await fetch(
    `https://${PROJECT_ID}.supabase.co/storage/v1/object/${bucket}/${path}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "apikey": ANON_KEY,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      body: file,
    },
  );

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = await res.json(); msg = j.error ?? j.message ?? msg; } catch {}
    console.error("[uploadImage] error:", msg);
    return { url: null, error: msg };
  }

  const publicUrl = `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${bucket}/${path}`;
  return { url: publicUrl, error: null };
}

export async function deleteImage(bucket: string, url: string): Promise<void> {
  const path = url.split(`/${bucket}/`)[1];
  if (path) await supabase.storage.from(bucket).remove([path]);
}
