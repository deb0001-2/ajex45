const db = require("../db");

function genLeaveId(existing) {
  let id;
  do {
    id = `LV-${Math.floor(100 + Math.random() * 900)}`;
  } while (existing.some((l) => l.id === id));
  return id;
}

module.exports = [
  {
    method: "GET",
    path: "/api/leaves",
    auth: true,
    handler: async ({ user, query, sendJson, res }) => {
      const data = db.read();
      let leaves = data.leaves;
      if (!user.isAdmin) {
        leaves = leaves.filter((l) => l.employeeId === user.employeeId);
      } else if (query.employeeId) {
        leaves = leaves.filter((l) => l.employeeId === query.employeeId);
      }
      if (query.status) leaves = leaves.filter((l) => l.status === query.status);
      return sendJson(res, 200, leaves);
    },
  },
  {
    method: "GET",
    path: "/api/leaves/balance/:employeeId",
    auth: true,
    handler: async ({ params, user, sendJson, res }) => {
      if (!user.isAdmin && user.employeeId !== params.employeeId) {
        return sendJson(res, 403, { error: "Cannot view another employee's leave balance" });
      }
      const data = db.read();
      const balance = data.leaveBalances[params.employeeId];
      if (!balance) return sendJson(res, 404, { error: "No leave balance found for this employee" });
      return sendJson(res, 200, balance);
    },
  },
  {
    method: "POST",
    path: "/api/leaves",
    auth: true,
    handler: async ({ user, body, sendJson, res }) => {
      const data = db.read();
      const employeeId = user.isAdmin && body.employeeId ? body.employeeId : user.employeeId;
      const employee = data.employees.find((e) => e.id === employeeId);
      if (!employee) return sendJson(res, 404, { error: "Employee not found" });

      if (!body.type || !body.startDate || !body.endDate || !body.days) {
        return sendJson(res, 400, {
          error: "type, startDate, endDate and days are required",
        });
      }

      const request = {
        id: genLeaveId(data.leaves),
        employeeId,
        employeeName: employee.name,
        type: body.type,
        startDate: body.startDate,
        endDate: body.endDate,
        days: body.days,
        reason: body.reason || "",
        status: "Pending",
        appliedDate: new Date().toISOString().split("T")[0],
        comments: [],
      };

      data.leaves.unshift(request);
      db.write(data);
      return sendJson(res, 201, request);
    },
  },
  {
    method: "PATCH",
    path: "/api/leaves/:id",
    auth: true,
    admin: true,
    handler: async ({ params, body, user, sendJson, res }) => {
      const data = db.read();
      const idx = data.leaves.findIndex((l) => l.id === params.id);
      if (idx === -1) return sendJson(res, 404, { error: "Leave request not found" });

      if (!["Approved", "Rejected"].includes(body.status)) {
        return sendJson(res, 400, { error: "status must be 'Approved' or 'Rejected'" });
      }

      const leave = data.leaves[idx];
      leave.status = body.status;

      if (body.comment && body.comment.trim()) {
        const admin = data.employees.find((e) => e.id === user.employeeId);
        leave.comments.push({
          sender: admin ? admin.name : "Admin",
          text: body.comment,
          date: new Date().toISOString().split("T")[0],
        });
      }

      if (body.status === "Approved") {
        const balance = data.leaveBalances[leave.employeeId];
        if (balance) {
          if (leave.type === "Casual Leave") balance.casual = Math.max(0, balance.casual - leave.days);
          if (leave.type === "Sick Leave") balance.sick = Math.max(0, balance.sick - leave.days);
          if (leave.type === "Annual Leave") balance.annual = Math.max(0, balance.annual - leave.days);
        }
      }

      db.write(data);
      return sendJson(res, 200, leave);
    },
  },
];
