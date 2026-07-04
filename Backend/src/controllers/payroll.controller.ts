import { Request, Response } from 'express';
import Payroll from '../models/Payroll.model';
import User from '../models/User.model';
import Notification from '../models/Notification.model';
import ActivityLog from '../models/ActivityLog.model';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import type {
  GeneratePayrollInput,
  UpdatePayrollInput,
  PayrollQueryInput,
} from '../validators/payroll.validator';

// ─── Helper: calculate net salary from all components ────────────────────────
// Formula: (basicSalary + HRA + medicalAllowance + travelAllowance + bonus + allowances)
//        - (deductions + tax + pf)

const calculateNetSalary = (data: Partial<GeneratePayrollInput>): number => {
  const gross =
    (data.basicSalary ?? 0) +
    (data.hra ?? 0) +
    (data.medicalAllowance ?? 0) +
    (data.travelAllowance ?? 0) +
    (data.bonus ?? 0) +
    (data.allowances ?? 0);

  const totalDeductions =
    (data.deductions ?? 0) + (data.tax ?? 0) + (data.pf ?? 0);

  return Math.max(0, gross - totalDeductions);
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/payroll
 * Admin only — Generate a monthly payroll entry for one employee
 */
const generatePayroll = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as GeneratePayrollInput;
  const {
    userId,
    month,
    year,
    basicSalary,
    hra = 0,
    medicalAllowance = 0,
    travelAllowance = 0,
    bonus = 0,
    allowances = 0,
    deductions = 0,
    tax = 0,
    pf = 0,
    paymentMethod = 'Bank Transfer',
  } = input;

  // 1. Verify employee exists
  const employee = await User.findById(userId).select('fullName employeeId isActive');
  if (!employee) {
    throw new ApiError(404, `No employee found with ID: ${userId}`);
  }

  if (!employee.isActive) {
    throw new ApiError(400, 'Cannot generate payroll for an inactive employee.');
  }

  // 2. Prevent duplicate payroll for same month/year
  const existing = await Payroll.findOne({ user: userId, month, year });
  if (existing) {
    throw new ApiError(
      409,
      `Payroll for ${employee.fullName} for ${month}/${year} already exists. Use PUT to update it.`
    );
  }

  // 3. Calculate net salary
  const netSalary = calculateNetSalary(input);

  // 4. Create payroll record
  const payroll = await Payroll.create({
    user: userId,
    month,
    year,
    basicSalary,
    hra,
    medicalAllowance,
    travelAllowance,
    bonus,
    allowances,
    deductions,
    tax,
    pf,
    netSalary,
    paymentMethod,
    status: 'Pending',
    generatedBy: req.user!._id,
  });

  // 5. Notify the employee
  await Notification.create({
    user: userId,
    title: 'Payslip Generated',
    message: `Your payslip for ${month}/${year} has been generated. Net Salary: ₹${netSalary.toLocaleString('en-IN')}`,
    type: 'Info',
    priority: 'Medium',
    actionUrl: `/my-salary/${payroll._id}`,
  });

  await ActivityLog.create({
    user: req.user!._id,
    action: 'GENERATE_PAYROLL',
    description: `Generated payroll for ${employee.fullName} — ${month}/${year}. Net: ₹${netSalary}`,
    ipAddress: req.ip,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      { payroll, netSalary },
      'Payroll generated successfully.'
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/payroll
 * Admin/HR — View all payroll records with filters
 */
const getAllPayroll = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    month,
    year,
    status,
    userId,
  } = req.query as unknown as PayrollQueryInput;

  const filter: Record<string, unknown> = {};
  if (month) filter.month = month;
  if (year) filter.year = year;
  if (status) filter.status = status;
  if (userId) filter.user = userId;

  const skip = (page - 1) * limit;

  const [payrolls, totalCount] = await Promise.all([
    Payroll.find(filter)
      .populate('user', 'fullName employeeId department designation')
      .populate('generatedBy', 'fullName')
      .sort({ year: -1, month: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Payroll.countDocuments(filter),
  ]);

  // Aggregate total payroll cost for the filtered period
  const [aggregate] = await Payroll.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalNetSalary: { $sum: '$netSalary' },
        totalBasic: { $sum: '$basicSalary' },
        totalBonus: { $sum: '$bonus' },
        totalTax: { $sum: '$tax' },
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        payrolls,
        summary: aggregate ?? { totalNetSalary: 0, count: 0 },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page * limit < totalCount,
        },
      },
      'Payroll records fetched.'
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/payroll/my-salary
 * Employee — View own salary history and payslips
 */
const getMySalary = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const { page = 1, limit = 12, year } =
    req.query as unknown as PayrollQueryInput;

  const filter: Record<string, unknown> = { user: userId };
  if (year) filter.year = year;

  const skip = (page - 1) * limit;

  const [payrolls, totalCount] = await Promise.all([
    Payroll.find(filter)
      .sort({ year: -1, month: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Payroll.countDocuments(filter),
  ]);

  // Year-to-date earnings
  const currentYear = new Date().getFullYear();
  const [ytd] = await Payroll.aggregate([
    {
      $match: {
        user: req.user!._id,
        year: currentYear,
        status: 'Processed',
      },
    },
    {
      $group: {
        _id: null,
        ytdEarnings: { $sum: '$netSalary' },
        ytdTax: { $sum: '$tax' },
        ytdBonus: { $sum: '$bonus' },
        monthsProcessed: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        payrolls,
        ytdSummary: ytd ?? { ytdEarnings: 0, ytdTax: 0, ytdBonus: 0 },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page * limit < totalCount,
        },
      },
      'Salary records fetched successfully.'
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * PUT /api/payroll/:id
 * Admin only — Update salary structure, bonuses, or mark as processed
 */
const updatePayroll = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body as UpdatePayrollInput;

  // Find first so we can recalculate net salary
  const payroll = await Payroll.findById(id);
  if (!payroll) {
    throw new ApiError(404, `No payroll record found with ID: ${id}`);
  }

  // Merge existing values with updates, then recalculate net
  const merged = {
    basicSalary: updates.basicSalary ?? payroll.basicSalary,
    hra: updates.hra ?? payroll.hra,
    medicalAllowance: updates.medicalAllowance ?? payroll.medicalAllowance,
    travelAllowance: updates.travelAllowance ?? payroll.travelAllowance,
    bonus: updates.bonus ?? payroll.bonus,
    allowances: updates.allowances ?? payroll.allowances,
    deductions: updates.deductions ?? payroll.deductions,
    tax: updates.tax ?? payroll.tax,
    pf: updates.pf ?? payroll.pf,
  };

  const netSalary = calculateNetSalary(merged);

  const updated = await Payroll.findByIdAndUpdate(
    id,
    { $set: { ...updates, netSalary } },
    { new: true, runValidators: true }
  ).populate('user', 'fullName employeeId');

  // If just processed, notify the employee
  if (updates.status === 'Processed' && updated) {
    await Notification.create({
      user: payroll.user,
      title: 'Salary Credited',
      message: `Your salary for ${payroll.month}/${payroll.year} has been processed. Net: ₹${netSalary.toLocaleString('en-IN')}`,
      type: 'Success',
      priority: 'High',
    });
  }

  await ActivityLog.create({
    user: req.user!._id,
    action: 'UPDATE_PAYROLL',
    description: `Updated payroll record ${id}. New net salary: ₹${netSalary}`,
    ipAddress: req.ip,
  });

  res.status(200).json(
    new ApiResponse(200, updated, 'Payroll updated successfully.')
  );
});

export { generatePayroll, getAllPayroll, getMySalary, updatePayroll };
