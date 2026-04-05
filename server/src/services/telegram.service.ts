// @ts-ignore
import fetch from "node-fetch";
import { chatService } from "./chat.service";
import type { Quake } from "./usgs.service";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const API = `https://api.telegram.org/bot${TOKEN}`;

let offset = 0;
let polling = false;

async function tgCall(method: string, body: object): Promise<any> {
  try {
    const res = await fetch(`${API}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (e) {
    console.error(`❌ Telegram API error (${method}):`, e);
  }
}

async function sendMessage(chatId: number, text: string): Promise<void> {
  await tgCall("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  });
}

async function pollUpdates(): Promise<void> {
  if (!TOKEN) return;

  try {
    const data = await tgCall("getUpdates", {
      offset,
      timeout: 30,
      allowed_updates: ["message"],
    });

    if (!data?.ok || !data.result?.length) return;

    for (const update of data.result) {
      offset = update.update_id + 1;

      const msg = update.message;
      if (!msg?.text || !msg.chat?.id) continue;

      const chatId: number = msg.chat.id;
      const text: string = msg.text.trim();
      const name: string = msg.chat.first_name ?? "друг";

      if (text === "/start") {
        chatService.add(chatId);
        await sendMessage(
          chatId,
          `🌍 <b>AlmaQuake</b>\n\nПривет, ${name}! Ты подписан на уведомления о землетрясениях в радиусе 100 км от Алматы (M≥2.5).\n\nОтправь /stop чтобы отписаться.`
        );
        console.log(`✅ Telegram подписчик добавлен: ${chatId} (${name})`);
      } else if (text === "/stop") {
        chatService.remove(chatId);
        await sendMessage(
          chatId,
          `👋 Ты отписан от уведомлений. Отправь /start чтобы подписаться снова.`
        );
        console.log(`🗑️ Telegram подписчик удалён: ${chatId}`);
      }
    }
  } catch (e) {
    console.error("⚠️ Ошибка polling Telegram:", e);
  } finally {
    if (polling) setTimeout(pollUpdates, 1000);
  }
}

export function startTelegramBot(): void {
  if (!TOKEN) {
    console.warn("⚠️ TELEGRAM_BOT_TOKEN не задан — Telegram бот отключён");
    return;
  }
  polling = true;
  pollUpdates();
  console.log("🤖 Telegram бот запущен");
}

export function stopTelegramBot(): void {
  polling = false;
}

export async function sendQuakeAlert(quake: Quake): Promise<void> {
  const chats = chatService.all();
  if (!chats.length || !TOKEN) return;

  const mag = quake.magnitude.toFixed(1);
  const emoji = quake.magnitude >= 5 ? "🚨" : quake.magnitude >= 4 ? "⚠️" : "📳";
  const depth = Math.round(quake.depthKm);
  const dist = Math.round(quake.distanceKm);

  const text =
    `${emoji} <b>Землетрясение M${mag}</b>\n\n` +
    `📍 ${quake.place}\n` +
    `📏 Расстояние от Алматы: ${dist} км\n` +
    `🔻 Глубина: ${depth} км\n` +
    `🕐 ${new Date(quake.time).toLocaleString("ru-KZ", { timeZone: "Asia/Almaty" })}`;

  const results = await Promise.allSettled(
    chats.map((id) => sendMessage(id, text))
  );

  const ok = results.filter((r) => r.status === "fulfilled").length;
  console.log(`📨 Telegram: отправлено ${ok}/${chats.length}`);
}
