import { z } from 'zod';

// ─── Update Profile Schema (Employee can update limited fields) ───────────────

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).trim().optional(),
  designation: z.string().trim().optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z
    .enum(['Male', 'Female', 'Other', 'Prefer not to say'])
    .optional(),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  skills: z.array(z.string().trim()).optional(),
  contactInfo: z
    .object({
      phone: z.string().trim().optional(),
      alternatePhone: z.string().trim().optional(),
      address: z.string().trim().optional(),
      emergencyContact: z
        .object({
          name: z.string().trim(),
          phone: z.string().trim(),
          relation: z.string().trim(),
        })
        .optional(),
    })
    .optional(),
});

// ─── Admin Update Schema (Admin can update everything above + privileged fields) ──

export const adminUpdateEmployeeSchema = updateProfileSchema.extend({
  role: z.enum(['Admin', 'HR', 'Manager', 'Employee']).optional(),
  department: z.string().min(1, 'Invalid department ID').optional(),
  manager: z.string().min(1, 'Invalid manager ID').optional(),
  designation: z.string().trim().optional(),
  joiningDate: z.coerce.date().optional(),
  employmentType: z
    .enum(['Full-Time', 'Part-Time', 'Intern'])
    .optional(),
  experience: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  leaveBalance: z
    .object({
      paid: z.number().min(0).optional(),
      sick: z.number().min(0).optional(),
      casual: z.number().min(0).optional(),
      unpaid: z.number().min(0).optional(),
    })
    .optional(),
});

// ─── Query Params Schema (for GET /api/employees list) ───────────────────────

export const employeeQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  department: z.string().trim().optional(),
  role: z.enum(['Admin', 'HR', 'Manager', 'Employee']).optional(),
  employmentType: z.enum(['Full-Time', 'Part-Time', 'Intern']).optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  sortBy: z
    .enum(['fullName', 'joiningDate', 'createdAt', 'department'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AdminUpdateEmployeeInput = z.infer<typeof adminUpdateEmployeeSchema>;
export type EmployeeQueryInput = z.infer<typeof employeeQuerySchema>;
