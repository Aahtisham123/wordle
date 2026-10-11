import type { Difficulty, GameMode } from "@/lib/game/types";

export function maxGuessesFor(difficulty: Difficulty, mode: GameMode) {
  if (mode === "practice" || difficulty === "easy") return 8;
  return 6;
}

export function hintBudgetFor(
  difficulty: Difficulty,
  mode: GameMode,
  hintsEnabled: boolean,
  hardHints: boolean,
) {
  if (!hintsEnabled) return 0;
  if (difficulty === "hard" && !hardHints) return 0;
  if (mode === "practice" || difficulty === "easy") return 3;
  if (difficulty === "medium") return 2;
  return 1;
}

export function countdownLimitMs(length: number) {
  return (90 + length * 12) * 1000;
}

export function difficultySummary(difficulty: Difficulty) {
  if (difficulty === "easy") {
    return "Eight guesses, up to three hints, and more common words.";
  }
  if (difficulty === "medium") {
    return "Six guesses, up to two hints, and a standard vocabulary.";
  }
  return "Six guesses, at most one hint, harder words, and strict clue rules.";
}
