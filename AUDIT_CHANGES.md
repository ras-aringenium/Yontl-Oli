# Audit and corrections applied

## Corrected
- Added a real TypeScript typecheck command and production check command.
- Added React and ReactDOM as direct runtime dependencies rather than optional peer dependencies.
- Restricted Supabase database and Storage write policies to the designated administrator email.
- Added an idempotent security/social migration for existing Supabase projects.
- Added missing social and Google profile columns to the fresh-install schema.
- Replaced the insecure HTTP IP-geolocation call with an HTTPS endpoint and preserved browser-language fallback.
- Removed broken `href="#"` navigation targets.
- Disabled unfinished legal footer links rather than sending visitors to the top of the page.
- Made the customer-supplied-equipment notice visible globally and enabled it for all five migrated services.
- Kept the existing mobile fixed Quote and WhatsApp action bar.

## Manual actions still required
- Run the two SQL migrations listed in `PRE_PUBLICATION.md`.
- Disable public Supabase sign-up.
- Restrict EmailJS to the production domain and configure anti-spam protection.
- Have final privacy-policy and terms text approved, then add real pages/links.

## Verification note
The active browser application passed TypeScript checking before the dependency layout was corrected. The previous package layout omitted React/ReactDOM from installable dependencies, which caused the production build to fail in a clean environment. They are now direct dependencies. Run `npm install` and `npm run check` in GitHub/local CI to reproduce the final build check.
