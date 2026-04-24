const APP_CONFIG = window.APP_CONFIG || {};

const SUPABASE_URL = APP_CONFIG.SUPABASE_URL || "";
const SUPABASE_KEY = APP_CONFIG.SUPABASE_KEY || "";
const APP_VERSION = APP_CONFIG.APP_VERSION || "dev";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Chybí konfigurace aplikace. Zkontroluj soubor config.js.");
}

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

console.log("SUPABASE_URL:", SUPABASE_URL);
console.log("APP VERSION:", APP_VERSION);

const $ = (id) => document.getElementById(id);

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
  offlineBannerEl = $("offlineBanner");

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
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, " ")
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

  if (!start || !end || end <= start) {
    return Number(row.break_minutes || 0);
  }

  const raw = Math.round((end.getTime() - start.getTime()) / 60000);

  if (raw <= 360) return 0;

  return Number(row.break_minutes || 0);
}

function getWorkedMinutes(row) {
  const type = normalizeText(row.type);
  if (type === "dovolena" || type === "leave" || type === "vacation") return 0;

  const start = parseRowDateTime(row.date, row.time_from);
  const end = parseRowDateTime(row.date, row.time_to);

  if (!start || !end || end <= start) return 0;

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

  if (n === "prace" || n === "work") return `<span class="type-badge type-work">${safe}</span>`;
  if (n === "home office" || n === "homeoffice") return `<span class="type-badge type-home-office">${safe}</span>`;
  if (n === "sluzebni cesta" || n === "business trip" || n === "trip") return `<span class="type-badge type-business-trip">${safe}</span>`;
  if (n === "k lekari" || n === "lekar" || n === "doctor" || n === "medical") return `<span class="type-badge type-doctor">${safe}</span>`;
  if (n === "dovolena" || n === "vacation" || n === "leave") return `<span class="type-badge type-vacation">${safe}</span>`;

  return `<span class="type-badge type-default">${safe}</span>`;
}

function renderLeaveStatusBadge(status) {
  const n = normalizeText(status);

  if (n === "pending" || n === "ceka" || n === "čeká") return `<span class="pill pill-warn">${escapeHtml(status || "pending")}</span>`;
  if (n === "approved" || n === "schvaleno" || n === "schváleno") return `<span class="pill pill-active">${escapeHtml(status || "approved")}</span>`;
  if (n === "rejected" || n === "zamitnuto" || n === "zamítnuto") return `<span class="pill pill-inactive">${escapeHtml(status || "rejected")}</span>`;
  if (n === "cancelled" || n === "storno" || n === "stornováno" || n === "stornovano") return `<span class="pill pill-inactive">${escapeHtml(status || "cancelled")}</span>`;

  return `<span class="pill pill-warn">${escapeHtml(status || "—")}</span>`;
}

function renderSimpleTable(columns, rows) {
  if (!rows || !rows.length) return `<div class="empty-box">Žádná data.</div>`;

  const thead = columns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join("");
  const tbody = rows
    .map((row) => `<tr>${columns.map((c) => `<td>${c.render ? c.render(row) : escapeHtml(row[c.key])}</td>`).join("")}</tr>`)
    .join("");

  return `<div class="table-wrap"><table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table></div>`;
}

function getAttendanceRowsForMonth(rows, monthStr) {
  return (rows || [])
    .filter((r) => r?.date && String(r.date).startsWith(monthStr))
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || Number(b.id || 0) - Number(a.id || 0));
}

function getMonthlySummary(rows) {
  const month = currentMonthStr();
  const workDays = new Set();
  const leaveDays = new Set();
  let totalWorkedMinutes = 0;

  for (const row of rows) {
    if (!row?.date || !String(row.date).startsWith(month)) continue;
    const type = normalizeText(row.type);

    if (type === "dovolena" || type === "vacation" || type === "leave") {
      leaveDays.add(row.date);
      continue;
    }

    const wm = getWorkedMinutes(row);
    if (wm > 0) {
      totalWorkedMinutes += wm;
      workDays.add(row.date);
    }
  }

  return {
    month,
    totalWorkedMinutes,
    workDays: workDays.size,
    leaveDays: leaveDays.size
  };
}

function getTodayWorkedMinutes(rows) {
  const today = todayStr();
  return (rows || []).filter((r) => r?.date === today).reduce((sum, row) => sum + getWorkedMinutes(row), 0);
}

function getExpectedMonthlyMinutes(employee, monthStr) {
  const normalizedWeekly = normalizeText(employee?.weekly || "");
  const uniqueWorkDays = new Set(
    getAttendanceRowsForMonth(myAttendanceRows, monthStr)
      .filter((row) => {
        const t = normalizeText(row.type);
        return t !== "dovolena" && t !== "vacation" && t !== "leave";
      })
      .map((row) => row.date)
  ).size;

  if (!uniqueWorkDays) return 0;
  if (normalizedWeekly.includes("polovicni") || normalizedWeekly.includes("poloviční") || normalizedWeekly.includes("0.5")) return uniqueWorkDays * 240;
  if (normalizedWeekly.includes("zkraceny") || normalizedWeekly.includes("zkrácený") || normalizedWeekly.includes("6h")) return uniqueWorkDays * 360;
  return uniqueWorkDays * 480;
}

function buildOfficeOptions(includeInactive = false) {
  return (officesData || [])
    .filter((r) => includeInactive || r.active !== false)
    .sort((a, b) => (Number(a.sort_order || 0) - Number(b.sort_order || 0)) || String(a.name || "").localeCompare(String(b.name || ""), "cs"));
}

function getOfficeIdByName(name) {
  const match = (officesData || []).find((r) => normalizeText(r.name) === normalizeText(name));
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

  if (selectedString && [...selectEl.options].some((opt) => opt.value === selectedString)) {
    selectEl.value = selectedString;
    return;
  }

  const mappedId = getOfficeIdByName(selectedString);
  if (mappedId && [...selectEl.options].some((opt) => opt.value === mappedId)) {
    selectEl.value = mappedId;
    return;
  }

  selectEl.selectedIndex = 0;
}

function normalizeAttendanceEditFields() {
  if (!editAttendanceTypeEl) return;

  const type = normalizeText(editAttendanceTypeEl.value);

  if (type === "dovolena" || type === "leave" || type === "vacation") {
    if (editAttendanceTimeFromEl) editAttendanceTimeFromEl.value = "";
    if (editAttendanceTimeToEl) editAttendanceTimeToEl.value = "";
    if (editAttendanceBreakMinutesEl) editAttendanceBreakMinutesEl.value = "0";
  }
}

function applyAppSettings() {
  const appName = currentAppSettings?.app_name || "Docházkový systém";
  const companyName = currentAppSettings?.company_name || "";
  const title = companyName ? `${appName} — ${companyName}` : appName;

  document.title = title;

  const brandEl = document.querySelector(".brand");
  if (brandEl) brandEl.textContent = appName;

  const topTitle = document.querySelector("title");
  if (topTitle) topTitle.textContent = title;

  if (currentAppSettings?.primary_color) {
    document.documentElement.style.setProperty("--primary", currentAppSettings.primary_color);
  }
}

async function loadAppSettings() {
  try {
    const { data, error } = await supabaseClient.rpc("get_app_settings");
    if (!error && Array.isArray(data) && data.length) {
      currentAppSettings = data[0];
      applyAppSettings();
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
  } catch (error) {
    console.error("Chyba app settings:", error);
  }
}

function renderMonthlySummary() {
  if (!currentEmployee || isAdmin) {
    myMonthlySummaryCardEl.classList.add("hidden");
    timeSummaryCardEl.classList.add("hidden");
    monthlySummaryLabelEl.textContent = "aktuální měsíc";
    monthlyWorkedValueEl.textContent = "—";
    monthlyWorkDaysValueEl.textContent = "—";
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
    timeSummaryLabelEl.textContent = "dnes a aktuální měsíc";
    todayWorkedValueEl.textContent = "00:00";
    monthWorkedSummaryValueEl.textContent = "00:00";
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
    myAttendanceHistoryWrapEl.innerHTML = `<div class="empty-box">Žádná data.</div>`;
    historySummaryLabelEl.textContent = "vybraný měsíc";
    historyRecordsValueEl.textContent = "0";
    historyWorkedValueEl.textContent = "00:00";
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
      { label: "Datum", render: (r) => escapeHtml(r.date || "") },
      { label: "Od", render: (r) => escapeHtml(r.time_from || "—") },
      { label: "Do", render: (r) => escapeHtml(r.time_to || "—") },
      { label: "Hodiny", render: (r) => escapeHtml(formatWorkedMinutes(getWorkedMinutes(r))) },
      { label: "Typ", render: (r) => renderAttendanceTypeBadge(r.type || "") },
      { label: "Místo", render: (r) => escapeHtml(r.office || "—") },
      { label: "Přestávka", render: (r) => escapeHtml(getAutoBreakMinutes(r) + " min") }
    ],
    rows
  );
}

async function loadAttendanceHistory() {
  if (!currentEmployee || isAdmin) {
    myAttendanceHistoryRows = [];
    renderAttendanceHistory();
    return;
  }

  const { data, error } = await supabaseClient.rpc("get_my_attendance_rows", { p_limit: 366 });
  if (error) throw error;

  myAttendanceHistoryRows = Array.isArray(data) ? data : [];
  renderAttendanceHistory();
}

async function getMonthLockStatus(monthStr) {
  try {
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

    setMessage(
      lockMonthMessageEl,
      locked ? `Měsíc ${formatMonthLabel(monthStr)} byl zamčen.` : `Měsíc ${formatMonthLabel(monthStr)} byl odemčen.`,
      locked ? "err" : "ok"
    );
  } catch (error) {
    setMessage(lockMonthMessageEl, "Chyba při změně uzávěrky: " + error.message, "err");
  }
}

function filterTodayRows(rows) {
  return (rows || []).filter((r) => {
    if (currentTodayFilter === "all") return true;

    const type = normalizeText(r.type || "");
    if (currentTodayFilter === "work") return type === "work" || type === "prace";
    if (currentTodayFilter === "home") return type.includes("home");
    if (currentTodayFilter === "trip") return type.includes("trip") || type.includes("cesta");
    if (currentTodayFilter === "leave") return type.includes("leave") || type.includes("dovolena");

    return true;
  });
}

function updateTodayFilterButtons() {
  todayFilterButtons.forEach((btn) => btn.classList.toggle("active-filter", (btn.dataset.filter || "all") === currentTodayFilter));
}

function renderAdminTodayTable() {
  const filtered = filterTodayRows(adminTodayAttendanceData);

  adminTodayWrapEl.innerHTML = renderSimpleTable(
    [
      { label: "ID", render: (r) => escapeHtml(r.id) },
      { label: "Zaměstnanec", render: (r) => escapeHtml(r.employee_name || "") },
      { label: "Místo", render: (r) => escapeHtml(r.office || "") },
      { label: "Typ", render: (r) => renderAttendanceTypeBadge(r.type || "") },
      { label: "Od", render: (r) => escapeHtml(r.time_from || "—") },
      { label: "Do", render: (r) => escapeHtml(r.time_to || "—") },
      { label: "Přestávka", render: (r) => escapeHtml(getAutoBreakMinutes(r) + " min") },
      { label: "Odpracováno", render: (r) => escapeHtml(formatWorkedMinutes(getWorkedMinutes(r))) },
      { label: "Akce", render: (r) => `<button type="button" class="btn-secondary edit-attendance-btn" data-id="${r.id}">Upravit</button>` }
    ],
    filtered
  );

  updateTodayFilterButtons();
}
async function loadAttendanceAudit() {
  if (!isAdmin) return;

  const month = auditMonthEl.value;
  if (!month) {
    auditWrapEl.innerHTML = `<div class="empty-box">Vyber měsíc.</div>`;
    return;
  }

  try {
    const { data, error } = await supabaseClient.rpc("get_attendance_audit_by_month", { p_month: month });
    if (error) throw error;

    auditRows = Array.isArray(data) ? data : [];
    auditWrapEl.innerHTML = renderSimpleTable(
      [
        { label: "Kdy", render: (r) => escapeHtml(r.changed_at || "—") },
        { label: "Zaměstnanec", render: (r) => escapeHtml(r.employee_name || "—") },
        { label: "Akce", render: (r) => escapeHtml(r.action || r.action_type || "—") },
        { label: "Před", render: (r) => escapeHtml(JSON.stringify(r.old_data || r.old_value || "")) },
        { label: "Po", render: (r) => escapeHtml(JSON.stringify(r.new_data || r.new_value || "")) }
      ],
      auditRows
    );
  } catch (error) {
    auditWrapEl.innerHTML = `<div class="empty-box">Chyba načítání auditu: ${escapeHtml(error.message)}</div>`;
  }
}

function buildAttendanceIssues(rows) {
  const issues = [];

  for (const row of rows || []) {
    const employeeName = row.employee_name || "Neznámý zaměstnanec";
    const dateText = row.date || "bez data";
    const start = parseRowDateTime(row.date, row.time_from);
    const end = parseRowDateTime(row.date, row.time_to);
    const rawMinutes = start && end && end > start ? Math.round((end.getTime() - start.getTime()) / 60000) : 0;
    const breakMinutes = Number(getAutoBreakMinutes(row) || 0);

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
      { label: "Priorita", render: (r) => r.severity === "err" ? `<span class="pill pill-inactive">chyba</span>` : `<span class="pill pill-warn">pozor</span>` },
      { label: "Zaměstnanec", render: (r) => escapeHtml(r.employee_name) },
      { label: "Datum", render: (r) => escapeHtml(r.date) },
      { label: "Problém", render: (r) => escapeHtml(r.issue) },
      { label: "Detail", render: (r) => escapeHtml(r.detail) }
    ],
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

  setMessage(
    adminHistorySummaryEl,
    `Měsíc ${formatMonthLabel(month)} · záznamy ${adminHistoryRows.length} · odpracováno ${formatWorkedMinutes(totalWorkedMinutes)} · dny v práci ${workDays.size}`,
    "ok"
  );

  adminHistoryWrapEl.innerHTML = renderSimpleTable(
    [
      { label: "ID", render: (r) => escapeHtml(r.id || "") },
      { label: "Datum", render: (r) => escapeHtml(r.date || "") },
      { label: "Od", render: (r) => escapeHtml(r.time_from || "—") },
      { label: "Do", render: (r) => escapeHtml(r.time_to || "—") },
      { label: "Hodiny", render: (r) => escapeHtml(formatWorkedMinutes(getWorkedMinutes(r))) },
      { label: "Typ", render: (r) => renderAttendanceTypeBadge(r.type || "") },
      { label: "Místo", render: (r) => escapeHtml(r.office || "—") },
      { label: "Přestávka", render: (r) => escapeHtml(getAutoBreakMinutes(r) + " min") },
      { label: "Akce", render: (r) => `<button type="button" class="btn-secondary admin-history-edit-btn" data-id="${r.id}">Upravit</button>` }
    ],
    adminHistoryRows
  );
}

function updateRoleVisibility() {
  if (isAdmin) {
    employeeOnlyBlockEl.classList.add("hidden");
    myAttendanceCardEl.classList.add("hidden");
    myAttendanceHistoryCardEl.classList.add("hidden");
    myMonthlySummaryCardEl.classList.add("hidden");
    timeSummaryCardEl.classList.add("hidden");
    adminPanelEl.classList.remove("hidden");
  } else {
    employeeOnlyBlockEl.classList.remove("hidden");
    myAttendanceCardEl.classList.remove("hidden");
    myAttendanceHistoryCardEl.classList.remove("hidden");
    myMonthlySummaryCardEl.classList.remove("hidden");
    timeSummaryCardEl.classList.remove("hidden");
    adminPanelEl.classList.add("hidden");
  }
}

function fillAdminLeaveEmployeeOptions() {
  adminLeaveEmployeeEl.innerHTML = "";

  adminEmployeesData
    .filter((e) => !isEmployeeAdmin(e))
    .forEach((employee) => {
      const option = document.createElement("option");
      option.value = employee.id;
      option.textContent = `${employee.name || ""} (${employee.email || ""})`;
      adminLeaveEmployeeEl.appendChild(option);
    });
}

function fillAdminHistoryEmployeeOptions() {
  adminHistoryEmployeeEl.innerHTML = "";

  adminEmployeesData
    .filter((e) => !isEmployeeAdmin(e))
    .forEach((employee) => {
      const option = document.createElement("option");
      option.value = employee.id;
      option.textContent = `${employee.name || ""} (${employee.email || ""})`;
      adminHistoryEmployeeEl.appendChild(option);
    });
}

function fillEditAttendanceEmployeeOptions() {
  editAttendanceEmployeeEl.innerHTML = "";
  const filtered = adminEmployeesData.filter((e) => !isEmployeeAdmin(e));

  if (!filtered.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Žádní zaměstnanci";
    editAttendanceEmployeeEl.appendChild(option);
    return;
  }

  filtered.forEach((employee) => {
    const option = document.createElement("option");
    option.value = employee.id;
    option.textContent = `${employee.name || ""} (${employee.email || ""})`;
    editAttendanceEmployeeEl.appendChild(option);
  });
}

function renderRoleBadge(role) {
  return normalizeText(role) === "admin"
    ? `<span class="pill pill-admin">admin</span>`
    : `<span class="pill pill-employee">employee</span>`;
}

function renderActiveBadge(active) {
  return active
    ? `<span class="pill pill-active">aktivní</span>`
    : `<span class="pill pill-inactive">neaktivní</span>`;
}

function getFilteredEmployees() {
  const search = normalizeText(employeeSearchInputEl?.value || "");
  const roleFilter = employeeRoleFilterEl?.value || "all";
  const activeFilter = employeeActiveFilterEl?.value || "all";

  return [...adminEmployeesData]
    .filter((employee) => {
      if (roleFilter !== "all" && String(employee.role || "") !== roleFilter) return false;
      if (activeFilter === "active" && !(employee.active !== false)) return false;
      if (activeFilter === "inactive" && employee.active !== false) return false;
      if (!search) return true;

      const haystack = normalizeText([employee.name, employee.email, employee.offices, employee.role].join(" "));
      return haystack.includes(search);
    })
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "cs"));
}

function renderEmployeesTable() {
  filteredAdminEmployeesData = getFilteredEmployees();

  employeesWrapEl.innerHTML = renderSimpleTable(
    [
      { label: "Jméno", render: r => escapeHtml(r.name || "") },
      { label: "E-mail", render: r => escapeHtml(r.email || "") },
      { label: "Role", render: r => renderRoleBadge(r.role || "employee") },
      { label: "Stav", render: r => renderActiveBadge(r.active !== false) },
      { label: "Offices", render: r => escapeHtml(r.offices || "—") },
      {
        label: "Akce",
        render: r => `
          <div class="actions">
            <button type="button" class="btn-secondary edit-employee-btn" data-id="${r.id}">Upravit</button>
            <button type="button" class="btn-success resend-invite-btn" data-email="${escapeHtml(r.email || "")}">Poslat pozvánku znovu</button>
          </div>
        `
      }
    ],
    filteredAdminEmployeesData
  );
}

function resetOfficeForm() {
  editOfficeId = null;
  officeNameEl.value = "";
  officeSortOrderEl.value = "0";
  officeActiveEl.value = "true";
  saveOfficeBtn.textContent = "Uložit místo";
  saveOfficeBtn.className = "btn-success";
  cancelOfficeEditBtn.classList.add("hidden");
  setMessage(officeMessageEl, "Přidej nové místo nebo uprav existující.", "warn");
}

function fillOfficeFormForEdit(officeRow) {
  editOfficeId = officeRow.id;
  officeNameEl.value = officeRow.name || "";
  officeSortOrderEl.value = String(officeRow.sort_order ?? 0);
  officeActiveEl.value = String(officeRow.active !== false);
  saveOfficeBtn.textContent = "Uložit změny";
  saveOfficeBtn.className = "btn-primary";
  cancelOfficeEditBtn.classList.remove("hidden");
  setMessage(officeMessageEl, `Upravuješ místo ID ${officeRow.id}: ${officeRow.name}`, "warn");
}

function renderOfficesAdminTable() {
  officesWrapEl.innerHTML = renderSimpleTable(
    [
      { label: "ID", render: (r) => escapeHtml(r.id) },
      { label: "Název", render: (r) => escapeHtml(r.name || "") },
      { label: "Pořadí", render: (r) => escapeHtml(r.sort_order ?? 0) },
      { label: "Stav", render: (r) => r.active !== false ? `<span class="pill pill-active">aktivní</span>` : `<span class="pill pill-inactive">neaktivní</span>` },
      { label: "Akce", render: (r) => `<button type="button" class="btn-secondary edit-office-btn" data-id="${r.id}">Upravit</button>` }
    ],
    buildOfficeOptions(true)
  );
}

async function loadOffices() {
  try {
    const { data, error } = await supabaseClient.rpc("get_offices");
    if (!error) {
      officesData = Array.isArray(data) ? data : [];
    } else {
      throw error;
    }
  } catch (_) {
    const { data, error } = await supabaseClient
      .from("offices")
      .select("id, name, sort_order, active")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    officesData = Array.isArray(data) ? data : [];
  }

  fillOfficeSelect(officeEl, officeEl?.value);
  fillOfficeSelect(manualAttendanceOfficeEl, manualAttendanceOfficeEl?.value);
  fillOfficeSelect(editAttendanceOfficeEl, editAttendanceOfficeEl?.value);
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
      if (error) throw error;

      await loadOffices();
      resetOfficeForm();
      return setMessage(officeMessageEl, "Místo bylo upraveno.", "ok");
    }

    const { error } = await supabaseClient.rpc("admin_create_office", { p_name, p_sort_order });
    if (error) throw error;

    await loadOffices();
    resetOfficeForm();
    setMessage(officeMessageEl, "Místo bylo vytvořeno.", "ok");
  } catch (error) {
    setMessage(officeMessageEl, "Chyba při ukládání místa: " + error.message, "err");
  }
}

function resetEmployeeForm() {
  editEmployeeId = null;
  employeeFormTitleEl.textContent = "Nový zaměstnanec";
  createEmployeeBtn.textContent = "Přidat zaměstnance";
  createEmployeeBtn.className = "btn-success";
  cancelEditEmployeeBtn.classList.add("hidden");
  newEmployeeNameEl.value = "";
  newEmployeeEmailEl.value = "";
  newEmployeeRoleEl.value = "employee";
  newEmployeeOfficesEl.value = "";
  newEmployeeWeeklyEl.value = "";
  newEmployeeLeaveDaysEl.value = "20";
  newEmployeeLeaveHoursEl.value = "160";
  newEmployeeActiveEl.value = "true";
  setMessage(createEmployeeMessageEl, "Vyplň údaje a ulož.", "warn");
}

function fillEmployeeFormForEdit(employee) {
  editEmployeeId = employee.id;
  employeeFormTitleEl.textContent = "Upravit zaměstnance";
  createEmployeeBtn.textContent = "Uložit změny";
  createEmployeeBtn.className = "btn-primary";
  cancelEditEmployeeBtn.classList.remove("hidden");
  newEmployeeNameEl.value = employee.name || "";
  newEmployeeEmailEl.value = employee.email || "";
  newEmployeeRoleEl.value = employee.role || "employee";
  newEmployeeOfficesEl.value = employee.offices || "";
  newEmployeeWeeklyEl.value = employee.weekly || "";
  newEmployeeLeaveDaysEl.value = employee.leave_days ?? 0;
  newEmployeeLeaveHoursEl.value = employee.leave_hours ?? 0;
  newEmployeeActiveEl.value = String(employee.active !== false);
  setMessage(createEmployeeMessageEl, `Upravuješ zaměstnance ID ${employee.id}: ${employee.name}`, "warn");
  window.scrollTo({ top: adminPanelEl.offsetTop, behavior: "smooth" });
}

function resetAttendanceEditForm() {
  editAttendanceId = null;
  attendanceFormTitleEl.textContent = "Upravit / vložit docházku";
  if (editAttendanceEmployeeEl.options.length > 0) editAttendanceEmployeeEl.selectedIndex = 0;
  editAttendanceDateEl.value = todayStr();
  fillOfficeSelect(editAttendanceOfficeEl, editAttendanceOfficeEl.options[0]?.value || "");
  editAttendanceTypeEl.value = "práce";
  editAttendanceTimeFromEl.value = "";
  editAttendanceTimeToEl.value = "";
  editAttendanceBreakMinutesEl.value = "30";
  deleteAttendanceBtn.classList.add("hidden");
  cancelAttendanceEditBtn.classList.add("hidden");
  setMessage(attendanceEditMessageEl, "Pro nový záznam vyplň pole a klikni na Vložit ručně. Pro úpravu klikni v tabulce docházky na Upravit.", "warn");
}

function resetManualAttendanceForm() {
  manualAttendanceDateEl.value = todayStr();
  manualAttendanceOfficeEl.value = officeEl.value || manualAttendanceOfficeEl.options[0]?.value || "";
  manualAttendanceTypeEl.value = attendanceTypeEl.value || "práce";
  manualAttendanceBreakMinutesEl.value = breakMinutesEl.value || "30";
  manualAttendanceTimeFromEl.value = "";
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

  if (row.employee_id !== undefined && row.employee_id !== null) {
    editAttendanceEmployeeEl.value = String(row.employee_id);
  }

  editAttendanceDateEl.value = row.date || "";
  editAttendanceOfficeEl.value = getOfficeIdByName(row.office || "") || editAttendanceOfficeEl.options[0]?.value || "";
  editAttendanceTypeEl.value = row.type || "práce";
  editAttendanceTimeFromEl.value = row.time_from || "";
  editAttendanceTimeToEl.value = row.time_to || "";
  editAttendanceBreakMinutesEl.value = row.break_minutes ?? 30;
  deleteAttendanceBtn.classList.remove("hidden");
  cancelAttendanceEditBtn.classList.remove("hidden");
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
  loginView.classList.remove("hidden");
  passwordResetView.classList.add("hidden");
  appView.classList.add("hidden");
}

function showRecoveryView() {
  loginView.classList.add("hidden");
  appView.classList.add("hidden");
  passwordResetView.classList.remove("hidden");
}

function showAppView() {
  loginView.classList.add("hidden");
  passwordResetView.classList.add("hidden");
  appView.classList.remove("hidden");
}

function cleanRecoveryUrl() {
  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);
}

function detectRecoveryModeFromUrl() {
  const hash = window.location.hash || "";
  const search = window.location.search || "";

  return (
    hash.includes("type=recovery") ||
    hash.includes("type=invite") ||
    hash.includes("type=signup") ||
    hash.includes("type=PASSWORD_RECOVERY") ||
    search.includes("type=recovery") ||
    search.includes("type=invite") ||
    search.includes("type=signup") ||
    search.includes("type=PASSWORD_RECOVERY") ||
    hash.includes("access_token=") ||
    search.includes("access_token=")
  );
}

async function ensureRecoverySessionFromUrl() {
  try {
    const hash = window.location.hash || "";
    const search = window.location.search || "";

    const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
    const searchParams = new URLSearchParams(search);

    const access_token = hashParams.get("access_token") || searchParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token") || searchParams.get("refresh_token");
    const type =
      hashParams.get("type") ||
      searchParams.get("type") ||
      "";

    if (access_token && refresh_token) {
      const { error } = await supabaseClient.auth.setSession({
        access_token,
        refresh_token
      });

      if (error) {
        throw error;
      }

      return true;
    }

    const code = searchParams.get("code");
    if (code) {
      const { error } = await supabaseClient.auth.exchangeCodeForSession(code);
      if (error) {
        throw error;
      }
      return true;
    }

    const { data } = await supabaseClient.auth.getSession();
    if (data?.session) {
      return true;
    }

    if (
      type === "recovery" ||
      type === "invite" ||
      type === "signup" ||
      type === "PASSWORD_RECOVERY"
    ) {
      return false;
    }

    return false;
  } catch (error) {
    console.error("ensureRecoverySessionFromUrl:", error);
    return false;
  }
}

async function ensureSessionFromUrl() {
  const hash = window.location.hash || "";
  const params = new URLSearchParams(hash.replace(/^#/, ""));

  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");

  if (!access_token || !refresh_token) return false;

  const { error } = await supabaseClient.auth.setSession({
    access_token,
    refresh_token
  });

  if (error) {
    console.error("setSession error:", error);
    return false;
  }

  return true;
}

async function saveNewPassword() {
  const p1 = newPasswordEl.value;
  const p2 = newPassword2El.value;

  if (!p1 || p1.length < 6) {
    return setMessage(passwordResetMessageEl, "Heslo musí mít alespoň 6 znaků.", "err");
  }

  if (p1 !== p2) {
    return setMessage(passwordResetMessageEl, "Hesla se neshodují.", "err");
  }

  setMessage(passwordResetMessageEl, "Ověřuji pozvánku…", "warn");

  await ensureSessionFromUrl();

  const { data: sessionData } = await supabaseClient.auth.getSession();

  if (!sessionData?.session) {
    return setMessage(
      passwordResetMessageEl,
      "Pozvánka není aktivní. Otevři odkaz z e-mailu znovu ve stejném prohlížeči.",
      "err"
    );
  }

  setMessage(passwordResetMessageEl, "Ukládám nové heslo…", "warn");

  const { error } = await supabaseClient.auth.updateUser({
    password: p1
  });

  if (error) {
    return setMessage(passwordResetMessageEl, "Chyba: " + error.message, "err");
  }

  passwordWasJustChanged = true;
  isPasswordRecoveryFlow = false;

  newPasswordEl.value = "";
  newPassword2El.value = "";

  cleanRecoveryUrl();

  await supabaseClient.auth.signOut();

  passwordWasJustChanged = false;
  renderLoggedOut();

  setMessage(loginMessageEl, "Heslo bylo nastaveno. Teď se přihlas novým heslem.", "ok");
}
  setMessage(passwordResetMessageEl, "Ukládám nové heslo…", "warn");

  const { error } = await supabaseClient.auth.updateUser({ password: p1 });

  if (error) {
    return setMessage(passwordResetMessageEl, "Chyba: " + error.message, "err");
  }

  passwordWasJustChanged = true;
  isPasswordRecoveryFlow = false;

  setMessage(
    passwordResetMessageEl,
    "Heslo bylo změněno. Probíhá návrat na přihlášení…",
    "ok"
  );

  newPasswordEl.value = "";
  newPassword2El.value = "";

  await supabaseClient.auth.signOut();
  cleanRecoveryUrl();

  passwordWasJustChanged = false;
  renderLoggedOut();
  setMessage(loginMessageEl, "Heslo bylo změněno. Teď se přihlas novým heslem.", "ok");
}

(async function bootstrap() {
  lockMonthEl.value = previousMonthStr();
  exportMonthEl.value = currentMonthStr();
  historyMonthEl.value = currentMonthStr();
  adminHistoryMonthEl.value = currentMonthStr();
  auditMonthEl.value = currentMonthStr();
  adminLeaveDateEl.value = todayStr();
  manualAttendanceDateEl.value = todayStr();

  isPasswordRecoveryFlow = detectRecoveryModeFromUrl();

  renderLoggedOut();
  updateOnlineStatus();

  if ("serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map(k => caches.delete(k)));
      console.log("Service Worker odstraněn a cache smazána");
    } catch (err) {
      console.error("Chyba při odstraňování Service Workeru:", err);
    }
  }

  if (isPasswordRecoveryFlow) {
    showRecoveryView();

    const recoveryReady = await ensureRecoverySessionFromUrl();

    if (recoveryReady) {
      setMessage(
        passwordResetMessageEl,
        "Odkaz pro nastavení hesla byl rozpoznán. Zadej nové heslo.",
        "warn"
      );
    } else {
      setMessage(
        passwordResetMessageEl,
        "Nepodařilo se aktivovat reset session z odkazu. Otevři znovu odkaz z e-mailu.",
        "err"
      );
    }

    return;
  }

  await loadSession();
})();
function renderLoggedOut() {
  if (isPasswordRecoveryFlow) showRecoveryView();
  else showLoginView();

  currentUser = null;
  currentEmployee = null;
  myAttendanceRows = [];
  myAttendanceHistoryRows = [];
  myOpenShift = null;
  myLeaveSummary = null;
  isAdmin = false;
  adminEmployeesData = [];
  filteredAdminEmployeesData = [];
  adminTodayAttendanceData = [];
  adminLeaveData = [];
  adminLeaveRequestsRows = [];
  myLeaveRequestsRows = [];
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
  openShiftValueEl.textContent = "—";
  todayArrivalValueEl.textContent = "—";
  todayDepartureValueEl.textContent = "—";
  leaveTotalHoursValueEl.textContent = "—";
  leaveUsedHoursValueEl.textContent = "—";
  leaveRemainingDaysValueEl.textContent = "—";
  monthlySummaryLabelEl.textContent = "aktuální měsíc";
  monthlyWorkedValueEl.textContent = "—";
  monthlyWorkDaysValueEl.textContent = "—";
  monthlyLeaveDaysValueEl.textContent = "—";
  timeSummaryLabelEl.textContent = "dnes a aktuální měsíc";
  todayWorkedValueEl.textContent = "00:00";
  monthWorkedSummaryValueEl.textContent = "00:00";
  overtimeValueEl.textContent = "00:00";
  employeeOfficesInfoEl.value = "";
  myAttendanceWrapEl.innerHTML = `<div class="empty-box">Zatím žádné záznamy.</div>`;
  myAttendanceHistoryWrapEl.innerHTML = `<div class="empty-box">Vyber měsíc a načti historii docházky.</div>`;
  myLeaveRequestsWrapEl.innerHTML = `<div class="empty-box">Po přihlášení uvidíš své žádosti.</div>`;
  historyMonthEl.value = currentMonthStr();
  historySummaryLabelEl.textContent = "vybraný měsíc";
  historyRecordsValueEl.textContent = "0";
  historyWorkedValueEl.textContent = "00:00";
  historyDaysValueEl.textContent = "0";
  adminActiveWrapEl.innerHTML = `<div class="empty-box">Načítám…</div>`;
  adminTodayWrapEl.innerHTML = `<div class="empty-box">Načítám…</div>`;
  attendanceIssuesWrapEl.innerHTML = `<div class="empty-box">Načítám kontroly…</div>`;
  adminLeaveWrapEl.innerHTML = `<div class="empty-box">Načítám…</div>`;
  adminLeaveRequestsWrapEl.innerHTML = `<div class="empty-box">Načítám žádosti…</div>`;
  auditWrapEl.innerHTML = `<div class="empty-box">Vyber měsíc a načti audit log.</div>`;
  adminHistoryWrapEl.innerHTML = `<div class="empty-box">Vyber zaměstnance a měsíc.</div>`;
  officesWrapEl.innerHTML = `<div class="empty-box">Načítám místa…</div>`;
  setMessage(adminHistorySummaryEl, "Vyber zaměstnance a měsíc.", "warn");
  setMessage(lockMonthMessageEl, "Vyber měsíc a zjisti stav uzávěrky.", "warn");
  employeesWrapEl.innerHTML = `<div class="empty-box">Načítám zaměstnance…</div>`;
  employeeSearchInputEl.value = "";
  employeeRoleFilterEl.value = "all";
  employeeActiveFilterEl.value = "all";
  adminLeaveEmployeeEl.innerHTML = "";
  adminHistoryEmployeeEl.innerHTML = "";
  editAttendanceEmployeeEl.innerHTML = "";
  lockMonthEl.value = previousMonthStr();
  exportMonthEl.value = currentMonthStr();
  adminHistoryMonthEl.value = currentMonthStr();
  auditMonthEl.value = currentMonthStr();
  sessionTextEl.textContent = isPasswordRecoveryFlow ? "Probíhá reset hesla." : "Nikdo není přihlášen.";
  updateTodayFilterButtons();
  resetAttendanceEditForm();
  resetManualAttendanceForm();
  resetLeaveRequestForm();
  setMessage(attendanceMessageEl, "Přihlas se a načti docházku.", "warn");
  setMessage(adminLeaveMessageEl, "Vyber zaměstnance, datum a hodiny.", "warn");
  setMessage(exportMessageEl, "Vyber měsíc a klikni na export.", "warn");
  setMessage(passwordResetMessageEl, "Zadej nové heslo.", "warn");
}

async function signIn() {
  if (isPasswordRecoveryFlow) {
    showRecoveryView();
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

  newPasswordEl.value = "";
  newPassword2El.value = "";
  cleanRecoveryUrl();

  await supabaseClient.auth.signOut();
  passwordWasJustChanged = false;
  renderLoggedOut();
  setMessage(loginMessageEl, "Heslo bylo změněno. Teď se přihlas novým heslem.", "ok");
}

async function loadProfile() {
  const { data, error } = await supabaseClient.rpc("get_my_employee_profile");
  if (error) throw error;

  currentEmployee = Array.isArray(data) && data.length ? data[0] : null;
  isAdmin = isEmployeeAdmin(currentEmployee);

  if (!currentEmployee) {
    await supabaseClient.auth.signOut();
    throw new Error("Tento účet není spárovaný se zaměstnancem v tabulce employees.");
  }

  if (currentEmployee.active === false) {
    await supabaseClient.auth.signOut();
    throw new Error("Tento účet je neaktivní. Kontaktuj administrátora.");
  }
}

function renderProfile() {
  if (!currentEmployee) {
    profileBoxEl.innerHTML = `Přihlášený účet není spárovaný s tabulkou <span class="mono">employees</span>.`;
    rolePillEl.textContent = "bez employee profilu";
    rolePillEl.className = "pill pill-warn";
    employeeOfficesInfoEl.value = "";
    updateRoleVisibility();
    return;
  }

  rolePillEl.textContent = isEmployeeAdmin(currentEmployee) ? "admin" : (currentEmployee.role || "employee");
  rolePillEl.className = "pill " + (isEmployeeAdmin(currentEmployee) ? "pill-admin" : "pill-employee");

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

async function loadMyAttendance() {
  if (!currentEmployee || isAdmin) {
    myAttendanceRows = [];
    myOpenShift = null;
    renderMyAttendance();
    renderMonthlySummary();
    renderTimeSummary();
    return;
  }

  const { data, error } = await supabaseClient.rpc("get_my_attendance_rows", { p_limit: 30 });
  if (error) throw error;

  myAttendanceRows = Array.isArray(data) ? data : [];
  myOpenShift = myAttendanceRows.find((r) => !r.time_to && normalizeText(r.type) !== "dovolena") || null;

  renderMyAttendance();
  renderMonthlySummary();
  renderTimeSummary();
}

function renderMyAttendance() {
  if (!currentEmployee || isAdmin) {
    openShiftValueEl.textContent = "—";
    todayArrivalValueEl.textContent = "—";
    todayDepartureValueEl.textContent = "—";
    myAttendanceWrapEl.innerHTML = `<div class="empty-box">Žádná data.</div>`;
    checkInBtn.disabled = true;
    checkOutBtn.disabled = true;
    return;
  }

  const today = todayStr();
  const todayRows = myAttendanceRows.filter((r) => r.date === today).sort((a, b) => b.id - a.id);
  const firstToday = todayRows.length ? todayRows[todayRows.length - 1] : null;
  const latestToday = todayRows.length ? todayRows[0] : null;

  openShiftValueEl.textContent = myOpenShift ? "ano" : "ne";
  todayArrivalValueEl.textContent = firstToday?.time_from || "—";
  todayDepartureValueEl.textContent = latestToday?.time_to || "—";

  if (latestToday?.office) {
    const officeId = getOfficeIdByName(latestToday.office);
    if (officeId) officeEl.value = officeId;
  }

  if (latestToday?.type && normalizeText(latestToday.type) !== "dovolena") {
    attendanceTypeEl.value = latestToday.type;
  }

  if (latestToday?.break_minutes !== null && latestToday?.break_minutes !== undefined) {
    breakMinutesEl.value = latestToday.break_minutes;
  }

  checkInBtn.disabled = !!myOpenShift;
  checkOutBtn.disabled = !myOpenShift;

  myAttendanceWrapEl.innerHTML = renderSimpleTable(
    [
      { label: "ID", render: (r) => escapeHtml(r.id) },
      { label: "Datum", render: (r) => escapeHtml(r.date) },
      { label: "Místo", render: (r) => escapeHtml(r.office || "") },
      { label: "Typ", render: (r) => renderAttendanceTypeBadge(r.type || "") },
      { label: "Od", render: (r) => escapeHtml(r.time_from || "—") },
      { label: "Do", render: (r) => escapeHtml(r.time_to || "—") },
      { label: "Přestávka", render: (r) => escapeHtml(getAutoBreakMinutes(r) + " min") },
      { label: "Odpracováno", render: (r) => escapeHtml(formatWorkedMinutes(getWorkedMinutes(r))) }
    ],
    myAttendanceRows
  );
}

async function loadMyLeaveSummary() {
  if (!currentEmployee || isAdmin) {
    myLeaveSummary = null;
    renderMyLeaveSummary();
    return;
  }

  try {
    const { data, error } = await supabaseClient.rpc("get_my_leave_summary");
    if (!error) {
      myLeaveSummary = Array.isArray(data) && data.length ? data[0] : null;
      renderMyLeaveSummary();
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
}

async function loadMyLeaveRequests() {
  if (!currentEmployee || isAdmin) {
    myLeaveRequestsRows = [];
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
      { label: "ID", render: (r) => escapeHtml(r.id) },
      { label: "Od", render: (r) => escapeHtml(r.date_from || "—") },
      { label: "Do", render: (r) => escapeHtml(r.date_to || "—") },
      { label: "Hodin / den", render: (r) => escapeHtml(fmtNumber(r.hours)) },
      { label: "Poznámka", render: (r) => escapeHtml(r.note || "—") },
      { label: "Stav", render: (r) => renderLeaveStatusBadge(r.status) },
      { label: "Vytvořeno", render: (r) => escapeHtml((r.created_at || "").toString().replace("T", " ").slice(0, 16) || "—") }
    ],
    myLeaveRequestsRows
  );
}

async function loadAdminLeaveRequests() {
  if (!isAdmin) {
    adminLeaveRequestsRows = [];
    renderAdminLeaveRequests();
    return;
  }

  try {
    const { data, error } = await supabaseClient.rpc("get_leave_requests");
    if (!error) {
      adminLeaveRequestsRows = Array.isArray(data) ? data : [];
      renderAdminLeaveRequests();
      return;
    }
  } catch (_) {}

  try {
    const { data, error } = await supabaseClient
      .from("leave_requests")
      .select("id, employee_id, date_from, date_to, hours, note, status, created_at, employees(name, email)")
      .order("id", { ascending: false });

    if (error) throw error;

    adminLeaveRequestsRows = (data || []).map((r) => ({
      ...r,
      employee_name: r.employees?.name || "—",
      employee_email: r.employees?.email || "—"
    }));
  } catch (error) {
    console.error("loadAdminLeaveRequests:", error);
    adminLeaveRequestsRows = [];
  }

  renderAdminLeaveRequests();
}

function renderAdminLeaveRequests() {
  adminLeaveRequestsWrapEl.innerHTML = renderSimpleTable(
    [
      { label: "ID", render: (r) => escapeHtml(r.id) },
      { label: "Zaměstnanec", render: (r) => escapeHtml(r.employee_name || "—") },
      { label: "Od", render: (r) => escapeHtml(r.date_from || "—") },
      { label: "Do", render: (r) => escapeHtml(r.date_to || "—") },
      { label: "Hodin / den", render: (r) => escapeHtml(fmtNumber(r.hours)) },
      { label: "Poznámka", render: (r) => escapeHtml(r.note || "—") },
      { label: "Stav", render: (r) => renderLeaveStatusBadge(r.status) },
      {
        label: "Akce",
        render: (r) => {
          const status = normalizeText(r.status);
          const parts = [];

          if (status === "pending" || status === "ceka" || status === "čeká") {
            parts.push(`<button type="button" class="btn-success approve-leave-btn" data-id="${r.id}">Schválit</button>`);
            parts.push(`<button type="button" class="btn-danger reject-leave-btn" data-id="${r.id}">Zamítnout</button>`);
          }

          if (status === "approved" || status === "schvaleno" || status === "schváleno") {
            parts.push(`<button type="button" class="btn-danger cancel-leave-btn" data-id="${r.id}">Storno schválené</button>`);
          }

          return parts.length ? `<div class="actions">${parts.join("")}</div>` : "—";
        }
      }
    ],
    adminLeaveRequestsRows
  );
}

async function approveLeaveRequestById(id) {
  const ok = window.confirm(`Schválit žádost #${id}?`);
  if (!ok) return;

  const { error } = await supabaseClient.rpc("approve_leave_request", { p_request_id: Number(id) });
  if (error) return alert("Chyba při schválení: " + mapAttendanceError(error));

  await loadAllData();
  alert("Žádost byla schválena.");
}

async function rejectLeaveRequestById(id) {
  const ok = window.confirm(`Zamítnout žádost #${id}?`);
  if (!ok) return;

  const { error } = await supabaseClient.rpc("reject_leave_request", { p_request_id: Number(id) });
  if (error) return alert("Chyba při zamítnutí: " + mapAttendanceError(error));

  await loadAllData();
  alert("Žádost byla zamítnuta.");
}

async function cancelApprovedLeaveRequestById(id) {
  const ok = window.confirm(`Stornovat schválenou žádost #${id}?`);
  if (!ok) return;

  const { error } = await supabaseClient.rpc("cancel_approved_leave_request", { p_request_id: Number(id) });
  if (error) return alert("Chyba při stornu: " + mapAttendanceError(error));

  await loadAllData();
  alert("Schválená žádost byla stornována.");
}
async function doCheckIn() {
  if (!currentEmployee || isAdmin) {
    return setMessage(attendanceMessageEl, "Příchod může zapisovat jen přihlášený zaměstnanec.", "err");
  }

  const officeRow = officesData.find((o) => String(o.id) === String(officeEl.value || ""));
  const officeText = officeRow?.name || "";
  const p_type = attendanceTypeEl.value;
  const p_break_minutes = Number(breakMinutesEl.value || 0);

  if (!officeText) {
    return setMessage(attendanceMessageEl, "Vyber místo.", "err");
  }

  setMessage(attendanceMessageEl, "Ověřuji možnost zápisu příchodu…", "warn");

  try {
    const { data: checkData, error: checkError } = await supabaseClient.rpc("can_check_in");

    if (checkError) {
      return setMessage(attendanceMessageEl, "Nepodařilo se ověřit možnost příchodu: " + mapAttendanceError(checkError), "err");
    }

    if (!checkData?.ok) {
      return setMessage(attendanceMessageEl, checkData?.message || "Příchod nelze zapsat.", "err");
    }

    const { error } = await supabaseClient.rpc("rpc_check_in", {
      p_office: officeText,
      p_type,
      p_break_minutes
    });

    if (error) {
      return setMessage(attendanceMessageEl, mapAttendanceError(error), "err");
    }

    await loadAllData();
    setMessage(attendanceMessageEl, "Příchod zapsán.", "ok");
  } catch (e) {
    return setMessage(attendanceMessageEl, "Neočekávaná chyba při zápisu příchodu: " + mapAttendanceError(e), "err");
  }
}

async function doCheckOut() {
  if (!currentEmployee || isAdmin) {
    return setMessage(attendanceMessageEl, "Odchod může zapisovat jen přihlášený zaměstnanec.", "err");
  }

  const officeRow = officesData.find((o) => String(o.id) === String(officeEl.value || ""));
  const officeText = officeRow?.name || "";
  const p_type = attendanceTypeEl.value;
  const p_break_minutes = Number(breakMinutesEl.value || 0);

  setMessage(attendanceMessageEl, "Ověřuji otevřenou směnu…", "warn");

  try {
    const { data: checkData, error: checkError } = await supabaseClient.rpc("can_check_out");

    if (checkError) {
      return setMessage(attendanceMessageEl, "Nepodařilo se ověřit možnost odchodu: " + mapAttendanceError(checkError), "err");
    }

    if (!checkData?.ok) {
      return setMessage(attendanceMessageEl, checkData?.message || "Odchod nelze zapsat.", "err");
    }

    const { error } = await supabaseClient.rpc("rpc_check_out", {
      p_office: officeText,
      p_type,
      p_break_minutes
    });

    if (error) {
      return setMessage(attendanceMessageEl, mapAttendanceError(error), "err");
    }

    await loadAllData();
    setMessage(attendanceMessageEl, "Odchod zapsán.", "ok");
  } catch (e) {
    return setMessage(attendanceMessageEl, "Neočekávaná chyba při zápisu odchodu: " + mapAttendanceError(e), "err");
  }
}

async function createMyManualAttendance() {
  const officeRow = officesData.find((o) => String(o.id) === String(manualAttendanceOfficeEl.value || ""));
  const p_date = manualAttendanceDateEl.value;
  const p_office = officeRow?.name || "";
  const p_type = manualAttendanceTypeEl.value;
  const p_time_from = manualAttendanceTimeFromEl.value || null;
  const p_time_to = manualAttendanceTimeToEl.value || null;
  const p_break_minutes = Number(manualAttendanceBreakMinutesEl.value || 0);

  if (!p_date || !p_office || !p_type) {
    return setMessage(manualAttendanceMessageEl, "Vyplň datum, místo a typ.", "err");
  }

  if (normalizeText(p_type) !== "dovolena" && !p_time_from) {
    return setMessage(manualAttendanceMessageEl, "Vyplň čas od.", "err");
  }

  try {
    await ensureMonthUnlockedOrThrow(p_date);
  } catch (error) {
    return setMessage(manualAttendanceMessageEl, error.message, "err");
  }

  setMessage(manualAttendanceMessageEl, "Ověřuji ruční zápis docházky…", "warn");

  try {
    const { data: checkData, error: checkError } = await supabaseClient.rpc("can_create_my_manual_attendance", {
      p_date,
      p_type,
      p_time_from,
      p_time_to
    });

    if (checkError) {
      return setMessage(manualAttendanceMessageEl, "Nepodařilo se ověřit ruční zápis: " + mapAttendanceError(checkError), "err");
    }

    if (!checkData?.ok) {
      return setMessage(manualAttendanceMessageEl, checkData?.message || "Ruční zápis nelze uložit.", "err");
    }

    const { error } = await supabaseClient.rpc("create_my_attendance_manual", {
      p_date,
      p_office,
      p_type,
      p_time_from,
      p_time_to,
      p_break_minutes
    });

    if (error) {
      return setMessage(manualAttendanceMessageEl, mapAttendanceError(error), "err");
    }

    resetManualAttendanceForm();
    await loadAllData();
    setMessage(manualAttendanceMessageEl, "Docházka byla ručně zapsána.", "ok");
  } catch (e) {
    return setMessage(manualAttendanceMessageEl, "Neočekávaná chyba ručního zápisu: " + mapAttendanceError(e), "err");
  }
}

async function createMyLeave() {
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

  const summaryRows = (data || []).map((row) => ({
    "ID zaměstnance": row.employee_id ?? "",
    "Zaměstnanec": row.employee_name || "",
    "Odpracováno (h)": fmtExportNumber(row.work_hours),
    "Dovolená (h)": fmtExportNumber(row.vacation_hours),
    "Home office (h)": fmtExportNumber(row.home_office_hours),
    "Nemoc (h)": fmtExportNumber(row.sick_hours),
    "Služební cesta (h)": fmtExportNumber(row.business_trip_hours),
    "Celkem (h)": fmtExportNumber(row.total_hours),
    "Dny v práci": Number(row.work_days || 0)
  }));

  if (!summaryRows.length) {
    return setMessage(exportMessageEl, `Pro měsíc ${p_month} nejsou k exportu žádná data.`, "warn");
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(summaryRows);
  ws["!cols"] = [{ wch: 14 }, { wch: 28 }, { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 12 }, { wch: 18 }, { wch: 14 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws, "Souhrn");
  const filename = `dochazka_souhrn_${p_month}.xlsx`;
  XLSX.writeFile(wb, filename);

  setMessage(exportMessageEl, `Export hotový: ${filename}`, "ok");
}

async function resendEmployeeInvite(email) {
  if (!email) return;

  const ok = window.confirm(`Odeslat pozvánku znovu na ${email}?`);
  if (!ok) return;

  setMessage(createEmployeeMessageEl, "Odesílám pozvánku…", "warn");

  const { data, error } = await supabaseClient.functions.invoke("invite-employee", {
    body: { email }
  });

  if (error) {
    console.error("resend invite error:", error);
    return setMessage(
      createEmployeeMessageEl,
      "Pozvánku se nepodařilo odeslat: " + (error.message || JSON.stringify(error)),
      "err"
    );
  }

  if (data?.error) {
    console.error("resend invite data error:", data);
    return setMessage(
      createEmployeeMessageEl,
      "Pozvánku se nepodařilo odeslat: " + data.error,
      "err"
    );
  }

  setMessage(createEmployeeMessageEl, "Pozvánka byla znovu odeslána.", "ok");
}

async function createOrUpdateEmployee() {
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
  }

  if (editEmployeeId) {
    setMessage(createEmployeeMessageEl, "Ukládám změny zaměstnance…", "warn");

    const { error } = await supabaseClient.rpc("admin_update_employee", {
      p_id: editEmployeeId,
      p_name,
      p_email,
      p_role,
      p_offices,
      p_weekly,
      p_leave_days,
      p_leave_hours,
      p_active
    });

    if (error) {
      return setMessage(createEmployeeMessageEl, "Chyba při úpravě zaměstnance: " + mapAttendanceError(error), "err");
    }

    resetEmployeeForm();
    await loadAllData();
    return setMessage(createEmployeeMessageEl, "Zaměstnanec byl upraven.", "ok");
  }

  setMessage(createEmployeeMessageEl, "Vytvářím zaměstnance…", "warn");

  const { error: createError } = await supabaseClient.rpc("admin_create_employee", {
    p_name,
    p_email,
    p_role,
    p_offices,
    p_weekly,
    p_leave_days,
    p_leave_hours
  });

  if (createError) {
    return setMessage(createEmployeeMessageEl, "Chyba při vytváření zaměstnance: " + mapAttendanceError(createError), "err");
  }

  setMessage(createEmployeeMessageEl, "Zaměstnanec vytvořen, odesílám pozvánku…", "warn");

  const { data: inviteData, error: inviteError } = await supabaseClient.functions.invoke("invite-employee", {
    body: { email: p_email }
  });

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
      "Zaměstnanec byl vytvořen, ale pozvánku se nepodařilo odeslat: " + (inviteData.error || JSON.stringify(inviteData)),
      "err"
    );
  }

  console.log("inviteData OK:", inviteData);

  resetEmployeeForm();
  await loadAllData();
  setMessage(createEmployeeMessageEl, "Zaměstnanec byl vytvořen a pozvánka byla odeslána.", "ok");
}

async function insertAttendanceManual() {
  normalizeAttendanceEditFields();

  const p_employee_id = Number(editAttendanceEmployeeEl.value || 0);
  const p_date = editAttendanceDateEl.value;
  const p_office_id = Number(editAttendanceOfficeEl.value || 0);
  const p_type = editAttendanceTypeEl.value;
  const p_time_from = editAttendanceTimeFromEl.value || null;
  const p_time_to = editAttendanceTimeToEl.value || null;
  const p_break_minutes = Number(editAttendanceBreakMinutesEl.value || 0);

  if (!p_employee_id || !p_date || !p_office_id || !p_type) {
    return setMessage(attendanceEditMessageEl, "Vyber zaměstnance a vyplň datum, místo a typ.", "err");
  }

  if (normalizeText(p_type) !== "dovolena" && !p_time_from) {
    return setMessage(attendanceEditMessageEl, "Vyplň čas od.", "err");
  }

  try {
    await ensureMonthUnlockedOrThrow(p_date);
  } catch (error) {
    return setMessage(attendanceEditMessageEl, error.message, "err");
  }

  setMessage(attendanceEditMessageEl, "Ověřuji možnost vložení docházky…", "warn");

  try {
    const { data: checkData, error: checkError } = await supabaseClient.rpc("can_admin_insert_attendance", {
      p_employee_id,
      p_date,
      p_type,
      p_time_from,
      p_time_to
    });

    if (checkError) {
      return setMessage(attendanceEditMessageEl, "Nepodařilo se ověřit vložení docházky: " + mapAttendanceError(checkError), "err");
    }

    if (!checkData?.ok) {
      return setMessage(attendanceEditMessageEl, checkData?.message || "Docházku nelze vložit.", "err");
    }

    const { error } = await supabaseClient.rpc("admin_insert_attendance", {
      p_employee_id,
      p_date,
      p_office_id,
      p_type,
      p_time_from,
      p_time_to,
      p_break_minutes
    });

    if (error) {
      return setMessage(attendanceEditMessageEl, mapAttendanceError(error), "err");
    }

    resetAttendanceEditForm();
    await loadAllData();
    if (adminHistoryEmployeeEl.value && adminHistoryMonthEl.value) await loadAdminAttendanceHistory();
    setMessage(attendanceEditMessageEl, "Nový záznam docházky byl vložen.", "ok");
  } catch (e) {
    return setMessage(attendanceEditMessageEl, "Neočekávaná chyba při vložení docházky: " + mapAttendanceError(e), "err");
  }
}

async function saveAttendanceEdit() {
  if (!editAttendanceId) {
    return setMessage(attendanceEditMessageEl, "Pro úpravu nejdřív vyber řádek tlačítkem Upravit. Pro nový záznam použij Vložit ručně.", "err");
  }

  normalizeAttendanceEditFields();

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
  setMessage(attendanceEditMessageEl, "Docházka byla smazána.", "ok");
}

async function loadAdminDashboard() {
  if (!isAdmin) {
    resetDashboard();
    return;
  }

  try {
    const { data, error } = await supabaseClient.rpc("get_admin_dashboard_summary");
    if (!error && data && data.length) {
      const d = data[0];
      dashTotalEmployeesEl.textContent = d.total_employees ?? 0;
      dashAtWorkEl.textContent = d.at_work_count ?? 0;
      dashHomeOfficeEl.textContent = d.home_office_count ?? 0;
      dashBusinessTripEl.textContent = d.business_trip_count ?? 0;
      dashOnLeaveEl.textContent = d.on_leave_count ?? 0;
      return;
    }
  } catch (_) {}

  try {
    const { data: employees, error: empError } = await supabaseClient.from("employees").select("id");
    if (empError) throw empError;

    const { data: todayRows, error: attError } = await supabaseClient
      .from("attendance")
      .select("type")
      .eq("date", todayStr());

    if (attError) throw attError;

    const types = (todayRows || []).map((x) => normalizeText(x.type));
    dashTotalEmployeesEl.textContent = employees?.length || 0;
    dashAtWorkEl.textContent = types.filter((t) => t === "prace" || t === "work").length;
    dashHomeOfficeEl.textContent = types.filter((t) => t.includes("home")).length;
    dashBusinessTripEl.textContent = types.filter((t) => t.includes("trip") || t.includes("cesta")).length;
    dashOnLeaveEl.textContent = types.filter((t) => t.includes("leave") || t.includes("dovolena")).length;
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
      supabaseClient.from("attendance").select("id, employee_id, date, office, type, time_from, time_to, break_minutes").eq("date", todayStr()),
      supabaseClient.from("employees").select("id, name, email, role, is_admin, active, offices, weekly, leave_days, leave_hours")
    ]);

    if (aErr) throw aErr;
    if (eErr) throw eErr;

    employees = eRows || [];
    const byEmployee = new Map(employees.map((e) => [Number(e.id), e]));

    todayRows = (aRows || []).map((r) => ({
      ...r,
      employee_name: byEmployee.get(Number(r.employee_id))?.name || ""
    }));

    locations = todayRows.filter((r) => !r.time_to).map((r) => ({
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
      .filter((e) => !isEmployeeAdmin(e))
      .map((e) => ({
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
  adminLeaveData = leaveSummary || [];

  fillAdminLeaveEmployeeOptions();
  fillAdminHistoryEmployeeOptions();
  fillEditAttendanceEmployeeOptions();

  adminActiveWrapEl.innerHTML = renderSimpleTable(
    [
      { label: "Zaměstnanec", render: (r) => escapeHtml(r.employee_name || "") },
      { label: "E-mail", render: (r) => escapeHtml(r.employee_email || "") },
      { label: "Místo", render: (r) => escapeHtml(r.office || "") },
      { label: "Typ", render: (r) => renderAttendanceTypeBadge(r.type || "") },
      { label: "Od", render: (r) => escapeHtml(r.time_from || "—") }
    ],
    locations || []
  );

  renderAdminTodayTable();
  renderAttendanceIssues(adminTodayAttendanceData);

  adminLeaveWrapEl.innerHTML = renderSimpleTable(
    [
      { label: "Zaměstnanec", render: (r) => escapeHtml(r.employee_name || "") },
      { label: "E-mail", render: (r) => escapeHtml(r.employee_email || "") },
      { label: "Nárok dny", render: (r) => escapeHtml(fmtNumber(r.leave_days_total)) },
      { label: "Nárok hodiny", render: (r) => escapeHtml(fmtNumber(r.leave_hours_total)) },
      { label: "Vyčerpáno hodin", render: (r) => escapeHtml(fmtNumber(r.leave_hours_used)) },
      { label: "Zbývá hodin", render: (r) => escapeHtml(fmtNumber(r.leave_hours_remaining)) },
      { label: "Zbývá dnů", render: (r) => escapeHtml(fmtNumber(r.leave_days_remaining)) }
    ],
    adminLeaveData
  );

  renderEmployeesTable();
  await loadAdminLeaveRequests();

  if (!adminHistoryMonthEl.value) adminHistoryMonthEl.value = currentMonthStr();
  if (!auditMonthEl.value) auditMonthEl.value = currentMonthStr();
}

async function loadAllData() {
  try {
    await loadAppSettings();
    await loadOffices();
    await loadProfile();
    renderProfile();
    await loadMyAttendance();
    await loadAttendanceHistory();
    await loadMyLeaveSummary();
    await loadMyLeaveRequests();
    await loadAdminData();
    await loadAdminDashboard();

    if (!isAdmin) {
      setMessage(attendanceMessageEl, myOpenShift ? "Máš otevřenou směnu." : "Nemáš otevřenou směnu.", "ok");
    }
  } catch (error) {
    console.error(error);
    if (!isAdmin) {
      setMessage(attendanceMessageEl, "Chyba načítání: " + (error?.message || String(error)), "err");
    }
  }
}

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
  await loadAllData();
}

loginBtn?.addEventListener("click", signIn);
logoutBtn?.addEventListener("click", signOut);
refreshBtn?.addEventListener("click", async () => {
  await loadAllData();
  if (isAdmin && adminHistoryEmployeeEl.value && adminHistoryMonthEl.value) {
    await loadAdminAttendanceHistory();
  }
});

loadHistoryBtn?.addEventListener("click", loadAttendanceHistory);
adminLoadHistoryBtn?.addEventListener("click", loadAdminAttendanceHistory);
loadAuditBtn?.addEventListener("click", loadAttendanceAudit);
checkLockBtn?.addEventListener("click", loadAttendanceLockStatus);
lockMonthBtn?.addEventListener("click", () => setAttendanceLockState(true));
unlockMonthBtn?.addEventListener("click", () => setAttendanceLockState(false));
saveOfficeBtn?.addEventListener("click", saveOffice);
cancelOfficeEditBtn?.addEventListener("click", resetOfficeForm);
saveNewPasswordBtn?.addEventListener("click", saveNewPassword);
checkInBtn?.addEventListener("click", doCheckIn);
checkOutBtn?.addEventListener("click", doCheckOut);
createManualAttendanceBtn?.addEventListener("click", createMyManualAttendance);
createMyLeaveBtn?.addEventListener("click", createMyLeave);
adminCreateLeaveBtn?.addEventListener("click", adminCreateLeave);
exportMonthBtn?.addEventListener("click", exportMonthSummary);
createEmployeeBtn?.addEventListener("click", createOrUpdateEmployee);
employeeSearchInputEl?.addEventListener("input", renderEmployeesTable);
employeeRoleFilterEl?.addEventListener("change", renderEmployeesTable);
employeeActiveFilterEl?.addEventListener("change", renderEmployeesTable);
cancelEditEmployeeBtn?.addEventListener("click", resetEmployeeForm);
insertAttendanceBtn?.addEventListener("click", insertAttendanceManual);
saveAttendanceEditBtn?.addEventListener("click", saveAttendanceEdit);
deleteAttendanceBtn?.addEventListener("click", deleteAttendanceRecord);
cancelAttendanceEditBtn?.addEventListener("click", resetAttendanceEditForm);
editAttendanceTypeEl?.addEventListener("change", normalizeAttendanceEditFields);

todayFilterButtons.forEach((btn) => btn.addEventListener("click", () => {
  currentTodayFilter = btn.dataset.filter || "all";
  renderAdminTodayTable();
}));

officesWrapEl?.addEventListener("click", (e) => {
  const btn = e.target.closest(".edit-office-btn");
  if (!btn) return;

  const officeRow = officesData.find((x) => Number(x.id) === Number(btn.dataset.id));
  if (officeRow) fillOfficeFormForEdit(officeRow);
});

employeesWrapEl?.addEventListener("click", (e) => {
  const btn = e.target.closest(".edit-employee-btn");
  if (!btn) return;

  const employee = adminEmployeesData.find((x) => Number(x.id) === Number(btn.dataset.id));
  if (employee) fillEmployeeFormForEdit(employee);
});

adminTodayWrapEl?.addEventListener("click", (e) => {
  const btn = e.target.closest(".edit-attendance-btn");
  if (!btn) return;

  const row = adminTodayAttendanceData.find((x) => Number(x.id) === Number(btn.dataset.id));
  if (row) fillAttendanceFormForEdit(row);
});

adminHistoryWrapEl?.addEventListener("click", (e) => {
  const btn = e.target.closest(".admin-history-edit-btn");
  if (!btn) return;

  const row = adminHistoryRows.find((x) => Number(x.id) === Number(btn.dataset.id));
  if (row) fillAttendanceFormForEdit(row);
});

adminLeaveRequestsWrapEl?.addEventListener("click", (e) => {
  const approveBtn = e.target.closest(".approve-leave-btn");
  if (approveBtn) return approveLeaveRequestById(approveBtn.dataset.id);

  const rejectBtn = e.target.closest(".reject-leave-btn");
  if (rejectBtn) return rejectLeaveRequestById(rejectBtn.dataset.id);

  const cancelBtn = e.target.closest(".cancel-leave-btn");
  if (cancelBtn) return cancelApprovedLeaveRequestById(cancelBtn.dataset.id);
});

passwordEl?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") signIn();
});

newPassword2El?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveNewPassword();
});

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === "PASSWORD_RECOVERY") {
    isPasswordRecoveryFlow = true;
    showRecoveryView();
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
    sessionTextEl.textContent = "Přihlášen: " + (currentUser.email || "");
    setTimeout(() => {
      loadAllData();
    }, 0);
  } else {
    renderLoggedOut();
  }
});

(async function bootstrap() {
  lockMonthEl.value = previousMonthStr();
  exportMonthEl.value = currentMonthStr();
  historyMonthEl.value = currentMonthStr();
  adminHistoryMonthEl.value = currentMonthStr();
  auditMonthEl.value = currentMonthStr();
  adminLeaveDateEl.value = todayStr();
  manualAttendanceDateEl.value = todayStr();

  isPasswordRecoveryFlow = detectRecoveryModeFromUrl();

  renderLoggedOut();
  updateOnlineStatus();

  if ("serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map(k => caches.delete(k)));
      console.log("Service Worker odstraněn a cache smazána");
    } catch (err) {
      console.error("Chyba při odstraňování Service Workeru:", err);
    }
  }

  if (isPasswordRecoveryFlow) {
    showRecoveryView();
    setMessage(passwordResetMessageEl, "Odkaz pro reset hesla byl rozpoznán. Načítám recovery session…", "warn");

    await new Promise(resolve => setTimeout(resolve, 1200));

    const {
      data: { session },
      error
    } = await supabaseClient.auth.getSession();

    console.log("RECOVERY SESSION:", session, error);

    if (session?.user) {
      currentUser = session.user;
      showRecoveryView();
      setMessage(passwordResetMessageEl, "Recovery session načtena. Teď nastav nové heslo.", "ok");
    } else {
      showRecoveryView();
      setMessage(
        passwordResetMessageEl,
        "Recovery session se nenačetla. Otevři znovu celý odkaz z e-mailu ve stejném okně prohlížeče.",
        "err"
      );
    }

    return;
  }

  await loadSession();
})();
