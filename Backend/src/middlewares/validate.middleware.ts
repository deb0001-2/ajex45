import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import ApiError from '../utils/ApiError';

/**
 * validateSchema — Zod request body validation middleware factory.
 *
 * Simple analogy:
 *   Think of this as a form checker at a counter.
 *   Before your application reaches the officer (controller),
 *   the checker verifies that all required fields are filled
 *   and correctly formatted. If anything is wrong, it sends
 *   back a detailed list of what's missing or incorrect.
 *
 * Usage:
 *   router.post('/register', validateSchema(registerSchema), authController.register);
 *
 * How it works:
 *   1. Takes a Zod schema as argument.
 *   2. Returns a middleware function.
 *   3. Calls schema.safeParse(req.body).
 *   4. On success → replaces req.body with the parsed (cleaned) data & calls next().
 *   5. On failure → formats Zod errors into human-readable messages & throws 400.
 */
const validateSchema = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Zod v4: use .issues (array of ZodIssue objects)
      const errorMessages = result.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      );

      return next(new ApiError(400, 'Validation failed.', errorMessages));
    }

    // Replace req.body with the sanitized & type-coerced data from Zod
    req.body = result.data;
    next();
  };
};

export { validateSchema };
