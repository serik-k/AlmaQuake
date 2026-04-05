import fs from "fs";
import path from "path";

const DATA_DIR = path.join(__dirname, "../../data");
const CHATS_FILE = path.join(DATA_DIR, "chats.json");

function load(): Set<number> {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(CHATS_FILE)) return new Set();
    const raw = fs.readFileSync(CHATS_FILE, "utf-8");
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

function save(chats: Set<number>) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(CHATS_FILE, JSON.stringify([...chats]), "utf-8");
  } catch (e) {
    console.error("❌ Ошибка сохранения chat_id:", e);
  }
}

const chats = load();
console.log(`💬 Telegram подписчиков: ${chats.size}`);

export const chatService = {
  add(id: number) {
    chats.add(id);
    save(chats);
  },
  remove(id: number) {
    chats.delete(id);
    save(chats);
  },
  all: () => [...chats],
  count: () => chats.size,
};
