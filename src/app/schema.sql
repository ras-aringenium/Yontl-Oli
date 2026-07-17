-- ============================================================
-- RUN THIS ONCE IN THE SUPABASE SQL EDITOR
-- Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── STORAGE BUCKETS ─────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES
  ('hero',           'hero',           true),
  ('gallery',        'gallery',        true),
  ('services',       'services',       true),
  ('certifications', 'certifications', true),
  ('brands',         'brands',         true)
ON CONFLICT (id) DO NOTHING;

-- ─── TABLES ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS business_settings (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name        TEXT NOT NULL DEFAULT '',
  contact_email       TEXT NOT NULL DEFAULT '',
  phone_number        TEXT NOT NULL DEFAULT '',
  whatsapp_number     TEXT NOT NULL DEFAULT '',
  address             TEXT NOT NULL DEFAULT '',
  opening_hours_fr    TEXT NOT NULL DEFAULT '',
  opening_hours_nl    TEXT NOT NULL DEFAULT '',
  opening_hours_en    TEXT NOT NULL DEFAULT '',
  free_quote_text_fr  TEXT NOT NULL DEFAULT '',
  free_quote_text_nl  TEXT NOT NULL DEFAULT '',
  free_quote_text_en  TEXT NOT NULL DEFAULT '',
  hero_image_url      TEXT NOT NULL DEFAULT '',
  social_facebook     TEXT,
  social_instagram    TEXT,
  social_twitter      TEXT,
  social_linkedin     TEXT,
  social_tiktok       TEXT,
  social_youtube      TEXT,
  google_business_url TEXT,
  google_maps_url     TEXT,
  google_review_url   TEXT,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT NOT NULL UNIQUE,
  title_fr        TEXT NOT NULL DEFAULT '',
  title_nl        TEXT NOT NULL DEFAULT '',
  title_en        TEXT NOT NULL DEFAULT '',
  description_fr  TEXT NOT NULL DEFAULT '',
  description_nl  TEXT NOT NULL DEFAULT '',
  description_en  TEXT NOT NULL DEFAULT '',
  image_url       TEXT NOT NULL DEFAULT '',
  icon_name       TEXT NOT NULL DEFAULT 'Wrench',
  display_order   INTEGER NOT NULL DEFAULT 0,
  active          BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id      UUID REFERENCES services(id) ON DELETE SET NULL,
  image_url       TEXT NOT NULL DEFAULT '',
  title_fr        TEXT DEFAULT '',
  title_nl        TEXT DEFAULT '',
  title_en        TEXT DEFAULT '',
  description_fr  TEXT DEFAULT '',
  description_nl  TEXT DEFAULT '',
  description_en  TEXT DEFAULT '',
  alt_text_fr     TEXT DEFAULT '',
  alt_text_nl     TEXT DEFAULT '',
  alt_text_en     TEXT DEFAULT '',
  display_order   INTEGER NOT NULL DEFAULT 0,
  active          BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name    TEXT NOT NULL DEFAULT '',
  customer_city    TEXT DEFAULT '',
  service_id       UUID REFERENCES services(id) ON DELETE SET NULL,
  rating           INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review_text_fr   TEXT DEFAULT '',
  review_text_nl   TEXT DEFAULT '',
  review_text_en   TEXT DEFAULT '',
  owner_reply_fr   TEXT DEFAULT '',
  owner_reply_nl   TEXT DEFAULT '',
  owner_reply_en   TEXT DEFAULT '',
  approved         BOOLEAN NOT NULL DEFAULT false,
  display_order    INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL DEFAULT '',
  logo_url        TEXT DEFAULT '',
  description_fr  TEXT DEFAULT '',
  description_nl  TEXT DEFAULT '',
  description_en  TEXT DEFAULT '',
  display_order   INTEGER NOT NULL DEFAULT 0,
  active          BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brands (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL DEFAULT '',
  logo_url        TEXT DEFAULT '',
  display_order   INTEGER NOT NULL DEFAULT 0,
  active          BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────

ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services           ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews            ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands             ENABLE ROW LEVEL SECURITY;

-- Public read (anon)
CREATE POLICY "public_read_settings"      ON business_settings FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_services"      ON services          FOR SELECT TO anon USING (active = true);
CREATE POLICY "public_read_gallery"       ON gallery_items     FOR SELECT TO anon USING (active = true);
CREATE POLICY "public_read_reviews"       ON reviews           FOR SELECT TO anon USING (approved = true);
CREATE POLICY "public_read_certifications" ON certifications   FOR SELECT TO anon USING (active = true);
CREATE POLICY "public_read_brands"        ON brands            FOR SELECT TO anon USING (active = true);

-- Admin full access, restricted to the designated administrator account
CREATE POLICY "admin_all_settings" ON business_settings FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com');
CREATE POLICY "admin_all_services" ON services FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com');
CREATE POLICY "admin_all_gallery" ON gallery_items FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com');
CREATE POLICY "admin_all_reviews" ON reviews FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com');
CREATE POLICY "admin_all_certifications" ON certifications FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com');
CREATE POLICY "admin_all_brands" ON brands FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com');

-- Storage RLS
CREATE POLICY "public_view_images" ON storage.objects FOR SELECT TO anon
  USING (bucket_id IN ('hero','gallery','services','certifications','brands'));
CREATE POLICY "admin_upload_images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('hero','gallery','services','certifications','brands')
    AND (auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com');
CREATE POLICY "admin_update_images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('hero','gallery','services','certifications','brands')
    AND (auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com')
  WITH CHECK (bucket_id IN ('hero','gallery','services','certifications','brands')
    AND (auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com');
CREATE POLICY "admin_delete_images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('hero','gallery','services','certifications','brands')
    AND (auth.jwt() ->> 'email') = 'lucianoncioiuoli@gmail.com');

-- ─── SEED DATA ───────────────────────────────────────────────

INSERT INTO business_settings (
  company_name, contact_email, phone_number, whatsapp_number, address,
  opening_hours_fr, opening_hours_nl, opening_hours_en,
  free_quote_text_fr, free_quote_text_nl, free_quote_text_en,
  hero_image_url
) VALUES (
  'Oncioiu Lucian-Ionut',
  'lucianoncioiuoli@gmail.com',
  '+32 465 140 837',
  'https://wa.me/32465140837',
  'Belgique',
  'Lun–Ven 8h00–18h00' || chr(10) || 'Sam 9h00–13h00',
  'Ma–Vr 8u00–18u00' || chr(10) || 'Za 9u00–13u00',
  'Mon–Fri 8am–6pm' || chr(10) || 'Sat 9am–1pm',
  'Devis gratuits et visites offertes.',
  'Gratis offertes en plaatsbezoeken.',
  'Free quotations and site visits offered.',
  'https://images.unsplash.com/photo-1642749776312-aa42ce20c9f5?w=1920&h=1080&fit=crop&fm=webp&auto=format'
);

INSERT INTO services (slug, title_fr, title_nl, title_en, description_fr, description_nl, description_en, image_url, icon_name, display_order) VALUES
('air-conditioning-installation',
  'Installation Climatisation', 'Installatie Airconditioning', 'Air Conditioning Installation',
  'Pose professionnelle de systèmes split et multi-split. Installateur certifié F-gaz et agréé fabricant.',
  'Professionele plaatsing van split- en multi-splitsystemen. F-gaz gecertificeerd en fabrikant-erkend installateur.',
  'Professional installation of split and multi-split systems. F-gas certified and manufacturer-approved installer.',
  'https://images.unsplash.com/photo-1642749776312-aa42ce20c9f5?w=800&h=500&fit=crop&fm=webp&auto=format',
  'Wrench', 1),
('air-conditioning-supply',
  'Fourniture de Climatisation', 'Levering Airconditioning', 'Air Conditioning Supply',
  'Vente des meilleures marques mondiales : Daikin, Samsung, Mitsubishi Electric, Panasonic & LG.',
  'Verkoop van de beste wereldmerken: Daikin, Samsung, Mitsubishi Electric, Panasonic & LG.',
  'Sales of the world''s best brands: Daikin, Samsung, Mitsubishi Electric, Panasonic & LG.',
  'https://images.unsplash.com/photo-1762341123870-d706f257a12e?w=800&h=500&fit=crop&fm=webp&auto=format',
  'Wind', 2),
('electrical-installations',
  'Installations Électriques', 'Elektrische Installaties', 'Electrical Installations',
  'Mise aux normes, rénovation de tableaux, câblage, prises et éclairage par un professionnel certifié RGIE.',
  'Normalisering, renovatie van verdeelkasten, bedrading, stopcontacten en verlichting door een AREI-gecertificeerde professional.',
  'Standards compliance, panel renovation, wiring, outlets and lighting by an RGIE-certified professional.',
  'https://images.unsplash.com/photo-1528817466667-942353411fee?w=800&h=500&fit=crop&fm=webp&auto=format',
  'Zap', 3),
('customer-supplied-airco-installation',
  'Pose d''Unités Fournies', 'Plaatsing Klanttoestel', 'Customer-Supplied Unit Install',
  'Installation professionnelle de votre unité de climatisation achetée chez un autre fournisseur.',
  'Professionele installatie van uw airconditioningtoestel dat u elders heeft aangekocht.',
  'Professional installation of your air conditioning unit purchased from another supplier.',
  'https://images.unsplash.com/photo-1732395805034-e0bf859665e5?w=800&h=500&fit=crop&fm=webp&auto=format',
  'Settings', 4),
('air-conditioning-maintenance',
  'Entretien & Maintenance', 'Onderhoud & Service', 'Maintenance & Service',
  'Révision annuelle, nettoyage de filtres et dépannage de vos systèmes pour des performances optimales.',
  'Jaarlijkse revisie, filterreiniging en herstelling van uw systemen voor optimale prestaties.',
  'Annual overhaul, filter cleaning and repair of your systems for optimal performance.',
  'https://images.unsplash.com/photo-1660330590022-9f4ff56b63f6?w=800&h=500&fit=crop&fm=webp&auto=format',
  'CheckCircle', 5),
('solar-home-batteries',
  'Batteries Domestiques', 'Thuisbatterijen', 'Home Battery Systems',
  'Installation de systèmes de stockage pour panneaux photovoltaïques. Maximisez votre autoconsommation.',
  'Installatie van opslagsystemen voor fotovoltaïsche panelen. Maximaliseer uw zelfverbruik.',
  'Installation of storage systems for photovoltaic panels. Maximize your energy self-consumption.',
  'https://images.unsplash.com/flagged/photo-1566838616631-f2618f74a6a2?w=800&h=500&fit=crop&fm=webp&auto=format',
  'Battery', 6);

INSERT INTO certifications (name, display_order, active) VALUES
  ('RGIE', 1, true), ('F-gaz', 2, true), ('Synergrid', 3, true), ('Agréé Fabricant', 4, true);

INSERT INTO brands (name, display_order, active) VALUES
  ('Daikin', 1, true), ('Samsung', 2, true), ('Fujitsu', 3, true),
  ('Mitsubishi Electric', 4, true), ('Panasonic', 5, true), ('LG', 6, true);
