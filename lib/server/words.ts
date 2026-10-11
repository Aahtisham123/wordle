import fs from "node:fs";
import path from "node:path";
import { dictionaryFromFile } from "@/lib/game/dictionary";
import type { DictionaryFile, LoadedDictionary, Locale, WordLength } from "@/lib/game/types";

const cache = new Map<string, LoadedDictionary>();

export function readDictionary(locale: Locale, length: WordLength) {
  const key = `${locale}:${length}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "public", "dictionaries", locale, `${length}.json`);
  const file = JSON.parse(fs.readFileSync(filePath, "utf8")) as DictionaryFile;
  const dictionary = dictionaryFromFile(file, locale, length);
  cache.set(key, dictionary);
  return dictionary;
}
