import { Router }          from "express";
import { tokenService }    from "../services/token.service";
import { chatService }     from "../services/chat.service";
import { fetchQuakes }     from "../services/usgs.service";
import { sendPush }        from "../services/fcm.service";
import { sendQuakeAlert }  from "../services/telegram.service";

export const router = Router();

function isValidToken(token: unknown): token is string {
  return typeof token === "string" && token.length > 10 && token.length < 512;
}

function requireAdminKey(req: any, res: any): boolean {
  const adminKey = process.env.ADMIN_SECRET;
  if (!adminKey) {
    res.status(503).json({ error: "admin endpoint disabled" });
    return false;
  }
  const provided = req.headers["x-admin-secret"] ?? req.body?.adminSecret;
  if (provided !== adminKey) {
    res.status(403).json({ error: "forbidden" });
    return false;
  }
  return true;
}

router.post("/register", (req, res) => {
  const { token } = req.body as { token?: unknown };
  if (!isValidToken(token)) {
    res.status(400).json({ error: "invalid token" });
    return;
  }
  tokenService.add(token);
  console.log(`✅ Зарегистрирован токен. Всего: ${tokenService.count()}`);
  res.json({ ok: true });
});

router.delete("/register", (req, res) => {
  const { token } = req.body as { token?: unknown };
  if (!isValidToken(token)) {
    res.status(400).json({ error: "invalid token" });
    return;
  }
  const removed = tokenService.remove(token);
  console.log(`🗑️ Удалён токен. Всего: ${tokenService.count()}`);
  res.json({ ok: true, removed });
});

router.post("/test-push", async (req, res) => {
  if (!requireAdminKey(req, res)) return;
  const fakeQuake = {
    id: "test-" + Date.now(),
    magnitude: 6.5,
    place: "ТЕСТОВОЕ УВЕДОМЛЕНИЕ · Алматы",
    time: Date.now(),
    depthKm: 10,
    lat: 43.2565,
    lng: 76.9286,
    distanceKm: 0,
  };

  await Promise.all([sendPush(fakeQuake), sendQuakeAlert(fakeQuake)]);
  res.json({ ok: true, fcmTokens: tokenService.count() });
});

router.post("/test-telegram", async (req, res) => {
  if (!requireAdminKey(req, res)) return;
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
  res.json({ ok: true });
});

router.get("/stats", (req, res) => {
  if (!requireAdminKey(req, res)) return;
  res.json({
    telegramSubscribers: chatService.all(),
    fcmTokens: tokenService.count(),
  });
});

router.get("/quakes", async (_req, res) => {
  try {
    const quakes = await fetchQuakes();
    res.json(quakes);
  } catch {
    res.status(500).json({ error: "failed to fetch quakes" });
  }
});
