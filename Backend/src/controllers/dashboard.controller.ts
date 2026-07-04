import { Request, Response } from 'express';
import User from '../models/User.model';
import Attendance from '../models/Attendance.model';
import Leave from '../models/Leave.model';
import Payroll from '../models/Payroll.model';
import Announcement from '../models/Announcement.model';
import Holiday from '../models/Holiday.model';
import ApiResponse from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';

// ─── Helper: strip time from date ────────────────────────────────────────────

const getDateOnly = (d: Date = new Date()): Date => {
  const date = new Date(d);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/dashboard/admin
 * Admin/HR only
 *
 * Returns a single response with all data the admin dashboard needs:
 * — Employee stats, today's attendance, pending leaves, payroll summary,
 *   recent announcements, upcoming holidays, and monthly trend charts.
 *
 * All queries run in parallel with Promise.all for maximum performance.
 */
const getAdminDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    const today = getDateOnly();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      employeeStats,
      todayAttendance,
      leaveStats,
      payrollStats,
      announcements,
      upcomingHolidays,
      monthlyAttendanceTrend,
      departmentHeadcount,
    ] = await Promise.all([

      // ── Employee Stats ────────────────────────────────────────────────────
      User.aggregate([
        {
          $facet: {
            totals: [
              {
                $group: {
                  _id: null,
                  total: { $sum: 1 },
                  active: { $sum: { $cond: ['$isActive', 1, 0] } },
                  inactive: { $sum: { $cond: ['$isActive', 0, 1] } },
                },
              },
            ],
            byRole: [{ $group: { _id: '$role', count: { $sum: 1 } } }],
            recentHires: [
              { $match: { joiningDate: { $gte: monthStart } } },
              { $count: 'count' },
            ],
          },
        },
      ]),

      // ── Today's Attendance ────────────────────────────────────────────────
      Attendance.aggregate([
        { $match: { date: today } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // ── Leave Stats ───────────────────────────────────────────────────────
      Leave.aggregate([
        {
          $facet: {
            pending: [
              { $match: { status: 'Pending' } },
              { $count: 'count' },
            ],
            thisMonth: [
              { $match: { appliedAt: { $gte: monthStart } } },
              { $group: { _id: '$status', count: { $sum: 1 } } },
            ],
          },
        },
      ]),

      // ── Payroll Stats (current + last month) ──────────────────────────────
      Payroll.aggregate([
        {
          $facet: {
            currentMonth: [
              {
                $match: {
                  month: now.getMonth() + 1,
                  year: now.getFullYear(),
                },
              },
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 },
                  totalNet: { $sum: '$netSalary' },
                },
              },
            ],
            lastMonth: [
              {
                $match: {
                  createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
                },
              },
              {
                $group: {
                  _id: null,
                  totalNet: { $sum: '$netSalary' },
                  count: { $sum: 1 },
                },
              },
            ],
          },
        },
      ]),

      // ── Recent Announcements ──────────────────────────────────────────────
      Announcement.find()
        .populate('createdBy', 'fullName')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      // ── Upcoming Holidays (next 30 days) ──────────────────────────────────
      Holiday.find({
        holidayDate: {
          $gte: today,
          $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
        .sort({ holidayDate: 1 })
        .limit(5)
        .lean(),

      // ── Monthly Attendance Trend (last 6 months) ──────────────────────────
      Attendance.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
              status: '$status',
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),

      // ── Department Headcount ──────────────────────────────────────────────
      User.aggregate([
        { $match: { isActive: true, department: { $exists: true } } },
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'departments',
            localField: '_id',
            foreignField: '_id',
            as: 'dept',
          },
        },
        { $unwind: { path: '$dept', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            departmentName: '$dept.departmentName',
            count: 1,
          },
        },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          employeeStats: employeeStats[0],
          todayAttendance,
          leaveStats: leaveStats[0],
          payrollStats: payrollStats[0],
          announcements,
          upcomingHolidays,
          monthlyAttendanceTrend,
          departmentHeadcount,
        },
        'Admin dashboard data fetched successfully.'
      )
    );
  }
);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/dashboard/employee
 * Any authenticated user
 *
 * Returns personal stats: streak, leave balance, today's attendance,
 * recent payslip, and upcoming holidays.
 */
const getEmployeeDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const today = getDateOnly();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      todayRecord,
      employee,
      monthlyAttendance,
      recentPayslip,
      upcomingHolidays,
      announcements,
    ] = await Promise.all([

      // ── Today's check-in record ───────────────────────────────────────────
      Attendance.findOne({ user: userId, date: today }).lean(),

      // ── Employee profile with leave balance ───────────────────────────────
      User.findById(userId)
        .select('fullName employeeId leaveBalance attendanceStreak department designation')
        .populate('department', 'departmentName')
        .lean(),

      // ── This month's attendance summary ───────────────────────────────────
      Attendance.aggregate([
        {
          $match: {
            user: req.user!._id,
            date: { $gte: monthStart },
          },
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalHours: { $sum: '$workingHours' },
          },
        },
      ]),

      // ── Most recent payslip ───────────────────────────────────────────────
      Payroll.findOne({ user: userId })
        .sort({ year: -1, month: -1 })
        .lean(),

      // ── Upcoming holidays ─────────────────────────────────────────────────
      Holiday.find({
        holidayDate: {
          $gte: today,
          $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
        .sort({ holidayDate: 1 })
        .limit(3)
        .lean(),

      // ── Recent announcements (company-wide or own department) ─────────────
      Announcement.find({
        $or: [
          { department: { $exists: false } },
          { department: null },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          profile: employee,
          todayAttendance: todayRecord,
          monthlyAttendanceSummary: monthlyAttendance,
          leaveBalance: employee?.leaveBalance,
          recentPayslip,
          upcomingHolidays,
          announcements,
        },
        'Employee dashboard data fetched successfully.'
      )
    );
  }
);

export { getAdminDashboard, getEmployeeDashboard };
