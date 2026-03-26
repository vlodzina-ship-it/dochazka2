-- ==========================================
-- 03_policies.sql
-- Docházkový systém - RLS a policies
-- ==========================================

-- Obsah:
-- - enable row level security
-- - create policy


-- ==========================================
-- ENABLE RLS
-- ==========================================

alter table public.app_settings enable row level security;
alter table public.employees enable row level security;
alter table public.attendance enable row level security;
alter table public.leaves enable row level security;
alter table public.leave_requests enable row level security;
alter table public.offices enable row level security;
alter table public.attendance_audit enable row level security;
alter table public.attendance_month_locks enable row level security;


-- ==========================================
-- DROP EXISTING POLICIES (safe re-run)
-- ==========================================

do $$
declare
    r record;
begin
    for r in
        select tablename, policyname
        from pg_policies
        where schemaname = 'public'
          and tablename in (
            'app_settings',
            'employees',
            'attendance',
            'leaves',
            'leave_requests',
            'offices',
            'attendance_audit',
            'attendance_month_locks'
          )
    loop
        execute format(
            'drop policy if exists %I on public.%I',
            r.policyname,
            r.tablename
        );
    end loop;
end $$;


-- ==========================================
-- app_settings
-- ==========================================

create policy app_settings_select_authenticated
on public.app_settings
for select
to authenticated
using (true);

create policy app_settings_update_admin
on public.app_settings
for update
to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());


-- ==========================================
-- employees
-- ==========================================

create policy employees_select_authenticated
on public.employees
for select
to authenticated
using (
  public.is_current_admin()
  or auth.uid() = auth_user_id
);

create policy employees_insert_admin
on public.employees
for insert
to authenticated
with check (
  public.is_current_admin()
);

create policy employees_update_authenticated
on public.employees
for update
to authenticated
using (
  public.is_current_admin()
  or auth.uid() = auth_user_id
)
with check (
  public.is_current_admin()
  or auth.uid() = auth_user_id
);

create policy employees_delete_admin
on public.employees
for delete
to authenticated
using (
  public.is_current_admin()
);


-- ==========================================
-- attendance
-- ==========================================

create policy attendance_select_authenticated
on public.attendance
for select
to authenticated
using (
  public.is_current_admin()
  or employee_id = public.my_employee_id()
);

create policy attendance_insert_authenticated
on public.attendance
for insert
to authenticated
with check (
  public.is_current_admin()
  or employee_id = public.my_employee_id()
);

create policy attendance_update_authenticated
on public.attendance
for update
to authenticated
using (
  public.is_current_admin()
  or employee_id = public.my_employee_id()
)
with check (
  public.is_current_admin()
  or employee_id = public.my_employee_id()
);

create policy attendance_delete_admin
on public.attendance
for delete
to authenticated
using (
  public.is_current_admin()
);


-- ==========================================
-- leaves
-- ==========================================

create policy leaves_select_authenticated
on public.leaves
for select
to authenticated
using (
  public.is_current_admin()
  or employee_id = public.my_employee_id()
);

create policy leaves_insert_authenticated
on public.leaves
for insert
to authenticated
with check (
  public.is_current_admin()
  or employee_id = public.my_employee_id()
);

create policy leaves_update_authenticated
on public.leaves
for update
to authenticated
using (
  public.is_current_admin()
  or employee_id = public.my_employee_id()
)
with check (
  public.is_current_admin()
  or employee_id = public.my_employee_id()
);

create policy leaves_delete_admin
on public.leaves
for delete
to authenticated
using (
  public.is_current_admin()
);


-- ==========================================
-- leave_requests
-- ==========================================

create policy leave_requests_select_authenticated
on public.leave_requests
for select
to authenticated
using (
  public.is_current_admin()
  or employee_id = public.my_employee_id()
);

create policy leave_requests_insert_authenticated
on public.leave_requests
for insert
to authenticated
with check (
  public.is_current_admin()
  or employee_id = public.my_employee_id()
);

create policy leave_requests_update_authenticated
on public.leave_requests
for update
to authenticated
using (
  public.is_current_admin()
  or employee_id = public.my_employee_id()
)
with check (
  public.is_current_admin()
  or employee_id = public.my_employee_id()
);

create policy leave_requests_delete_admin
on public.leave_requests
for delete
to authenticated
using (
  public.is_current_admin()
);


-- ==========================================
-- offices
-- ==========================================

create policy offices_select_authenticated
on public.offices
for select
to authenticated
using (true);

create policy offices_insert_admin
on public.offices
for insert
to authenticated
with check (
  public.is_current_admin()
);

create policy offices_update_admin
on public.offices
for update
to authenticated
using (
  public.is_current_admin()
)
with check (
  public.is_current_admin()
);

create policy offices_delete_admin
on public.offices
for delete
to authenticated
using (
  public.is_current_admin()
);


-- ==========================================
-- attendance_audit
-- ==========================================

create policy attendance_audit_select_admin
on public.attendance_audit
for select
to authenticated
using (
  public.is_current_admin()
);


-- ==========================================
-- attendance_month_locks
-- ==========================================

create policy attendance_month_locks_select_authenticated
on public.attendance_month_locks
for select
to authenticated
using (true);

create policy attendance_month_locks_insert_admin
on public.attendance_month_locks
for insert
to authenticated
with check (
  public.is_current_admin()
);

create policy attendance_month_locks_update_admin
on public.attendance_month_locks
for update
to authenticated
using (
  public.is_current_admin()
)
with check (
  public.is_current_admin()
);

create policy attendance_month_locks_delete_admin
on public.attendance_month_locks
for delete
to authenticated
using (
  public.is_current_admin()
);
