const db = require("../db");
const { sign, verifyPassword, hashPassword } = require("../utils/auth");
const { sanitizeEmployee } = require("../utils/sanitize");
const { nextEmployeeId } = require("../utils/ids");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = [
  {
    method: "POST",
    path: "/api/auth/login",
    handler: async ({ body, sendJson, res }) => {
      const { email, password } = body;
      if (!email || !password) {
        return sendJson(res, 400, { error: "email and password are required" });
      }
      const data = db.read();
      const employee = data.employees.find(
        (e) => e.email.toLowerCase() === String(email).toLowerCase()
      );
      if (!employee || !verifyPassword(password, employee.password)) {
        return sendJson(res, 401, { error: "Invalid email or password" });
      }
      const token = sign({ employeeId: employee.id, isAdmin: !!employee.isAdmin });
      return sendJson(res, 200, { token, user: sanitizeEmployee(employee) });
    },
  },
  {
    method: "POST",
    path: "/api/auth/signup",
    handler: async ({ body, sendJson, res }) => {
      const { name, email, password, department, role, contact } = body;

      if (!name || !String(name).trim()) {
        return sendJson(res, 400, { error: "Full name is required" });
      }
      if (!email || !EMAIL_RE.test(String(email).trim())) {
        return sendJson(res, 400, { error: "A valid email address is required" });
      }
      if (!password || String(password).length < 6) {
        return sendJson(res, 400, { error: "Password must be at least 6 characters" });
      }

      const data = db.read();
      const emailLower = String(email).toLowerCase();
      if (data.employees.some((e) => e.email.toLowerCase() === emailLower)) {
        return sendJson(res, 409, { error: "An account with this email already exists" });
      }

      const id = nextEmployeeId(data.employees);
      const salary = 5000;
      const newEmployee = {
        id,
        name: String(name).trim(),
        email: String(email).trim(),
        department: department || "Unassigned",
        role: role || "Employee",
        manager: "Unassigned",
        skills: ["General Operations", "Communication", "Time Management"],
        experience: "0 Years",
        contact: contact || "",
        emergencyContact: "",
        bloodGroup: "",
        status: "Active",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(String(name).trim())}`,
        profileCompletion: 40,
        hireDate: new Date().toISOString().split("T")[0],
        streak: 0,
        isAdmin: false,
        password: hashPassword(String(password)),
        salaryBreakdown: {
          basic: salary,
          bonus: Math.round(salary * 0.15),
          tax: Math.round(salary * 0.12),
          pf: Math.round(salary * 0.08),
          deductions: 0,
          net: Math.round(salary * 0.95),
        },
      };

      data.employees.push(newEmployee);
      data.leaveBalances[id] = { casual: 10, sick: 8, annual: 12, maternity: 0 };
      db.write(data);

      const token = sign({ employeeId: newEmployee.id, isAdmin: false });
      return sendJson(res, 201, { token, user: sanitizeEmployee(newEmployee) });
    },
  },
  {
    method: "GET",
    path: "/api/auth/me",
    auth: true,
    handler: async ({ user, sendJson, res }) => {
      const data = db.read();
      const employee = data.employees.find((e) => e.id === user.employeeId);
      if (!employee) return sendJson(res, 404, { error: "User not found" });
      return sendJson(res, 200, { user: sanitizeEmployee(employee) });
    },
  },
];
