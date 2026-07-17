-- Run once in Supabase SQL Editor after the existing schema/migrations.
-- Restricts all write access to Lucian's administrator account and adds social fields safely.

ALTER TABLE business_settings
  ADD COLUMN IF NOT EXISTS social_facebook TEXT,
  ADD COLUMN IF NOT EXISTS social_instagram TEXT,
  ADD COLUMN IF NOT EXISTS social_twitter TEXT,
  ADD COLUMN IF NOT EXISTS social_linkedin TEXT,
  ADD COLUMN IF NOT EXISTS social_tiktok TEXT,
  ADD COLUMN IF NOT EXISTS social_youtube TEXT,
  ADD COLUMN IF NOT EXISTS google_business_url TEXT,
  ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
  ADD COLUMN IF NOT EXISTS google_review_url TEXT;

DROP POLICY IF EXISTS "admin_all_settings" ON business_settings;
DROP POLICY IF EXISTS "admin_all_services" ON services;
DROP POLICY IF EXISTS "admin_all_gallery" ON gallery_items;
DROP POLICY IF EXISTS "admin_all_reviews" ON reviews;
DROP POLICY IF EXISTS "admin_all_certifications" ON certifications;
DROP POLICY IF EXISTS "admin_all_brands" ON brands;
DROP POLICY IF EXISTS "admin_upload_images" ON storage.objects;
DROP POLICY IF EXISTS "admin_update_images" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_images" ON storage.objects;

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
