import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import ApiError from '../utils/ApiError';

/**
 * errorHandler — Global Express error handling middleware.
 *
 * Simple analogy:
 *   This is the "catch-all safety net" at the bottom of all
 *   your route handlers. No matter what goes wrong anywhere
 *   in the app, the error flows here and always sends back a
 *   clean, consistent JSON response instead of crashing.
 *
 * It handles 4 special cases:
 *   1. Our own ApiError        → use its statusCode & message directly
 *   2. Mongoose ValidationError → convert to 400 with field errors
 *   3. Mongoose duplicate key   → convert to 409 Conflict
 *   4. Mongoose CastError       → invalid ObjectId → 404
 *   5. Everything else          → 500 Internal Server Error
 *
 * IMPORTANT: This must be registered LAST in app.ts with app.use(errorHandler).
 */
const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // ── Case 1: Our own ApiError ───────────────────────────────────────────────
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // ── Case 2: Mongoose Validation Error (e.g. missing required field) ────────
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => e.message);
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Mongoose validation failed.',
      errors,
    });
    return;
  }

  // ── Case 3: MongoDB Duplicate Key (e.g. duplicate email) ──────────────────
  if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: number }).code === 11000
  ) {
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue;
    const field = keyValue ? Object.keys(keyValue)[0] : 'field';
    res.status(409).json({
      success: false,
      statusCode: 409,
      message: `Duplicate value: '${field}' already exists.`,
      errors: [],
    });
    return;
  }

  // ── Case 4: Mongoose CastError (invalid ObjectId in route param) ───────────
  if (err instanceof mongoose.Error.CastError) {
    res.status(404).json({
      success: false,
      statusCode: 404,
      message: `Invalid value for field '${err.path}': ${err.value}`,
      errors: [],
    });
    return;
  }

  // ── Case 5: Unknown / unhandled error ──────────────────────────────────────
  const errorMessage =
    err instanceof Error ? err.message : 'Internal Server Error';

  console.error('🔴 Unhandled Error:', err);

  res.status(500).json({
    success: false,
    statusCode: 500,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : errorMessage,
    errors: [],
    ...(process.env.NODE_ENV === 'development' &&
      err instanceof Error && { stack: err.stack }),
  });
};

/**
 * notFound — 404 middleware for unmatched routes.
 *
 * Register this BEFORE errorHandler in app.ts:
 *   app.use(notFound);
 *   app.use(errorHandler);
 */
const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export { errorHandler, notFound };
