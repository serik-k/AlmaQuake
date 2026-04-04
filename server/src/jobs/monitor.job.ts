import { fetchQuakes } from "../services/usgs.service";
import { sendPush }    from "../services/fcm.service";
import { config }      from "../config";

let lastSeenId: string | null = null;

export async function runMonitor(): Promise<void> {
  try {
    console.log("🔍 Проверка USGS...");
    const quakes = await fetchQuakes();
    if (quakes.length === 0) return;

    const latest = quakes[0];

    if (lastSeenId === null) {
      lastSeenId = latest.id;
      console.log(`📌 Инициализация: ${latest.id}`);
      return;
    }

    if (latest.id !== lastSeenId) {
      console.log(`🌍 Новое: M${latest.mag} — ${latest.place}`);
      lastSeenId = latest.id;
      await sendPush(latest);
    }
  } catch (error) {
    console.error("❌ Ошибка в задаче мониторинга:", error);
  }
}

export function startMonitorJob(): void {
  // Запуск первой проверки сразу
  runMonitor();
  setInterval(runMonitor, config.poll.intervalMs);
}
