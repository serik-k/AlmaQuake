import fs from "fs";
import path from "path";

const DATA_DIR = path.join(__dirname, "../../data");
const TOKENS_FILE = path.join(DATA_DIR, "tokens.json");

function load(): Set<string> {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(TOKENS_FILE)) return new Set();
    const raw = fs.readFileSync(TOKENS_FILE, "utf-8");
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function save(tokens: Set<string>) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(TOKENS_FILE, JSON.stringify([...tokens]), "utf-8");
  } catch (e) {
    console.error("❌ Ошибка сохранения токенов:", e);
  }
}

const tokens = load();
console.log(`📦 Загружено токенов: ${tokens.size}`);

export const tokenService = {
  add(t: string) {
    tokens.add(t);
    save(tokens);
  },
  remove(t: string) {
    const existed = tokens.has(t);
    tokens.delete(t);
    if (existed) save(tokens);
    return existed;
  },
  all: () => [...tokens],
  count: () => tokens.size,
};
