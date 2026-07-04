/**
 * Consistent API response wrapper.
 *
 * Example:
 *   res.status(200).json(new ApiResponse(200, data, 'Login successful'));
 *   → { statusCode: 200, data: {...}, message: 'Login successful', success: true }
 */
class ApiResponse<T = unknown> {
  public statusCode: number;
  public data: T;
  public message: string;
  public success: boolean;

  constructor(statusCode: number, data: T, message: string = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    // Any 2xx status code means success
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
