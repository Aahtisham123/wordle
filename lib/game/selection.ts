import { wordsForCategory } from "@/lib/game/categories";
import type {
  CategoryId,
  Difficulty,
  LoadedDictionary,
  Locale,
} from "@/lib/game/types";

export function answerPool(
  dictionary: LoadedDictionary,
  category: CategoryId,
  difficulty: Difficulty,
  locale: Locale,
) {
  if (category === "random") return dictionary.pools[difficulty];
  const themed = wordsForCategory(category, dictionary.length, locale);
  if (themed.length === 0) return [];
  const preferred = themed.filter((word) => dictionary.pools[difficulty].includes(word));
  return preferred.length >= 8 ? preferred : themed;
}

export function pickAnswer(pool: string[], exclude?: string | null, random = Math.random) {
  if (pool.length === 0) {
    throw new Error("No valid answer is available for this combination.");
  }
  const usable = exclude && pool.length > 1 ? pool.filter((word) => word !== exclude) : pool;
  const source = usable.length > 0 ? usable : pool;
  const index = Math.floor(random() * source.length);
  return source[index] ?? source[0];
}
