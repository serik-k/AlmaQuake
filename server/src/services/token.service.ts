import { dataFile, readJson, writeJson } from "./storage.service";

const TOKENS_FILE = dataFile("tokens.json");

function load(): Set<string> {
  return new Set(readJson<string[]>(TOKENS_FILE, []));
}

function save(tokens: Set<string>) {
  writeJson(TOKENS_FILE, [...tokens]);
}

const tokens = load();
console.log(`📦 Загружено токенов: ${tokens.size}`);

export const tokenService = {
  add(t: string) {
    if (!tokens.has(t)) {
      tokens.add(t);
      save(tokens);
    }
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
