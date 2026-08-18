export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  public static badRequest(message: string, code?: string): AppError {
    return new AppError(message, 400, true, code ?? "BAD_REQUEST");
  }

  public static unauthorized(message: string = "Unauthorized"): AppError {
    return new AppError(message, 401, true, "UNAUTHORIZED");
  }

  public static forbidden(message: string = "Forbidden"): AppError {
    return new AppError(message, 403, true, "FORBIDDEN");
  }

  public static notFound(message: string = "Resource not found"): AppError {
    return new AppError(message, 404, true, "NOT_FOUND");
  }

  public static internal(message: string = "Internal server error"): AppError {
    return new AppError(message, 500, false, "INTERNAL_ERROR");
  }

  public static serviceUnavailable(message: string = "Service temporarily unavailable"): AppError {
    return new AppError(message, 503, true, "SERVICE_UNAVAILABLE");
  }
}
