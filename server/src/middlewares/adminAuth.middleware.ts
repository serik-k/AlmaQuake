import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.utils";

export function adminAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const adminKey = process.env.ADMIN_SECRET;
  if (!adminKey) {
    return next(AppError.serviceUnavailable("Admin endpoint disabled (ADMIN_SECRET not configured)"));
  }

  const providedKey = req.headers["x-admin-secret"] ?? req.body?.adminSecret;
  if (providedKey !== adminKey) {
    return next(AppError.forbidden("Forbidden: invalid admin credentials"));
  }

  next();
}
