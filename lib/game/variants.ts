import pairs from "@/data/variants.json";
import type { Locale } from "@/lib/game/types";

const usToUk = new Map<string, string>(pairs as Array<[string, string]>);
const ukToUs = new Map<string, string>(
  (pairs as Array<[string, string]>).map(([us, uk]) => [uk, us]),
);

export function applyLocale(word: string, locale: Locale) {
  const lower = word.toLowerCase();
  if (locale === "uk") return usToUk.get(lower) ?? lower;
  return ukToUs.get(lower) ?? lower;
}

export function spellingOf(word: string, locale: Locale) {
  return applyLocale(word, locale);
}
