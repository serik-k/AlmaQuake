import { fetchQuakes }      from "../services/usgs.service";
import { sendPush }         from "../services/fcm.service";
import { sendQuakeAlert }   from "../services/telegram.service";
import { config }           from "../config";
import { dataFile, readJson, writeJson } from "../services/storage.service";

const STATE_FILE = dataFile("monitor-state.json");
let seenIds = new Set(readJson<string[]>(STATE_FILE, []));
let running = false;

export async function runMonitor(): Promise<void> {
  if (running) return;
  running = true;
  try {
    const quakes = await fetchQuakes();
    if (quakes.length === 0) {
      console.log(`ℹ️ Сейсмическая активность в радиусе ${config.quake.radiusKm} км не зафиксирована`);
      return;
    }

    if (seenIds.size === 0) {
      seenIds = new Set(quakes.map((quake) => quake.id));
      writeJson(STATE_FILE, [...seenIds]);
      console.log(`📌 Монитор запущен. Последнее событие: ${quakes[0].id} (M${quakes[0].magnitude})`);
      return;
    }

    const newQuakes = quakes.filter((quake) => !seenIds.has(quake.id)).reverse();
    for (const quake of newQuakes) {
      console.log(`🌍 ОБНАРУЖЕНО НОВОЕ СОБЫТИЕ: M${quake.magnitude} — ${quake.place}`);
      await Promise.all([sendPush(quake), sendQuakeAlert(quake)]);
    }
    seenIds = new Set(quakes.map((quake) => quake.id));
    writeJson(STATE_FILE, [...seenIds]);
  } catch (error: any) {
    console.error("⚠️ Сбой мониторинга (повтор через 60с):", error.message || error);
  } finally {
    running = false;
  }
}

export function startMonitorJob(): void {
  // Запуск первой проверки сразу
  runMonitor();
  setInterval(runMonitor, config.poll.intervalMs);
}
