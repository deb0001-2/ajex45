const db = require("../db");
const { hashPassword } = require("../utils/auth");
const { sanitizeEmployee } = require("../utils/sanitize");
const { nextEmployeeId } = require("../utils/ids");

module.exports = [
  {
    method: "GET",
    path: "/api/employees",
    auth: true,
    handler: async ({ query, sendJson, res }) => {
      const data = db.read();
      let employees = data.employees;
      if (query.department) {
        employees = employees.filter(
          (e) => e.department.toLowerCase() === query.department.toLowerCase()
        );
      }
      if (query.status) {
        employees = employees.filter(
          (e) => e.status.toLowerCase() === query.status.toLowerCase()
        );
      }
      return sendJson(res, 200, employees.map(sanitizeEmployee));
    },
  },
  {
    method: "GET",
    path: "/api/employees/:id",
    auth: true,
    handler: async ({ params, sendJson, res }) => {
      const data = db.read();
      const emp = data.employees.find((e) => e.id === params.id);
      if (!emp) return sendJson(res, 404, { error: "Employee not found" });
      return sendJson(res, 200, sanitizeEmployee(emp));
    },
  },
  {
    method: "POST",
    path: "/api/employees",
    auth: true,
    admin: true,
    handler: async ({ body, sendJson, res }) => {
      const data = db.read();
      if (!body.name || !body.email) {
        return sendJson(res, 400, { error: "name and email are required" });
      }
      if (
        data.employees.some(
          (e) => e.email.toLowerCase() === String(body.email).toLowerCase()
        )
      ) {
        return sendJson(res, 409, { error: "An employee with this email already exists" });
      }

      const id = nextEmployeeId(data.employees);
      const salary = parseInt(body.salary, 10) || 5000;
      const newEmp = {
        id,
        name: body.name,
        email: body.email,
        department: body.department || "Unassigned",
        role: body.role || "Employee",
        manager: body.manager || "Unassigned",
        skills: Array.isArray(body.skills) ? body.skills : [],
        experience: body.experience || "0 Years",
        contact: body.contact || "",
        emergencyContact: body.emergencyContact || "",
        bloodGroup: body.bloodGroup || "",
        status: "Active",
        avatar:
          body.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(body.name)}`,
        profileCompletion: 80,
        hireDate: new Date().toISOString().split("T")[0],
        streak: 0,
        isAdmin: false,
        password: hashPassword(body.password || "employee123"),
        salaryBreakdown: {
          basic: salary,
          bonus: Math.round(salary * 0.15),
          tax: Math.round(salary * 0.12),
          pf: Math.round(salary * 0.08),
          deductions: 0,
          net: Math.round(salary * 0.95),
        },
      };

      data.employees.push(newEmp);
      data.leaveBalances[id] = { casual: 10, sick: 8, annual: 12, maternity: 0 };
      db.write(data);
      return sendJson(res, 201, sanitizeEmployee(newEmp));
    },
  },
  {
    method: "PUT",
    path: "/api/employees/:id",
    auth: true,
    admin: true,
    handler: async ({ params, body, sendJson, res }) => {
      const data = db.read();
      const idx = data.employees.findIndex((e) => e.id === params.id);
      if (idx === -1) return sendJson(res, 404, { error: "Employee not found" });

      const { password, id, ...updatable } = body;
      data.employees[idx] = { ...data.employees[idx], ...updatable };
      if (password) {
        data.employees[idx].password = hashPassword(password);
      }
      db.write(data);
      return sendJson(res, 200, sanitizeEmployee(data.employees[idx]));
    },
  },
  {
    method: "DELETE",
    path: "/api/employees/:id",
    auth: true,
    admin: true,
    handler: async ({ params, sendJson, res }) => {
      const data = db.read();
      const idx = data.employees.findIndex((e) => e.id === params.id);
      if (idx === -1) return sendJson(res, 404, { error: "Employee not found" });

      const [removed] = data.employees.splice(idx, 1);
      delete data.leaveBalances[params.id];
      data.attendance = data.attendance.filter((a) => a.employeeId !== params.id);
      data.leaves = data.leaves.filter((l) => l.employeeId !== params.id);
      db.write(data);
      return sendJson(res, 200, { message: `${removed.name} removed`, id: params.id });
    },
  },
];
