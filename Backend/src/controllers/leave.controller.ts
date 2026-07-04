import { Request, Response } from 'express';
import Leave from '../models/Leave.model';
import User from '../models/User.model';
import Notification from '../models/Notification.model';
import ActivityLog from '../models/ActivityLog.model';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import type {
  ApplyLeaveInput,
  UpdateLeaveStatusInput,
  LeaveQueryInput,
} from '../validators/leave.validator';

// ─── Helper: count working days between two dates (Mon–Fri only) ──────────────

const countWorkingDays = (start: Date, end: Date): number => {
  let count = 0;
  const current = new Date(start);
  current.setUTCHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setUTCHours(0, 0, 0, 0);

  while (current <= endDate) {
    const day = current.getUTCDay(); // 0=Sun, 6=Sat
    if (day !== 0 && day !== 6) count++;
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return count;
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/leaves
 * Employee — Apply for leave
 */
const applyLeave = asyncHandler(async (req: Request, res: Response) => {
  const { leaveType, startDate, endDate, reason } =
    req.body as ApplyLeaveInput;
  const userId = req.user!._id;

  // 1. Calculate working days
  const totalDays = countWorkingDays(new Date(startDate), new Date(endDate));
  if (totalDays === 0) {
    throw new ApiError(400, 'Leave dates cannot fall entirely on weekends.');
  }

  // 2. Check the employee's leave balance
  const employee = await User.findById(userId).select('leaveBalance fullName');
  if (!employee) throw new ApiError(404, 'Employee not found.');

  const balanceKey = leaveType.toLowerCase() as keyof typeof employee.leaveBalance;

  if (leaveType !== 'Unpaid' && employee.leaveBalance[balanceKey] < totalDays) {
    throw new ApiError(
      400,
      `Insufficient leave balance. You have ${employee.leaveBalance[balanceKey]} ${leaveType} leave(s) remaining, but requested ${totalDays}.`
    );
  }

  // 3. Check for overlapping approved/pending leaves
  const overlap = await Leave.findOne({
    user: userId,
    status: { $in: ['Pending', 'Approved'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
    ],
  });

  if (overlap) {
    throw new ApiError(
      409,
      `You already have a ${overlap.status.toLowerCase()} leave request overlapping these dates.`
    );
  }

  // 4. Create the leave request
  const leave = await Leave.create({
    user: userId,
    leaveType,
    startDate,
    endDate,
    totalDays,
    reason,
    status: 'Pending',
    appliedAt: new Date(),
  });

  // 5. Notify all Admins/HR about the new leave request
  const admins = await User.find({ role: { $in: ['Admin', 'HR'] } }).select('_id');
  if (admins.length > 0) {
    const notifications = admins.map((admin) => ({
      user: admin._id,
      title: 'New Leave Request',
      message: `${employee.fullName} has applied for ${totalDays} day(s) of ${leaveType} leave.`,
      type: 'Info' as const,
      priority: 'Medium' as const,
      actionUrl: `/admin/leaves/${leave._id}`,
    }));
    await Notification.insertMany(notifications);
  }

  await ActivityLog.create({
    user: userId,
    action: 'APPLY_LEAVE',
    description: `Applied for ${totalDays} day(s) of ${leaveType} leave from ${startDate} to ${endDate}`,
    ipAddress: req.ip,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      { leave, totalDays },
      'Leave application submitted successfully.'
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/leaves/my-leaves
 * Employee — View own leave history and remaining balance
 */
const getMyLeaves = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const { page = 1, limit = 10, status, leaveType } =
    req.query as unknown as LeaveQueryInput;

  const filter: Record<string, unknown> = { user: userId };
  if (status) filter.status = status;
  if (leaveType) filter.leaveType = leaveType;

  const skip = (page - 1) * limit;

  const [leaves, totalCount, employee] = await Promise.all([
    Leave.find(filter)
      .populate('approvedBy', 'fullName designation')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Leave.countDocuments(filter),
    User.findById(userId).select('leaveBalance'),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        leaves,
        leaveBalance: employee?.leaveBalance,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page * limit < totalCount,
        },
      },
      'Leave records fetched successfully.'
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/leaves
 * Admin/HR — All leave requests with filters
 */
const getAllLeaves = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    status,
    leaveType,
    userId,
    startDate,
    endDate,
    sortOrder = 'desc',
  } = req.query as unknown as LeaveQueryInput;

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (leaveType) filter.leaveType = leaveType;
  if (userId) filter.user = userId;

  if (startDate || endDate) {
    const dateFilter: Record<string, Date> = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    filter.startDate = dateFilter;
  }

  const skip = (page - 1) * limit;

  const [leaves, totalCount, pendingCount] = await Promise.all([
    Leave.find(filter)
      .populate('user', 'fullName employeeId department designation profilePicture')
      .populate('approvedBy', 'fullName')
      .sort({ appliedAt: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Leave.countDocuments(filter),
    Leave.countDocuments({ status: 'Pending' }), // always useful for badge count
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        leaves,
        pendingCount,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page * limit < totalCount,
        },
      },
      'All leave requests fetched.'
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * PUT /api/leaves/:id/status
 * Admin/HR — Approve or reject a leave request
 */
const updateLeaveStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, comments } = req.body as UpdateLeaveStatusInput;

  const leave = await Leave.findById(id).populate<{
    user: {
      _id: unknown;
      fullName: string;
      leaveBalance: {
        paid: number;
        sick: number;
        casual: number;
        unpaid: number;
      };
    };
  }>('user', 'fullName leaveBalance');

  if (!leave) {
    throw new ApiError(404, `No leave request found with ID: ${id}`);
  }

  if (leave.status !== 'Pending') {
    throw new ApiError(
      400,
      `This leave has already been ${leave.status.toLowerCase()}. Cannot update again.`
    );
  }

  // Deduct leave balance on approval
  if (status === 'Approved') {
    const employee = await User.findById(leave.user._id);
    if (!employee) throw new ApiError(404, 'Employee not found.');

    const balanceKey = leave.leaveType.toLowerCase() as keyof typeof employee.leaveBalance;

    if (leave.leaveType !== 'Unpaid') {
      // Final balance check at time of approval
      if (employee.leaveBalance[balanceKey] < leave.totalDays) {
        throw new ApiError(
          400,
          `Cannot approve — employee only has ${employee.leaveBalance[balanceKey]} ${leave.leaveType} leave(s) remaining.`
        );
      }
      // Deduct from balance
      employee.leaveBalance[balanceKey] -= leave.totalDays;
      leave.leaveBalanceAfterApproval = employee.leaveBalance[balanceKey];
    }

    await employee.save({ validateBeforeSave: false });
  }

  leave.status = status;
  leave.approvedBy = req.user!._id;
  leave.comments = comments;
  await leave.save();

  // Notify the employee of the decision
  await Notification.create({
    user: String(leave.user._id),
    title: `Leave ${status}`,
    message: `Your ${leave.leaveType} leave request (${leave.totalDays} day(s)) has been ${status.toLowerCase()}.${comments ? ` Note: ${comments}` : ''}`,
    type: status === 'Approved' ? 'Success' : 'Warning',
    priority: 'High',
    actionUrl: `/my-leaves/${leave._id}`,
  });

  await ActivityLog.create({
    user: req.user!._id,
    action: `LEAVE_${status.toUpperCase()}`,
    description: `${status} leave request for ${leave.user.fullName}`,
    ipAddress: req.ip,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      leave,
      `Leave request ${status.toLowerCase()} successfully.`
    )
  );
});

export { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };
