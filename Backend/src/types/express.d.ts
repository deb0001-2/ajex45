import { Types } from 'mongoose';

/**
 * This file extends Express's built-in Request type so that
 * TypeScript knows that req.user exists after our JWT middleware runs.
 *
 * Think of it as "telling TypeScript the shape of the object
 * that our auth middleware glues onto every request."
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId;
        employeeId: string;
        email: string;
        role: 'Admin' | 'HR' | 'Manager' | 'Employee';
        fullName: string;
      };
    }
  }
}

export {};
