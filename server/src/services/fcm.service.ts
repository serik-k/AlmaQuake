import admin from "firebase-admin";
import { tokenService } from "./token.service";
import type { Quake } from "./usgs.service";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve(__dirname, "../../firebase-service-account.json");

if (process.env.FIREBASE_CONFIG) {
  try {
    const config = JSON.parse(process.env.FIREBASE_CONFIG);
    admin.initializeApp({
      credential: admin.credential.cert(config),
    });
    console.log("✅ Firebase инициализирован через переменную окружения");
  } catch (e) {
    console.error("❌ Ошибка парсинга FIREBASE_CONFIG:", e);
  }
} else if (fs.existsSync(serviceAccountPath)) {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
  });
  console.log("✅ Firebase инициализирован через локальный файл");
} else {
  console.warn("⚠️ Конфиг Firebase не найден. Push-уведомления будут отключены.");
}

function buildNotification(q: Quake) {
  const mag   = q.magnitude.toFixed(1);
  const emoji = q.magnitude >= 5 ? "🚨" : q.magnitude >= 4 ? "⚠️" : "📳";
  return {
    title: `${emoji} Землетрясение M${mag} вблизи Алматы`,
    body:  `${q.place} · Глубина: ${Math.round(q.depthKm)} км`,
  };
}

export async function sendPush(quake: Quake): Promise<void> {
  const tokens = tokenService.all();
  if (tokens.length === 0) return;

  // Если firebase не инициализирован, выходим
  if (admin.apps.length === 0) return;

  const { title, body } = buildNotification(quake);

  try {
    const result = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title, body },
      data: {
        quakeId:   quake.id,
        magnitude: String(quake.magnitude),
        place:     quake.place,
        depth:     String(quake.depthKm),
      },
      android: {
        priority: "high",
        notification: {
          channelId:              "earthquake_alerts",
          sound:                  "alarm",
          priority:               "max",
          vibrateTimingsMillis:   [0, 300, 200, 300],
        },
      },
      apns: {
        payload: { aps: { sound: "alarm.wav", badge: 1, contentAvailable: true } },
      },
    });

    // Remove invalid/expired tokens
    result.responses.forEach((r, i) => {
      if (!r.success && r.error?.code === "messaging/registration-token-not-registered") {
        tokenService.remove(tokens[i]);
      }
    });

    console.log(`📲 Push: ${result.successCount} ok · ${result.failureCount} err`);
  } catch (error) {
    console.error("❌ Ошибка отправки Push:", error);
  }
}
