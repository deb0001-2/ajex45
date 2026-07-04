import { z } from 'zod';

// ─── Generate Payroll Schema (Admin) ─────────────────────────────────────────

export const generatePayrollSchema = z.object({
  userId: z.string().min(1, 'Employee ID is required'),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  basicSalary: z.number().min(0),
  hra: z.number().min(0).default(0),
  medicalAllowance: z.number().min(0).default(0),
  travelAllowance: z.number().min(0).default(0),
  bonus: z.number().min(0).default(0),
  allowances: z.number().min(0).default(0),
  deductions: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  pf: z.number().min(0).default(0),
  paymentMethod: z
    .enum(['Bank Transfer', 'Cheque', 'Cash'])
    .default('Bank Transfer'),
});

// ─── Update Payroll Schema (Admin) ────────────────────────────────────────────

export const updatePayrollSchema = z.object({
  basicSalary: z.number().min(0).optional(),
  hra: z.number().min(0).optional(),
  medicalAllowance: z.number().min(0).optional(),
  travelAllowance: z.number().min(0).optional(),
  bonus: z.number().min(0).optional(),
  allowances: z.number().min(0).optional(),
  deductions: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  pf: z.number().min(0).optional(),
  status: z.enum(['Pending', 'Processed']).optional(),
  paymentMethod: z.enum(['Bank Transfer', 'Cheque', 'Cash']).optional(),
  paymentDate: z.coerce.date().optional(),
});

// ─── Payroll Query Schema ─────────────────────────────────────────────────────

export const payrollQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).optional(),
  status: z.enum(['Pending', 'Processed']).optional(),
  userId: z.string().trim().optional(),
  department: z.string().trim().optional(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type GeneratePayrollInput = z.infer<typeof generatePayrollSchema>;
export type UpdatePayrollInput = z.infer<typeof updatePayrollSchema>;
export type PayrollQueryInput = z.infer<typeof payrollQuerySchema>;
