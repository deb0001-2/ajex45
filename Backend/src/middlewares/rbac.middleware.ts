import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import { UserRole } from '../models/User.model';

/**
 * authorizeRoles — Role-Based Access Control (RBAC) middleware factory.
 *
 * Simple analogy:
 *   After the security guard (authenticateJWT) lets you in,
 *   this is the key-card system for specific rooms.
 *   e.g. "Admin Hall" only lets in Admins and HRs.
 *
 * Usage in a route:
 *   router.get('/all', authenticateJWT, authorizeRoles('Admin', 'HR'), controller);
 *
 * How it works:
 *   1. Takes a list of allowed roles as arguments.
 *   2. Returns a middleware function.
 *   3. That function checks if req.user.role is in the allowed list.
 *   4. If YES → call next(). If NO → throw 403 Forbidden.
 */
const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // authenticateJWT must run first — req.user must be set
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Required role: [${allowedRoles.join(' or ')}]. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
};

export default authorizeRoles;
