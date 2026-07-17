-- Add new columns to the services table
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS brands         TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS show_customer_supply_note BOOLEAN NOT NULL DEFAULT FALSE;

-- Upsert the 5 service categories (idempotent — safe to run multiple times)
INSERT INTO services (
  slug, title_fr, title_nl, title_en,
  description_fr, description_nl, description_en,
  icon_name, brands, show_customer_supply_note,
  display_order, active
) VALUES
  (
    'heat-pumps',
    'Pompes à Chaleur',
    'Warmtepompen',
    'Heat Pumps',
    'Pompes à chaleur air/air (climatisation) et air/eau (eau chaude sanitaire & chauffage). Distributeur agréé Daikin, Samsung et Fujitsu.',
    'Lucht/lucht warmtepompen (airconditioning) en lucht/water warmtepompen (sanitair warm water & verwarming). Erkend verdeler van Daikin, Samsung en Fujitsu.',
    'Air-to-air heat pumps (air conditioning) and air-to-water heat pumps (domestic hot water & heating). Authorised distributor for Daikin, Samsung and Fujitsu.',
    'Wind',
    ARRAY['Daikin', 'Samsung', 'Fujitsu'],
    FALSE, 1, TRUE
  ),
  (
    'general-electricity',
    'Électricité Générale',
    'Algemene Elektriciteit',
    'General Electricity',
    'Travaux électriques résidentiels et professionnels : nouvelles installations, mise aux normes RGIE, rénovation de tableaux, câblage, dépannage et réparations.',
    'Elektrische werken voor particulieren en bedrijven: nieuwe installaties, AREI-conformiteit, renovatie verdeelkasten, bekabeling, depannage en herstellingen.',
    'Residential and professional electrical works: new installations, RGIE/AREI compliance, panel upgrades, wiring, troubleshooting and repairs.',
    'Zap',
    ARRAY[]::TEXT[],
    FALSE, 2, TRUE
  ),
  (
    'photovoltaic',
    'Installations Photovoltaïques',
    'Fotovoltaïsche Installaties',
    'Photovoltaic Installations',
    'Panneaux solaires avec ou sans batteries domestiques : nouvelles installations, extensions et mises à niveau de systèmes existants.',
    'Zonnepanelen met of zonder thuisbatterijen: nieuwe installaties, uitbreidingen en upgrades van bestaande systemen.',
    'Solar panels with or without home batteries: new systems, extensions and upgrades of existing installations.',
    'Sun',
    ARRAY['Nphase', 'SMA', 'GoodWe', 'SolarEdge', 'Enphase', 'Huawei'],
    FALSE, 3, TRUE
  ),
  (
    'ev-charging',
    'Bornes de Recharge VE',
    'EV-Laadstations',
    'EV Charging Stations',
    'Installation et mise en service de bornes de recharge pour véhicules électriques, résidentielles et professionnelles.',
    'Installatie en inbedrijfstelling van laadpalen voor elektrische voertuigen, voor particulieren en bedrijven.',
    'Installation and commissioning of electric vehicle charging stations for residential and commercial use.',
    'Plug',
    ARRAY['Zaptec', 'Easee', 'Wallbox'],
    FALSE, 4, TRUE
  ),
  (
    'maintenance',
    'Entretien, Maintenance & Dépannage',
    'Onderhoud, Preventief & Herstellingen',
    'Service, Maintenance & Repairs',
    'Entretien préventif, diagnostics, dépannage et réparations pour pompes à chaleur, électricité, photovoltaïque, batteries et bornes VE.',
    'Preventief onderhoud, diagnoses, depannage en herstellingen voor warmtepompen, elektriciteit, fotovoltaïsch, batterijen en laadstations.',
    'Preventive maintenance, diagnostics, troubleshooting and repairs for heat pumps, electrical systems, photovoltaic installations, batteries and EV charging stations.',
    'Wrench',
    ARRAY[]::TEXT[],
    FALSE, 5, TRUE
  )
ON CONFLICT (slug) DO UPDATE SET
  title_fr                  = EXCLUDED.title_fr,
  title_nl                  = EXCLUDED.title_nl,
  title_en                  = EXCLUDED.title_en,
  description_fr            = EXCLUDED.description_fr,
  description_nl            = EXCLUDED.description_nl,
  description_en            = EXCLUDED.description_en,
  icon_name                 = EXCLUDED.icon_name,
  brands                    = EXCLUDED.brands,
  show_customer_supply_note = EXCLUDED.show_customer_supply_note,
  display_order             = EXCLUDED.display_order,
  active                    = EXCLUDED.active,
  updated_at                = NOW();
