import { fetchQuakes } from "../services/usgs.service";
import { sendPush }    from "../services/fcm.service";
import { config }      from "../config";

let lastSeenId: string | null = null;

export async function runMonitor(): Promise<void> {
  try {
    const quakes = await fetchQuakes();
    if (quakes.length === 0) {
      console.log("ℹ️ Сейсмическая активность в радиусе 100 км не зафиксирована");
      return;
    }

    const latest = quakes[0];

    if (lastSeenId === null) {
      lastSeenId = latest.id;
      console.log(`📌 Монитор запущен. Последнее событие: ${latest.id} (M${latest.magnitude})`);
      return;
    }

    if (latest.id !== lastSeenId) {
      console.log(`🌍 ОБНАРУЖЕНО НОВОЕ СОБЫТИЕ: M${latest.magnitude} — ${latest.place}`);
      lastSeenId = latest.id;
      await sendPush(latest);
    }
  } catch (error: any) {
    console.error("⚠️ Сбой мониторинга (повтор через 60с):", error.message || error);
  }
}

export function startMonitorJob(): void {
  // Запуск первой проверки сразу
  runMonitor();
  setInterval(runMonitor, config.poll.intervalMs);
}
