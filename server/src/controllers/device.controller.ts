import { Request, Response, NextFunction } from "express";
import { tokenService } from "../services/token.service";
import { sendSuccess } from "../utils/response.utils";
import { AppError } from "../utils/error.utils";
import { logger } from "../utils/logger.utils";

function isValidToken(token: unknown): token is string {
  return typeof token === "string" && token.trim().length > 10 && token.length < 512;
}

export function registerDevice(req: Request, res: Response, next: NextFunction): void {
  const { token } = req.body as { token?: unknown };

  if (!isValidToken(token)) {
    return next(AppError.badRequest("Invalid or missing device push token", "INVALID_TOKEN"));
  }

  tokenService.add(token.trim());
  logger.info(`Device token registered. Total tokens: ${tokenService.count()}`);
  sendSuccess(res, { registered: true, count: tokenService.count() });
}

export function unregisterDevice(req: Request, res: Response, next: NextFunction): void {
  const { token } = req.body as { token?: unknown };

  if (!isValidToken(token)) {
    return next(AppError.badRequest("Invalid or missing device push token", "INVALID_TOKEN"));
  }

  const removed = tokenService.remove(token.trim());
  logger.info(`Device token unregistered. Total tokens: ${tokenService.count()}`);
  sendSuccess(res, { unregistered: true, removed, count: tokenService.count() });
}
