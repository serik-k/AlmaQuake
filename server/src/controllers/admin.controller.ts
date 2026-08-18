import { Request, Response, NextFunction } from "express";
import { chatService } from "../services/chat.service";
import { tokenService } from "../services/token.service";
import { sendQuakeAlert } from "../services/telegram.service";
import { sendSuccess } from "../utils/response.utils";
import { AppError } from "../utils/error.utils";

export function getStats(_req: Request, res: Response): void {
  sendSuccess(res, {
    telegramSubscribers: chatService.all(),
    telegramSubscribersCount: chatService.all().length,
    fcmTokensCount: tokenService.count(),
  });
}

export async function testTelegramAlert(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const fakeQuake = {
      id: "test-" + Date.now(),
      magnitude: 5.8,
      place: "ТЕСТОВОЕ УВЕДОМЛЕНИЕ · Алматы",
      time: Date.now(),
      depthKm: 12,
      lat: 43.2565,
      lng: 76.9286,
      distanceKm: 5,
    };

    await sendQuakeAlert(fakeQuake);
    sendSuccess(res, { alertSent: true, quake: fakeQuake });
  } catch (err: any) {
    next(AppError.internal(`Failed to send test Telegram alert: ${err.message}`));
  }
}
