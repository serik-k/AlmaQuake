import fs from "fs";
import path from "path";

const configuredDataDir = process.env.DATA_DIR?.trim();

export const dataDir = configuredDataDir
  ? path.resolve(configuredDataDir)
  : path.resolve(__dirname, "../../data");

export function dataFile(name: string): string {
  return path.join(dataDir, name);
}

export function readJson<T>(file: string, fallback: T): T {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(file)) return fallback;

  try {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  } catch (error) {
    // Failing startup is safer than silently loading an empty collection and
    // overwriting all subscribers on the next registration.
    console.error(`Persistent data is unreadable: ${file}`, error);
    throw error;
  }
}

export function writeJson(file: string, value: unknown): void {
  fs.mkdirSync(dataDir, { recursive: true });
  const temporaryFile = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(value), "utf-8");
  fs.renameSync(temporaryFile, file);
}

export function logStorageConfiguration(): void {
  console.log(`Persistent data directory: ${dataDir}`);
  if (process.env.RAILWAY_ENVIRONMENT && !configuredDataDir) {
    console.warn(
      "DATA_DIR is not set on Railway. Attach a persistent Volume and set DATA_DIR to its mount path (for example /data)."
    );
  }
}
