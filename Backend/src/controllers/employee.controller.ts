import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.model';
import ActivityLog from '../models/ActivityLog.model';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import type {
  UpdateProfileInput,
  AdminUpdateEmployeeInput,
  EmployeeQueryInput,
} from '../validators/employee.validator';

// ─── GET /api/employees ───────────────────────────────────────────────────────
// Admin only — paginated list with search, filter, sort

const getAllEmployees = asyncHandler(async (req: Request, res: Response) => {
  // Query params already validated & typed by Zod via validateSchema
  const {
    page,
    limit,
    search,
    department,
    role,
    employmentType,
    isActive,
    sortBy,
    sortOrder,
  } = req.query as unknown as EmployeeQueryInput;

  // ─ Build the MongoDB filter object step by step ───────────────────────────

  // Think of this as building a list of conditions for a WHERE clause in SQL.
  const filter: Record<string, unknown> = {};

  // 1. Text search on fullName or email
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
    ];
  }

  // 2. Filter by department (ObjectId string)
  if (department) {
    filter.department = new mongoose.Types.ObjectId(department);
  }

  // 3. Filter by role
  if (role) filter.role = role;

  // 4. Filter by employment type
  if (employmentType) filter.employmentType = employmentType;

  // 5. Filter by active status (default: show all)
  if (isActive !== undefined) filter.isActive = isActive;

  // ─ Sort ───────────────────────────────────────────────────────────────────

  const sortOptions: Record<string, 1 | -1> = {
    [sortBy ?? 'createdAt']: sortOrder === 'asc' ? 1 : -1,
  };

  // ─ Pagination ─────────────────────────────────────────────────────────────
  const pageNum = page ?? 1;
  const limitNum = limit ?? 10;
  const skip = (pageNum - 1) * limitNum;

  // ─ Execute queries in parallel for performance ────────────────────────────
  const [employees, totalCount] = await Promise.all([
    User.find(filter)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .populate('department', 'departmentName departmentCode')
      .populate('manager', 'fullName email designation')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean(), // .lean() returns plain JS objects — much faster than Mongoose docs
    User.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        employees,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalCount,
          limit: limitNum,
          hasNextPage: pageNum * limitNum < totalCount,
          hasPrevPage: pageNum > 1,
        },
      },
      'Employees fetched successfully.'
    )
  );
});

// ─── GET /api/employees/:id ───────────────────────────────────────────────────
// Admin can view any employee; Employee can only view their own profile

const getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Self-access guard: Employee can only access their own record
  const isSelf = req.user!._id.toString() === id;
  const isAdminOrHR =
    req.user!.role === 'Admin' || req.user!.role === 'HR';

  if (!isSelf && !isAdminOrHR) {
    throw new ApiError(403, 'You can only view your own profile.');
  }

  const employee = await User.findById(id)
    .select('-password -resetPasswordToken -resetPasswordExpires')
    .populate('department', 'departmentName departmentCode')
    .populate('manager', 'fullName email designation employeeId');

  if (!employee) {
    throw new ApiError(404, `No employee found with ID: ${id}`);
  }

  res.status(200).json(
    new ApiResponse(200, employee, 'Employee fetched successfully.')
  );
});

// ─── PUT /api/employees/:id ───────────────────────────────────────────────────
// Admin: can update all fields
// Employee: can only update their own profile (limited fields)

const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const requesterId = req.user!._id.toString();
  const requesterRole = req.user!.role;
  const isSelf = requesterId === id;
  const isAdminOrHR = requesterRole === 'Admin' || requesterRole === 'HR';

  // Prevent employees from editing someone else's profile
  if (!isSelf && !isAdminOrHR) {
    throw new ApiError(403, 'You can only edit your own profile.');
  }

  // If it's an Employee editing their own profile, restrict the fields they can change.
  // We do this by picking only the "safe" fields from req.body.
  let updateData: Partial<AdminUpdateEmployeeInput | UpdateProfileInput>;

  if (isAdminOrHR) {
    // Admin/HR gets the full payload (already validated by adminUpdateEmployeeSchema)
    updateData = req.body as AdminUpdateEmployeeInput;
  } else {
    // Employee only — strip any privileged fields even if they were smuggled in
    const {
      fullName,
      dateOfBirth,
      gender,
      bloodGroup,
      skills,
      contactInfo,
    } = req.body as UpdateProfileInput;
    updateData = { fullName, dateOfBirth, gender, bloodGroup, skills, contactInfo };
  }

  // Find and update — runValidators ensures Mongoose schema validators still run
  const updatedEmployee = await User.findByIdAndUpdate(
    id,
    { $set: { ...updateData, updatedBy: req.user!._id } },
    { new: true, runValidators: true }
  )
    .select('-password -resetPasswordToken -resetPasswordExpires')
    .populate('department', 'departmentName departmentCode');

  if (!updatedEmployee) {
    throw new ApiError(404, `No employee found with ID: ${id}`);
  }

  // Log the update action
  await ActivityLog.create({
    user: req.user!._id,
    action: 'UPDATE_EMPLOYEE',
    description: `Updated profile for employeeId: ${updatedEmployee.employeeId}`,
    ipAddress: req.ip,
  });

  res.status(200).json(
    new ApiResponse(200, updatedEmployee, 'Employee updated successfully.')
  );
});

// ─── DELETE /api/employees/:id ────────────────────────────────────────────────
// Admin only — soft-delete (sets isActive: false instead of removing the record)

const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Prevent Admin from deactivating themselves
  if (req.user!._id.toString() === id) {
    throw new ApiError(400, 'You cannot deactivate your own account.');
  }

  const employee = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        isActive: false,
        updatedBy: req.user!._id,
      },
    },
    { new: true }
  ).select('employeeId fullName email isActive');

  if (!employee) {
    throw new ApiError(404, `No employee found with ID: ${id}`);
  }

  await ActivityLog.create({
    user: req.user!._id,
    action: 'DEACTIVATE_EMPLOYEE',
    description: `Deactivated employee: ${employee.fullName} (${employee.employeeId})`,
    ipAddress: req.ip,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      { employeeId: employee.employeeId, isActive: false },
      `Employee '${employee.fullName}' has been deactivated.`
    )
  );
});

// ─── PATCH /api/employees/:id/profile-picture ─────────────────────────────────
// Authenticated — Upload profile picture (handled by multer in routes)

const uploadProfilePicture = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    // Only self or Admin can update a profile picture
    const isSelf = req.user!._id.toString() === id;
    const isAdmin = req.user!.role === 'Admin';

    if (!isSelf && !isAdmin) {
      throw new ApiError(403, 'You can only update your own profile picture.');
    }

    // multer attaches the file to req.file
    if (!req.file) {
      throw new ApiError(400, 'Please upload a file.');
    }

    // Build the accessible URL for the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;

    const employee = await User.findByIdAndUpdate(
      id,
      { $set: { profilePicture: fileUrl, updatedBy: req.user!._id } },
      { new: true }
    ).select('employeeId fullName profilePicture');

    if (!employee) {
      throw new ApiError(404, `No employee found with ID: ${id}`);
    }

    res.status(200).json(
      new ApiResponse(
        200,
        { profilePicture: employee.profilePicture },
        'Profile picture updated successfully.'
      )
    );
  }
);

// ─── GET /api/employees/stats ─────────────────────────────────────────────────
// Admin/HR — Quick summary stats used by the admin dashboard

const getEmployeeStats = asyncHandler(async (_req: Request, res: Response) => {
  // Aggregation pipeline — groups and counts in a single DB query
  const [stats] = await User.aggregate([
    {
      $facet: {
        // Total counts by status
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
        // Breakdown by role
        byRole: [
          { $group: { _id: '$role', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        // Breakdown by employment type
        byEmploymentType: [
          { $group: { _id: '$employmentType', count: { $sum: 1 } } },
        ],
        // New hires in last 30 days
        recentHires: [
          {
            $match: {
              joiningDate: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
          { $count: 'count' },
        ],
      },
    },
  ]);

  res.status(200).json(
    new ApiResponse(200, stats, 'Employee statistics fetched successfully.')
  );
});

export {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  uploadProfilePicture,
  getEmployeeStats,
};
