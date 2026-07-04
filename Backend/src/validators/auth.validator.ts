import { z } from 'zod';

// ─── Register Schema ──────────────────────────────────────────────────────────
// Defines exactly what fields are required when creating a new employee.

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').trim(),
  email: z.string().email('Please provide a valid email address').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and a number'
    ),
  role: z
    .enum(['Admin', 'HR', 'Manager', 'Employee'])
    .optional()
    .default('Employee'),
  designation: z.string().trim().optional(),
  employmentType: z
    .enum(['Full-Time', 'Part-Time', 'Intern'])
    .optional()
    .default('Full-Time'),
  joiningDate: z.coerce.date().optional(),
});

// ─── Login Schema ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

// ─── Forgot Password Schema ───────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email address').toLowerCase(),
});

// ─── Reset Password Schema ────────────────────────────────────────────────────

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and a number'
    ),
});

// ─── Inferred Types (use in controllers) ─────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
