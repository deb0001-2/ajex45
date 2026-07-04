import { z } from 'zod';

// ─── Check-In Schema ──────────────────────────────────────────────────────────

export const checkInSchema = z.object({
  location: z.string().trim().optional(),
  device: z.string().trim().optional(),
  remarks: z.string().trim().optional(),
});

// ─── Check-Out Schema ─────────────────────────────────────────────────────────

export const checkOutSchema = z.object({
  remarks: z.string().trim().optional(),
  breakDuration: z.number().min(0).optional(), // minutes
});

// ─── Admin Edit Attendance Schema ─────────────────────────────────────────────

export const editAttendanceSchema = z.object({
  checkInTime: z.coerce.date().optional(),
  checkOutTime: z.coerce.date().optional(),
  status: z
    .enum(['Present', 'Absent', 'Late', 'Half Day', 'Leave'])
    .optional(),
  workingHours: z.number().min(0).optional(),
  breakDuration: z.number().min(0).optional(),
  overtimeHours: z.number().min(0).optional(),
  remarks: z.string().trim().optional(),
});

// ─── Attendance Query Schema ──────────────────────────────────────────────────

export const attendanceQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  userId: z.string().trim().optional(),        // Admin can filter by employee
  status: z
    .enum(['Present', 'Absent', 'Late', 'Half Day', 'Leave'])
    .optional(),
  department: z.string().trim().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type CheckInInput = z.infer<typeof checkInSchema>;
export type CheckOutInput = z.infer<typeof checkOutSchema>;
export type EditAttendanceInput = z.infer<typeof editAttendanceSchema>;
export type AttendanceQueryInput = z.infer<typeof attendanceQuerySchema>;
