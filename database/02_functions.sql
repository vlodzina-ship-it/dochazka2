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


-- ==========================================
-- FUNCTION: admin_insert_attendance
-- ==========================================

create or replace function public.admin_insert_attendance(
  p_employee_id bigint,
  p_date date,
  p_office_id bigint,
  p_type text,
  p_time_from text default null,
  p_time_to text default null,
  p_break_minutes integer default 0
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_office_name text;
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může vložit docházku';
  end if;

  select name
    into v_office_name
  from public.offices
  where id = p_office_id
  limit 1;

  if v_office_name is null then
    raise exception 'Office nebyl nalezen';
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
    p_employee_id,
    p_date,
    case
      when p_time_from is null or btrim(p_time_from) = '' then null
      else p_time_from::time
    end,
    case
      when p_time_to is null or btrim(p_time_to) = '' then null
      else p_time_to::time
    end,
    v_office_name,
    p_type,
    coalesce(p_break_minutes, 0)
  );
end;
$$;


-- ==========================================
-- FUNCTION: admin_update_attendance
-- ==========================================

create or replace function public.admin_update_attendance(
  p_attendance_id bigint,
  p_date date,
  p_office_id bigint,
  p_type text,
  p_time_from text default null,
  p_time_to text default null,
  p_break_minutes integer default 0
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_office_name text;
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může upravit docházku';
  end if;

  select name
    into v_office_name
  from public.offices
  where id = p_office_id
  limit 1;

  if v_office_name is null then
    raise exception 'Office nebyl nalezen';
  end if;

  update public.attendance
  set
    date = p_date,
    time_from = case
      when p_time_from is null or btrim(p_time_from) = '' then null
      else p_time_from::time
    end,
    time_to = case
      when p_time_to is null or btrim(p_time_to) = '' then null
      else p_time_to::time
    end,
    office = v_office_name,
    type = p_type,
    break_minutes = coalesce(p_break_minutes, 0)
  where id = p_attendance_id;

  if not found then
    raise exception 'Docházka nebyla nalezena';
  end if;
end;
$$;


-- ==========================================
-- FUNCTION: admin_delete_attendance
-- ==========================================

create or replace function public.admin_delete_attendance(
  p_attendance_id bigint
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může smazat docházku';
  end if;

  delete from public.attendance
  where id = p_attendance_id;

  if not found then
    raise exception 'Docházka nebyla nalezena';
  end if;
end;
$$;


-- ==========================================
-- FUNCTION: admin_create_employee
-- ==========================================

create or replace function public.admin_create_employee(
  p_name text,
  p_email text,
  p_role text default 'employee',
  p_offices text default null,
  p_weekly text default null,
  p_leave_days integer default 20,
  p_leave_hours integer default 160
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může vytvořit zaměstnance';
  end if;

  insert into public.employees (
    name,
    email,
    role,
    offices,
    weekly,
    leave_days,
    leave_hours,
    is_admin,
    active
  )
  values (
    p_name,
    lower(p_email),
    coalesce(p_role, 'employee'),
    p_offices,
    p_weekly,
    coalesce(p_leave_days, 20),
    coalesce(p_leave_hours, 160),
    case when coalesce(p_role, 'employee') = 'admin' then true else false end,
    true
  );
end;
$$;


-- ==========================================
-- FUNCTION: admin_update_employee
-- ==========================================

create or replace function public.admin_update_employee(
  p_id bigint,
  p_name text,
  p_email text,
  p_role text,
  p_offices text default null,
  p_weekly text default null,
  p_leave_days integer default 20,
  p_leave_hours integer default 160,
  p_active boolean default true
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může upravit zaměstnance';
  end if;

  update public.employees
  set
    name = p_name,
    email = lower(p_email),
    role = coalesce(p_role, 'employee'),
    offices = p_offices,
    weekly = p_weekly,
    leave_days = coalesce(p_leave_days, 20),
    leave_hours = coalesce(p_leave_hours, 160),
    is_admin = case when coalesce(p_role, 'employee') = 'admin' then true else false end,
    active = coalesce(p_active, true)
  where id = p_id;

  if not found then
    raise exception 'Zaměstnanec nebyl nalezen';
  end if;
end;
$$;


-- ==========================================
-- FUNCTION: create_leave_request
-- ==========================================

create or replace function public.create_leave_request(
  p_date_from date,
  p_date_to date,
  p_hours integer,
  p_note text default null
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

  if p_date_from is null or p_date_to is null then
    raise exception 'Datum od a do je povinné';
  end if;

  if p_date_from > p_date_to then
    raise exception 'Datum od nesmí být větší než datum do';
  end if;

  insert into public.leave_requests (
    employee_id,
    date_from,
    date_to,
    hours,
    note,
    status
  )
  values (
    v_employee_id,
    p_date_from,
    p_date_to,
    coalesce(p_hours, 8),
    p_note,
    'pending'
  );
end;
$$;


-- ==========================================
-- FUNCTION: approve_leave_request
-- ==========================================

create or replace function public.approve_leave_request(
  p_request_id bigint
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employee_id bigint;
  v_date_from date;
  v_date_to date;
  v_hours integer;
  v_note text;
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může schválit dovolenou';
  end if;

  select employee_id, date_from, date_to, hours, note
    into v_employee_id, v_date_from, v_date_to, v_hours, v_note
  from public.leave_requests
  where id = p_request_id
    and status = 'pending'
  limit 1;

  if v_employee_id is null then
    raise exception 'Žádost nebyla nalezena nebo není ve stavu pending';
  end if;

  update public.leave_requests
  set status = 'approved'
  where id = p_request_id;

  insert into public.leaves (
    employee_id,
    date_from,
    date_to,
    hours,
    type,
    note
  )
  values (
    v_employee_id,
    v_date_from,
    v_date_to,
    coalesce(v_hours, 8),
    'vacation',
    v_note
  );
end;
$$;


-- ==========================================
-- FUNCTION: reject_leave_request
-- ==========================================

create or replace function public.reject_leave_request(
  p_request_id bigint
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může zamítnout dovolenou';
  end if;

  update public.leave_requests
  set status = 'rejected'
  where id = p_request_id
    and status = 'pending';

  if not found then
    raise exception 'Žádost nebyla nalezena nebo není ve stavu pending';
  end if;
end;
$$;


-- ==========================================
-- FUNCTION: cancel_approved_leave_request
-- ==========================================

create or replace function public.cancel_approved_leave_request(
  p_request_id bigint
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employee_id bigint;
  v_date_from date;
  v_date_to date;
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může stornovat schválenou dovolenou';
  end if;

  select employee_id, date_from, date_to
    into v_employee_id, v_date_from, v_date_to
  from public.leave_requests
  where id = p_request_id
    and status = 'approved'
  limit 1;

  if v_employee_id is null then
    raise exception 'Žádost nebyla nalezena nebo není schválená';
  end if;

  update public.leave_requests
  set status = 'cancelled'
  where id = p_request_id;

  delete from public.leaves
  where employee_id = v_employee_id
    and date_from = v_date_from
    and date_to = v_date_to;
end;
$$;


-- ==========================================
-- FUNCTION: get_my_employee_profile
-- ==========================================

create or replace function public.get_my_employee_profile()
returns table (
  id bigint,
  name text,
  weekly text,
  leave_days integer,
  leave_hours integer,
  offices text,
  email text,
  auth_user_id uuid,
  is_admin boolean,
  active boolean,
  role text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    e.id,
    e.name,
    e.weekly,
    e.leave_days,
    e.leave_hours,
    e.offices,
    e.email,
    e.auth_user_id,
    e.is_admin,
    e.active,
    e.role,
    e.created_at
  from public.employees e
  where e.auth_user_id = auth.uid()
  limit 1;
$$;


-- ==========================================
-- FUNCTION: get_my_attendance_rows
-- ==========================================

create or replace function public.get_my_attendance_rows(
  p_limit integer default 30
)
returns table (
  id bigint,
  employee_id bigint,
  date date,
  time_from time,
  time_to time,
  office text,
  type text,
  break_minutes integer,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    a.id,
    a.employee_id,
    a.date,
    a.time_from,
    a.time_to,
    a.office,
    a.type,
    a.break_minutes,
    a.created_at
  from public.attendance a
  where a.employee_id = public.my_employee_id()
  order by a.date desc, a.id desc
  limit coalesce(p_limit, 30);
$$;


-- ==========================================
-- FUNCTION: get_offices
-- ==========================================

create or replace function public.get_offices()
returns table (
  id bigint,
  name text,
  sort_order integer,
  active boolean
)
language sql
security definer
set search_path = public
as $$
  select
    o.id,
    o.name,
    o.sort_order,
    o.active
  from public.offices o
  where o.active = true
  order by o.sort_order asc, o.name asc;
$$;


-- ==========================================
-- FUNCTION: get_admin_employees
-- ==========================================

create or replace function public.get_admin_employees()
returns table (
  id bigint,
  name text,
  email text,
  role text,
  is_admin boolean,
  active boolean,
  offices text,
  weekly text,
  leave_days integer,
  leave_hours integer
)
language sql
security definer
set search_path = public
as $$
  select
    e.id,
    e.name,
    e.email,
    e.role,
    e.is_admin,
    e.active,
    e.offices,
    e.weekly,
    e.leave_days,
    e.leave_hours
  from public.employees e
  where public.is_current_admin()
  order by e.name asc;
$$;


-- ==========================================
-- FUNCTION: get_admin_today_attendance
-- ==========================================

create or replace function public.get_admin_today_attendance()
returns table (
  id bigint,
  employee_id bigint,
  employee_name text,
  date date,
  office text,
  type text,
  time_from time,
  time_to time,
  break_minutes integer
)
language sql
security definer
set search_path = public
as $$
  select
    a.id,
    a.employee_id,
    e.name as employee_name,
    a.date,
    a.office,
    a.type,
    a.time_from,
    a.time_to,
    a.break_minutes
  from public.attendance a
  join public.employees e on e.id = a.employee_id
  where public.is_current_admin()
    and a.date = current_date
  order by e.name asc, a.time_from asc nulls last;
$$;


-- ==========================================
-- FUNCTION: get_admin_today_locations
-- ==========================================

create or replace function public.get_admin_today_locations()
returns table (
  employee_id bigint,
  employee_name text,
  employee_email text,
  office text,
  type text,
  time_from time
)
language sql
security definer
set search_path = public
as $$
  select
    a.employee_id,
    e.name as employee_name,
    e.email as employee_email,
    a.office,
    a.type,
    a.time_from
  from public.attendance a
  join public.employees e on e.id = a.employee_id
  where public.is_current_admin()
    and a.date = current_date
    and a.time_to is null
  order by e.name asc;
$$;


-- ==========================================
-- FUNCTION: get_admin_leave_summary
-- ==========================================

create or replace function public.get_admin_leave_summary()
returns table (
  employee_id bigint,
  employee_name text,
  employee_email text,
  leave_days_total integer,
  leave_hours_total integer,
  leave_hours_used numeric,
  leave_hours_remaining numeric,
  leave_days_remaining numeric
)
language sql
security definer
set search_path = public
as $$
  select
    e.id as employee_id,
    e.name as employee_name,
    e.email as employee_email,
    e.leave_days as leave_days_total,
    e.leave_hours as leave_hours_total,
    coalesce(sum(l.hours), 0)::numeric as leave_hours_used,
    (e.leave_hours - coalesce(sum(l.hours), 0))::numeric as leave_hours_remaining,
    case
      when coalesce(e.leave_hours, 0) = 0 then 0::numeric
      else round((e.leave_days::numeric * (e.leave_hours - coalesce(sum(l.hours), 0))::numeric) / e.leave_hours::numeric, 2)
    end as leave_days_remaining
  from public.employees e
  left join public.leaves l on l.employee_id = e.id
  where public.is_current_admin()
  group by e.id, e.name, e.email, e.leave_days, e.leave_hours
  order by e.name asc;
$$;


-- ==========================================
-- FUNCTION: get_leave_requests
-- ==========================================

create or replace function public.get_leave_requests()
returns table (
  id bigint,
  employee_id bigint,
  employee_name text,
  date_from date,
  date_to date,
  hours integer,
  note text,
  status text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    r.id,
    r.employee_id,
    e.name as employee_name,
    r.date_from,
    r.date_to,
    r.hours,
    r.note,
    r.status,
    r.created_at
  from public.leave_requests r
  join public.employees e on e.id = r.employee_id
  where public.is_current_admin()
  order by r.id desc;
$$;


-- ==========================================
-- FUNCTION: get_monthly_summary
-- ==========================================

create or replace function public.get_monthly_summary(
  p_month text
)
returns table (
  employee_id bigint,
  employee_name text,
  work_hours numeric,
  vacation_hours numeric,
  home_office_hours numeric,
  sick_hours numeric,
  business_trip_hours numeric,
  total_hours numeric,
  work_days integer
)
language sql
security definer
set search_path = public
as $$
  with attendance_calc as (
    select
      a.employee_id,
      e.name as employee_name,
      a.date,
      lower(coalesce(a.type, '')) as type_normalized,
      case
        when a.time_from is not null and a.time_to is not null
          then greatest(
            extract(epoch from (a.time_to - a.time_from)) / 3600.0 - coalesce(a.break_minutes, 0) / 60.0,
            0
          )
        else 0
      end as worked_hours
    from public.attendance a
    join public.employees e on e.id = a.employee_id
    where public.is_current_admin()
      and to_char(a.date, 'YYYY-MM') = p_month
  )
  select
    employee_id,
    employee_name,
    round(sum(case when type_normalized in ('práce', 'prace', 'work') then worked_hours else 0 end)::numeric, 2) as work_hours,
    round(sum(case when type_normalized in ('dovolená', 'dovolena', 'vacation', 'leave') then coalesce(worked_hours, 0) else 0 end)::numeric, 2) as vacation_hours,
    round(sum(case when type_normalized in ('home office', 'homeoffice') then worked_hours else 0 end)::numeric, 2) as home_office_hours,
    round(sum(case when type_normalized in ('nemoc', 'sick') then worked_hours else 0 end)::numeric, 2) as sick_hours,
    round(sum(case when type_normalized in ('služební cesta', 'sluzebni cesta', 'business trip', 'trip') then worked_hours else 0 end)::numeric, 2) as business_trip_hours,
    round(sum(worked_hours)::numeric, 2) as total_hours,
    count(distinct case when worked_hours > 0 then date end)::integer as work_days
  from attendance_calc
  group by employee_id, employee_name
  order by employee_name asc;
$$;
