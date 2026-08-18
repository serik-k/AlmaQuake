import { Request } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  timestamp: string;
}

export interface AdminAuthRequest extends Request {
  isAdmin?: boolean;
}

export interface HealthCheckStatus {
  status: "ok" | "degraded" | "error";
  uptime: number;
  timestamp: string;
  fcmTokensCount: number;
  telegramSubscribersCount: number;
  storageConfigured: boolean;
}
