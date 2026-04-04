import { Router }       from "express";
import { tokenService } from "../services/token.service";
import { fetchQuakes }  from "../services/usgs.service";
import { sendPush }     from "../services/fcm.service";

export const router = Router();

function isValidToken(token: unknown): token is string {
  return typeof token === "string" && token.length > 10 && token.length < 512;
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

router.post("/test-push", async (_req, res) => {
  if (tokenService.count() === 0) {
    res.status(400).json({ error: "no tokens registered" });
    return;
  }

  const fakeQuake = {
    id: "test-" + Date.now(),
    magnitude: 6.5,
    place: "ТЕСТОВОЕ УВЕДОМЛЕНИЕ",
    time: Date.now(),
    depthKm: 10,
    lat: 43.2565,
    lng: 76.9286,
    distanceKm: 0,
  };

  await sendPush(fakeQuake);
  res.json({ ok: true });
});

router.get("/quakes", async (_req, res) => {
  try {
    const quakes = await fetchQuakes();
    res.json(quakes);
  } catch {
    res.status(500).json({ error: "failed to fetch quakes" });
  }
});
