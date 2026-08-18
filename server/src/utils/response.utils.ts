import { Response } from "express";
import { ApiResponse } from "../types/api.types";

export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200): Response {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  code?: string
): Response {
  const payload: ApiResponse = {
    success: false,
    error: {
      message,
      code,
    },
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
}
