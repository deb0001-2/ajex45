const db = require("../db");

module.exports = [
  {
    method: "GET",
    path: "/api/announcements",
    auth: true,
    handler: async ({ sendJson, res }) => sendJson(res, 200, db.read().announcements),
  },
  {
    method: "POST",
    path: "/api/announcements",
    auth: true,
    admin: true,
    handler: async ({ body, sendJson, res }) => {
      const data = db.read();
      if (!body.title || !body.content) {
        return sendJson(res, 400, { error: "title and content are required" });
      }
      const announcement = {
        id: `A-${data.announcements.length + 1}`,
        title: body.title,
        content: body.content,
        category: body.category || "General",
        date: new Date().toISOString().split("T")[0],
      };
      data.announcements.unshift(announcement);
      db.write(data);
      return sendJson(res, 201, announcement);
    },
  },
  {
    method: "GET",
    path: "/api/holidays",
    auth: true,
    handler: async ({ sendJson, res }) => {
      const data = db.read();
      const today = new Date();
      const holidays = data.holidays.map((h) => {
        const diffDays = Math.round((new Date(h.date) - today) / (1000 * 60 * 60 * 24));
        return { ...h, daysLeft: Math.max(0, diffDays) };
      });
      return sendJson(res, 200, holidays);
    },
  },
  {
    method: "GET",
    path: "/api/meetings",
    auth: true,
    handler: async ({ sendJson, res }) => sendJson(res, 200, db.read().meetings),
  },
  {
    method: "GET",
    path: "/api/stats",
    auth: true,
    handler: async ({ sendJson, res }) => {
      const data = db.read();
      const today = new Date().toISOString().split("T")[0];

      const presentToday = data.attendance.filter(
        (a) => a.date === today && a.status === "Present"
      );
      const lateToday = presentToday.filter((a) => a.isLate);
      const onLeaveToday = data.employees.filter((e) => e.status === "On Leave");
      const pendingLeaves = data.leaves.filter((l) => l.status === "Pending");

      const totalCount = data.employees.length;
      const presentCount = presentToday.length;
      const absentCount = Math.max(0, totalCount - presentCount - onLeaveToday.length);
      const denominator = totalCount - onLeaveToday.length;
      const attendanceRate = denominator > 0 ? Math.round((presentCount / denominator) * 100) : 100;

      return sendJson(res, 200, {
        totalEmployees: totalCount,
        presentToday: presentCount,
        absentToday: absentCount,
        pendingLeaves: pendingLeaves.length,
        lateCheckins: lateToday.length,
        attendanceRate,
        onLeaveToday: onLeaveToday.length,
      });
    },
  },
  {
    method: "GET",
    path: "/api/health",
    handler: async ({ sendJson, res }) =>
      sendJson(res, 200, { status: "ok", time: new Date().toISOString() }),
  },
];
