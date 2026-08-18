import { fetchQuakes } from "../services/usgs.service";
import { sendQuakeAlert } from "../services/telegram.service";
import { config } from "../config";
import { dataFile, readJson, writeJson } from "../services/storage.service";
import { logger } from "../utils/logger.utils";

const STATE_FILE = dataFile("monitor-state.json");
const MAX_SEEN_IDS = 200;

let seenIds = new Set(readJson<string[]>(STATE_FILE, []).slice(0, MAX_SEEN_IDS));
let running = false;
let timer: ReturnType<typeof setTimeout> | undefined;
let stopped = false;

function rememberLatest(quakeIds: string[]): void {
  seenIds = new Set(quakeIds.slice(0, MAX_SEEN_IDS));
  writeJson(STATE_FILE, [...seenIds]);
}

export async function runMonitor(): Promise<void> {
  if (running || stopped) return;
  running = true;
  try {
    const quakes = await fetchQuakes();
    if (quakes.length === 0) return;

    if (seenIds.size === 0) {
      rememberLatest(quakes.map((quake) => quake.id));
      logger.info(`Monitor initialized with latest event ${quakes[0].id} (M${quakes[0].magnitude})`);
      return;
    }

    const newQuakes = quakes.filter((quake) => !seenIds.has(quake.id)).reverse();
    for (const quake of newQuakes) {
      logger.info(`New earthquake detected: M${quake.magnitude} — ${quake.place}`);
      await sendQuakeAlert(quake);
    }

    rememberLatest(quakes.map((quake) => quake.id));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Monitoring failure; retrying after ${config.poll.intervalMs}ms: ${message}`);
  } finally {
    running = false;
  }
}

function scheduleNextRun(): void {
  if (stopped) return;
  timer = setTimeout(async () => {
    await runMonitor();
    scheduleNextRun();
  }, config.poll.intervalMs);
}

export function startMonitorJob(): void {
  stopped = false;
  void runMonitor().finally(scheduleNextRun);
}

export function stopMonitorJob(): void {
  stopped = true;
  if (timer) {
    clearTimeout(timer);
    timer = undefined;
  }
}
