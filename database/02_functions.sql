-- ==========================================
-- 02_functions.sql
-- Docházkový systém - funkce
-- ==========================================


-- ==========================================
-- FUNCTION: my_employee_id
-- ==========================================

create or replace function public.my_employee_id()
returns bigint
language sql
security definer
set search_path = public
as $$
  select id
  from employees
  where auth_user_id = auth.uid()
  limit 1;
$$;


-- ==========================================
-- FUNCTION: is_admin
-- ==========================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(is_admin, false)
  from employees
  where auth_user_id = auth.uid()
  limit 1;
$$;


-- ==========================================
-- FUNCTION: is_current_admin
-- ==========================================

create or replace function public.is_current_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select public.is_admin();
$$;
