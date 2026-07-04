import { z } from 'zod';

// ─── Apply Leave Schema ───────────────────────────────────────────────────────

export const applyLeaveSchema = z
  .object({
    leaveType: z.enum(['Paid', 'Casual', 'Sick', 'Unpaid']),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    reason: z.string().min(10, 'Reason must be at least 10 characters').trim(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

// ─── Update Leave Status Schema (Admin) ──────────────────────────────────────

export const updateLeaveStatusSchema = z.object({
  status: z.enum(['Approved', 'Rejected']),
  comments: z.string().trim().optional(),
});

// ─── Leave Query Schema ───────────────────────────────────────────────────────

export const leaveQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(['Pending', 'Approved', 'Rejected']).optional(),
  leaveType: z.enum(['Paid', 'Casual', 'Sick', 'Unpaid']).optional(),
  userId: z.string().trim().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type ApplyLeaveInput = z.infer<typeof applyLeaveSchema>;
export type UpdateLeaveStatusInput = z.infer<typeof updateLeaveStatusSchema>;
export type LeaveQueryInput = z.infer<typeof leaveQuerySchema>;
