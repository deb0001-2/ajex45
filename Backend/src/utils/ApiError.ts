/**
 * Custom API Error class that extends native Error.
 *
 * Simple example:
 *   throw new ApiError(404, 'Employee not found');
 *   → { statusCode: 404, message: 'Employee not found', success: false }
 */
class ApiError extends Error {
  public statusCode: number;
  public success: boolean;
  public errors: unknown[];
  public data: null;

  constructor(
    statusCode: number,
    message: string = 'Something went wrong',
    errors: unknown[] = [],
    stack?: string
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.data = null;
    this.message = message;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
