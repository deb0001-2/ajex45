// API client for the Odo HRMS backend (replaces the old localStorage mock DB).
// Talks to the zero-dependency Node backend in `hrms-backend`.

const API_BASE = (window.__HRMS_API_BASE__ || "http://localhost:4000") + "/api";

const TOKEN_KEY = "hrms_token";
const USER_KEY = "hrms_user";

let authToken = localStorage.getItem(TOKEN_KEY) || null;

function setSession(token, user) {
  authToken = token || null;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getToken() {
  return authToken;
}

function buildQuery(params) {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "" && v !== "All"
  );
  if (!entries.length) return "";
  return `?${new URLSearchParams(entries).toString()}`;
}

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error(
      "Unable to reach the HRMS server. Please make sure the backend is running on port 4000."
    );
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = (data && data.error) || `Request failed with status ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  return data;
}

export const api = {
  // Session
  getToken,
  getStoredUser,
  clearSession: () => setSession(null, null),

  // Auth
  async login(email, password) {
    const result = await request("POST", "/auth/login", { email, password });
    setSession(result.token, result.user);
    return result.user;
  },
  async signup(payload) {
    const result = await request("POST", "/auth/signup", payload);
    setSession(result.token, result.user);
    return result.user;
  },
  async me() {
    const result = await request("GET", "/auth/me");
    setSession(authToken, result.user);
    return result.user;
  },

  // Employees
  getEmployees: (params) => request("GET", `/employees${buildQuery(params)}`),
  getEmployee: (id) => request("GET", `/employees/${encodeURIComponent(id)}`),
  createEmployee: (payload) => request("POST", "/employees", payload),
  updateEmployee: (id, payload) => request("PUT", `/employees/${encodeURIComponent(id)}`, payload),
  deleteEmployee: (id) => request("DELETE", `/employees/${encodeURIComponent(id)}`),

  // Attendance
  getAttendance: (params) => request("GET", `/attendance${buildQuery(params)}`),
  getHeatmap: () => request("GET", "/attendance/heatmap"),
  checkIn: (employeeId) => request("POST", "/attendance/checkin", employeeId ? { employeeId } : {}),
  checkOut: (employeeId) => request("POST", "/attendance/checkout", employeeId ? { employeeId } : {}),

  // Leaves
  getLeaves: (params) => request("GET", `/leaves${buildQuery(params)}`),
  getLeaveBalance: (employeeId) => request("GET", `/leaves/balance/${encodeURIComponent(employeeId)}`),
  applyLeave: (payload) => request("POST", "/leaves", payload),
  assessLeave: (id, payload) => request("PATCH", `/leaves/${encodeURIComponent(id)}`, payload),

  // Misc
  getAnnouncements: () => request("GET", "/announcements"),
  createAnnouncement: (payload) => request("POST", "/announcements", payload),
  getHolidays: () => request("GET", "/holidays"),
  getMeetings: () => request("GET", "/meetings"),
  getStats: () => request("GET", "/stats"),
  health: () => request("GET", "/health"),
};
