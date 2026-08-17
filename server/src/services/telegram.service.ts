import { chatService } from "./chat.service";
import type { Quake } from "./usgs.service";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const API = `https://api.telegram.org/bot${TOKEN}`;

let offset = 0;
let polling = false;

const BROADCAST_BATCH_SIZE = 25;
const BROADCAST_BATCH_DELAY_MS = 1_000;
const MAX_RATE_LIMIT_RETRIES = 3;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Тексты инструкций ───────────────────────────────────────────────────────

const SAFETY = {
  before: `🏠 <b>До землетрясения</b>

• Закрепи тяжёлую мебель и шкафы к стенам
• Держи аптечку, воду (3 л/чел/день) и еду на 3 суток
• Запомни безопасные места в каждой комнате: углы несущих стен, проёмы
• Узнай, где отключается газ, вода и электричество
• Договорись с семьёй о точке сбора вне дома
• Держи документы и деньги в одном месте`,

  during: `🚨 <b>Во время землетрясения</b>

<b>Если ты внутри:</b>
• Не беги к лифту и лестницам — падающие предметы опасны
• Встань в угол несущей стены или под дверной проём
• Укройся под столом, прикрой голову руками
• Держись подальше от окон и тяжёлой мебели

<b>Если ты на улице:</b>
• Отойди от зданий, деревьев, столбов и проводов
• Ляг на землю лицом вниз, прикрой голову руками

<b>Если ты в машине:</b>
• Остановись вдали от мостов и зданий
• Оставайся в машине до окончания толчков`,

  after: `✅ <b>После землетрясения</b>

• Проверь себя и близких на травмы — не двигай тяжелораненых
• Выйди из здания, если есть трещины или запах газа
• Не пользуйся лифтами — они могут отключиться
• Не зажигай огонь — возможна утечка газа
• Слушай официальные сообщения по радио или телефону
• Будь готов к повторным толчкам (афтершокам)
• Не возвращайся в повреждённое здание без разрешения`,

  bag: `🎒 <b>Тревожный чемодан</b>

<b>Документы:</b>
• Паспорта, свидетельства о рождении (копии)
• Медицинские полисы, страховки

<b>Вода и еда:</b>
• Вода — 3 литра на человека на 3 дня
• Консервы, орехи, сухофрукты, энергобатончики

<b>Аптечка:</b>
• Бинты, антисептик, обезболивающее
• Личные лекарства на 5–7 дней

<b>Прочее:</b>
• Фонарик + запасные батарейки
• Портативная зарядка для телефона
• Наличные деньги
• Тёплая одежда и дождевик
• Свисток для подачи сигнала`,
};

const HELP_TEXT = `🌍 <b>AlmaQuake — команды бота</b>

/start — подписаться на уведомления
/stop — отписаться от уведомлений
/safety — инструкции по безопасности
/before — что делать до землетрясения
/during — что делать во время
/after — что делать после
/bag — тревожный чемодан`;

// ─── Telegram API helpers ─────────────────────────────────────────────────────

async function tgCall(
  method: string,
  body: object,
  retriesRemaining = MAX_RATE_LIMIT_RETRIES
): Promise<any> {
  const res = await fetch(`${API}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  const data = await res.json() as {
    ok?: boolean;
    error_code?: number;
    description?: string;
    result?: unknown;
    parameters?: { retry_after?: number };
  };
  if (
    data.error_code === 429 &&
    data.parameters?.retry_after &&
    retriesRemaining > 0
  ) {
    await delay((data.parameters.retry_after + 1) * 1_000);
    return tgCall(method, body, retriesRemaining - 1);
  }
  if (!res.ok || !data.ok) {
    throw new Error(`Telegram ${method}: ${data.description ?? `HTTP ${res.status}`}`);
  }
  return data;
}

async function sendMessage(chatId: number, text: string): Promise<void> {
  await tgCall("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  });
}

// ─── Polling ──────────────────────────────────────────────────────────────────

async function handleCommand(chatId: number, text: string, name: string): Promise<void> {
  const cmd = text.split("@")[0]; // убираем @botname если есть

  switch (cmd) {
    case "/start":
      chatService.add(chatId);
      await sendMessage(
        chatId,
        `🌍 <b>AlmaQuake</b>\n\nПривет, ${name}! Ты подписан на уведомления о землетрясениях в радиусе 300 км от Алматы (M≥2.5).\n\n${HELP_TEXT}`
      );
      console.log(`✅ Telegram подписчик добавлен: ${chatId} (${name})`);
      break;

    case "/stop":
      chatService.remove(chatId);
      await sendMessage(chatId, `👋 Ты отписан от уведомлений. Отправь /start чтобы подписаться снова.`);
      console.log(`🗑️ Telegram подписчик удалён: ${chatId}`);
      break;

    case "/safety":
      await sendMessage(chatId, HELP_TEXT);
      break;

    case "/before":
      await sendMessage(chatId, SAFETY.before);
      break;

    case "/during":
      await sendMessage(chatId, SAFETY.during);
      break;

    case "/after":
      await sendMessage(chatId, SAFETY.after);
      break;

    case "/bag":
      await sendMessage(chatId, SAFETY.bag);
      break;

    default:
      await sendMessage(chatId, `Неизвестная команда. Отправь /safety чтобы увидеть список команд.`);
  }
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

      if (text.startsWith("/")) {
        await handleCommand(chatId, text, name);
      }
    }
  } catch (e) {
    console.error("⚠️ Ошибка polling Telegram:", e);
  } finally {
    if (polling) setTimeout(pollUpdates, 1000);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

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
    `🕐 ${new Date(quake.time).toLocaleString("ru-KZ", { timeZone: "Asia/Almaty" })}\n\n` +
    `📋 Отправь /during для инструкций`;

  let ok = 0;
  for (let index = 0; index < chats.length; index += BROADCAST_BATCH_SIZE) {
    const batch = chats.slice(index, index + BROADCAST_BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((id) => sendMessage(id, text))
    );
    ok += results.filter((result) => result.status === "fulfilled").length;

    if (index + BROADCAST_BATCH_SIZE < chats.length) {
      await delay(BROADCAST_BATCH_DELAY_MS);
    }
  }

  console.log(`📨 Telegram: отправлено ${ok}/${chats.length}`);
}
