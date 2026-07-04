import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.model';
import ActivityLog from '../models/ActivityLog.model';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../validators/auth.validator';


// ─── Helper: generate a signed JWT ───────────────────────────────────────────

const generateToken = (payload: {
  _id: string;
  email: string;
  role: string;
}): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new ApiError(500, 'JWT secret is not configured.');

  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'],
  });
};

// ─── Helper: auto-generate unique employeeId ──────────────────────────────────
// Format: HMS-2025-0001, HMS-2025-0002, ...

const generateEmployeeId = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `HMS-${year}-`;

  // Count existing employees this year for the sequence number
  const count = await User.countDocuments({
    employeeId: { $regex: `^${prefix}` },
  });

  const sequence = String(count + 1).padStart(4, '0');
  return `${prefix}${sequence}`;
};

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Public (or Admin only — secured at the route level)
 * Creates a new employee/user account.
 */
const register = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, password, role, designation, employmentType, joiningDate } =
    req.body as RegisterInput;

  // 1. Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  // 2. Auto-generate a unique employee ID
  const employeeId = await generateEmployeeId();

  // 3. Create user (password is hashed by the pre-save hook in User.model.ts)
  const user = await User.create({
    employeeId,
    fullName,
    email,
    password,
    role: role ?? 'Employee',
    designation,
    employmentType: employmentType ?? 'Full-Time',
    joiningDate,
    // Default leave balance is seeded by the schema defaults
  });

  // 4. Log the activity
  await ActivityLog.create({
    user: user._id,
    action: 'REGISTER',
    description: `New account created with role: ${user.role}`,
    ipAddress: req.ip,
  });

  // 5. Generate token for immediate login after registration
  const token = generateToken({
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  // 6. Return response (never return password)
  res.status(201).json(
    new ApiResponse(
      201,
      {
        token,
        user: {
          _id: user._id,
          employeeId: user.employeeId,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
      'Employee registered successfully.'
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Public
 * Authenticates user and returns a JWT.
 */
const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;

  // 1. Find user — explicitly select password (it's excluded by default with select:false)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // 2. Check if account is active
  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated. Contact HR.');
  }

  // 3. Compare password using bcrypt
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // 4. Update last login timestamp
  user.lastLogin = new Date();
  await user.save();

  // 5. Log the activity
  await ActivityLog.create({
    user: user._id,
    action: 'LOGIN',
    description: 'User logged in successfully.',
    ipAddress: req.ip,
    device: req.headers['user-agent'],
  });

  // 6. Generate token
  const token = generateToken({
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        user: {
          _id: user._id,
          employeeId: user.employeeId,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      },
      'Login successful.'
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/forgot-password
 * Public
 * Generates a reset token and returns it in the response.
 * (In production: send this token via email instead)
 */
const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as ForgotPasswordInput;

  const user = await User.findOne({ email });

  // Security: always respond with the same message (don't reveal if email exists)
  if (!user) {
    res.status(200).json(
      new ApiResponse(
        200,
        null,
        'If that email exists, a reset token has been sent.'
      )
    );
    return;
  }

  // Generate a cryptographically random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresMinutes = Number(process.env.RESET_TOKEN_EXPIRES_MINUTES ?? 30);

  // Store hashed version of token in DB (never store raw tokens)
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + expiresMinutes * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  // TODO: In production — send resetToken via email using Nodemailer
  // For now, returning it in the response for development/testing
  res.status(200).json(
    new ApiResponse(
      200,
      {
        resetToken, // ← Remove this in production; email it instead
        expiresIn: `${expiresMinutes} minutes`,
      },
      'Password reset token generated. (In production, this would be sent via email)'
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/reset-password
 * Public
 * Validates the reset token and sets a new password.
 */
const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body as ResetPasswordInput;

  // Hash the incoming token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }, // token must not be expired
  });

  if (!user) {
    throw new ApiError(400, 'Reset token is invalid or has expired.');
  }

  // Set new password and clear the reset token fields
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save(); // pre-save hook auto-hashes the new password

  res.status(200).json(
    new ApiResponse(200, null, 'Password reset successfully. Please log in.')
  );
});

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/auth/me
 * Authenticated (any role)
 * Returns the currently logged-in user's profile.
 */
const getMe = asyncHandler(async (req: Request, res: Response) => {
  // req.user is set by authenticateJWT middleware
  const user = await User.findById(req.user!._id)
    .populate('department', 'departmentName departmentCode')
    .populate('manager', 'fullName email designation');

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  res.status(200).json(
    new ApiResponse(200, user, 'Profile fetched successfully.')
  );
});

// ─────────────────────────────────────────────────────────────────────────────

export { register, login, forgotPassword, resetPassword, getMe };
