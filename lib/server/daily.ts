import { hashString } from "@/lib/game/hash";
import type { Locale, WordLength } from "@/lib/game/types";
import { readDictionary } from "@/lib/server/words";

/** Daily puzzles change at 00:00 UTC for every player. */
export function utcDate(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function dailyPuzzleKey(date: string, length: WordLength, locale: Locale) {
  return `daily:${date}:${length}:${locale}`;
}

export function dailyWord(date: string, length: WordLength, locale: Locale) {
  const pool = readDictionary(locale, length).pools.medium;
  if (pool.length === 0) {
    throw new Error("The daily word list is empty.");
  }
  const index = hashString(`${date}:${length}:${locale}`) % pool.length;
  return pool[index];
}
