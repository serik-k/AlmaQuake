import { Request, Response } from "express";
import { tokenService } from "../services/token.service";
import { chatService } from "../services/chat.service";
import { sendSuccess } from "../utils/response.utils";
import { HealthCheckStatus } from "../types/api.types";

const startTime = Date.now();

export function getHealth(_req: Request, res: Response): void {
  const data: HealthCheckStatus = {
    status: "ok",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    fcmTokensCount: tokenService.count(),
    telegramSubscribersCount: chatService.all().length,
    storageConfigured: Boolean(process.env.DATA_DIR),
  };

  sendSuccess(res, data);
}
