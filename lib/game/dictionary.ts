import type { DictionaryFile, LoadedDictionary, Locale, WordLength } from "@/lib/game/types";

const cache = new Map<string, Promise<LoadedDictionary>>();

export function dictionaryFromFile(
  file: DictionaryFile,
  locale: Locale,
  length: WordLength,
): LoadedDictionary {
  return {
    locale,
    length,
    pools: {
      easy: file.easy,
      medium: file.medium,
      hard: file.hard,
    },
    allowed: new Set(file.allowed),
  };
}

export function loadDictionary(locale: Locale, length: WordLength) {
  const key = `${locale}:${length}`;
  const existing = cache.get(key);
  if (existing) return existing;
  const pending = fetch(`/dictionaries/${locale}/${length}.json`)
    .then(async (response) => {
      if (!response.ok) throw new Error("Could not load the word list.");
      const file = (await response.json()) as DictionaryFile;
      return dictionaryFromFile(file, locale, length);
    })
    .catch((error: unknown) => {
      cache.delete(key);
      throw error;
    });
  cache.set(key, pending);
  return pending;
}
