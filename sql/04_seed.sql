-- ==========================================
-- 04_seed.sql
-- Docházkový systém - výchozí data
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
  currency = excluded.currency,
  updated_at = now();

insert into public.offices (name, sort_order, active)
values
  ('Kancelář', 1, true),
  ('Home office', 2, true),
  ('Provoz', 3, true)
on conflict (name) do nothing;

/*
VOLITELNÉ: první admin záznam
--------------------------------
Po vytvoření uživatele v Supabase Auth se při prvním loginu employee
automaticky spáruje podle stejného e-mailu.

Odkomentuj a uprav podle potřeby:

insert into public.employees (
  name,
  email,
  role,
  is_admin,
  active,
  leave_days,
  leave_hours
)
values (
  'Admin',
  'admin@firma.cz',
  'admin',
  true,
  true,
  20,
  160
)
on conflict do nothing;
*/
