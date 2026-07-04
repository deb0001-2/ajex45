import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async controller function so you never need
 * to write try/catch in every controller.
 *
 * Example:
 *   router.get('/me', asyncHandler(getMe));
 *   — any thrown error is passed to Express's next(err)
 */
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
