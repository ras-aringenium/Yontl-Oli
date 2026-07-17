Keep the existing website exactly as it is visually.

Do not redesign the website.
Do not rebuild the project from scratch.
Do not remove or replace any existing functionality.
The website must remain stable and publishable today.

The current contact form already uses EmailJS.
Keep the existing EmailJS implementation exactly as it is.
Do not replace EmailJS with Supabase.
Do not change the current EmailJS service, template or public key configuration.

The objective is only to connect the existing website to the already connected Supabase project for editable website content and a simple private admin area.

This website will later be reused as a template for other independent contractors, so organize the data in a clear and reusable way, but do not build a multi-tenant SaaS platform now.

------------------------------------
PUBLIC WEBSITE
------------------------------------

Keep the existing:

- header
- navigation
- hero section
- services section
- certification ribbon
- brand ribbon
- gallery
- reviews
- contact section
- footer
- French, Dutch and English versions
- responsive behaviour
- current visual style
- existing SEO configuration
- EmailJS contact form

Do not change the design unless a small change is technically required to connect dynamic content.

------------------------------------
SUPABASE DATA
------------------------------------

Use the already connected Supabase project.

Create only the minimum database structure required for this website.

Use clear lowercase table names.

1. business_settings

Fields:

- id
- company_name
- contact_email
- phone_number
- whatsapp_number
- address
- opening_hours_fr
- opening_hours_nl
- opening_hours_en
- free_quote_text_fr
- free_quote_text_nl
- free_quote_text_en
- hero_image_url
- updated_at

There should be only one active business settings record for this website.

Important:

The contact form must continue using EmailJS.

The contact_email field is only for displaying the contact address on the website and for future configuration. Do not attempt to dynamically modify the EmailJS destination using Supabase unless the current EmailJS configuration already supports this safely.

The WhatsApp buttons must use the whatsapp_number stored in business_settings.

2. services

Fields:

- id
- slug
- title_fr
- title_nl
- title_en
- description_fr
- description_nl
- description_en
- image_url
- icon_name
- display_order
- active
- created_at
- updated_at

Create initial service categories for:

- air-conditioning-supply
- air-conditioning-installation
- customer-supplied-airco-installation
- air-conditioning-maintenance
- electrical-installations
- solar-home-batteries

3. gallery_items

Fields:

- id
- service_id
- image_url
- title_fr
- title_nl
- title_en
- description_fr
- description_nl
- description_en
- alt_text_fr
- alt_text_nl
- alt_text_en
- display_order
- active
- created_at

Gallery images must be linked to a service using service_id.

The public website must display gallery images in the correct service category.

4. reviews

Fields:

- id
- customer_name
- customer_city
- service_id
- rating
- review_text_fr
- review_text_nl
- review_text_en
- owner_reply_fr
- owner_reply_nl
- owner_reply_en
- approved
- display_order
- created_at

Only approved reviews must appear on the public website.

5. certifications

Fields:

- id
- name
- logo_url
- description_fr
- description_nl
- description_en
- display_order
- active
- created_at

Active certification logos must appear in the existing semi-transparent hero ribbon.

6. brands

Fields:

- id
- name
- logo_url
- display_order
- active
- created_at

Active brand logos must appear in the existing brand ribbon.

The existing message about installing leading brands must remain in French, Dutch and English.

------------------------------------
STORAGE
------------------------------------

Create Supabase Storage buckets or folders for:

- hero
- gallery
- services
- certifications
- brands

Images must be uploaded as files.

Do not ask the administrator to manually enter image URLs.

The admin interface must use:

- Upload image
- Replace image
- Delete image

The upload control must allow selecting an image from the computer or mobile photo library.

------------------------------------
PRIVATE ADMIN AREA
------------------------------------

Create a simple private admin page.

Do not show the admin link in the public navigation.

Suggested route:

/admin

Protect the admin area using Supabase authentication.

The admin interface must be simple and functional, not visually complex.

Admin sections:

1. Business settings

Allow editing:

- company name
- displayed contact email
- phone number
- WhatsApp number
- address
- opening hours
- free quotation text
- hero image

2. Services

Allow:

- editing service texts
- changing service images
- changing display order
- activating or deactivating services

3. Gallery

Allow:

- uploading images
- selecting the related service
- editing title and description
- editing alt text
- changing display order
- activating or hiding an image
- deleting an image

Do not use URL input fields for image uploads.

4. Reviews

Allow:

- adding a review
- editing a review
- selecting the related service
- setting a rating from 1 to 5
- approving or hiding a review
- adding an owner reply
- deleting a review

5. Certifications

Allow:

- uploading certification logos
- editing certification descriptions
- changing display order
- activating or hiding certifications
- deleting certifications

6. Brands

Allow:

- uploading brand logos
- changing display order
- activating or hiding brands
- deleting brands

------------------------------------
SECURITY
------------------------------------

Public visitors must only be able to read active and approved content.

Only authenticated administrators may:

- create records
- edit records
- delete records
- upload images
- delete images
- approve reviews
- change business settings

Create appropriate Supabase Row Level Security policies.

Do not expose private Supabase keys in client-side code.

Use only the public anonymous key in the frontend.

------------------------------------
SEO
------------------------------------

Keep the existing SEO implementation.

Do not remove or overwrite existing:

- title tags
- meta descriptions
- Open Graph tags
- canonical tags
- hreflang tags
- JSON-LD structured data
- image alt text
- semantic HTML

When gallery images or services are loaded from Supabase, use the translated alt text stored in Supabase.

------------------------------------
IMPORTANT DELIVERY RULES
------------------------------------

Do not rebuild the existing website.

Do not change the existing visual identity.

Do not replace EmailJS.

Do not implement calendar booking.

Do not implement route optimization.

Do not implement CRM functionality.

Do not implement multiple businesses or subscriptions.

The priority is:

1. Keep the current website working.
2. Keep the site publishable today.
3. Connect only the editable content to Supabase.
4. Add a simple private admin area.
5. Avoid unnecessary complexity.

If implementing the full admin area risks breaking the public website, preserve the public website first and implement the Supabase structure and admin area incrementally.