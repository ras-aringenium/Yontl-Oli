# Pre-publication actions

1. In Supabase SQL Editor, run migrations in this order:
   - `supabase/migrations/20260717_services_restructure.sql`
   - `supabase/migrations/20260717_security_and_social.sql`
2. In Supabase Authentication settings, disable public user sign-ups.
3. Confirm the only administrator account is `lucianoncioiuoli@gmail.com`.
4. In EmailJS, restrict the public key/template to the final production domain and enable anti-spam protection.
5. Add approved privacy-policy and terms pages before enabling the muted footer labels.
6. Run `npm install`, then `npm run check`.
