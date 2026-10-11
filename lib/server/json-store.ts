import fs from "node:fs";
import path from "node:path";
import { dataDir, ensureDataDir, withLock } from "@/lib/server/paths";

export function readCollection<T>(name: string): T[] {
  const file = path.join(dataDir(), name);
  if (!fs.existsSync(file)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as { items?: T[] };
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

export function writeCollection<T>(name: string, items: T[]) {
  ensureDataDir();
  const file = path.join(dataDir(), name);
  fs.writeFileSync(file, JSON.stringify({ items }));
}

export function updateCollection<T>(name: string, mutate: (items: T[]) => T[]) {
  return withLock(() => {
    const next = mutate(readCollection<T>(name));
    writeCollection(name, next);
    return next;
  });
}
