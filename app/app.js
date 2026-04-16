const APP_CONFIG = window.APP_CONFIG || {};

const SUPABASE_URL = APP_CONFIG.SUPABASE_URL || "";
const SUPABASE_KEY = APP_CONFIG.SUPABASE_KEY || "";
const APP_VERSION = APP_CONFIG.APP_VERSION || "dev";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Chybí konfigurace aplikace. Zkontroluj soubor config.js.");
}

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

console.log("SUPABASE_URL:", SUPABASE_URL);
console.log("APP VERSION:", APP_VERSION);

const $ = id => document.getElementById(id);

const loginView = $("loginView"),
  passwordResetView = $("passwordResetView"),
  appView = $("appView"),
  employeeOnlyBlockEl = $("employeeOnlyBlock"),
  myAttendanceCardEl = $("myAttendanceCard"),
  myAttendanceHistoryCardEl = $("myAttendanceHistoryCard"),
  myMonthlySummaryCardEl = $("myMonthlySummaryCard"),
  timeSummaryCardEl = $("timeSummaryCard"),
  emailEl = $("email"),
  passwordEl = $("password"),
  loginBtn = $("loginBtn"),
  logoutBtn = $("logoutBtn"),
  refreshBtn = $("refreshBtn"),
  newPasswordEl = $("newPassword"),
  newPassword2El = $("newPassword2"),
  saveNewPasswordBtn = $("saveNewPasswordBtn"),
  loginMessageEl = $("loginMessage"),
  passwordResetMessageEl = $("passwordResetMessage"),
  attendanceMessageEl = $("attendanceMessage"),
  manualAttendanceMessageEl = $("manualAttendanceMessage"),
  myLeaveMessageEl = $("myLeaveMessage"),
  adminLeaveMessageEl = $("adminLeaveMessage"),
  exportMessageEl = $("exportMessage"),
  createEmployeeMessageEl = $("createEmployeeMessage"),
  attendanceEditMessageEl = $("attendanceEditMessage"),
  adminHistorySummaryEl = $("adminHistorySummary"),
  lockMonthMessageEl = $("lockMonthMessage"),
  officeMessageEl = $("officeMessage"),
  sessionTextEl = $("sessionText"),
  rolePillEl = $("rolePill"),
  profileBoxEl = $("profileBox"),
  openShiftValueEl = $("openShiftValue"),
  todayArrivalValueEl = $("todayArrivalValue"),
  todayDepartureValueEl = $("todayDepartureValue"),
  leaveTotalHoursValueEl = $("leaveTotalHoursValue"),
  leaveUsedHoursValueEl = $("leaveUsedHoursValue"),
  leaveRemainingDaysValueEl = $("leaveRemainingDaysValue"),
  monthlySummaryLabelEl = $("monthlySummaryLabel"),
  monthlyWorkedValueEl = $("monthlyWorkedValue"),
  monthlyWorkDaysValueEl = $("monthlyWorkDaysValue"),
  monthlyLeaveDaysValueEl = $("monthlyLeaveDaysValue"),
  timeSummaryLabelEl = $("timeSummaryLabel"),
  todayWorkedValueEl = $("todayWorkedValue"),
  monthWorkedSummaryValueEl = $("monthWorkedSummaryValue"),
  overtimeValueEl = $("overtimeValue"),
  historyMonthEl = $("historyMonth"),
  loadHistoryBtn = $("loadHistoryBtn"),
  myAttendanceHistoryWrapEl = $("myAttendanceHistoryWrap"),
  historySummaryLabelEl = $("historySummaryLabel"),
  historyRecordsValueEl = $("historyRecordsValue"),
  historyWorkedValueEl = $("historyWorkedValue"),
  historyDaysValueEl = $("historyDaysValue"),
  officeEl = $("office"),
  attendanceTypeEl = $("attendanceType"),
  breakMinutesEl = $("breakMinutes"),
  employeeOfficesInfoEl = $("employeeOfficesInfo"),
  checkInBtn = $("checkInBtn"),
  checkOutBtn = $("checkOutBtn"),
  manualAttendanceDateEl = $("manualAttendanceDate"),
  manualAttendanceOfficeEl = $("manualAttendanceOffice"),
  manualAttendanceTypeEl = $("manualAttendanceType"),
  manualAttendanceBreakMinutesEl = $("manualAttendanceBreakMinutes"),
  manualAttendanceTimeFromEl = $("manualAttendanceTimeFrom"),
  manualAttendanceTimeToEl = $("manualAttendanceTimeTo"),
  createManualAttendanceBtn = $("createManualAttendanceBtn"),
  myLeaveDateFromEl = $("myLeaveDateFrom"),
  myLeaveDateToEl = $("myLeaveDateTo"),
  myLeaveHoursEl = $("myLeaveHours"),
  myLeaveNoteEl = $("myLeaveNote"),
  createMyLeaveBtn = $("createMyLeaveBtn"),
  myAttendanceWrapEl = $("myAttendanceWrap"),
  myLeaveRequestsWrapEl = $("myLeaveRequestsWrap"),
  adminPanelEl = $("adminPanel"),
  adminActiveWrapEl = $("adminActiveWrap"),
  adminTodayWrapEl = $("adminTodayWrap"),
  attendanceIssuesWrapEl = $("attendanceIssuesWrap"),
  adminLeaveWrapEl = $("adminLeaveWrap"),
  adminLeaveRequestsWrapEl = $("adminLeaveRequestsWrap"),
  employeesWrapEl = $("employeesWrap"),
  employeeSearchInputEl = $("employeeSearchInput"),
  employeeRoleFilterEl = $("employeeRoleFilter"),
  employeeActiveFilterEl = $("employeeActiveFilter"),
  dashTotalEmployeesEl = $("dashTotalEmployees"),
  dashAtWorkEl = $("dashAtWork"),
  dashHomeOfficeEl = $("dashHomeOffice"),
  dashBusinessTripEl = $("dashBusinessTrip"),
  dashOnLeaveEl = $("dashOnLeave"),
  adminLeaveEmployeeEl = $("adminLeaveEmployee"),
  officeNameEl = $("officeName"),
  officeSortOrderEl = $("officeSortOrder"),
  officeActiveEl = $("officeActive"),
  saveOfficeBtn = $("saveOfficeBtn"),
  cancelOfficeEditBtn = $("cancelOfficeEditBtn"),
  officesWrapEl = $("officesWrap"),
  adminLeaveDateEl = $("adminLeaveDate"),
  adminLeaveHoursEl = $("adminLeaveHours"),
  adminLeaveNoteEl = $("adminLeaveNote"),
  adminCreateLeaveBtn = $("adminCreateLeaveBtn"),
  adminHistoryEmployeeEl = $("adminHistoryEmployee"),
  adminHistoryMonthEl = $("adminHistoryMonth"),
  adminLoadHistoryBtn = $("adminLoadHistoryBtn"),
  adminHistoryWrapEl = $("adminHistoryWrap"),
  auditMonthEl = $("auditMonth"),
  loadAuditBtn = $("loadAuditBtn"),
  auditWrapEl = $("auditWrap"),
  lockMonthEl = $("lockMonth"),
  checkLockBtn = $("checkLockBtn"),
  lockMonthBtn = $("lockMonthBtn"),
  unlockMonthBtn = $("unlockMonthBtn"),
  exportMonthEl = $("exportMonth"),
  exportMonthBtn = $("exportMonthBtn"),
  attendanceFormTitleEl = $("attendanceFormTitle"),
  editAttendanceEmployeeEl = $("editAttendanceEmployee"),
  editAttendanceDateEl = $("editAttendanceDate"),
  editAttendanceOfficeEl = $("editAttendanceOffice"),
  editAttendanceTypeEl = $("editAttendanceType"),
  editAttendanceTimeFromEl = $("editAttendanceTimeFrom"),
  editAttendanceTimeToEl = $("editAttendanceTimeTo"),
  editAttendanceBreakMinutesEl = $("editAttendanceBreakMinutes"),
  insertAttendanceBtn = $("insertAttendanceBtn"),
  saveAttendanceEditBtn = $("saveAttendanceEditBtn"),
  deleteAttendanceBtn = $("deleteAttendanceBtn"),
  cancelAttendanceEditBtn = $("cancelAttendanceEditBtn"),
  employeeFormTitleEl = $("employeeFormTitle"),
  newEmployeeNameEl = $("newEmployeeName"),
  newEmployeeEmailEl = $("newEmployeeEmail"),
  newEmployeeRoleEl = $("newEmployeeRole"),
  newEmployeeOfficesEl = $("newEmployeeOffices"),
  newEmployeeWeeklyEl = $("newEmployeeWeekly"),
  newEmployeeLeaveDaysEl = $("newEmployeeLeaveDays"),
  newEmployeeLeaveHoursEl = $("newEmployeeLeaveHours"),
  newEmployeeActiveEl = $("newEmployeeActive"),
  createEmployeeBtn = $("createEmployeeBtn"),
  cancelEditEmployeeBtn = $("cancelEditEmployeeBtn"),
  offlineBannerEl = $("offlineBanner"),
  onboardingViewEl = $("onboardingView"),
  registerCompanyBtn = $("registerCompanyBtn"),
  registerMessageEl = $("registerMessage"),
  regCompanyEl = $("regCompany"),
  regNameEl = $("regName"),
  regEmailEl = $("regEmail"),
  showLoginBtn = $("showLoginBtn"),
  showOnboardingBtn = $("showOnboardingBtn");

const todayFilterButtons = document.querySelectorAll(".today-filter-btn");

let currentUser = null,
  currentEmployee = null,
  currentAppSettings = null,
  myAttendanceRows = [],
  myAttendanceHistoryRows = [],
  myOpenShift = null,
  myLeaveSummary = null,
  isAdmin = false,
  adminEmployeesData = [],
  filteredAdminEmployeesData = [],
  adminTodayAttendanceData = [],
  adminLeaveData = [],
  adminLeaveRequestsRows = [],
  myLeaveRequestsRows = [],
  editEmployeeId = null,
  editAttendanceId = null,
  currentTodayFilter = "all",
  auditRows = [],
  officesData = [],
  editOfficeId = null,
  isPasswordRecoveryFlow = false,
  passwordWasJustChanged = false,
  adminHistoryRows = [];

function setMessage(el, text, type = "warn") {
  if (!el) return;
  el.textContent = text;
  el.className = "message " + type;
}

function mapAttendanceError(error) {
  if (!error) return "Neznámá chyba.";

  const raw = String(error.message || error.details || error.hint || "").trim();
  const msg = raw.toLowerCase();
  const code = String(error.code || "").trim();

  if (code === "23505") return "Pro tento den už existuje pracovní docházka.";
  if (code === "23502") return "Chybí povinná hodnota. Zkontroluj čas a vyplněná pole.";
  if (code === "23503") return "Neplatný odkaz na zaměstnance nebo místo.";
  if (code === "22007") return "Neplatný formát data nebo času.";

  if (msg.includes("open shift")) return "Máš otevřenou směnu. Nejdřív zapiš odchod.";
  if (msg.includes("no open shift")) return "Nemáš otevřenou směnu. Nejdřív zapiš příchod.";
  if (msg.includes("already checked in")) return "Příchod pro dnešní den už je zapsaný.";
  if (msg.includes("already clocked in")) return "Příchod pro dnešní den už je zapsaný.";
  if (msg.includes("day already exists")) return "Pro tento den už pracovní docházka existuje.";
  if (msg.includes("open_shift_exists")) return "Pro tento den už existuje otevřená směna.";
  if (msg.includes("invalid time range")) return "Čas do musí být později než čas od.";
  if (msg.includes("missing_time_from")) return "Vyplň čas od.";
  if (msg.includes("duplicate")) return "Záznam už existuje.";
  if (msg.includes("unique")) return "Záznam už existuje.";
  if (msg.includes("null value")) return "Chybí povinná hodnota.";
  if (msg.includes("time") && msg.includes("null")) return "Vyplň čas.";
  if (msg.includes("check")) return "Neplatná kombinace hodnot.";

  return raw || "Došlo k chybě.";
}

function escapeHtml(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function currentMonthStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function previousMonthStr() {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function fmtNumber(v) {
  if (v === null || v === undefined || v === "") return "0";
  const n = Number(v);
  return Number.isNaN(n) ? String(v) : n % 1 === 0 ? String(n) : n.toFixed(2);
}

function fmtExportNumber(v) {
  const n = Number(v || 0);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

function parseRowDateTime(dateValue, timeValue) {
  if (!dateValue || !timeValue) return null;
  const p = new Date(`${dateValue}T${timeValue}`);
  return Number.isNaN(p.getTime()) ? null : p;
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
@@ -268,12 +275,14 @@
    .replace(/\s+/g, " ")
    .trim();
}

function isEmployeeAdmin(employee) {
  return !!employee && (
    normalizeText(employee.role) === "admin" ||
    employee.is_admin === true
  );
}

function getAutoBreakMinutes(row) {
  const start = parseRowDateTime(row.date, row.time_from);
  const end = parseRowDateTime(row.date, row.time_to);
@@ -288,6 +297,7 @@

  return Number(row.break_minutes || 0);
}

function getWorkedMinutes(row) {
  const type = normalizeText(row.type);
  if (type === "dovolena" || type === "leave" || type === "vacation") return 0;
@@ -297,23 +307,28 @@
  const raw = Math.round((end.getTime() - start.getTime()) / 60000);
  return Math.max(0, raw - getAutoBreakMinutes(row));
}

function formatWorkedMinutes(minutes) {
  const m = Math.max(0, Number(minutes || 0));
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

function formatMonthLabel(monthStr) {
  if (!monthStr || !monthStr.includes("-")) return "aktuální měsíc";
  const [y, m] = monthStr.split("-");
  return `${m}.${y}`;
}

function monthFromDateStr(dateStr) {
  return String(dateStr || "").slice(0, 7);
}

function updateOnlineStatus() {
  if (!offlineBannerEl) return;
  if (navigator.onLine) offlineBannerEl.classList.add("hidden");
  else offlineBannerEl.classList.remove("hidden");
}

function renderAttendanceTypeBadge(type) {
  const safe = escapeHtml(type || "—");
  const n = normalizeText(type);
@@ -324,6 +339,7 @@
  if (n === "dovolena" || n === "vacation" || n === "leave") return `<span class="type-badge type-vacation">${safe}</span>`;
  return `<span class="type-badge type-default">${safe}</span>`;
}

function renderLeaveStatusBadge(status) {
  const n = normalizeText(status);
  if (n === "pending" || n === "ceka" || n === "čeká") return `<span class="pill pill-warn">${escapeHtml(status || "pending")}</span>`;
@@ -332,6 +348,7 @@
  if (n === "cancelled" || n === "storno" || n === "stornováno" || n === "stornovano") return `<span class="pill pill-inactive">${escapeHtml(status || "cancelled")}</span>`;
  return `<span class="pill pill-warn">${escapeHtml(status || "—")}</span>`;
}

function renderSimpleTable(columns, rows) {
  if (!rows || !rows.length) return `<div class="empty-box">Žádná data.</div>`;
  const thead = columns.map(c => `<th>${escapeHtml(c.label)}</th>`).join("");
@@ -340,15 +357,19 @@
    .join("");
  return `<div class="table-wrap"><table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table></div>`;
}

function getAttendanceRowsForMonth(rows, monthStr) {
  return (rows || [])
    .filter(r => r?.date && String(r.date).startsWith(monthStr))
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || Number(b.id || 0) - Number(a.id || 0));
}

function getMonthlySummary(rows) {
  const month = currentMonthStr();
  const workDays = new Set(), leaveDays = new Set();
  const workDays = new Set();
  const leaveDays = new Set();
  let totalWorkedMinutes = 0;

  for (const row of rows) {
    if (!row?.date || !String(row.date).startsWith(month)) continue;
    const type = normalizeText(row.type);
@@ -362,12 +383,15 @@
      workDays.add(row.date);
    }
  }

  return { month, totalWorkedMinutes, workDays: workDays.size, leaveDays: leaveDays.size };
}

function getTodayWorkedMinutes(rows) {
  const today = todayStr();
  return (rows || []).filter(r => r?.date === today).reduce((sum, row) => sum + getWorkedMinutes(row), 0);
}

function getExpectedMonthlyMinutes(employee, monthStr) {
  const normalizedWeekly = normalizeText(employee?.weekly || "");
  const uniqueWorkDays = new Set(
@@ -378,41 +402,51 @@
      })
      .map(row => row.date)
  ).size;

  if (!uniqueWorkDays) return 0;
  if (normalizedWeekly.includes("polovicni") || normalizedWeekly.includes("poloviční") || normalizedWeekly.includes("0.5")) return uniqueWorkDays * 240;
  if (normalizedWeekly.includes("zkraceny") || normalizedWeekly.includes("zkrácený") || normalizedWeekly.includes("6h")) return uniqueWorkDays * 360;
  return uniqueWorkDays * 480;
}

function buildOfficeOptions(includeInactive = false) {
  return (officesData || [])
    .filter(r => includeInactive || r.active !== false)
    .sort((a, b) => (Number(a.sort_order || 0) - Number(b.sort_order || 0)) || String(a.name || "").localeCompare(String(b.name || ""), "cs"));
}

function getOfficeIdByName(name) {
  const match = (officesData || []).find(r => normalizeText(r.name) === normalizeText(name));
  return match ? String(match.id) : "";
}

function fillOfficeSelect(selectEl, selectedValue = "") {
  if (!selectEl) return;

  const options = buildOfficeOptions(false);
  const selectedString = String(selectedValue || "");
  selectEl.innerHTML = "";

  for (const officeRow of options) {
    const option = document.createElement("option");
    option.value = String(officeRow.id);
    option.textContent = officeRow.name;
    selectEl.appendChild(option);
  }

  if (!selectEl.options.length) return;

  if (selectedString && [...selectEl.options].some(opt => opt.value === selectedString)) {
    selectEl.value = selectedString;
    return;
  }

  const mappedId = getOfficeIdByName(selectedString);
  if (mappedId && [...selectEl.options].some(opt => opt.value === mappedId)) {
    selectEl.value = mappedId;
    return;
  }

  selectEl.selectedIndex = 0;
}

@@ -439,11 +473,13 @@
      return;
    }
  } catch (_) {}

  try {
    const { data, error } = await supabaseClient
      .from("app_settings")
      .select("app_name, company_name, logo_url, primary_color, support_email, timezone, currency")
      .limit(1);

    if (error) throw error;
    currentAppSettings = Array.isArray(data) && data.length ? data[0] : null;
    applyAppSettings();
@@ -462,13 +498,15 @@
    monthlyLeaveDaysValueEl.textContent = "—";
    return;
  }

  myMonthlySummaryCardEl.classList.remove("hidden");
  const s = getMonthlySummary(myAttendanceRows);
  monthlySummaryLabelEl.textContent = formatMonthLabel(s.month);
  monthlyWorkedValueEl.textContent = formatWorkedMinutes(s.totalWorkedMinutes);
  monthlyWorkDaysValueEl.textContent = String(s.workDays);
  monthlyLeaveDaysValueEl.textContent = String(s.leaveDays);
}

function renderTimeSummary() {
  if (!currentEmployee || isAdmin) {
    timeSummaryCardEl.classList.add("hidden");
@@ -478,18 +516,21 @@
    overtimeValueEl.textContent = "00:00";
    return;
  }

  timeSummaryCardEl.classList.remove("hidden");
  const month = currentMonthStr();
  const monthlyRows = getAttendanceRowsForMonth(myAttendanceRows, month);
  const todayWorkedMinutes = getTodayWorkedMinutes(myAttendanceRows);
  const monthWorkedMinutes = monthlyRows.reduce((sum, row) => sum + getWorkedMinutes(row), 0);
  const expectedMonthlyMinutes = getExpectedMonthlyMinutes(currentEmployee, month);
  const overtimeMinutes = Math.max(0, monthWorkedMinutes - expectedMonthlyMinutes);

  timeSummaryLabelEl.textContent = formatMonthLabel(month);
  todayWorkedValueEl.textContent = formatWorkedMinutes(todayWorkedMinutes);
  monthWorkedSummaryValueEl.textContent = formatWorkedMinutes(monthWorkedMinutes);
  overtimeValueEl.textContent = formatWorkedMinutes(overtimeMinutes);
}

function renderAttendanceHistory() {
  if (!currentEmployee || isAdmin) {
    myAttendanceHistoryCardEl.classList.add("hidden");
@@ -500,22 +541,26 @@
    historyDaysValueEl.textContent = "0";
    return;
  }

  myAttendanceHistoryCardEl.classList.remove("hidden");
  const month = historyMonthEl?.value || currentMonthStr();
  const rows = getAttendanceRowsForMonth(myAttendanceHistoryRows, month);
  const workDays = new Set();
  let totalWorkedMinutes = 0;

  for (const row of rows) {
    const wm = getWorkedMinutes(row);
    if (wm > 0) {
      totalWorkedMinutes += wm;
      workDays.add(row.date);
    }
  }

  historySummaryLabelEl.textContent = formatMonthLabel(month);
  historyRecordsValueEl.textContent = String(rows.length);
  historyWorkedValueEl.textContent = formatWorkedMinutes(totalWorkedMinutes);
  historyDaysValueEl.textContent = String(workDays.size);

  myAttendanceHistoryWrapEl.innerHTML = renderSimpleTable(
    [
      { label: "Datum", render: r => escapeHtml(r.date || "") },
@@ -536,6 +581,7 @@
    renderAttendanceHistory();
    return;
  }

  const { data, error } = await supabaseClient.rpc("get_my_attendance_rows", { p_limit: 366 });
  if (error) throw error;
  myAttendanceHistoryRows = Array.isArray(data) ? data : [];
@@ -547,44 +593,61 @@
    const { data, error } = await supabaseClient.rpc("is_attendance_month_locked", { p_month: monthStr });
    if (!error) return !!data;
  } catch (_) {}

  const { data, error } = await supabaseClient
    .from("attendance_month_locks")
    .select("locked")
    .eq("month", monthStr)
    .limit(1);

  if (error) throw error;
  return !!(Array.isArray(data) && data.length && data[0].locked);
}

async function ensureMonthUnlockedOrThrow(dateStr) {
  const monthStr = monthFromDateStr(dateStr);
  if (!monthStr) return;
  const isLocked = await getMonthLockStatus(monthStr);
  if (isLocked) throw new Error(`Měsíc ${formatMonthLabel(monthStr)} je uzamčený.`);
}

async function ensureRangeMonthsUnlockedOrThrow(dateFrom, dateTo) {
  const startMonth = monthFromDateStr(dateFrom), endMonth = monthFromDateStr(dateTo);
  const startMonth = monthFromDateStr(dateFrom);
  const endMonth = monthFromDateStr(dateTo);
  if (startMonth) await ensureMonthUnlockedOrThrow(dateFrom);
  if (endMonth && endMonth !== startMonth) await ensureMonthUnlockedOrThrow(dateTo);
}

async function loadAttendanceLockStatus() {
  if (!isAdmin) return;
  const monthStr = lockMonthEl.value;
  if (!monthStr) return setMessage(lockMonthMessageEl, "Vyber měsíc.", "err");

  try {
    const isLocked = await getMonthLockStatus(monthStr);
    setMessage(lockMonthMessageEl, isLocked ? `Měsíc ${formatMonthLabel(monthStr)} je zamčený.` : `Měsíc ${formatMonthLabel(monthStr)} není zamčený.`, isLocked ? "err" : "ok");
    setMessage(
      lockMonthMessageEl,
      isLocked ? `Měsíc ${formatMonthLabel(monthStr)} je zamčený.` : `Měsíc ${formatMonthLabel(monthStr)} není zamčený.`,
      isLocked ? "err" : "ok"
    );
  } catch (error) {
    setMessage(lockMonthMessageEl, "Chyba načítání uzávěrky: " + error.message, "err");
  }
}

async function setAttendanceLockState(locked) {
  if (!isAdmin) return;
  const monthStr = lockMonthEl.value;
  if (!monthStr) return setMessage(lockMonthMessageEl, "Vyber měsíc.", "err");

  try {
    const { error } = await supabaseClient.rpc("set_attendance_month_lock", { p_month: monthStr, p_locked: locked });
    if (error) throw error;
    setMessage(lockMonthMessageEl, locked ? `Měsíc ${formatMonthLabel(monthStr)} byl zamčen.` : `Měsíc ${formatMonthLabel(monthStr)} byl odemčen.`, locked ? "err" : "ok");
    setMessage(
      lockMonthMessageEl,
      locked ? `Měsíc ${formatMonthLabel(monthStr)} byl zamčen.` : `Měsíc ${formatMonthLabel(monthStr)} byl odemčen.`,
      locked ? "err" : "ok"
    );
  } catch (error) {
    setMessage(lockMonthMessageEl, "Chyba při změně uzávěrky: " + error.message, "err");
  }
@@ -601,9 +664,11 @@
    return true;
  });
}

function updateTodayFilterButtons() {
  todayFilterButtons.forEach(btn => btn.classList.toggle("active-filter", (btn.dataset.filter || "all") === currentTodayFilter));
}

function renderAdminTodayTable() {
  const filtered = filterTodayRows(adminTodayAttendanceData);
  adminTodayWrapEl.innerHTML = renderSimpleTable(
@@ -630,6 +695,7 @@
    auditWrapEl.innerHTML = `<div class="empty-box">Vyber měsíc.</div>`;
    return;
  }

  try {
    const { data, error } = await supabaseClient.rpc("get_attendance_audit_by_month", { p_month: month });
    if (error) throw error;
@@ -651,36 +717,75 @@

function buildAttendanceIssues(rows) {
  const issues = [];

  for (const row of rows || []) {
    const employeeName = row.employee_name || "Neznámý zaměstnanec";
    const dateText = row.date || "bez data";
    const start = parseRowDateTime(row.date, row.time_from);
    const end = parseRowDateTime(row.date, row.time_to);
    const rawMinutes = start && end && end > start ? Math.round((end.getTime() - start.getTime()) / 60000) : 0;
    const breakMinutes = Number(getAutoBreakMinutes(row) || 0);
    if (!row.time_to && normalizeText(row.type) !== "dovolena") issues.push({ severity: "err", employee_name: employeeName, date: dateText, issue: "Otevřená směna", detail: `Chybí čas odchodu. Od: ${row.time_from || "—"}` });
    if (rawMinutes > 720) issues.push({ severity: "err", employee_name: employeeName, date: dateText, issue: "Směna delší než 12 hodin", detail: `Délka směny ${formatWorkedMinutes(rawMinutes)}.` });
    if (rawMinutes >= 360 && breakMinutes <= 0) issues.push({ severity: "warn", employee_name: employeeName, date: dateText, issue: "Chybí přestávka", detail: `Směna je ${formatWorkedMinutes(rawMinutes)}, ale přestávka je 0 min.` });

    if (!row.time_to && normalizeText(row.type) !== "dovolena") {
      issues.push({
        severity: "err",
        employee_name: employeeName,
        date: dateText,
        issue: "Otevřená směna",
        detail: `Chybí čas odchodu. Od: ${row.time_from || "—"}`
      });
    }

    if (rawMinutes > 720) {
      issues.push({
        severity: "err",
        employee_name: employeeName,
        date: dateText,
        issue: "Směna delší než 12 hodin",
        detail: `Délka směny ${formatWorkedMinutes(rawMinutes)}.`
      });
    }

    if (rawMinutes >= 360 && breakMinutes <= 0) {
      issues.push({
        severity: "warn",
        employee_name: employeeName,
        date: dateText,
        issue: "Chybí přestávka",
        detail: `Směna je ${formatWorkedMinutes(rawMinutes)}, ale přestávka je 0 min.`
      });
    }
  }

  const grouped = new Map();
  for (const row of rows || []) {
    const key = `${row.employee_name || "?"}__${row.date || "?"}`;
    grouped.set(key, (grouped.get(key) || 0) + 1);
  }

  for (const [key, count] of grouped.entries()) {
    if (count > 1) {
      const [employee_name, date] = key.split("__");
      issues.push({ severity: "warn", employee_name, date, issue: "Více záznamů v jednom dni", detail: `Počet záznamů za den: ${count}.` });
      issues.push({
        severity: "warn",
        employee_name,
        date,
        issue: "Více záznamů v jednom dni",
        detail: `Počet záznamů za den: ${count}.`
      });
    }
  }

  return issues.sort((a, b) => a.severity !== b.severity ? (a.severity === "err" ? -1 : 1) : String(b.date).localeCompare(String(a.date)));
}

function renderAttendanceIssues(rows) {
  const issues = buildAttendanceIssues(rows);
  if (!issues.length) {
    attendanceIssuesWrapEl.innerHTML = `<div class="empty-box">Nenalezeny žádné zjevné chyby v docházce.</div>`;
    return;
  }

  attendanceIssuesWrapEl.innerHTML = renderSimpleTable(
    [
      { label: "Priorita", render: r => r.severity === "err" ? `<span class="pill pill-inactive">chyba</span>` : `<span class="pill pill-warn">pozor</span>` },
@@ -692,32 +797,44 @@
    issues
  );
}

async function loadAdminAttendanceHistory() {
  if (!isAdmin) return;
  const employeeId = Number(adminHistoryEmployeeEl.value || 0);
  const month = adminHistoryMonthEl.value;

  if (!employeeId || !month) {
    adminHistoryWrapEl.innerHTML = `<div class="empty-box">Vyber zaměstnance a měsíc.</div>`;
    setMessage(adminHistorySummaryEl, "Vyber zaměstnance a měsíc.", "warn");
    return;
  }

  const { data, error } = await supabaseClient.rpc("get_attendance_by_month", { p_employee_id: employeeId, p_month: month });

  if (error) {
    adminHistoryWrapEl.innerHTML = `<div class="empty-box">Chyba načítání.</div>`;
    setMessage(adminHistorySummaryEl, "Chyba načítání: " + error.message, "err");
    return;
  }

  adminHistoryRows = Array.isArray(data) ? data : [];
  const workDays = new Set();
  let totalWorkedMinutes = 0;

  for (const row of adminHistoryRows) {
    const wm = getWorkedMinutes(row);
    if (wm > 0) {
      totalWorkedMinutes += wm;
      workDays.add(row.date);
    }
  }
  setMessage(adminHistorySummaryEl, `Měsíc ${formatMonthLabel(month)} · záznamy ${adminHistoryRows.length} · odpracováno ${formatWorkedMinutes(totalWorkedMinutes)} · dny v práci ${workDays.size}`, "ok");

  setMessage(
    adminHistorySummaryEl,
    `Měsíc ${formatMonthLabel(month)} · záznamy ${adminHistoryRows.length} · odpracováno ${formatWorkedMinutes(totalWorkedMinutes)} · dny v práci ${workDays.size}`,
    "ok"
  );

  adminHistoryWrapEl.innerHTML = renderSimpleTable(
    [
      { label: "ID", render: r => escapeHtml(r.id || "") },
@@ -751,6 +868,7 @@
    adminPanelEl.classList.add("hidden");
  }
}

function fillAdminLeaveEmployeeOptions() {
  adminLeaveEmployeeEl.innerHTML = "";
  adminEmployeesData
@@ -762,6 +880,7 @@
      adminLeaveEmployeeEl.appendChild(option);
    });
}

function fillAdminHistoryEmployeeOptions() {
  adminHistoryEmployeeEl.innerHTML = "";
  adminEmployeesData
@@ -773,6 +892,7 @@
      adminHistoryEmployeeEl.appendChild(option);
    });
}

function fillEditAttendanceEmployeeOptions() {
  editAttendanceEmployeeEl.innerHTML = "";
  const filtered = adminEmployeesData.filter(employee => !isEmployeeAdmin(employee));
@@ -794,15 +914,20 @@
}

function renderRoleBadge(role) {
  return normalizeText(role) === "admin" ? `<span class="pill pill-admin">admin</span>` : `<span class="pill pill-employee">employee</span>`;
  return normalizeText(role) === "admin"
    ? `<span class="pill pill-admin">admin</span>`
    : `<span class="pill pill-employee">employee</span>`;
}

function renderActiveBadge(active) {
  return active ? `<span class="pill pill-active">aktivní</span>` : `<span class="pill pill-inactive">neaktivní</span>`;
}

function getFilteredEmployees() {
  const search = normalizeText(employeeSearchInputEl?.value || "");
  const roleFilter = employeeRoleFilterEl?.value || "all";
  const activeFilter = employeeActiveFilterEl?.value || "all";

  return [...adminEmployeesData]
    .filter(employee => {
      if (roleFilter !== "all" && String(employee.role || "") !== roleFilter) return false;
@@ -814,6 +939,7 @@
    })
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "cs"));
}

function renderEmployeesTable() {
  filteredAdminEmployeesData = getFilteredEmployees();
  employeesWrapEl.innerHTML = renderSimpleTable(
@@ -828,6 +954,7 @@
    filteredAdminEmployeesData
  );
}

function resetOfficeForm() {
  editOfficeId = null;
  officeNameEl.value = "";
@@ -838,6 +965,7 @@
  cancelOfficeEditBtn.classList.add("hidden");
  setMessage(officeMessageEl, "Přidej nové místo nebo uprav existující.", "warn");
}

function fillOfficeFormForEdit(officeRow) {
  editOfficeId = officeRow.id;
  officeNameEl.value = officeRow.name || "";
@@ -848,6 +976,7 @@
  cancelOfficeEditBtn.classList.remove("hidden");
  setMessage(officeMessageEl, `Upravuješ místo ID ${officeRow.id}: ${officeRow.name}`, "warn");
}

function renderOfficesAdminTable() {
  officesWrapEl.innerHTML = renderSimpleTable(
    [
@@ -860,6 +989,7 @@
    buildOfficeOptions(true)
  );
}

async function loadOffices() {
  try {
    const { data, error } = await supabaseClient.rpc("get_offices");
@@ -873,20 +1003,26 @@
      .from("offices")
      .select("id, name, sort_order, active")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    officesData = Array.isArray(data) ? data : [];
  }

  fillOfficeSelect(officeEl, officeEl.value);
  fillOfficeSelect(manualAttendanceOfficeEl, manualAttendanceOfficeEl.value);
  fillOfficeSelect(editAttendanceOfficeEl, editAttendanceOfficeEl.value);
  renderOfficesAdminTable();
}

async function saveOffice() {
  if (!isAdmin) return;

  const p_name = officeNameEl.value.trim();
  const p_sort_order = Number(officeSortOrderEl.value || 0);
  const p_active = officeActiveEl.value === "true";

  if (!p_name) return setMessage(officeMessageEl, "Vyplň název místa.", "err");

  try {
    if (editOfficeId) {
      const { error } = await supabaseClient.rpc("admin_update_office", { p_id: editOfficeId, p_name, p_sort_order, p_active });
@@ -895,6 +1031,7 @@
      resetOfficeForm();
      return setMessage(officeMessageEl, "Místo bylo upraveno.", "ok");
    }

    const { error } = await supabaseClient.rpc("admin_create_office", { p_name, p_sort_order });
    if (error) throw error;
    await loadOffices();
@@ -921,6 +1058,7 @@
  newEmployeeActiveEl.value = "true";
  setMessage(createEmployeeMessageEl, "Vyplň údaje a ulož.", "warn");
}

function fillEmployeeFormForEdit(employee) {
  editEmployeeId = employee.id;
  employeeFormTitleEl.textContent = "Upravit zaměstnance";
@@ -938,6 +1076,7 @@
  setMessage(createEmployeeMessageEl, `Upravuješ zaměstnance ID ${employee.id}: ${employee.name}`, "warn");
  window.scrollTo({ top: adminPanelEl.offsetTop, behavior: "smooth" });
}

function resetAttendanceEditForm() {
  editAttendanceId = null;
  attendanceFormTitleEl.textContent = "Upravit / vložit docházku";
@@ -952,6 +1091,7 @@
  cancelAttendanceEditBtn.classList.add("hidden");
  setMessage(attendanceEditMessageEl, "Pro nový záznam vyplň pole a klikni na Vložit ručně. Pro úpravu klikni v tabulce docházky na Upravit.", "warn");
}

function resetManualAttendanceForm() {
  manualAttendanceDateEl.value = todayStr();
  manualAttendanceOfficeEl.value = officeEl.value || manualAttendanceOfficeEl.options[0]?.value || "";
@@ -961,13 +1101,15 @@
  manualAttendanceTimeToEl.value = "";
  setMessage(manualAttendanceMessageEl, "Vyplň datum a čas. Hodí se pro zpětné doplnění docházky.", "warn");
}

function resetLeaveRequestForm() {
  myLeaveDateFromEl.value = todayStr();
  myLeaveDateToEl.value = todayStr();
  myLeaveHoursEl.value = "8";
  myLeaveNoteEl.value = "";
  setMessage(myLeaveMessageEl, "Vyber datum od, datum do a počet hodin.", "warn");
}

function fillAttendanceFormForEdit(row) {
  editAttendanceId = row.id;
  attendanceFormTitleEl.textContent = `Upravit docházku ID ${row.id}`;
@@ -983,31 +1125,36 @@
  setMessage(attendanceEditMessageEl, `Upravuješ docházku ID ${row.id}`, "warn");
  window.scrollTo({ top: adminPanelEl.offsetTop, behavior: "smooth" });
}

function resetDashboard() {
  dashTotalEmployeesEl.textContent = "0";
  dashAtWorkEl.textContent = "0";
  dashHomeOfficeEl.textContent = "0";
  dashBusinessTripEl.textContent = "0";
  dashOnLeaveEl.textContent = "0";
}

function showLoginView() {
  onboardingViewEl?.classList.add("hidden");
  loginView.classList.remove("hidden");
  passwordResetView.classList.add("hidden");
  appView.classList.add("hidden");
}

function showRecoveryView() {
  onboardingViewEl?.classList.add("hidden");
  loginView.classList.add("hidden");
  appView.classList.add("hidden");
  passwordResetView.classList.remove("hidden");
}

function showAppView() {
  onboardingViewEl?.classList.add("hidden");
  loginView.classList.add("hidden");
  passwordResetView.classList.add("hidden");
  appView.classList.remove("hidden");
}

function showOnboardingView() {
  onboardingViewEl?.classList.remove("hidden");
  loginView?.classList.add("hidden");
@@ -1034,22 +1181,19 @@
  setMessage(registerMessageEl, "Vytvářím firmu…", "warn");

  try {
   const res = await fetch(
  `${SUPABASE_URL}/functions/v1/register-company`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify({
      companyName,
      adminName,
      adminEmail
    })
  }
);
    const res = await fetch(`${SUPABASE_URL}/functions/v1/register-company`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        companyName,
        adminName,
        adminEmail
      })
    });

    const data = await res.json().catch(() => ({}));

@@ -1075,17 +1219,26 @@
    setMessage(registerMessageEl, "Chyba registrace firmy: " + (err.message || err), "err");
  }
}

function cleanRecoveryUrl() {
  window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
}

function detectRecoveryModeFromUrl() {
  const hash = window.location.hash || "";
  const search = window.location.search || "";
  return hash.includes("type=recovery") || hash.includes("type=PASSWORD_RECOVERY") || search.includes("type=recovery") || search.includes("type=PASSWORD_RECOVERY") || hash.includes("access_token=") || search.includes("access_token=");
  return hash.includes("type=recovery") ||
    hash.includes("type=PASSWORD_RECOVERY") ||
    search.includes("type=recovery") ||
    search.includes("type=PASSWORD_RECOVERY") ||
    hash.includes("access_token=") ||
    search.includes("access_token=");
}

function renderLoggedOut() {
  if (isPasswordRecoveryFlow) showRecoveryView();
  else showOnboardingView();

  currentUser = null;
  currentEmployee = null;
  myAttendanceRows = [];
@@ -1102,10 +1255,12 @@
  currentTodayFilter = "all";
  officesData = [];
  adminHistoryRows = [];

  resetEmployeeForm();
  resetOfficeForm();
  resetDashboard();
  updateRoleVisibility();

  profileBoxEl.innerHTML = "Přihlas se.";
  rolePillEl.textContent = "bez role";
  rolePillEl.className = "pill pill-warn";
@@ -1170,33 +1325,44 @@
    setMessage(loginMessageEl, "Právě probíhá reset hesla. Nejprve nastav nové heslo.", "warn");
    return;
  }

  const email = emailEl.value.trim();
  const password = passwordEl.value;

  if (!email || !password) return setMessage(loginMessageEl, "Vyplň e-mail i heslo.", "err");

  setMessage(loginMessageEl, "Přihlašuji…", "warn");
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) return setMessage(loginMessageEl, "Login chyba: " + error.message, "err");

  passwordEl.value = "";
  setMessage(loginMessageEl, "Přihlášení proběhlo.", "ok");
}

async function signOut() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }

  if (!passwordWasJustChanged) isPasswordRecoveryFlow = false;
  cleanRecoveryUrl();
  renderLoggedOut();
}

async function saveNewPassword() {
  const p1 = newPasswordEl.value, p2 = newPassword2El.value;
  const p1 = newPasswordEl.value;
  const p2 = newPassword2El.value;

  if (!p1 || p1.length < 6) return setMessage(passwordResetMessageEl, "Heslo musí mít alespoň 6 znaků.", "err");
  if (p1 !== p2) return setMessage(passwordResetMessageEl, "Hesla se neshodují.", "err");

  setMessage(passwordResetMessageEl, "Ukládám nové heslo…", "warn");
  const { error } = await supabaseClient.auth.updateUser({ password: p1 });
  if (error) return setMessage(passwordResetMessageEl, "Chyba: " + error.message, "err");

  passwordWasJustChanged = true;
  isPasswordRecoveryFlow = false;
  setMessage(passwordResetMessageEl, "Heslo bylo změněno. Probíhá návrat na přihlášení…", "ok");
@@ -1226,6 +1392,7 @@
    throw new Error("Tento účet je neaktivní. Kontaktuj administrátora.");
  }
}

function renderProfile() {
  if (!currentEmployee) {
    profileBoxEl.innerHTML = `Přihlášený účet není spárovaný s tabulkou <span class="mono">employees</span>.`;
@@ -1235,9 +1402,19 @@
    updateRoleVisibility();
    return;
  }

  rolePillEl.textContent = isEmployeeAdmin(currentEmployee) ? "admin" : (currentEmployee.role || "employee");
  rolePillEl.className = "pill " + (isEmployeeAdmin(currentEmployee) ? "pill-admin" : "pill-employee");
  profileBoxEl.innerHTML = `<strong>${escapeHtml(currentEmployee.name || "")}</strong><br>${escapeHtml(currentEmployee.email || "")}<br>role: <span class="mono">${escapeHtml(currentEmployee.role || "employee")}</span><br>is_admin: <span class="mono">${escapeHtml(String(!!currentEmployee.is_admin))}</span><br>active: <span class="mono">${escapeHtml(String(!!currentEmployee.active))}</span><br>employee id: <span class="mono">${escapeHtml(currentEmployee.id)}</span><br>auth_user_id: <span class="mono">${escapeHtml(currentEmployee.auth_user_id || "")}</span><br>offices: <span class="mono">${escapeHtml(currentEmployee.offices || "—")}</span>`;
  profileBoxEl.innerHTML =
    `<strong>${escapeHtml(currentEmployee.name || "")}</strong><br>` +
    `${escapeHtml(currentEmployee.email || "")}<br>` +
    `role: <span class="mono">${escapeHtml(currentEmployee.role || "employee")}</span><br>` +
    `is_admin: <span class="mono">${escapeHtml(String(!!currentEmployee.is_admin))}</span><br>` +
    `active: <span class="mono">${escapeHtml(String(!!currentEmployee.active))}</span><br>` +
    `employee id: <span class="mono">${escapeHtml(currentEmployee.id)}</span><br>` +
    `auth_user_id: <span class="mono">${escapeHtml(currentEmployee.auth_user_id || "")}</span><br>` +
    `offices: <span class="mono">${escapeHtml(currentEmployee.offices || "—")}</span>`;

  employeeOfficesInfoEl.value = currentEmployee.offices || "";
  updateRoleVisibility();
}
@@ -1251,6 +1428,7 @@
    renderTimeSummary();
    return;
  }

  const { data, error } = await supabaseClient.rpc("get_my_attendance_rows", { p_limit: 30 });
  if (error) throw error;
  myAttendanceRows = Array.isArray(data) ? data : [];
@@ -1259,6 +1437,7 @@
  renderMonthlySummary();
  renderTimeSummary();
}

function renderMyAttendance() {
  if (!currentEmployee || isAdmin) {
    openShiftValueEl.textContent = "—";
@@ -1269,21 +1448,27 @@
    checkOutBtn.disabled = true;
    return;
  }

  const today = todayStr();
  const todayRows = myAttendanceRows.filter(r => r.date === today).sort((a, b) => b.id - a.id);
  const firstToday = todayRows.length ? todayRows[todayRows.length - 1] : null;
  const latestToday = todayRows.length ? todayRows[0] : null;

  openShiftValueEl.textContent = myOpenShift ? "ano" : "ne";
  todayArrivalValueEl.textContent = firstToday?.time_from || "—";
  todayDepartureValueEl.textContent = latestToday?.time_to || "—";

  if (latestToday?.office) {
    const officeId = getOfficeIdByName(latestToday.office);
    if (officeId) officeEl.value = officeId;
  }

  if (latestToday?.type && normalizeText(latestToday.type) !== "dovolena") attendanceTypeEl.value = latestToday.type;
  if (latestToday?.break_minutes !== null && latestToday?.break_minutes !== undefined) breakMinutesEl.value = latestToday.break_minutes;

  checkInBtn.disabled = !!myOpenShift;
  checkOutBtn.disabled = !myOpenShift;

  myAttendanceWrapEl.innerHTML = renderSimpleTable(
    [
      { label: "ID", render: r => escapeHtml(r.id) },
@@ -1305,6 +1490,7 @@
    renderMyLeaveSummary();
    return;
  }

  try {
    const { data, error } = await supabaseClient.rpc("get_my_leave_summary");
    if (!error) {
@@ -1313,42 +1499,51 @@
      return;
    }
  } catch (_) {}

  try {
    const { data: empRows, error: empError } = await supabaseClient
      .from("employees")
      .select("leave_days, leave_hours")
      .eq("id", Number(currentEmployee.id))
      .limit(1);
    if (empError) throw empError;

    const { data: leaveRows, error: leaveError } = await supabaseClient
      .from("leaves")
      .select("hours")
      .eq("employee_id", Number(currentEmployee.id));
    if (leaveError) throw leaveError;

    const emp = Array.isArray(empRows) && empRows.length ? empRows[0] : { leave_days: 0, leave_hours: 0 };
    const used = (leaveRows || []).reduce((s, r) => s + Number(r.hours || 0), 0);
    const remainHours = Number(emp.leave_hours || 0) - used;

    myLeaveSummary = {
      leave_days_total: Number(emp.leave_days || 0),
      leave_hours_total: Number(emp.leave_hours || 0),
      leave_hours_used: used,
      leave_hours_remaining: remainHours,
      leave_days_remaining: Number(emp.leave_hours || 0) > 0 ? Math.round((Number(emp.leave_days || 0) * remainHours / Number(emp.leave_hours || 0)) * 100) / 100 : 0
      leave_days_remaining: Number(emp.leave_hours || 0) > 0
        ? Math.round((Number(emp.leave_days || 0) * remainHours / Number(emp.leave_hours || 0)) * 100) / 100
        : 0
    };

    renderMyLeaveSummary();
  } catch (error) {
    console.error("loadMyLeaveSummary:", error);
    myLeaveSummary = null;
    renderMyLeaveSummary();
  }
}

function renderMyLeaveSummary() {
  if (!myLeaveSummary || isAdmin) {
    leaveTotalHoursValueEl.textContent = "—";
    leaveUsedHoursValueEl.textContent = "—";
    leaveRemainingDaysValueEl.textContent = "—";
    return;
  }

  leaveTotalHoursValueEl.textContent = fmtNumber(myLeaveSummary.leave_hours_total);
  leaveUsedHoursValueEl.textContent = fmtNumber(myLeaveSummary.leave_hours_used);
  leaveRemainingDaysValueEl.textContent = fmtNumber(myLeaveSummary.leave_days_remaining);
@@ -1360,20 +1555,24 @@
    renderMyLeaveRequests();
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from("leave_requests")
      .select("id, employee_id, date_from, date_to, hours, note, status, created_at")
      .eq("employee_id", Number(currentEmployee.id))
      .order("id", { ascending: false });

    if (error) throw error;
    myLeaveRequestsRows = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("loadMyLeaveRequests:", error);
    myLeaveRequestsRows = [];
  }

  renderMyLeaveRequests();
}

function renderMyLeaveRequests() {
  myLeaveRequestsWrapEl.innerHTML = renderSimpleTable(
    [
@@ -1395,6 +1594,7 @@
    renderAdminLeaveRequests();
    return;
  }

  try {
    const { data, error } = await supabaseClient.rpc("get_leave_requests");
    if (!error) {
@@ -1403,12 +1603,15 @@
      return;
    }
  } catch (_) {}

  try {
    const { data, error } = await supabaseClient
      .from("leave_requests")
      .select("id, employee_id, date_from, date_to, hours, note, status, created_at, employees(name, email)")
      .order("id", { ascending: false });

    if (error) throw error;

    adminLeaveRequestsRows = (data || []).map(r => ({
      ...r,
      employee_name: r.employees?.name || "—",
@@ -1418,8 +1621,10 @@
    console.error("loadAdminLeaveRequests:", error);
    adminLeaveRequestsRows = [];
  }

  renderAdminLeaveRequests();
}

function renderAdminLeaveRequests() {
  adminLeaveRequestsWrapEl.innerHTML = renderSimpleTable(
    [
@@ -1458,6 +1663,7 @@
  await loadAllData();
  alert("Žádost byla schválena.");
}

async function rejectLeaveRequestById(id) {
  const ok = window.confirm(`Zamítnout žádost #${id}?`);
  if (!ok) return;
@@ -1466,6 +1672,7 @@
  await loadAllData();
  alert("Žádost byla zamítnuta.");
}

async function cancelApprovedLeaveRequestById(id) {
  const ok = window.confirm(`Stornovat schválenou žádost #${id}?`);
  if (!ok) return;
@@ -1622,44 +1829,62 @@
}

async function createMyLeave() {
  const p_date_from = myLeaveDateFromEl.value, p_date_to = myLeaveDateToEl.value, p_hours = Number(myLeaveHoursEl.value || 0), p_note = myLeaveNoteEl.value.trim();
  const p_date_from = myLeaveDateFromEl.value;
  const p_date_to = myLeaveDateToEl.value;
  const p_hours = Number(myLeaveHoursEl.value || 0);
  const p_note = myLeaveNoteEl.value.trim();

  if (!p_date_from || !p_date_to || !p_hours) return setMessage(myLeaveMessageEl, "Vyber datum od, datum do a počet hodin.", "err");
  if (p_date_from > p_date_to) return setMessage(myLeaveMessageEl, "Datum od nesmí být větší než datum do.", "err");

  try {
    await ensureRangeMonthsUnlockedOrThrow(p_date_from, p_date_to);
  } catch (error) {
    return setMessage(myLeaveMessageEl, error.message, "err");
  }

  setMessage(myLeaveMessageEl, "Odesílám žádost o dovolenou…", "warn");
  const { error } = await supabaseClient.rpc("create_leave_request", { p_date_from, p_date_to, p_hours, p_note });
  if (error) return setMessage(myLeaveMessageEl, "Chyba při odeslání žádosti: " + mapAttendanceError(error), "err");

  resetLeaveRequestForm();
  await loadAllData();
  setMessage(myLeaveMessageEl, "Žádost o dovolenou byla odeslána.", "ok");
}

async function adminCreateLeave() {
  const p_employee_id = Number(adminLeaveEmployeeEl.value || 0), p_date = adminLeaveDateEl.value, p_hours = Number(adminLeaveHoursEl.value || 0), p_note = adminLeaveNoteEl.value.trim();
  const p_employee_id = Number(adminLeaveEmployeeEl.value || 0);
  const p_date = adminLeaveDateEl.value;
  const p_hours = Number(adminLeaveHoursEl.value || 0);
  const p_note = adminLeaveNoteEl.value.trim();

  if (!p_employee_id || !p_date || !p_hours) return setMessage(adminLeaveMessageEl, "Vyber zaměstnance, datum a počet hodin.", "err");

  try {
    await ensureMonthUnlockedOrThrow(p_date);
  } catch (error) {
    return setMessage(adminLeaveMessageEl, error.message, "err");
  }

  setMessage(adminLeaveMessageEl, "Zapisuji dovolenou…", "warn");
  const { error } = await supabaseClient.rpc("admin_create_leave", { p_employee_id, p_date, p_hours, p_note });
  if (error) return setMessage(adminLeaveMessageEl, "Chyba při zápisu dovolené: " + mapAttendanceError(error), "err");

  adminLeaveDateEl.value = "";
  adminLeaveHoursEl.value = "8";
  adminLeaveNoteEl.value = "";
  await loadAllData();
  setMessage(adminLeaveMessageEl, "Dovolená byla zaměstnanci zapsána.", "ok");
}

async function exportMonthSummary() {
  const p_month = exportMonthEl.value;
  if (!p_month) return setMessage(exportMessageEl, "Vyber měsíc.", "err");

  setMessage(exportMessageEl, "Generuji export pro účetní…", "warn");
  const { data, error } = await supabaseClient.rpc("get_monthly_summary", { p_month });
  if (error) return setMessage(exportMessageEl, "Chyba exportu: " + mapAttendanceError(error), "err");

  const summaryRows = (data || []).map(row => ({
    "ID zaměstnance": row.employee_id ?? "",
    "Zaměstnanec": row.employee_name || "",
@@ -1671,9 +1896,11 @@
    "Celkem (h)": fmtExportNumber(row.total_hours),
    "Dny v práci": Number(row.work_days || 0)
  }));

  if (!summaryRows.length) {
    return setMessage(exportMessageEl, `Pro měsíc ${p_month} nejsou k exportu žádná data.`, "warn");
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(summaryRows);
  ws["!cols"] = [{ wch: 14 }, { wch: 28 }, { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 12 }, { wch: 18 }, { wch: 14 }, { wch: 12 }];
@@ -1684,14 +1911,14 @@
}

async function createOrUpdateEmployee() {
  const p_name = newEmployeeNameEl.value.trim(),
    p_email = newEmployeeEmailEl.value.trim().toLowerCase(),
    p_role = newEmployeeRoleEl.value,
    p_offices = newEmployeeOfficesEl.value.trim(),
    p_weekly = newEmployeeWeeklyEl.value.trim(),
    p_leave_days = Number(newEmployeeLeaveDaysEl.value || 0),
    p_leave_hours = Number(newEmployeeLeaveHoursEl.value || 0),
    p_active = newEmployeeActiveEl.value === "true";
  const p_name = newEmployeeNameEl.value.trim();
  const p_email = newEmployeeEmailEl.value.trim().toLowerCase();
  const p_role = newEmployeeRoleEl.value;
  const p_offices = newEmployeeOfficesEl.value.trim();
  const p_weekly = newEmployeeWeeklyEl.value.trim();
  const p_leave_days = Number(newEmployeeLeaveDaysEl.value || 0);
  const p_leave_hours = Number(newEmployeeLeaveHoursEl.value || 0);
  const p_active = newEmployeeActiveEl.value === "true";

  if (!p_name || !p_email || !p_role) {
    return setMessage(createEmployeeMessageEl, "Vyplň jméno, e-mail a roli.", "err");
@@ -1713,11 +1940,7 @@
    });

    if (error) {
      return setMessage(
        createEmployeeMessageEl,
        "Chyba při úpravě zaměstnance: " + mapAttendanceError(error),
        "err"
      );
      return setMessage(createEmployeeMessageEl, "Chyba při úpravě zaměstnance: " + mapAttendanceError(error), "err");
    }

    resetEmployeeForm();
@@ -1738,11 +1961,7 @@
  });

  if (createError) {
    return setMessage(
      createEmployeeMessageEl,
      "Chyba při vytváření zaměstnance: " + mapAttendanceError(createError),
      "err"
    );
    return setMessage(createEmployeeMessageEl, "Chyba při vytváření zaměstnance: " + mapAttendanceError(createError), "err");
  }

  setMessage(createEmployeeMessageEl, "Zaměstnanec vytvořen, odesílám pozvánku…", "warn");
@@ -1753,31 +1972,29 @@
    }
  });

if (inviteError) {
  console.error("inviteError:", inviteError);
  await loadAllData();
  resetEmployeeForm();
  return setMessage(
    createEmployeeMessageEl,
    "Zaměstnanec byl vytvořen, ale pozvánku se nepodařilo odeslat: " +
      (inviteError.message || JSON.stringify(inviteError)),
    "err"
  );
}
  if (inviteError) {
    console.error("inviteError:", inviteError);
    await loadAllData();
    resetEmployeeForm();
    return setMessage(
      createEmployeeMessageEl,
      "Zaměstnanec byl vytvořen, ale pozvánku se nepodařilo odeslat: " + (inviteError.message || JSON.stringify(inviteError)),
      "err"
    );
  }

if (inviteData?.error) {
  console.error("inviteData.error:", inviteData);
  await loadAllData();
  resetEmployeeForm();
  return setMessage(
    createEmployeeMessageEl,
    "Zaměstnanec byl vytvořen, ale pozvánku se nepodařilo odeslat: " +
      (inviteData.error || JSON.stringify(inviteData)),
    "err"
  );
}
  if (inviteData?.error) {
    console.error("inviteData.error:", inviteData);
    await loadAllData();
    resetEmployeeForm();
    return setMessage(
      createEmployeeMessageEl,
      "Zaměstnanec byl vytvořen, ale pozvánku se nepodařilo odeslat: " + (inviteData.error || JSON.stringify(inviteData)),
      "err"
    );
  }

console.log("inviteData OK:", inviteData);
  console.log("inviteData OK:", inviteData);

  resetEmployeeForm();
  await loadAllData();
@@ -1792,6 +2009,7 @@
    editAttendanceBreakMinutesEl.value = "0";
  }
}

async function insertAttendanceManual() {
  normalizeAttendanceEditFields();

@@ -1858,38 +2076,61 @@
    return setMessage(attendanceEditMessageEl, "Neočekávaná chyba při vložení docházky: " + mapAttendanceError(e), "err");
  }
}

async function saveAttendanceEdit() {
  if (!editAttendanceId) return setMessage(attendanceEditMessageEl, "Pro úpravu nejdřív vyber řádek tlačítkem Upravit. Pro nový záznam použij Vložit ručně.", "err");
  if (!editAttendanceId) {
    return setMessage(attendanceEditMessageEl, "Pro úpravu nejdřív vyber řádek tlačítkem Upravit. Pro nový záznam použij Vložit ručně.", "err");
  }

  normalizeAttendanceEditFields();
  const p_attendance_id = Number(editAttendanceId),
    p_date = editAttendanceDateEl.value,
    p_office_id = Number(editAttendanceOfficeEl.value || 0),
    p_type = editAttendanceTypeEl.value,
    p_time_from = editAttendanceTimeFromEl.value || null,
    p_time_to = editAttendanceTimeToEl.value || null,
    p_break_minutes = Number(editAttendanceBreakMinutesEl.value || 0);

  const p_attendance_id = Number(editAttendanceId);
  const p_date = editAttendanceDateEl.value;
  const p_office_id = Number(editAttendanceOfficeEl.value || 0);
  const p_type = editAttendanceTypeEl.value;
  const p_time_from = editAttendanceTimeFromEl.value || null;
  const p_time_to = editAttendanceTimeToEl.value || null;
  const p_break_minutes = Number(editAttendanceBreakMinutesEl.value || 0);

  if (!p_date || !p_office_id || !p_type) return setMessage(attendanceEditMessageEl, "Vyplň datum, místo a typ.", "err");
  if (normalizeText(p_type) !== "dovolena" && !p_time_from) return setMessage(attendanceEditMessageEl, "Vyplň čas od.", "err");

  try {
    await ensureMonthUnlockedOrThrow(p_date);
  } catch (error) {
    return setMessage(attendanceEditMessageEl, error.message, "err");
  }

  setMessage(attendanceEditMessageEl, "Ukládám opravu docházky…", "warn");
  const { error } = await supabaseClient.rpc("admin_update_attendance", { p_attendance_id, p_date, p_office_id, p_type, p_time_from, p_time_to, p_break_minutes });

  const { error } = await supabaseClient.rpc("admin_update_attendance", {
    p_attendance_id,
    p_date,
    p_office_id,
    p_type,
    p_time_from,
    p_time_to,
    p_break_minutes
  });

  if (error) return setMessage(attendanceEditMessageEl, "Chyba při opravě docházky: " + mapAttendanceError(error), "err");

  resetAttendanceEditForm();
  await loadAllData();
  if (adminHistoryEmployeeEl.value && adminHistoryMonthEl.value) await loadAdminAttendanceHistory();
  setMessage(attendanceEditMessageEl, "Docházka byla upravena.", "ok");
}

async function deleteAttendanceRecord() {
  if (!editAttendanceId) return setMessage(attendanceEditMessageEl, "Nejdřív vyber docházku k úpravě.", "err");

  const ok = window.confirm(`Opravdu chceš smazat docházku ID ${editAttendanceId}?`);
  if (!ok) return;

  setMessage(attendanceEditMessageEl, "Mažu docházku…", "warn");
  const { error } = await supabaseClient.rpc("admin_delete_attendance", { p_attendance_id: Number(editAttendanceId) });
  if (error) return setMessage(attendanceEditMessageEl, "Chyba při mazání docházky: " + mapAttendanceError(error), "err");

  resetAttendanceEditForm();
  await loadAllData();
  if (adminHistoryEmployeeEl.value && adminHistoryMonthEl.value) await loadAdminAttendanceHistory();
@@ -1917,18 +2158,99 @@
    dashHomeOfficeEl.textContent = types.filter(t => t.includes("home")).length;
    dashBusinessTripEl.textContent = types.filter(t => t.includes("trip") || t.includes("cesta")).length;
    dashOnLeaveEl.textContent = types.filter(t => t.includes("leave") || t.includes("dovolena")).length;

  } catch (error) {
    console.error("loadAdminDashboard:", error);
    resetDashboard();
  }
}

async function loadAdminData() {
  if (!isAdmin) {
    adminPanelEl.classList.add("hidden");
    return;
  }

  adminPanelEl.classList.remove("hidden");

  let locations = [];
  let todayRows = [];
  let employees = [];
  let leaveSummary = [];

  try {
    const [locationsRes, todayRes, employeesRes] = await Promise.all([
      supabaseClient.rpc("get_admin_today_locations"),
      supabaseClient.rpc("get_admin_today_attendance"),
      supabaseClient.rpc("get_admin_employees")
    ]);

    if (locationsRes.error) throw locationsRes.error;
    if (todayRes.error) throw todayRes.error;
    if (employeesRes.error) throw employeesRes.error;

    locations = locationsRes.data || [];
    todayRows = todayRes.data || [];
    employees = employeesRes.data || [];
  } catch (_) {
    const [{ data: aRows, error: aErr }, { data: eRows, error: eErr }] = await Promise.all([
      supabaseClient
        .from("attendance")
        .select("id, employee_id, date, office, type, time_from, time_to, break_minutes")
        .eq("date", todayStr()),
      supabaseClient
        .from("employees")
        .select("id, name, email, role, is_admin, active, offices, weekly, leave_days, leave_hours")
    ]);

    if (aErr) throw aErr;
    if (eErr) throw eErr;

    employees = eRows || [];
    const byEmployee = new Map(employees.map(e => [Number(e.id), e]));

    todayRows = (aRows || []).map(r => ({
      ...r,
      employee_name: byEmployee.get(Number(r.employee_id))?.name || ""
    }));

    locations = todayRows
      .filter(r => !r.time_to)
      .map(r => ({
        employee_name: byEmployee.get(Number(r.employee_id))?.name || "",
        employee_email: byEmployee.get(Number(r.employee_id))?.email || "",
        office: r.office,
        type: r.type,
        time_from: r.time_from
      }));
  }

  try {
    const { data, error } = await supabaseClient.rpc("get_admin_leave_summary");
    if (!error) leaveSummary = data || [];
  } catch (_) {}

  if (!leaveSummary.length) {
    leaveSummary = employees
      .filter(employee => !isEmployeeAdmin(employee))
      .map(e => ({
        employee_name: e.name,
        employee_email: e.email,
        leave_days_total: e.leave_days || 0,
        leave_hours_total: e.leave_hours || 0,
        leave_hours_used: 0,
        leave_hours_remaining: e.leave_hours || 0,
        leave_days_remaining: e.leave_days || 0
      }));
  }

  adminTodayAttendanceData = todayRows || [];
  adminEmployeesData = employees || [];
  adminEmployeesData = (employees || []).filter(employee => !isEmployeeAdmin(employee));
  adminLeaveData = leaveSummary || [];

  fillAdminLeaveEmployeeOptions();
  fillAdminHistoryEmployeeOptions();
  fillEditAttendanceEmployeeOptions();

  adminActiveWrapEl.innerHTML = renderSimpleTable(
    [
      { label: "Zaměstnanec", render: r => escapeHtml(r.employee_name || "") },
@@ -1939,8 +2261,10 @@
    ],
    locations || []
  );

  renderAdminTodayTable();
  renderAttendanceIssues(adminTodayAttendanceData);

  adminLeaveWrapEl.innerHTML = renderSimpleTable(
    [
      { label: "Zaměstnanec", render: r => escapeHtml(r.employee_name || "") },
@@ -1953,8 +2277,10 @@
    ],
    adminLeaveData
  );

  renderEmployeesTable();
  await loadAdminLeaveRequests();

  if (!adminHistoryMonthEl.value) adminHistoryMonthEl.value = currentMonthStr();
  if (!auditMonthEl.value) auditMonthEl.value = currentMonthStr();
}
@@ -1977,7 +2303,10 @@
    await loadMyLeaveRequests();
    await loadAdminData();
    await loadAdminDashboard();
    if (!isAdmin) setMessage(attendanceMessageEl, myOpenShift ? "Máš otevřenou směnu." : "Nemáš otevřenou směnu.", "ok");

    if (!isAdmin) {
      setMessage(attendanceMessageEl, myOpenShift ? "Máš otevřenou směnu." : "Nemáš otevřenou směnu.", "ok");
    }
  } catch (error) {
    if (!isAdmin) setMessage(attendanceMessageEl, "Chyba načítání: " + (error?.message || String(error)), "err");
    console.error(error);
@@ -1986,15 +2315,18 @@

async function loadSession() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error || !data?.session?.user) {
    renderLoggedOut();
    return;
  }

  if (isPasswordRecoveryFlow) {
    showRecoveryView();
    setMessage(passwordResetMessageEl, "Reset link je aktivní. Nastav nové heslo.", "warn");
    return;
  }

  currentUser = data.session.user;
  showAppView();
  sessionTextEl.textContent = "Přihlášen: " + (currentUser.email || "");
@@ -2003,10 +2335,14 @@

loginBtn?.addEventListener("click", signIn);
logoutBtn?.addEventListener("click", signOut);

refreshBtn?.addEventListener("click", async () => {
  await loadAllData();
  if (isAdmin && adminHistoryEmployeeEl.value && adminHistoryMonthEl.value) await loadAdminAttendanceHistory();
  if (isAdmin && adminHistoryEmployeeEl.value && adminHistoryMonthEl.value) {
    await loadAdminAttendanceHistory();
  }
});

loadHistoryBtn?.addEventListener("click", loadAttendanceHistory);
adminLoadHistoryBtn?.addEventListener("click", loadAdminAttendanceHistory);
loadAuditBtn?.addEventListener("click", loadAttendanceAudit);
@@ -2044,41 +2380,52 @@
  const officeRow = officesData.find(x => Number(x.id) === Number(btn.dataset.id));
  if (officeRow) fillOfficeFormForEdit(officeRow);
});

employeesWrapEl?.addEventListener("click", e => {
  const btn = e.target.closest(".edit-employee-btn");
  if (!btn) return;
  const employee = adminEmployeesData.find(x => Number(x.id) === Number(btn.dataset.id));
  if (employee) fillEmployeeFormForEdit(employee);
});

adminTodayWrapEl?.addEventListener("click", e => {
  const btn = e.target.closest(".edit-attendance-btn");
  if (!btn) return;
  const row = adminTodayAttendanceData.find(x => Number(x.id) === Number(btn.dataset.id));
  if (row) fillAttendanceFormForEdit(row);
});

adminHistoryWrapEl?.addEventListener("click", e => {
  const btn = e.target.closest(".admin-history-edit-btn");
  if (!btn) return;
  const row = adminHistoryRows.find(x => Number(x.id) === Number(btn.dataset.id));
  if (row) fillAttendanceFormForEdit(row);
});

adminLeaveRequestsWrapEl?.addEventListener("click", e => {
  const approveBtn = e.target.closest(".approve-leave-btn");
  if (approveBtn) return approveLeaveRequestById(approveBtn.dataset.id);

  const rejectBtn = e.target.closest(".reject-leave-btn");
  if (rejectBtn) return rejectLeaveRequestById(rejectBtn.dataset.id);

  const cancelBtn = e.target.closest(".cancel-leave-btn");
  if (cancelBtn) return cancelApprovedLeaveRequestById(cancelBtn.dataset.id);
});

passwordEl?.addEventListener("keydown", e => {
  if (e.key === "Enter") signIn();
});

newPassword2El?.addEventListener("keydown", e => {
  if (e.key === "Enter") saveNewPassword();
});

registerCompanyBtn?.addEventListener("click", registerCompany);
showLoginBtn?.addEventListener("click", showLoginOnlyView);
showOnboardingBtn?.addEventListener("click", showOnboardingView);
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === "PASSWORD_RECOVERY") {
@@ -2087,10 +2434,12 @@
    setMessage(passwordResetMessageEl, "Reset link rozpoznán. Nastav nové heslo.", "warn");
    return;
  }

  if (isPasswordRecoveryFlow && !passwordWasJustChanged) {
    showRecoveryView();
    return;
  }

  if (session?.user) {
    currentUser = session.user;
    showAppView();
@@ -2134,5 +2483,6 @@
    setMessage(passwordResetMessageEl, "Odkaz pro reset hesla byl rozpoznán. Nastav nové heslo.", "warn");
    return;
  }

  await loadSession();
})();
