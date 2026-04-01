-- ==========================================
-- 02_functions.sql
-- Docházkový systém - funkce
-- ==========================================

-- ==========================================
-- HELPER: set_updated_at
-- ==========================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_app_settings_updated_at on public.app_settings;
create trigger trg_app_settings_updated_at
before update on public.app_settings
for each row
execute function public.set_updated_at();

drop trigger if exists trg_offices_updated_at on public.offices;
create trigger trg_offices_updated_at
before update on public.offices
for each row
execute function public.set_updated_at();

drop trigger if exists trg_employees_updated_at on public.employees;
create trigger trg_employees_updated_at
before update on public.employees
for each row
execute function public.set_updated_at();

drop trigger if exists trg_attendance_updated_at on public.attendance;
create trigger trg_attendance_updated_at
before update on public.attendance
for each row
execute function public.set_updated_at();

drop trigger if exists trg_attendance_month_locks_updated_at on public.attendance_month_locks;
create trigger trg_attendance_month_locks_updated_at
before update on public.attendance_month_locks
for each row
execute function public.set_updated_at();

drop trigger if exists trg_leaves_updated_at on public.leaves;
create trigger trg_leaves_updated_at
before update on public.leaves
for each row
execute function public.set_updated_at();

drop trigger if exists trg_leave_requests_updated_at on public.leave_requests;
create trigger trg_leave_requests_updated_at
before update on public.leave_requests
for each row
execute function public.set_updated_at();

-- ==========================================
-- HELPER: my_user_email
-- ==========================================

create or replace function public.my_user_email()
returns text
language sql
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

-- ==========================================
-- HELPER: my_employee_id
-- auto-link by email on first login
-- ==========================================

create or replace function public.my_employee_id()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employee_id bigint;
  v_email text;
begin
  select e.id
    into v_employee_id
  from public.employees e
  where e.auth_user_id = auth.uid()
  limit 1;

  if v_employee_id is not null then
    return v_employee_id;
  end if;

  v_email := public.my_user_email();

  if auth.uid() is not null and v_email <> '' then
    update public.employees
    set auth_user_id = auth.uid()
    where auth_user_id is null
      and lower(email) = v_email;

    select e.id
      into v_employee_id
    from public.employees e
    where e.auth_user_id = auth.uid()
    limit 1;
  end if;

  return v_employee_id;
end;
$$;

-- ==========================================
-- HELPER: is_admin / is_current_admin
-- ==========================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.employees e
    where e.id = public.my_employee_id()
      and e.active = true
      and (e.is_admin = true or e.role = 'admin')
  );
$$;

create or replace function public.is_current_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select public.is_admin();
$$;

-- ==========================================
-- HELPER: get_app_settings
-- ==========================================

create or replace function public.get_app_settings()
returns table (
  app_name text,
  company_name text,
  logo_url text,
  primary_color text,
  support_email text,
  timezone text,
  currency text
)
language sql
security definer
set search_path = public
as $$
  select
    s.app_name,
    s.company_name,
    s.logo_url,
    s.primary_color,
    s.support_email,
    s.timezone,
    s.currency
  from public.app_settings s
  where s.id = 1
  limit 1;
$$;

-- ==========================================
-- HELPER: attendance overlap
-- ==========================================

create or replace function public.attendance_overlap_exists(
  p_employee_id bigint,
  p_date date,
  p_time_from time,
  p_time_to time default null,
  p_exclude_attendance_id bigint default null
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.attendance a
    where a.employee_id = p_employee_id
      and a.date = p_date
      and (p_exclude_attendance_id is null or a.id <> p_exclude_attendance_id)
      and a.time_from is not null
      and p_time_from is not null
      and greatest(a.time_from, p_time_from)
          < least(coalesce(a.time_to, time '23:59:59'), coalesce(p_time_to, time '23:59:59'))
  );
$$;

-- ==========================================
-- HELPER: get employee profile
-- ==========================================

create or replace function public.get_my_employee_profile()
returns table (
  id bigint,
  name text,
  email text,
  role text,
  is_admin boolean,
  active boolean,
  auth_user_id uuid,
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
    e.auth_user_id,
    e.offices,
    e.weekly,
    e.leave_days,
    e.leave_hours
  from public.employees e
  where e.id = public.my_employee_id()
  limit 1;
$$;

-- ==========================================
-- HELPER: month lock
-- ==========================================

create or replace function public.is_attendance_month_locked(
  p_month text
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce((
    select l.locked
    from public.attendance_month_locks l
    where l.month = p_month
    limit 1
  ), false);
$$;

create or replace function public.set_attendance_month_lock(
  p_month text,
  p_locked boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může měnit uzávěrku';
  end if;

  insert into public.attendance_month_locks (month, locked)
  values (p_month, coalesce(p_locked, false))
  on conflict (month) do update
  set locked = excluded.locked,
      updated_at = now();
end;
$$;

-- ==========================================
-- HELPER: write attendance audit
-- ==========================================

create or replace function public.write_attendance_audit(
  p_action text,
  p_old_data jsonb default null,
  p_new_data jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employee_name text;
begin
  select e.name
    into v_employee_name
  from public.employees e
  where e.id = public.my_employee_id()
  limit 1;

  insert into public.attendance_audit (
    employee_name,
    action,
    old_data,
    new_data
  )
  values (
    coalesce(v_employee_name, 'Neznámý uživatel'),
    p_action,
    p_old_data,
    p_new_data
  );
end;
$$;

-- ==========================================
-- CHECKERS: check-in / check-out
-- ==========================================

create or replace function public.can_check_in()
returns table (
  ok boolean,
  message text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employee_id bigint;
begin
  v_employee_id := public.my_employee_id();

  if v_employee_id is null then
    return query select false, 'Uživatel není spárován s employees';
    return;
  end if;

  if exists (
    select 1
    from public.attendance
    where employee_id = v_employee_id
      and time_to is null
  ) then
    return query select false, 'Máš otevřenou směnu. Nejdřív zapiš odchod.';
    return;
  end if;

  return query select true, 'OK';
end;
$$;

create or replace function public.can_check_out()
returns table (
  ok boolean,
  message text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employee_id bigint;
begin
  v_employee_id := public.my_employee_id();

  if v_employee_id is null then
    return query select false, 'Uživatel není spárován s employees';
    return;
  end if;

  if not exists (
    select 1
    from public.attendance
    where employee_id = v_employee_id
      and time_to is null
  ) then
    return query select false, 'Nemáš otevřenou směnu. Nejdřív zapiš příchod.';
    return;
  end if;

  return query select true, 'OK';
end;
$$;

-- ==========================================
-- RPC: check in / check out
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
-- EMPLOYEE: manual attendance
-- ==========================================

create or replace function public.can_create_my_manual_attendance(
  p_date date,
  p_type text,
  p_time_from text,
  p_time_to text default null
)
returns table (
  ok boolean,
  message text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employee_id bigint;
  v_time_from time;
  v_time_to time;
begin
  v_employee_id := public.my_employee_id();

  if v_employee_id is null then
    return query select false, 'Uživatel není spárován s employees';
    return;
  end if;

  if p_date is null then
    return query select false, 'Vyplň datum.';
    return;
  end if;

  if p_type <> 'dovolená' and (p_time_from is null or btrim(p_time_from) = '') then
    return query select false, 'Vyplň čas od.';
    return;
  end if;

  v_time_from := case when p_time_from is null or btrim(p_time_from) = '' then null else p_time_from::time end;
  v_time_to := case when p_time_to is null or btrim(p_time_to) = '' then null else p_time_to::time end;

  if v_time_from is not null and v_time_to is not null and v_time_to <= v_time_from then
    return query select false, 'Čas do musí být později než čas od.';
    return;
  end if;

  if public.attendance_overlap_exists(v_employee_id, p_date, v_time_from, v_time_to, null) then
    return query select false, 'Záznam se překrývá s jinou docházkou v tomto dni.';
    return;
  end if;

  return query select true, 'OK';
end;
$$;

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
    case when p_time_from is null or btrim(p_time_from) = '' then null else p_time_from::time end,
    case when p_time_to is null or btrim(p_time_to) = '' then null else p_time_to::time end,
    p_office,
    p_type,
    coalesce(p_break_minutes, 0)
  );
end;
$$;

-- ==========================================
-- ADMIN: attendance insert/update/delete
-- ==========================================

create or replace function public.can_admin_insert_attendance(
  p_employee_id bigint,
  p_date date,
  p_type text,
  p_time_from text,
  p_time_to text default null
)
returns table (
  ok boolean,
  message text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_time_from time;
  v_time_to time;
begin
  if not public.is_current_admin() then
    return query select false, 'Pouze admin může vložit docházku.';
    return;
  end if;

  if p_employee_id is null or p_date is null then
    return query select false, 'Vyber zaměstnance a datum.';
    return;
  end if;

  if p_type <> 'dovolená' and (p_time_from is null or btrim(p_time_from) = '') then
    return query select false, 'Vyplň čas od.';
    return;
  end if;

  v_time_from := case when p_time_from is null or btrim(p_time_from) = '' then null else p_time_from::time end;
  v_time_to := case when p_time_to is null or btrim(p_time_to) = '' then null else p_time_to::time end;

  if v_time_from is not null and v_time_to is not null and v_time_to <= v_time_from then
    return query select false, 'Čas do musí být později než čas od.';
    return;
  end if;

  if public.attendance_overlap_exists(p_employee_id, p_date, v_time_from, v_time_to, null) then
    return query select false, 'Záznam se překrývá s jinou docházkou v tomto dni.';
    return;
  end if;

  return query select true, 'OK';
end;
$$;

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
  v_new_row public.attendance%rowtype;
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
    case when p_time_from is null or btrim(p_time_from) = '' then null else p_time_from::time end,
    case when p_time_to is null or btrim(p_time_to) = '' then null else p_time_to::time end,
    v_office_name,
    p_type,
    coalesce(p_break_minutes, 0)
  )
  returning * into v_new_row;

  perform public.write_attendance_audit(
    'admin_insert_attendance',
    null,
    to_jsonb(v_new_row)
  );
end;
$$;

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
  v_old_row public.attendance%rowtype;
  v_new_row public.attendance%rowtype;
  v_office_name text;
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může upravit docházku';
  end if;

  select *
    into v_old_row
  from public.attendance
  where id = p_attendance_id
  limit 1;

  if v_old_row.id is null then
    raise exception 'Docházka nebyla nalezena';
  end if;

  select name
    into v_office_name
  from public.offices
  where id = p_office_id
  limit 1;

  if v_office_name is null then
    raise exception 'Office nebyl nalezen';
  end if;

  if public.attendance_overlap_exists(
    v_old_row.employee_id,
    p_date,
    case when p_time_from is null or btrim(p_time_from) = '' then null else p_time_from::time end,
    case when p_time_to is null or btrim(p_time_to) = '' then null else p_time_to::time end,
    p_attendance_id
  ) then
    raise exception 'Záznam se překrývá s jinou docházkou v tomto dni.';
  end if;

  update public.attendance
  set
    date = p_date,
    time_from = case when p_time_from is null or btrim(p_time_from) = '' then null else p_time_from::time end,
    time_to = case when p_time_to is null or btrim(p_time_to) = '' then null else p_time_to::time end,
    office = v_office_name,
    type = p_type,
    break_minutes = coalesce(p_break_minutes, 0)
  where id = p_attendance_id
  returning * into v_new_row;

  perform public.write_attendance_audit(
    'admin_update_attendance',
    to_jsonb(v_old_row),
    to_jsonb(v_new_row)
  );
end;
$$;

create or replace function public.admin_delete_attendance(
  p_attendance_id bigint
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_row public.attendance%rowtype;
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může smazat docházku';
  end if;

  select *
    into v_old_row
  from public.attendance
  where id = p_attendance_id
  limit 1;

  if v_old_row.id is null then
    raise exception 'Docházka nebyla nalezena';
  end if;

  delete from public.attendance
  where id = p_attendance_id;

  perform public.write_attendance_audit(
    'admin_delete_attendance',
    to_jsonb(v_old_row),
    null
  );
end;
$$;

-- ==========================================
-- ADMIN: employees
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
declare
  v_role text;
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může vytvořit zaměstnance';
  end if;

  v_role := case when coalesce(p_role, 'employee') = 'admin' then 'admin' else 'employee' end;

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
    v_role,
    p_offices,
    p_weekly,
    coalesce(p_leave_days, 20),
    coalesce(p_leave_hours, 160),
    (v_role = 'admin'),
    true
  );
end;
$$;

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
declare
  v_role text;
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může upravit zaměstnance';
  end if;

  v_role := case when coalesce(p_role, 'employee') = 'admin' then 'admin' else 'employee' end;

  update public.employees
  set
    name = p_name,
    email = lower(p_email),
    role = v_role,
    offices = p_offices,
    weekly = p_weekly,
    leave_days = coalesce(p_leave_days, 20),
    leave_hours = coalesce(p_leave_hours, 160),
    is_admin = (v_role = 'admin'),
    active = coalesce(p_active, true)
  where id = p_id;

  if not found then
    raise exception 'Zaměstnanec nebyl nalezen';
  end if;
end;
$$;

-- ==========================================
-- ADMIN: offices
-- ==========================================

create or replace function public.admin_create_office(
  p_name text,
  p_sort_order integer default 0
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může vytvořit místo';
  end if;

  insert into public.offices (name, sort_order, active)
  values (p_name, coalesce(p_sort_order, 0), true);
end;
$$;

create or replace function public.admin_update_office(
  p_id bigint,
  p_name text,
  p_sort_order integer default 0,
  p_active boolean default true
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může upravit místo';
  end if;

  update public.offices
  set
    name = p_name,
    sort_order = coalesce(p_sort_order, 0),
    active = coalesce(p_active, true)
  where id = p_id;

  if not found then
    raise exception 'Místo nebylo nalezeno';
  end if;
end;
$$;

-- ==========================================
-- EMPLOYEE / ADMIN: leave requests and leaves
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
  v_days integer;
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

  v_days := (v_date_to - v_date_from) + 1;

  update public.leave_requests
  set status = 'approved'
  where id = p_request_id;

  insert into public.leaves (
    employee_id,
    date_from,
    date_to,
    days,
    hours,
    type,
    note
  )
  values (
    v_employee_id,
    v_date_from,
    v_date_to,
    v_days,
    coalesce(v_hours, 8),
    'vacation',
    v_note
  );
end;
$$;

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

create or replace function public.cancel_approved_leave_request(
  p_request_id bigint
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může stornovat schválenou dovolenou';
  end if;

  update public.leave_requests
  set status = 'cancelled'
  where id = p_request_id
    and status = 'approved';

  if not found then
    raise exception 'Žádost nebyla nalezena nebo není schválená';
  end if;

  delete from public.leaves
  where employee_id = (
      select employee_id from public.leave_requests where id = p_request_id
    )
    and date_from = (
      select date_from from public.leave_requests where id = p_request_id
    )
    and date_to = (
      select date_to from public.leave_requests where id = p_request_id
    )
    and type = 'vacation';
end;
$$;

create or replace function public.admin_create_leave(
  p_employee_id bigint,
  p_date date,
  p_hours integer,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_admin() then
    raise exception 'Pouze admin může zapsat dovolenou';
  end if;

  insert into public.leaves (
    employee_id,
    date_from,
    date_to,
    days,
    hours,
    type,
    note
  )
  values (
    p_employee_id,
    p_date,
    p_date,
    1,
    coalesce(p_hours, 8),
    'vacation',
    p_note
  );
end;
$$;

create or replace function public.get_my_leave_summary()
returns table (
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
  with emp as (
    select e.id, e.leave_days, e.leave_hours
    from public.employees e
    where e.id = public.my_employee_id()
  ),
  used_leave as (
    select coalesce(sum(l.days * l.hours), 0)::numeric as used_hours
    from public.leaves l
    where l.employee_id = public.my_employee_id()
      and l.type = 'vacation'
  )
  select
    emp.leave_days as leave_days_total,
    emp.leave_hours as leave_hours_total,
    used_leave.used_hours as leave_hours_used,
    (emp.leave_hours - used_leave.used_hours) as leave_hours_remaining,
    case
      when emp.leave_hours = 0 then 0::numeric
      else round((emp.leave_days::numeric * (emp.leave_hours - used_leave.used_hours)) / emp.leave_hours::numeric, 2)
    end as leave_days_remaining
  from emp, used_leave;
$$;

-- ==========================================
-- READ: attendance / history / audit / offices
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

create or replace function public.get_attendance_by_month(
  p_employee_id bigint,
  p_month text
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
  where public.is_current_admin()
    and a.employee_id = p_employee_id
    and to_char(a.date, 'YYYY-MM') = p_month
  order by a.date desc, a.id desc;
$$;

create or replace function public.get_attendance_audit_by_month(
  p_month text
)
returns table (
  changed_at timestamptz,
  employee_name text,
  action text,
  old_data jsonb,
  new_data jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    a.changed_at,
    a.employee_name,
    a.action,
    a.old_data,
    a.new_data
  from public.attendance_audit a
  where public.is_current_admin()
    and to_char(a.changed_at::date, 'YYYY-MM') = p_month
  order by a.changed_at desc;
$$;

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
  order by o.sort_order asc, o.name asc;
$$;

-- ==========================================
-- READ: admin employees / attendance / dashboard
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

create or replace function public.get_admin_dashboard_summary()
returns table (
  total_employees bigint,
  at_work_count bigint,
  home_office_count bigint,
  business_trip_count bigint,
  on_leave_count bigint
)
language sql
security definer
set search_path = public
as $$
  with today_att as (
    select *
    from public.attendance
    where date = current_date
  ),
  leave_today as (
    select distinct l.employee_id
    from public.leaves l
    where l.type = 'vacation'
      and current_date between l.date_from and l.date_to
  )
  select
    (select count(*) from public.employees e where e.active = true) as total_employees,
    (select count(distinct a.employee_id) from today_att a where lower(coalesce(a.type, '')) in ('práce', 'work')) as at_work_count,
    (select count(distinct a.employee_id) from today_att a where lower(coalesce(a.type, '')) in ('home office', 'homeoffice')) as home_office_count,
    (select count(distinct a.employee_id) from today_att a where lower(coalesce(a.type, '')) in ('služební cesta', 'sluzebni cesta', 'business trip', 'trip')) as business_trip_count,
    (select count(*) from leave_today) as on_leave_count
  where public.is_current_admin();
$$;

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
    coalesce(sum(l.days * l.hours), 0)::numeric as leave_hours_used,
    (e.leave_hours - coalesce(sum(l.days * l.hours), 0))::numeric as leave_hours_remaining,
    case
      when coalesce(e.leave_hours, 0) = 0 then 0::numeric
      else round((e.leave_days::numeric * (e.leave_hours - coalesce(sum(l.days * l.hours), 0))::numeric) / e.leave_hours::numeric, 2)
    end as leave_days_remaining
  from public.employees e
  left join public.leaves l on l.employee_id = e.id and l.type = 'vacation'
  where public.is_current_admin()
  group by e.id, e.name, e.email, e.leave_days, e.leave_hours
  order by e.name asc;
$$;

create or replace function public.get_leave_requests()
returns table (
  id bigint,
  employee_id bigint,
  employee_name text,
  employee_email text,
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
    e.email as employee_email,
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
-- READ: monthly summary
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
        when a.time_from is not null and a.time_to is not null then
          greatest(
            extract(epoch from (a.time_to - a.time_from)) / 3600.0 - coalesce(a.break_minutes, 0) / 60.0,
            0
          )
        else 0
      end as worked_hours
    from public.attendance a
    join public.employees e on e.id = a.employee_id
    where public.is_current_admin()
      and to_char(a.date, 'YYYY-MM') = p_month
  ),
  attendance_group as (
    select
      employee_id,
      employee_name,
      round(sum(case when type_normalized in ('práce', 'prace', 'work') then worked_hours else 0 end)::numeric, 2) as work_hours,
      round(sum(case when type_normalized in ('home office', 'homeoffice') then worked_hours else 0 end)::numeric, 2) as home_office_hours,
      round(sum(case when type_normalized in ('nemoc', 'sick') then worked_hours else 0 end)::numeric, 2) as sick_hours,
      round(sum(case when type_normalized in ('služební cesta', 'sluzebni cesta', 'business trip', 'trip') then worked_hours else 0 end)::numeric, 2) as business_trip_hours,
      count(distinct case when worked_hours > 0 then date end)::integer as work_days
    from attendance_calc
    group by employee_id, employee_name
  ),
  leave_group as (
    select
      l.employee_id,
      round(sum(
        (
          least(l.date_to, (to_date(p_month || '-01', 'YYYY-MM-DD') + interval '1 month - 1 day')::date)
          - greatest(l.date_from, to_date(p_month || '-01', 'YYYY-MM-DD'))
          + 1
        ) * l.hours
      )::numeric, 2) as vacation_hours
    from public.leaves l
    where public.is_current_admin()
      and l.type = 'vacation'
      and l.date_from <= (to_date(p_month || '-01', 'YYYY-MM-DD') + interval '1 month - 1 day')::date
      and l.date_to >= to_date(p_month || '-01', 'YYYY-MM-DD')
    group by l.employee_id
  )
  select
    e.id as employee_id,
    e.name as employee_name,
    coalesce(a.work_hours, 0)::numeric as work_hours,
    coalesce(l.vacation_hours, 0)::numeric as vacation_hours,
    coalesce(a.home_office_hours, 0)::numeric as home_office_hours,
    coalesce(a.sick_hours, 0)::numeric as sick_hours,
    coalesce(a.business_trip_hours, 0)::numeric as business_trip_hours,
    (
      coalesce(a.work_hours, 0)
      + coalesce(l.vacation_hours, 0)
      + coalesce(a.home_office_hours, 0)
      + coalesce(a.sick_hours, 0)
      + coalesce(a.business_trip_hours, 0)
    )::numeric as total_hours,
    coalesce(a.work_days, 0)::integer as work_days
  from public.employees e
  left join attendance_group a on a.employee_id = e.id
  left join leave_group l on l.employee_id = e.id
  where public.is_current_admin()
  order by e.name asc;
$$;
