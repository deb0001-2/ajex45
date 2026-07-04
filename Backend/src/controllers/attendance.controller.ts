import { Request, Response } from 'express';
import Attendance from '../models/Attendance.model';
import ActivityLog from '../models/ActivityLog.model';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import type {
  CheckInInput,
  CheckOutInput,
  EditAttendanceInput,
  AttendanceQueryInput,
} from '../validators/attendance.validator';

// ─── Helper: strip time, keep date only (midnight UTC) ───────────────────────
// Used to build the daily attendance record.
// e.g. "2025-07-04T14:30:00" → "2025-07-04T00:00:00.000Z"

const getDateOnly = (d: Date = new Date()): Date => {
  const date = new Date(d);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

// ─── Helper: calculate working hours between check-in and check-out ───────────

const calcWorkingHours = (
  checkIn: Date,
  checkOut: Date,
  breakMinutes: number = 0
): number => {
  const diffMs = checkOut.getTime() - checkIn.getTime();
  const totalHours = diffMs / (1000 * 60 * 60);
  const breakHours = breakMinutes / 60;
  return Math.max(0, Math.round((totalHours - breakHours) * 100) / 100);
};

// ─── Helper: determine status from working hours ──────────────────────────────

const determineStatus = (workingHours: number): 'Present' | 'Half Day' | 'Late' => {
  if (workingHours >= 8) return 'Present';
  if (workingHours >= 4) return 'Half Day';
  return 'Late';
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/attendance/check-in
 * Employee only — creates today's attendance record with checkInTime
 */
const checkIn = asyncHandler(async (req: Request, res: Response) => {
  const { location, device, remarks } = req.body as CheckInInput;
  const userId = req.user!._id;
  const today = getDateOnly();

  // Prevent double check-in on the same day
  const existing = await Attendance.findOne({ user: userId, date: today });
  if (existing) {
    throw new ApiError(
      409,
      'You have already checked in today. Use check-out to close your session.'
    );
  }

  const attendance = await Attendance.create({
    user: userId,
    date: today,
    checkInTime: new Date(),
    status: 'Present', // tentative — recalculated on check-out
    location,
    device,
    ipAddress: req.ip,
    remarks,
  });

  await ActivityLog.create({
    user: userId,
    action: 'CHECK_IN',
    description: `Checked in at ${new Date().toISOString()}`,
    ipAddress: req.ip,
    device: req.headers['user-agent'],
  });

  res.status(201).json(
    new ApiResponse(201, attendance, 'Check-in recorded successfully.')
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/attendance/check-out
 * Employee only — updates today's record with checkOutTime and calculates hours
 */
const checkOut = asyncHandler(async (req: Request, res: Response) => {
  const { remarks, breakDuration = 0 } = req.body as CheckOutInput;
  const userId = req.user!._id;
  const today = getDateOnly();

  // Find today's check-in record
  const attendance = await Attendance.findOne({ user: userId, date: today });

  if (!attendance) {
    throw new ApiError(
      400,
      'No check-in found for today. Please check in first.'
    );
  }

  if (attendance.checkOutTime) {
    throw new ApiError(409, 'You have already checked out today.');
  }

  const checkOutTime = new Date();
  const workingHours = calcWorkingHours(
    attendance.checkInTime!,
    checkOutTime,
    breakDuration
  );

  // Recalculate late office hours threshold (9 AM)
  const checkInHour = attendance.checkInTime!.getHours();
  const isLate = checkInHour >= 10; // Late if checked in after 10 AM

  const status = isLate ? 'Late' : determineStatus(workingHours);

  attendance.checkOutTime = checkOutTime;
  attendance.workingHours = workingHours;
  attendance.breakDuration = breakDuration;
  attendance.status = status;
  if (remarks) attendance.remarks = remarks;

  // Calculate overtime (anything beyond 8 hours)
  attendance.overtimeHours = Math.max(0, workingHours - 8);

  await attendance.save();

  await ActivityLog.create({
    user: userId,
    action: 'CHECK_OUT',
    description: `Checked out at ${checkOutTime.toISOString()}. Working hours: ${workingHours}h`,
    ipAddress: req.ip,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        attendance,
        summary: {
          workingHours,
          overtimeHours: attendance.overtimeHours,
          status,
        },
      },
      'Check-out recorded successfully.'
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/attendance/my-records
 * Employee — Get own attendance history (with optional date range)
 */
const getMyAttendance = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const { page = 1, limit = 20, startDate, endDate, status } =
    req.query as unknown as AttendanceQueryInput;

  const filter: Record<string, unknown> = { user: userId };

  if (startDate || endDate) {
    const dateFilter: Record<string, Date> = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    filter.date = dateFilter;
  }

  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const [records, totalCount] = await Promise.all([
    Attendance.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Attendance.countDocuments(filter),
  ]);

  // ─ Monthly summary stats ───────────────────────────────────────────────────
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlySummary = await Attendance.aggregate([
    { $match: { user: req.user!._id, date: { $gte: monthStart } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalHours: { $sum: '$workingHours' },
      },
    },
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        records,
        monthlySummary,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page * limit < totalCount,
        },
      },
      'Attendance records fetched successfully.'
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/attendance
 * Admin/HR — Get all attendance records with filters
 */
const getAllAttendance = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    startDate,
    endDate,
    userId,
    status,
    sortOrder = 'desc',
  } = req.query as unknown as AttendanceQueryInput;

  const filter: Record<string, unknown> = {};

  if (userId) filter.user = userId;
  if (status) filter.status = status;

  if (startDate || endDate) {
    const dateFilter: Record<string, Date> = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    filter.date = dateFilter;
  }

  const skip = (page - 1) * limit;

  const [records, totalCount] = await Promise.all([
    Attendance.find(filter)
      .populate('user', 'fullName employeeId department')
      .sort({ date: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Attendance.countDocuments(filter),
  ]);

  // Today's quick stats for the admin dashboard
  const todayStats = await Attendance.aggregate([
    { $match: { date: getDateOnly() } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        records,
        todayStats,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page * limit < totalCount,
        },
      },
      'All attendance records fetched.'
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * PUT /api/attendance/:id
 * Admin only — Manually correct an attendance record
 */
const editAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body as EditAttendanceInput;

  // Recalculate working hours if both times are provided
  let workingHours = updates.workingHours;
  if (updates.checkInTime && updates.checkOutTime && !workingHours) {
    workingHours = calcWorkingHours(
      new Date(updates.checkInTime),
      new Date(updates.checkOutTime),
      updates.breakDuration ?? 0
    );
  }

  const updated = await Attendance.findByIdAndUpdate(
    id,
    { $set: { ...updates, workingHours } },
    { new: true, runValidators: true }
  ).populate('user', 'fullName employeeId');

  if (!updated) {
    throw new ApiError(404, `No attendance record found with ID: ${id}`);
  }

  await ActivityLog.create({
    user: req.user!._id,
    action: 'EDIT_ATTENDANCE',
    description: `Admin manually edited attendance record: ${id}`,
    ipAddress: req.ip,
  });

  res.status(200).json(
    new ApiResponse(200, updated, 'Attendance record updated successfully.')
  );
});

export { checkIn, checkOut, getMyAttendance, getAllAttendance, editAttendance };
