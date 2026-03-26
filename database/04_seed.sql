-- ==========================================
-- 04_seed.sql
-- Docházkový systém - výchozí data
-- ==========================================

-- Obsah:
-- - app_settings
-- - základní offices
-- - případně první admin setup


-- ==========================================
-- DEFAULT APP SETTINGS
-- ==========================================

insert into public.app_settings (
  id,
  app_name,
  company_name,
  logo_url,
  primary_color,
  support_email,
  timezone,
  currency
)
values (
  1,
  'Docházkový systém',
  'Moje firma',
  null,
  '#2563eb',
  null,
  'Europe/Prague',
  'CZK'
)
on conflict (id) do update
set
  app_name = excluded.app_name,
  company_name = excluded.company_name,
  logo_url = excluded.logo_url,
  primary_color = excluded.primary_color,
  support_email = excluded.support_email,
  timezone = excluded.timezone,
  currency = excluded.currency;


-- ==========================================
-- DEFAULT OFFICES
-- ==========================================

insert into public.offices (name, sort_order, active)
values
  ('Kancelář', 1, true),
  ('Home office', 2, true),
  ('Provoz', 3, true)
on conflict (name) do nothing;
