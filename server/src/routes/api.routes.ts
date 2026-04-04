import { Router }       from "express";
import { tokenService } from "../services/token.service";
import { fetchQuakes }  from "../services/usgs.service";

export const router = Router();

router.post("/register", (req, res) => {
  const { token } = req.body as { token?: string };
  if (!token) {
    res.status(400).json({ error: "token required" });
    return;
  }
  tokenService.add(token);
  console.log(`✅ Зарегистрирован токен. Всего: ${tokenService.count()}`);
  res.json({ ok: true });
});

router.post("/test-push", async (_req, res) => {
  const { sendPush } = require("../services/fcm.service");
  const { tokenService } = require("../services/token.service");
  
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
  res.json({ ok: true, sentTo: tokenService.count() });
});

router.get("/quakes", async (_req, res) => {
  try {
    const quakes = await fetchQuakes();
    res.json(quakes);
  } catch (error) {
    res.status(500).json({ error: "failed to fetch quakes" });
  }
});
