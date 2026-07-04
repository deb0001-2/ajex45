import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError';
import User from '../models/User.model';

// ─── Shape of the JWT payload we sign ────────────────────────────────────────

interface JwtPayload {
  _id: string;
  email: string;
  role: 'Admin' | 'HR' | 'Manager' | 'Employee';
}

// ─── Middleware ───────────────────────────────────────────────────────────────

/**
 * authenticateJWT
 *
 * Simple analogy:
 *   Think of this as the security guard at the office door.
 *   Every request must show its "badge" (the JWT token in the
 *   Authorization header). If the badge is valid, the guard
 *   stamps the request with the user's info (req.user) and
 *   lets them in. If not, access is denied immediately.
 *
 * Expected header:
 *   Authorization: Bearer <token>
 */
const authenticateJWT = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify the token signature & expiry
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ApiError(500, 'JWT secret is not configured.');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    // 3. Check if user still exists and is active in DB
    //    (handles cases where the user was deactivated after token was issued)
    const user = await User.findById(decoded._id).select(
      '_id employeeId email role fullName isActive'
    );

    if (!user) {
      throw new ApiError(401, 'User not found. Token is invalid.');
    }

    if (!user.isActive) {
      throw new ApiError(
        403,
        'Your account has been deactivated. Contact HR.'
      );
    }

    // 4. Attach user info to the request object for downstream use
    req.user = {
      _id: user._id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    next();
  } catch (error) {
    // Handle specific JWT errors with friendly messages
    if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError(401, 'Token has expired. Please log in again.'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, 'Invalid token. Please log in again.'));
    } else {
      next(error);
    }
  }
};

export default authenticateJWT;
