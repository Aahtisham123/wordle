import { wordsForCategory } from "@/lib/game/categories";
import type { CategoryId, LoadedDictionary, Locale } from "@/lib/game/types";

export function normalizeWord(value: string) {
  return value.trim().toLowerCase();
}

export function isAlphabeticWord(value: string, length?: number) {
  if (!/^[a-z]+$/.test(value)) return false;
  if (length !== undefined && value.length !== length) return false;
  return value.length >= 3 && value.length <= 10;
}

export function guessError(input: {
  guess: string;
  length: number;
  dictionary?: LoadedDictionary | null;
  category: CategoryId;
  locale: Locale;
  custom: boolean;
}) {
  if (input.guess.length !== input.length) {
    return `Enter a ${input.length}-letter word.`;
  }
  if (!/^[a-z]+$/.test(input.guess)) {
    return "Use letters only.";
  }
  if (input.custom) return null;
  const themed = new Set(wordsForCategory(input.category, input.length, input.locale));
  if (themed.has(input.guess)) return null;
  if (input.dictionary?.allowed.has(input.guess)) return null;
  return "That is not in the word list.";
}
