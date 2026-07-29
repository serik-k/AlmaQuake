import { dataFile, readJson, writeJson } from "./storage.service";

const CHATS_FILE = dataFile("chats.json");

function load(): Set<number> {
  return new Set(readJson<number[]>(CHATS_FILE, []));
}

function save(chats: Set<number>) {
  writeJson(CHATS_FILE, [...chats]);
}

const chats = load();
console.log(`💬 Telegram подписчиков: ${chats.size}`);

export const chatService = {
  add(id: number) {
    if (!chats.has(id)) {
      chats.add(id);
      save(chats);
    }
  },
  remove(id: number) {
    if (chats.delete(id)) save(chats);
  },
  all: () => [...chats],
  count: () => chats.size,
};
