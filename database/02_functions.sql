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


-- ==========================================
-- FUNCTION: rpc_check_in
-- ==========================================

create or replace function public.rpc_check_in(
  p_office text,
  p_type text,
  p_break_minutes integer default 0
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employee_id bigint;
begin
  v_employee_id := public.my_employee_id();

  if v_employee_id is null then
    raise exception 'Uživatel není spárován s employees';
  end if;

  if exists (
    select 1
    from public.attendance
    where employee_id = v_employee_id
      and date = current_date
      and time_to is null
  ) then
    raise exception 'Uživatel už má otevřenou směnu';
  end if;

  insert into public.attendance (
    employee_id,
    date,
    time_from,
    office,
    type,
    break_minutes
  )
  values (
    v_employee_id,
    current_date,
    localtime(0),
    p_office,
    p_type,
    coalesce(p_break_minutes, 0)
  );
end;
$$;


-- ==========================================
-- FUNCTION: rpc_check_out
-- ==========================================

create or replace function public.rpc_check_out(
  p_office text,
  p_type text,
  p_break_minutes integer default 0
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employee_id bigint;
  v_attendance_id bigint;
begin
  v_employee_id := public.my_employee_id();

  if v_employee_id is null then
    raise exception 'Uživatel není spárován s employees';
  end if;

  select id
    into v_attendance_id
  from public.attendance
  where employee_id = v_employee_id
    and date = current_date
    and time_to is null
  order by id desc
  limit 1;

  if v_attendance_id is null then
    raise exception 'Nebyla nalezena otevřená směna';
  end if;

  update public.attendance
  set
    time_to = localtime(0),
    office = coalesce(p_office, office),
    type = coalesce(p_type, type),
    break_minutes = coalesce(p_break_minutes, break_minutes)
  where id = v_attendance_id;
end;
$$;


-- ==========================================
-- FUNCTION: create_my_attendance_manual
-- ==========================================

create or replace function public.create_my_attendance_manual(
  p_date date,
  p_office text,
  p_type text,
  p_time_from text,
  p_time_to text default null,
  p_break_minutes integer default 0
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employee_id bigint;
begin
  v_employee_id := public.my_employee_id();

  if v_employee_id is null then
    raise exception 'Uživatel není spárován s employees';
  end if;

  insert into public.attendance (
    employee_id,
    date,
    time_from,
    time_to,
    office,
    type,
    break_minutes
  )
  values (
    v_employee_id,
    p_date,
    p_time_from::time,
    case
      when p_time_to is null or btrim(p_time_to) = '' then null
      else p_time_to::time
    end,
    p_office,
    p_type,
    coalesce(p_break_minutes, 0)
  );
end;
$$;
