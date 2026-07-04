// Core JavaScript Entry Point for Premium HRMS SPA
// Wired to the real hrms-backend REST API (see src/api.js) instead of the
// old localStorage mock database.
import { api } from "./api.js";
import { showToast, generateQR, exportToCSV, printPayslip, triggerCelebration } from "./utils.js";
import {
  renderAttendanceTrendChart,
  renderLeaveDistributionChart,
  renderDepartmentChart,
  renderPayrollChart,
  renderGenderChart,
  updateAllCharts
} from "./charts.js";

// Global App State
let state = {
  currentUser: null,
  currentRole: null, // "admin" or "employee"
  activeView: "dashboard",
  checkInTimer: null
};

// In-memory caches populated by the most recent list fetches, so dynamically
// rendered row/card action buttons can look records up without refetching.
let directoryEmployeesCache = [];
let leavesCache = [];

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  initTheme();
  initRouter();
  initGlobalClock();
  restoreSession();
});

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// ========================================================
// A. EVENT LISTENERS AND INITIALIZATIONS
// ========================================================
function setupEventListeners() {
  // Login Panel Switches
  document.getElementById("switch-to-employee-btn").addEventListener("click", () => {
    toggleLoginView("employee");
  });
  document.getElementById("switch-to-admin-btn").addEventListener("click", () => {
    toggleLoginView("admin");
  });
  document.getElementById("switch-to-signup-btn").addEventListener("click", () => {
    toggleLoginView("signup");
  });
  document.getElementById("switch-to-login-from-signup-btn").addEventListener("click", () => {
    toggleLoginView("employee");
  });

  // Login Form Submissions
  document.getElementById("admin-login-form").addEventListener("submit", handleAdminLogin);
  document.getElementById("employee-login-form").addEventListener("submit", handleEmployeeLogin);
  document.getElementById("signup-form").addEventListener("submit", handleSignup);

  // Welcome Continue Buttons
  document.getElementById("continue-to-admin-dashboard").addEventListener("click", () => {
    enterApp();
  });
  document.getElementById("continue-to-employee-dashboard").addEventListener("click", () => {
    enterApp();
    // Auto check-in employee if they click "Start My Day"
    autoEmployeeCheckIn();
  });

  // Logout Trigger
  document.getElementById("logout-btn-trigger").addEventListener("click", handleLogout);

  // Sidebar Tab Routing
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = item.getAttribute("data-view");
      navigateTo(targetView);
    });
  });

  // Theme Toggle Button
  document.getElementById("theme-toggle-btn").addEventListener("click", toggleTheme);
  document.getElementById("settings-theme-select").addEventListener("change", (e) => {
    setTheme(e.target.value === "dark");
  });

  // Search Everywhere (⌘K / Ctrl+K) Shortcut
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      document.getElementById("global-search-input").focus();
    }
  });

  // Global Search Box Search Actions
  document.getElementById("global-search-input").addEventListener("input", (e) => {
    const term = e.target.value;
    handleGlobalSearch(term);
  });

  // Directory Filters and Actions
  document.getElementById("search-directory-field").addEventListener("input", filterDirectory);
  document.getElementById("filter-dept-field").addEventListener("change", filterDirectory);
  document.getElementById("filter-status-field").addEventListener("change", filterDirectory);
  document.getElementById("export-directory-csv").addEventListener("click", exportDirectory);

  // Add Employee Modals
  document.getElementById("add-employee-quick-btn").addEventListener("click", () => openModal("modal-add-employee"));
  document.getElementById("add-employee-btn").addEventListener("click", () => openModal("modal-add-employee"));
  document.getElementById("add-employee-form").addEventListener("submit", handleAddEmployee);

  // Apply Leave Modal and Form
  document.getElementById("apply-leave-btn").addEventListener("click", () => openModal("modal-apply-leave"));
  document.getElementById("apply-leave-form").addEventListener("submit", handleApplyLeave);

  // Employee Checkin Operations
  document.getElementById("emp-checkin-btn").addEventListener("click", handleEmployeeCheckIn);
  document.getElementById("emp-checkout-btn").addEventListener("click", handleEmployeeCheckOut);
  document.getElementById("view-my-digital-id-btn").addEventListener("click", () => {
    showDigitalBadge(state.currentUser);
  });

  // Modals Close button actions
  const closeBtns = document.querySelectorAll(".close-modal-btn");
  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-modal");
      closeModal(modalId);
    });
  });

  // Payroll Selector
  document.getElementById("payroll-employee-select").addEventListener("change", (e) => {
    loadPayrollBreakdown(e.target.value);
  });
  document.getElementById("download-payslip-pdf-btn").addEventListener("click", handlePrintPayslip);

  // Document Vault Simulation
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("document-download-trigger")) {
      const docName = e.target.getAttribute("data-doc");
      handleDocumentDownload(docName);
    }
  });

  document.getElementById("document-upload-mock-btn").addEventListener("click", () => {
    showToast("Mock Upload: Drag & Drop file to vault successful!", "info");
  });

  document.getElementById("save-settings-btn").addEventListener("click", () => {
    showToast("System configurations saved successfully!");
  });
}

// ========================================================
// B. LOGIN, SIGNUP AND SESSION FLOWS
// ========================================================
function toggleLoginView(view) {
  const adminView = document.getElementById("admin-login-view");
  const employeeView = document.getElementById("employee-login-view");
  const signupView = document.getElementById("signup-view");

  adminView.style.display = view === "admin" ? "flex" : "none";
  employeeView.style.display = view === "employee" ? "flex" : "none";
  signupView.style.display = view === "signup" ? "flex" : "none";

  lucide.createIcons();
}

// Attempt to restore a previously authenticated session (JWT persisted in
// localStorage) so a page refresh doesn't force a fresh login.
async function restoreSession() {
  if (!api.getToken()) return;
  try {
    const user = await api.me();
    state.currentUser = user;
    state.currentRole = user.isAdmin ? "admin" : "employee";
    await enterApp();
  } catch (err) {
    // Token expired or invalid - clear it and fall back to the login screen.
    api.clearSession();
  }
}

async function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById("admin-email").value;
  const pass = document.getElementById("admin-password").value;

  try {
    const user = await api.login(email, pass);
    if (!user.isAdmin) {
      api.clearSession();
      showToast("This account does not have admin access.", "error");
      return;
    }
    state.currentRole = "admin";
    state.currentUser = user;
    triggerWorkspaceLoader(user.name);
  } catch (err) {
    showToast(err.message || "Invalid admin credentials.", "error");
  }
}

async function handleEmployeeLogin(e) {
  e.preventDefault();
  const email = document.getElementById("employee-email").value;
  const pass = document.getElementById("employee-password").value;

  try {
    const user = await api.login(email, pass);
    state.currentRole = user.isAdmin ? "admin" : "employee";
    state.currentUser = user;
    triggerWorkspaceLoader(user.name);
  } catch (err) {
    showToast(err.message || "Invalid credentials.", "error");
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const department = document.getElementById("signup-dept").value;
  const role = document.getElementById("signup-role").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;

  if (password !== confirmPassword) {
    showToast("Passwords do not match.", "error");
    return;
  }
  if (password.length < 6) {
    showToast("Password must be at least 6 characters.", "error");
    return;
  }

  try {
    const user = await api.signup({ name, email, department, role, password });
    state.currentRole = "employee";
    state.currentUser = user;
    showToast("Account created successfully! Welcome aboard.");
    triggerWorkspaceLoader(user.name);
    document.getElementById("signup-form").reset();
  } catch (err) {
    showToast(err.message || "Could not create your account.", "error");
  }
}

function triggerWorkspaceLoader(name) {
  document.getElementById("auth-overlay").classList.remove("auth-active");
  const loader = document.getElementById("loader-overlay");
  loader.classList.add("loader-active");

  const messages = [
    "VERIFYING SECURITY SIGNATURES...",
    "SYNCHRONIZING ENTERPRISE DIRECTORY...",
    "CALCULATING ATTENDANCE HEATMAPS...",
    "GENERATING CRYPTOGRAPHIC DIGITAL IDS..."
  ];

  let step = 0;
  const interval = setInterval(() => {
    if (step < messages.length) {
      document.getElementById("loader-message").innerText = messages[step];
      step++;
    } else {
      clearInterval(interval);
      loader.classList.remove("loader-active");
      showWelcomeSummary();
    }
  }, 400);
}

async function showWelcomeSummary() {
  const overlay = document.getElementById("welcome-overlay");
  overlay.classList.add("welcome-active");

  try {
    if (state.currentRole === "admin") {
      document.getElementById("admin-welcome-box").style.display = "block";
      document.getElementById("employee-welcome-box").style.display = "none";

      // Load Admin Summary Counts
      const stats = await api.getStats();
      document.getElementById("welcome-total-employees").innerText = stats.totalEmployees;
      document.getElementById("welcome-present-employees").innerText = stats.presentToday;
      document.getElementById("welcome-leave-requests").innerText = stats.pendingLeaves;
      document.getElementById("welcome-birthdays").innerText = stats.onLeaveToday ?? 0;
    } else {
      document.getElementById("admin-welcome-box").style.display = "none";
      const box = document.getElementById("employee-welcome-box");
      box.style.display = "block";

      // Load Employee Summary Counts
      document.getElementById("employee-welcome-title").innerText = `Good Morning, ${state.currentUser.name.split(" ")[0]} 👋`;
      document.getElementById("welcome-employee-streak").innerText = `${state.currentUser.streak} Days`;

      const balance = await api.getLeaveBalance(state.currentUser.id).catch(() => null);
      const sumBalance = balance ? (balance.casual + balance.sick + balance.annual) : 0;
      document.getElementById("welcome-employee-leaves").innerText = `${sumBalance} Days`;
    }
  } catch (err) {
    showToast(err.message || "Could not load your workspace summary.", "error");
  }
}

async function enterApp() {
  document.getElementById("welcome-overlay").classList.remove("welcome-active");
  document.getElementById("app-container").classList.add("app-active");

  // Set User Profile Footer and Header
  document.getElementById("sidebar-avatar").src = state.currentUser.avatar;
  document.getElementById("sidebar-name").innerText = state.currentUser.name;
  document.getElementById("sidebar-role").innerText = state.currentUser.role;

  document.getElementById("header-avatar").src = state.currentUser.avatar;
  document.getElementById("header-name").innerText = state.currentUser.name.split(" ")[0];

  // Adjust sidebar tabs according to Role
  const employeesTab = document.getElementById("nav-item-employees");
  const analyticsTab = document.getElementById("nav-item-analytics");

  if (state.currentRole === "admin") {
    // Admin View
    document.getElementById("admin-dashboard-layout").style.display = "block";
    document.getElementById("employee-dashboard-layout").style.display = "none";
    employeesTab.style.display = "flex";
    analyticsTab.style.display = "flex";
  } else {
    // Employee View
    document.getElementById("admin-dashboard-layout").style.display = "none";
    document.getElementById("employee-dashboard-layout").style.display = "block";

    // Custom: Make directory read-only for employees
    employeesTab.style.display = "flex";
    analyticsTab.style.display = "none"; // Hide advanced system analytics

    // Load Employee Dashboard Specifics
    await initEmployeeDashboard();
  }

  await navigateTo("dashboard");
  showToast(`Authenticated successfully as ${state.currentRole}`);
  lucide.createIcons();
}

function handleLogout() {
  api.clearSession();
  state.currentUser = null;
  state.currentRole = null;
  if (state.checkInTimer) clearInterval(state.checkInTimer);

  document.getElementById("app-container").classList.remove("app-active");
  document.getElementById("auth-overlay").classList.add("auth-active");

  // Reset forms
  document.getElementById("admin-login-form").reset();
  document.getElementById("employee-login-form").reset();
  document.getElementById("signup-form").reset();
  toggleLoginView("admin");
  showToast("Logged out of session", "info");
}

// ========================================================
// C. SPA ROUTER AND VIEWS DISPATCHER
// ========================================================
async function navigateTo(viewId) {
  state.activeView = viewId;

  // Update nav list items active classes
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    if (item.getAttribute("data-view") === viewId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Switch View Dividers
  const views = document.querySelectorAll(".page-view");
  views.forEach(view => {
    if (view.id === `view-${viewId}`) {
      view.classList.add("active");
    } else {
      view.classList.remove("active");
    }
  });

  try {
    // Dispatch individual view loads
    if (viewId === "dashboard") {
      if (state.currentRole === "admin") {
        await loadAdminDashboard();
      } else {
        await loadEmployeeDashboard();
      }
    } else if (viewId === "employees") {
      await loadEmployeesDirectory();
    } else if (viewId === "attendance") {
      await loadAttendanceTracker();
    } else if (viewId === "leaves") {
      await loadLeavesManager();
    } else if (viewId === "payroll") {
      await loadPayrollCenter();
    } else if (viewId === "analytics") {
      await loadAnalyticsDashboard();
    }
  } catch (err) {
    showToast(err.message || "Could not load this section.", "error");
  }

  lucide.createIcons();
}

function initRouter() {
  // Setup default starting point
  toggleLoginView("admin");
}

// ========================================================
// D. ADMIN DASHBOARD OPERATIONS
// ========================================================
async function loadAdminDashboard() {
  const [stats, attendance, employees, announcements, holidays, meetings] = await Promise.all([
    api.getStats(),
    api.getAttendance({ date: todayStr() }),
    api.getEmployees(),
    api.getAnnouncements(),
    api.getHolidays(),
    api.getMeetings()
  ]);

  document.getElementById("stat-total-headcount").innerText = stats.totalEmployees;
  document.getElementById("stat-present-today").innerText = stats.presentToday;
  document.getElementById("stat-pending-leaves").innerText = stats.pendingLeaves;
  document.getElementById("stat-attendance-rate").innerText = `${stats.attendanceRate}%`;

  // Render Charts
  setTimeout(() => {
    renderAttendanceTrendChart("attendance-trend-chart");
    renderLeaveDistributionChart("leave-dist-chart");
  }, 100);

  // Load activities Feed
  const feed = document.getElementById("dashboard-recent-activities");
  const todayCheckins = attendance;

  if (todayCheckins.length === 0) {
    feed.innerHTML = `
      <div class="empty-state" style="padding: 12px 0;">
        <p>No activity logs recorded today yet.</p>
      </div>
    `;
  } else {
    feed.innerHTML = todayCheckins.slice(0, 5).map(log => {
      const emp = employees.find(e => e.id === log.employeeId);
      if (!emp) return "";
      const isLateBadge = log.isLate ? `<span class="badge badge-danger btn-sm" style="font-size: 0.65rem;">LATE</span>` : "";
      return `
        <div class="detail-item">
          <div class="detail-item-left">
            <img src="${emp.avatar}" style="width:34px; height:34px; border-radius:50%; object-fit:cover;">
            <div class="detail-item-text">
              <h5>${emp.name}</h5>
              <p>${emp.role} • ${log.checkIn}</p>
            </div>
          </div>
          <div class="flex-center" style="gap:6px;">
            ${isLateBadge}
            <span class="badge badge-success">CHECKED IN</span>
          </div>
        </div>
      `;
    }).join("");
  }

  // Load announcements
  const announcementsContainer = document.getElementById("dashboard-announcements");
  announcementsContainer.innerHTML = announcements.slice(0, 3).map(ann => {
    let catColor = "var(--brand-primary)";
    if (ann.category === "Benefits") catColor = "var(--accent-secondary)";
    if (ann.category === "Events") catColor = "var(--success)";

    return `
      <div class="announcement-card" style="border-left-color: ${catColor};">
        <div class="flex-center" style="justify-content:space-between; margin-bottom:4px;">
          <h6>${ann.title}</h6>
          <span style="font-size:0.6rem; color:var(--text-secondary);">${ann.date}</span>
        </div>
        <p>${ann.content}</p>
      </div>
    `;
  }).join("");

  // Load Calendar Highlight Feed
  const calendarContainer = document.getElementById("dashboard-events-calendar");
  const upcomingHolidays = holidays.slice(0, 2);
  const upcomingMeetings = meetings.slice(0, 2);

  let calendarHTML = "";
  upcomingHolidays.forEach(hol => {
    calendarHTML += `
      <div class="detail-item">
        <div class="detail-item-left">
          <div class="flex-center" style="width:30px; height:30px; background:rgba(245, 158, 11, 0.1); color:var(--warning); border-radius:6px;">
            <i data-lucide="palm-tree" style="width:16px; height:16px;"></i>
          </div>
          <div class="detail-item-text">
            <h5>${hol.name}</h5>
            <p>Holiday • ${hol.date}</p>
          </div>
        </div>
        <span class="badge badge-warning">${hol.daysLeft === 0 ? "Today" : `in ${hol.daysLeft}d`}</span>
      </div>
    `;
  });
  upcomingMeetings.forEach(meet => {
    calendarHTML += `
      <div class="detail-item">
        <div class="detail-item-left">
          <div class="flex-center" style="width:30px; height:30px; background:rgba(59, 130, 246, 0.1); color:var(--accent-secondary); border-radius:6px;">
            <i data-lucide="video" style="width:16px; height:16px;"></i>
          </div>
          <div class="detail-item-text">
            <h5>${meet.title}</h5>
            <p>${meet.time} • ${meet.room}</p>
          </div>
        </div>
        <span class="badge badge-info">Meeting</span>
      </div>
    `;
  });
  calendarContainer.innerHTML = calendarHTML;
}

// ========================================================
// E. EMPLOYEE PORTAL OPERATIONS
// ========================================================
async function initEmployeeDashboard() {
  // Set details inside top header elements
  document.getElementById("emp-hero-avatar").src = state.currentUser.avatar;
  document.getElementById("emp-hero-greeting").innerText = `Good Morning, ${state.currentUser.name.split(" ")[0]} 👋`;
  document.getElementById("emp-hero-role").innerText = `${state.currentUser.role} • ${state.currentUser.department} Department`;

  // Set default balances
  document.getElementById("emp-streak-value").innerText = `${state.currentUser.streak} Days`;

  const [balance, meetings, holidays] = await Promise.all([
    api.getLeaveBalance(state.currentUser.id).catch(() => null),
    api.getMeetings(),
    api.getHolidays()
  ]);

  const sumBalance = balance ? (balance.casual + balance.sick + balance.annual) : 0;
  document.getElementById("emp-leaves-value").innerText = `${sumBalance} Days`;
  document.getElementById("emp-salary-value").innerText = `$${state.currentUser.salaryBreakdown.net.toLocaleString()}`;

  // Meetings
  const meetList = document.getElementById("emp-meetings-list");
  meetList.innerHTML = meetings.map(m => `
    <div class="detail-item">
      <div class="detail-item-left">
        <div class="flex-center" style="width:28px; height:28px; background:rgba(59,130,246,0.1); color:var(--accent-secondary); border-radius:6px;"><i data-lucide="clock" style="width:14px; height:14px;"></i></div>
        <div class="detail-item-text">
          <h5>${m.title}</h5>
          <p>${m.time} • ${m.room}</p>
        </div>
      </div>
      <button class="btn btn-outline btn-sm">Join Call</button>
    </div>
  `).join("");

  // Holidays
  const holList = document.getElementById("emp-holidays-list");
  holList.innerHTML = holidays.slice(0, 3).map(h => `
    <div class="detail-item">
      <div class="detail-item-left">
        <div class="flex-center" style="width:28px; height:28px; background:rgba(34,197,94,0.1); color:var(--success); border-radius:6px;"><i data-lucide="calendar" style="width:14px; height:14px;"></i></div>
        <div class="detail-item-text">
          <h5>${h.name}</h5>
          <p>${h.date}</p>
        </div>
      </div>
      <span class="badge badge-success">${h.daysLeft === 0 ? "Today" : `in ${h.daysLeft}d`}</span>
    </div>
  `).join("");
}

async function loadEmployeeDashboard() {
  // Sync checkin state with DOM buttons
  const attendance = await api.getAttendance({ date: todayStr(), employeeId: state.currentUser.id });
  const logged = attendance[0];

  const statusBadge = document.getElementById("emp-clock-status-badge");
  const checkinBtn = document.getElementById("emp-checkin-btn");
  const checkoutBtn = document.getElementById("emp-checkout-btn");

  if (logged) {
    if (logged.checkOut === "") {
      statusBadge.innerText = "CHECKED IN";
      statusBadge.className = "badge badge-success";
      checkinBtn.disabled = true;
      checkoutBtn.disabled = false;
      startCheckInTimer(logged.checkIn);
    } else {
      statusBadge.innerText = "COMPLETED DAY";
      statusBadge.className = "badge badge-info";
      checkinBtn.disabled = true;
      checkoutBtn.disabled = true;
      stopActiveCheckInTimer(`Checked Out at ${logged.checkOut}`);
    }
  } else {
    statusBadge.innerText = "OUT OF OFFICE";
    statusBadge.className = "badge badge-brand";
    checkinBtn.disabled = false;
    checkoutBtn.disabled = true;
    stopActiveCheckInTimer("Not Checked In");
  }
  lucide.createIcons();
}

async function autoEmployeeCheckIn() {
  try {
    const attendance = await api.getAttendance({ date: todayStr(), employeeId: state.currentUser.id });
    if (!attendance.length) {
      await handleEmployeeCheckIn();
    }
  } catch (err) {
    // Silently ignore - the employee can always check in manually.
  }
}

async function handleEmployeeCheckIn() {
  try {
    await api.checkIn();

    // Refresh the current user to pick up the updated streak from the server.
    const refreshed = await api.me();
    state.currentUser = refreshed;
    document.getElementById("emp-streak-value").innerText = `${state.currentUser.streak} Days`;

    triggerCelebration();
    showToast("Check-in successful! Have a wonderful day.");
    await loadEmployeeDashboard();
  } catch (err) {
    showToast(err.message || "Could not check in.", "error");
  }
}

async function handleEmployeeCheckOut() {
  try {
    await api.checkOut();
    showToast("Check-out successful! Thank you for your work.");
    await loadEmployeeDashboard();
  } catch (err) {
    showToast(err.message || "Could not check out.", "error");
  }
}

function startCheckInTimer(inTimeStr) {
  if (state.checkInTimer) clearInterval(state.checkInTimer);

  const parsedIn = parseTime(inTimeStr);

  state.checkInTimer = setInterval(() => {
    const diffMs = new Date() - parsedIn;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);

    const pad = (num) => String(num).padStart(2, "0");
    document.getElementById("live-running-clock").innerText = `${pad(diffHrs)}:${pad(diffMins)}:${pad(diffSecs)}`;
    document.getElementById("live-running-date").innerText = `Active Shift In: ${inTimeStr}`;
  }, 1000);
}

function stopActiveCheckInTimer(message) {
  if (state.checkInTimer) clearInterval(state.checkInTimer);
  initGlobalClock();
}

function initGlobalClock() {
  const clockEl = document.getElementById("live-running-clock");
  const dateEl = document.getElementById("live-running-date");
  if (!clockEl) return;

  const updateGlobalClock = () => {
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    dateEl.innerText = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  updateGlobalClock();
  state.checkInTimer = setInterval(updateGlobalClock, 1000);
}

function parseTime(timeStr) {
  // parses e.g. "08:45 AM" relative to today
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours);
  minutes = parseInt(minutes);

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// ========================================================
// F. EMPLOYEES DIRECTORY PAGE
// ========================================================
async function loadEmployeesDirectory() {
  const addBtn = document.getElementById("add-employee-btn");
  if (state.currentRole === "admin") {
    addBtn.style.display = "inline-flex";
  } else {
    addBtn.style.display = "none";
  }

  await filterDirectory();
}

async function filterDirectory() {
  const term = document.getElementById("search-directory-field").value.toLowerCase();
  const dept = document.getElementById("filter-dept-field").value;
  const status = document.getElementById("filter-status-field").value;

  const employees = await api.getEmployees({ department: dept, status });
  directoryEmployeesCache = employees;
  const container = document.getElementById("directory-cards-container");

  const filtered = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(term) ||
                          emp.role.toLowerCase().includes(term) ||
                          emp.skills.some(s => s.toLowerCase().includes(term));
    return matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i data-lucide="users-round" class="empty-state-icon" style="width:48px; height:48px;"></i>
        <h4>No employees found</h4>
        <p>Try refining your search terms or selecting different filters.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(emp => {
    // Skills formatting
    const skillsList = emp.skills.slice(0, 3).map(s => `<span class="badge badge-brand" style="font-size:0.65rem;">${s}</span>`).join("");
    const extraCount = emp.skills.length - 3;
    const extraBadge = extraCount > 0 ? `<span class="badge badge-brand" style="font-size:0.65rem;">+${extraCount} more</span>` : "";

    let statusClass = "badge-success";
    if (emp.status === "Remote") statusClass = "badge-info";
    if (emp.status === "On Leave") statusClass = "badge-warning";

    // Action buttons depending on admin vs employee
    let actions = "";
    if (state.currentRole === "admin") {
      actions = `
        <button class="btn btn-outline btn-sm view-badge-btn" data-id="${emp.id}"><i data-lucide="qr-code" style="width:12px; height:12px;"></i> Badge</button>
        <button class="btn btn-primary btn-sm edit-employee-btn" data-id="${emp.id}" style="padding: 6px 10px;"><i data-lucide="edit-3" style="width:12px; height:12px;"></i> Details</button>
      `;
    } else {
      actions = `
        <button class="btn btn-outline btn-sm view-badge-btn" style="width:100%;" data-id="${emp.id}"><i data-lucide="qr-code" style="width:12px; height:12px;"></i> View Digital Badge</button>
      `;
    }

    return `
      <div class="card employee-card">
        <span class="badge ${statusClass} status-indicator-badge">${emp.status.toUpperCase()}</span>
        <img src="${emp.avatar}" alt="${emp.name}" class="employee-card-avatar">
        <h4 class="employee-card-name">${emp.name}</h4>
        <p class="employee-card-role">${emp.role} • <span style="opacity:0.8;">${emp.id}</span></p>

        <div style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:8px;">
          Dept: <strong>${emp.department}</strong>
        </div>

        <div class="employee-card-tags">
          ${skillsList}
          ${extraBadge}
        </div>

        <div class="progress-bar-container" style="margin-bottom: 8px;" title="Profile completion: ${emp.profileCompletion}%">
          <div class="progress-bar-fill" style="width: ${emp.profileCompletion}%;"></div>
        </div>
        <div style="font-size: 0.65rem; color: var(--text-secondary); text-align: left; margin-bottom: 12px;">Profile Completion: ${emp.profileCompletion}%</div>

        <div class="employee-card-actions">
          ${actions}
        </div>
      </div>
    `;
  }).join("");

  // Attach event handlers to dynamic cards
  const badgeBtns = container.querySelectorAll(".view-badge-btn");
  badgeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const emp = directoryEmployeesCache.find(e => e.id === btn.getAttribute("data-id"));
      if (emp) showDigitalBadge(emp);
    });
  });

  const detailBtns = container.querySelectorAll(".edit-employee-btn");
  detailBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const emp = directoryEmployeesCache.find(e => e.id === btn.getAttribute("data-id"));
      if (emp) showEmployeeDetailsModal(emp);
    });
  });

  lucide.createIcons();
}

async function handleAddEmployee(e) {
  e.preventDefault();
  const name = document.getElementById("new-emp-name").value;
  const email = document.getElementById("new-emp-email").value;
  const department = document.getElementById("new-emp-dept").value;
  const role = document.getElementById("new-emp-role").value;
  const salary = document.getElementById("new-emp-salary").value;
  const blood = document.getElementById("new-emp-blood").value;
  const manager = document.getElementById("new-emp-manager").value;

  const data = {
    name, email, department, role, salary, bloodGroup: blood, manager,
    skills: ["General Operations", "Communication", "Time Management"]
  };

  try {
    const newEmp = await api.createEmployee(data);
    triggerCelebration();
    showToast(`Onboarded ${newEmp.name} successfully!`);
    closeModal("modal-add-employee");
    document.getElementById("add-employee-form").reset();
    await loadEmployeesDirectory();
  } catch (err) {
    showToast(err.message || "Could not onboard employee.", "error");
  }
}

async function exportDirectory() {
  const employees = await api.getEmployees();
  const headers = ["id", "name", "email", "department", "role", "manager", "status", "hireDate", "bloodGroup"];
  exportToCSV("employee_directory.csv", headers, employees);
}

function showEmployeeDetailsModal(employee) {
  // For hackathon completeness, we display employee metadata in a toast or show details
  showToast(`Profile details: Manager is ${employee.manager}. Experience: ${employee.experience}.`, "info");
}

// ========================================================
// G. DIGITAL ID BADGE VIEWER
// ========================================================
function showDigitalBadge(employee) {
  document.getElementById("badge-front-avatar").src = employee.avatar;
  document.getElementById("badge-front-name").innerText = employee.name;
  document.getElementById("badge-front-role").innerText = employee.role;
  document.getElementById("badge-front-id").innerText = employee.id;
  document.getElementById("badge-front-blood").innerText = employee.bloodGroup;

  document.getElementById("badge-back-manager").innerText = employee.manager;
  document.getElementById("badge-back-hired").innerText = employee.hireDate;

  // Generate QR dynamically
  const qrData = `VERIFICATION CODE: ODOO-HR-${employee.id} | NAME: ${employee.name} | SIGNATURE: SHA256-5432B`;
  document.getElementById("badge-back-qr").innerHTML = generateQR(qrData);

  openModal("modal-digital-id");
}

// ========================================================
// H. ATTENDANCE & HEATMAPS PAGE
// ========================================================
async function loadAttendanceTracker() {
  const [heatmapData, todayRecords, employees, allAttendance] = await Promise.all([
    api.getHeatmap(),
    api.getAttendance({ date: todayStr() }),
    api.getEmployees(),
    api.getAttendance()
  ]);

  // Render Heatmap
  const grid = document.getElementById("attendance-heatmap-grid");
  grid.innerHTML = "";

  // Draw 27 weeks x 7 days grid blocks
  const dateKeys = Object.keys(heatmapData).sort();
  // Take latest 189 days (27 weeks)
  const totalCells = 189;
  const sliceKeys = dateKeys.slice(-totalCells);

  sliceKeys.forEach(dateStr => {
    const val = heatmapData[dateStr];
    const block = document.createElement("div");
    block.className = `heatmap-day heatmap-w${val}`;
    block.title = `${dateStr}: workforce activity weight ${val}`;
    grid.appendChild(block);
  });

  // Load Live Log table today
  const logTable = document.getElementById("attendance-live-log-table");

  if (todayRecords.length === 0) {
    logTable.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-secondary);">No check-in entries recorded for today.</td>
      </tr>
    `;
  } else {
    logTable.innerHTML = todayRecords.map(rec => {
      const emp = employees.find(e => e.id === rec.employeeId);
      if (!emp) return "";
      const checkinStr = rec.checkIn + (rec.isLate ? " (Late)" : "");
      return `
        <tr>
          <td>
            <div class="flex-center" style="justify-content: flex-start; gap: 10px;">
              <img src="${emp.avatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">
              <strong>${emp.name}</strong>
            </div>
          </td>
          <td>${checkinStr}</td>
          <td>${rec.checkOut || `<span style="opacity:0.5;">--:--</span>`}</td>
          <td><span class="badge ${emp.status === "Remote" ? "badge-info" : "badge-brand"}">${emp.status === "Remote" ? "Remote" : "Office"}</span></td>
          <td><span class="badge ${rec.checkOut ? "badge-info" : "badge-success"}">${rec.checkOut ? "COMPLETED" : "ACTIVE"}</span></td>
        </tr>
      `;
    }).join("");
  }

  // Load Late Arrivals List
  const lateList = document.getElementById("attendance-late-arrivals-list");
  const lateRecords = todayRecords.filter(r => r.isLate);

  if (lateRecords.length === 0) {
    lateList.innerHTML = `
      <div class="empty-state" style="padding: 24px 0;">
        <i data-lucide="check" class="empty-state-icon" style="width: 30px; height:30px; color:var(--success); opacity:1;"></i>
        <h4>100% On-time Arrival</h4>
        <p>No late arrivals recorded today.</p>
      </div>
    `;
  } else {
    lateList.innerHTML = lateRecords.map(rec => {
      const emp = employees.find(e => e.id === rec.employeeId);
      if (!emp) return "";
      return `
        <div class="detail-item">
          <div class="detail-item-left">
            <img src="${emp.avatar}" style="width:30px; height:30px; border-radius:50%; object-fit:cover;">
            <div class="detail-item-text">
              <h5>${emp.name}</h5>
              <p>${emp.role} • In: ${rec.checkIn}</p>
            </div>
          </div>
          <span class="badge badge-danger">LATE</span>
        </div>
      `;
    }).join("");
  }

  // Hook report downloader
  document.getElementById("download-attendance-report-btn").onclick = () => {
    exportToCSV("attendance_journal.csv", ["employeeId", "date", "checkIn", "checkOut", "status", "isLate"], allAttendance);
  };
}

// ========================================================
// I. LEAVE MANAGEMENT PAGE
// ========================================================
async function loadLeavesManager() {
  const balanceContainer = document.getElementById("leave-balances-container");
  const balance = await api.getLeaveBalance(state.currentUser.id).catch(() => null);

  // Render leave balance stats
  if (balance) {
    balanceContainer.innerHTML = `
      <div class="card stat-card">
        <span class="stat-card-title">Casual Leave Balance</span>
        <div class="stat-card-value">${balance.casual} Days</div>
        <div class="stat-card-sub">Allocated: 12 Days</div>
        <div class="stat-card-icon" style="color:var(--success);"><i data-lucide="umbrella" style="width:24px; height:24px;"></i></div>
      </div>
      <div class="card stat-card">
        <span class="stat-card-title">Sick Leave Balance</span>
        <div class="stat-card-value">${balance.sick} Days</div>
        <div class="stat-card-sub">Allocated: 10 Days</div>
        <div class="stat-card-icon" style="color:var(--brand-primary);"><i data-lucide="activity" style="width:24px; height:24px;"></i></div>
      </div>
      <div class="card stat-card">
        <span class="stat-card-title">Annual Vacation Balance</span>
        <div class="stat-card-value">${balance.annual} Days</div>
        <div class="stat-card-sub">Allocated: 20 Days</div>
        <div class="stat-card-icon" style="color:var(--accent-secondary);"><i data-lucide="plane" style="width:24px; height:24px;"></i></div>
      </div>
    `;
  } else {
    balanceContainer.innerHTML = "";
  }

  // Adjust table view content
  const tableTitle = document.getElementById("leave-history-title");
  const tableBody = document.getElementById("leave-history-table-body");
  const leaves = await api.getLeaves();
  leavesCache = leaves;

  // The backend already scopes results to "own leaves" for employees and
  // "all leaves" for admins, so `leaves` is already the right display set.
  const displayLeaves = leaves;
  tableTitle.innerText = state.currentRole === "admin" ? "Workforce Time-Off Applications" : "My Time-Off Applications";

  if (displayLeaves.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-secondary); padding:24px 0;">No leave request logs found.</td>
      </tr>
    `;
  } else {
    tableBody.innerHTML = displayLeaves.map(lv => {
      let statusClass = "badge-warning";
      if (lv.status === "Approved") statusClass = "badge-success";
      if (lv.status === "Rejected") statusClass = "badge-danger";

      let actionBtn = "";
      if (state.currentRole === "admin" && lv.status === "Pending") {
        actionBtn = `<button class="btn btn-primary btn-sm assess-leave-btn" data-id="${lv.id}">Assess</button>`;
      } else {
        actionBtn = `<button class="btn btn-outline btn-sm view-leave-detail" data-id="${lv.id}">View</button>`;
      }

      return `
        <tr style="cursor: pointer;" class="leave-row-tr" data-id="${lv.id}">
          <td><strong>${lv.employeeName}</strong></td>
          <td>${lv.type}</td>
          <td>${lv.startDate} to ${lv.endDate}</td>
          <td>${lv.days} Days</td>
          <td><span class="badge ${statusClass}">${lv.status}</span></td>
          <td>${actionBtn}</td>
        </tr>
      `;
    }).join("");
  }

  // Row selection handler for Right hand side Timeline load
  const rows = tableBody.querySelectorAll(".leave-row-tr");
  rows.forEach(row => {
    row.addEventListener("click", (e) => {
      // Don't trigger if click is on action button
      if (e.target.tagName === "BUTTON") return;
      loadLeaveTimeline(row.getAttribute("data-id"));
    });
  });

  // Assess leave triggers
  const assessBtns = tableBody.querySelectorAll(".assess-leave-btn");
  assessBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      showLeaveApprovalModal(btn.getAttribute("data-id"));
    });
  });

  const viewDetailBtns = tableBody.querySelectorAll(".view-leave-detail");
  viewDetailBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      loadLeaveTimeline(btn.getAttribute("data-id"));
    });
  });

  lucide.createIcons();
}

async function handleApplyLeave(e) {
  e.preventDefault();
  const type = document.getElementById("leave-type-field").value;
  const start = document.getElementById("leave-start-date").value;
  const end = document.getElementById("leave-end-date").value;
  const reason = document.getElementById("leave-reason").value;

  const date1 = new Date(start);
  const date2 = new Date(end);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Validate date range
  if (date2 < date1) {
    showToast("Invalid end date selected", "error");
    return;
  }

  const request = {
    type,
    startDate: start,
    endDate: end,
    days: diffDays,
    reason
  };

  try {
    await api.applyLeave(request);
    showToast("Leave request submitted for approval");
    closeModal("modal-apply-leave");
    document.getElementById("apply-leave-form").reset();
    await loadLeavesManager();
  } catch (err) {
    showToast(err.message || "Could not submit leave request.", "error");
  }
}

function loadLeaveTimeline(leaveId) {
  const container = document.getElementById("leave-timeline-container");
  const request = leavesCache.find(l => l.id === leaveId);
  if (!request) return;

  let timelineHTML = `
    <div class="timeline-step success">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-title-row">
          <h6>Application Submitted</h6>
          <span class="timeline-date">${request.appliedDate}</span>
        </div>
        <p style="font-size:0.75rem; color:var(--text-secondary);">Reason: "${request.reason}"</p>
      </div>
    </div>
  `;

  // Comment logs
  if (request.comments.length > 0) {
    request.comments.forEach(com => {
      timelineHTML += `
        <div class="timeline-step success">
          <div class="timeline-dot"></div>
          <div class="timeline-card">
            <div class="timeline-title-row">
              <h6>Comment by ${com.sender}</h6>
              <span class="timeline-date">${com.date}</span>
            </div>
            <p style="font-size:0.75rem; color:var(--text-secondary);">"${com.text}"</p>
          </div>
        </div>
      `;
    });
  }

  // End status step
  let statusClass = request.status === "Pending" ? "active" : "success";
  let statusText = request.status === "Pending" ? "Pending Executive Review" : `Request ${request.status}`;

  timelineHTML += `
    <div class="timeline-step ${statusClass}">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-title-row">
          <h6>${statusText}</h6>
        </div>
        <p style="font-size:0.75rem; color:var(--text-secondary);">Final status determined by Director.</p>
      </div>
    </div>
  `;

  container.innerHTML = timelineHTML;
}

function showLeaveApprovalModal(leaveId) {
  const req = leavesCache.find(l => l.id === leaveId);
  if (!req) return;

  const box = document.getElementById("leave-approval-details-box");
  box.innerHTML = `
    <div><strong>Applicant:</strong> ${req.employeeName} (${req.employeeId})</div>
    <div><strong>Type:</strong> ${req.type}</div>
    <div><strong>Period:</strong> ${req.startDate} to ${req.endDate} (${req.days} Days)</div>
    <div><strong>Reason:</strong> "${req.reason}"</div>
  `;

  const footer = document.getElementById("leave-approval-footer-actions");
  footer.innerHTML = `
    <button class="btn btn-outline close-modal-btn" data-modal="modal-leave-approval">Cancel</button>
    <button class="btn btn-danger reject-leave-trigger-btn" data-id="${req.id}">Reject</button>
    <button class="btn btn-primary approve-leave-trigger-btn" data-id="${req.id}">Approve Request</button>
  `;

  // Hook button events
  footer.querySelector(".close-modal-btn").onclick = () => closeModal("modal-leave-approval");

  footer.querySelector(".approve-leave-trigger-btn").onclick = () => {
    assessRequest(req.id, "Approved");
  };
  footer.querySelector(".reject-leave-trigger-btn").onclick = () => {
    assessRequest(req.id, "Rejected");
  };

  openModal("modal-leave-approval");
}

async function assessRequest(leaveId, status) {
  const commentText = document.getElementById("leave-assess-comment").value;

  try {
    await api.assessLeave(leaveId, { status, comment: commentText.trim() || undefined });
    triggerCelebration();
    showToast(`Leave request ${status}`);
    closeModal("modal-leave-approval");
    document.getElementById("leave-assess-comment").value = "";
    await loadLeavesManager();
  } catch (err) {
    showToast(err.message || "Could not update this leave request.", "error");
  }
}

// ========================================================
// J. PAYROLL & PAYSLIPS PAGE
// ========================================================
async function loadPayrollCenter() {
  const select = document.getElementById("payroll-employee-select");

  // Load selection dropdown (Admin can choose anyone, employee can only choose themselves)
  if (state.currentRole === "admin") {
    const employees = await api.getEmployees();
    select.disabled = false;
    select.innerHTML = employees.map(emp => `<option value="${emp.id}">${emp.name} (${emp.id})</option>`).join("");
  } else {
    select.disabled = true;
    select.innerHTML = `<option value="${state.currentUser.id}">${state.currentUser.name}</option>`;
  }

  // Load initial selection breakdown
  await loadPayrollBreakdown(select.value);

  // Render payroll trend chart
  setTimeout(() => {
    renderPayrollChart("payroll-chart");
  }, 100);

  // Load ledger items
  const ledger = document.getElementById("payroll-ledger-list");
  ledger.innerHTML = `
    <div class="detail-item">
      <div class="detail-item-left">
        <div class="flex-center" style="width:28px; height:28px; background:rgba(34,197,94,0.1); color:var(--success); border-radius:6px;"><i data-lucide="check" style="width:14px; height:14px;"></i></div>
        <div class="detail-item-text">
          <h5>July 2026 Batch Payroll</h5>
          <p>Direct Deposit • July 1, 2026</p>
        </div>
      </div>
      <span class="badge badge-success">CREDITED</span>
    </div>
    <div class="detail-item">
      <div class="detail-item-left">
        <div class="flex-center" style="width:28px; height:28px; background:rgba(34,197,94,0.1); color:var(--success); border-radius:6px;"><i data-lucide="check" style="width:14px; height:14px;"></i></div>
        <div class="detail-item-text">
          <h5>June 2026 Batch Payroll</h5>
          <p>Direct Deposit • June 1, 2026</p>
        </div>
      </div>
      <span class="badge badge-success">CREDITED</span>
    </div>
  `;
  lucide.createIcons();
}

async function loadPayrollBreakdown(empId) {
  const container = document.getElementById("payroll-breakdown-details-box");
  let emp;
  try {
    emp = await api.getEmployee(empId);
  } catch (err) {
    return;
  }
  if (!emp) return;

  const b = emp.salaryBreakdown;
  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px;">
      <div style="display:flex; justify-content:space-between; font-size:0.875rem; border-bottom: 1px solid var(--border-color); padding-bottom:8px;">
        <span>Basic Salary Credit</span>
        <strong>$${b.basic.toLocaleString()}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.875rem; border-bottom: 1px solid var(--border-color); padding-bottom:8px;">
        <span>Incentive & Performance Bonus</span>
        <strong style="color:var(--success)">+$${b.bonus.toLocaleString()}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.875rem; border-bottom: 1px solid var(--border-color); padding-bottom:8px;">
        <span>Provident Fund (PF) Deduction</span>
        <strong style="color:var(--danger)">-$${b.pf.toLocaleString()}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.875rem; border-bottom: 1px solid var(--border-color); padding-bottom:8px;">
        <span>Income Tax withholding</span>
        <strong style="color:var(--danger)">-$${b.tax.toLocaleString()}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:1.125rem; font-weight:700; padding-top:8px;">
        <span>Net Take-home Salary</span>
        <span class="text-gradient">$${b.net.toLocaleString()}</span>
      </div>
    </div>
  `;
}

async function handlePrintPayslip() {
  const select = document.getElementById("payroll-employee-select");
  try {
    const emp = await api.getEmployee(select.value);
    if (emp) {
      printPayslip(emp, "July 2026");
    }
  } catch (err) {
    showToast(err.message || "Could not load payslip.", "error");
  }
}

// ========================================================
// K. DOCUMENT VAULT OPERATIONS
// ========================================================
function handleDocumentDownload(docName) {
  const loader = document.getElementById("loader-overlay");
  loader.classList.add("loader-active");
  document.getElementById("loader-message").innerText = "AUDITING DOWNLOAD TRANSACTIONS...";

  setTimeout(() => {
    loader.classList.remove("loader-active");

    // Trigger mock raw file download
    const link = document.createElement("a");
    link.href = "data:text/plain;charset=utf-8,Mock Encrypted File Contents";
    link.download = docName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Secured transaction. Downloaded ${docName} successfully.`);
  }, 1200);
}

// ========================================================
// L. ADVANCED ANALYTICS VIEWS
// ========================================================
async function loadAnalyticsDashboard() {
  setTimeout(() => {
    renderDepartmentChart("dept-chart");
    renderGenderChart("gender-chart");
  }, 100);
}

// ========================================================
// M. GLOBAL SEARCH EVERYWHERE INTERACTIVE LISTENER
// ========================================================
async function handleGlobalSearch(term) {
  if (term.trim() === "") return;

  // We search matching page tags or employees
  const termLower = term.toLowerCase();
  const pages = ["dashboard", "employees", "attendance", "leaves", "payroll", "documents", "settings"];

  // Check if matches navigation page tag
  const matchingPage = pages.find(p => p.startsWith(termLower));
  if (matchingPage) {
    showToast(`Route shortcut found: navigating to ${matchingPage}`, "info");
    await navigateTo(matchingPage);
    document.getElementById("global-search-input").value = "";
    document.getElementById("global-search-input").blur();
    return;
  }

  // If not page, check employee match and redirect to directory
  try {
    const employees = await api.getEmployees();
    const employeeMatch = employees.find(e => e.name.toLowerCase().includes(termLower));
    if (employeeMatch) {
      showToast(`Employee match found: redirects to directory`, "info");
      await navigateTo("employees");
      document.getElementById("search-directory-field").value = employeeMatch.name;
      await filterDirectory();
      document.getElementById("global-search-input").value = "";
      document.getElementById("global-search-input").blur();
    }
  } catch (err) {
    // Silently ignore search failures.
  }
}

// ========================================================
// N. MODAL HELPERS
// ========================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
  }
}

// ========================================================
// O. THEME MANAGEMENT SETUP
// ========================================================
function initTheme() {
  const savedTheme = localStorage.getItem("hrms_theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
  setTheme(isDark);
}

function toggleTheme() {
  const isCurrentlyDark = document.body.classList.contains("dark-theme");
  setTheme(!isCurrentlyDark);
}

function setTheme(isDark) {
  const icon = document.getElementById("theme-toggle-icon");
  const select = document.getElementById("settings-theme-select");

  if (isDark) {
    document.body.classList.add("dark-theme");
    localStorage.setItem("hrms_theme", "dark");
    if (icon) icon.setAttribute("data-lucide", "sun");
    if (select) select.value = "dark";
  } else {
    document.body.classList.remove("dark-theme");
    localStorage.setItem("hrms_theme", "light");
    if (icon) icon.setAttribute("data-lucide", "moon");
    if (select) select.value = "light";
  }

  lucide.createIcons();

  // Redraw all charts to update grid layout colors
  updateAllCharts();
}
