const db = require("../db");

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function formatTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minutesStr} ${ampm}`;
}

module.exports = [
  {
    method: "GET",
    path: "/api/attendance",
    auth: true,
    handler: async ({ query, sendJson, res }) => {
      const data = db.read();
      let records = data.attendance;
      if (query.date) records = records.filter((a) => a.date === query.date);
      if (query.employeeId) records = records.filter((a) => a.employeeId === query.employeeId);
      return sendJson(res, 200, records);
    },
  },
  {
    method: "GET",
    path: "/api/attendance/heatmap",
    auth: true,
    handler: async ({ sendJson, res }) => {
      const data = db.read();
      return sendJson(res, 200, data.heatmap);
    },
  },
  {
    method: "POST",
    path: "/api/attendance/checkin",
    auth: true,
    handler: async ({ user, body, sendJson, res }) => {
      const data = db.read();
      const employeeId = user.isAdmin && body.employeeId ? body.employeeId : user.employeeId;
      const employee = data.employees.find((e) => e.id === employeeId);
      if (!employee) return sendJson(res, 404, { error: "Employee not found" });

      const date = todayStr();
      const existing = data.attendance.find(
        (a) => a.employeeId === employeeId && a.date === date
      );
      if (existing) return sendJson(res, 409, { error: "Already checked in today" });

      const now = new Date();
      const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);
      const record = {
        employeeId,
        checkIn: formatTime(now),
        checkOut: "",
        date,
        status: "Present",
        isLate,
      };
      data.attendance.push(record);

      const empIdx = data.employees.findIndex((e) => e.id === employeeId);
      if (empIdx !== -1) data.employees[empIdx].streak += 1;
      data.heatmap[date] = 4;

      db.write(data);
      return sendJson(res, 201, record);
    },
  },
  {
    method: "POST",
    path: "/api/attendance/checkout",
    auth: true,
    handler: async ({ user, body, sendJson, res }) => {
      const data = db.read();
      const employeeId = user.isAdmin && body.employeeId ? body.employeeId : user.employeeId;
      const date = todayStr();

      const idx = data.attendance.findIndex(
        (a) => a.employeeId === employeeId && a.date === date
      );
      if (idx === -1) return sendJson(res, 404, { error: "No check-in record found for today" });
      if (data.attendance[idx].checkOut) {
        return sendJson(res, 409, { error: "Already checked out today" });
      }

      data.attendance[idx].checkOut = formatTime(new Date());
      db.write(data);
      return sendJson(res, 200, data.attendance[idx]);
    },
  },
];
