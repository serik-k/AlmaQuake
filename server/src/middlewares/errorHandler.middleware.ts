import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.utils";
import { sendError } from "../utils/response.utils";
import { logger } from "../utils/logger.utils";

export function errorHandlerMiddleware(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error(`Critical error: ${err.message}`, err);
    }
    sendError(res, err.message, err.statusCode, err.code);
    return;
  }

  logger.error(`Unhandled error: ${err.message}`, err);
  sendError(res, "Internal server error", 500, "INTERNAL_ERROR");
}
