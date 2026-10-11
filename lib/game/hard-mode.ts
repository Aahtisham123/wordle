import type { TileMark } from "@/lib/game/types";

export type HardConstraints = {
  fixed: Array<string | null>;
  min: Map<string, number>;
  max: Map<string, number>;
  bannedAt: Map<string, Set<number>>;
  absent: Set<string>;
};

export function constraintsFromPlay(
  guesses: string[],
  evaluations: TileMark[][],
  revealed: Array<string | null>,
  eliminated: string[],
): HardConstraints {
  const length = revealed.length || guesses[0]?.length || 0;
  const fixed: Array<string | null> = Array.from({ length }, (_, index) => revealed[index] ?? null);
  const min = new Map<string, number>();
  const max = new Map<string, number>();
  const bannedAt = new Map<string, Set<number>>();
  const absent = new Set<string>();

  const raiseMin = (letter: string, count: number) => {
    min.set(letter, Math.max(min.get(letter) ?? 0, count));
  };
  const lowerMax = (letter: string, count: number) => {
    max.set(letter, Math.min(max.get(letter) ?? Number.POSITIVE_INFINITY, count));
  };
  const ban = (letter: string, index: number) => {
    const positions = bannedAt.get(letter) ?? new Set<number>();
    positions.add(index);
    bannedAt.set(letter, positions);
  };

  guesses.forEach((guess, guessIndex) => {
    const marks = evaluations[guessIndex] ?? [];
    const tally = new Map<string, { confirmed: number; sawAbsent: boolean }>();
    for (let index = 0; index < guess.length; index += 1) {
      const letter = guess[index];
      const mark = marks[index];
      const entry = tally.get(letter) ?? { confirmed: 0, sawAbsent: false };
      if (mark === "correct") {
        fixed[index] = letter;
        entry.confirmed += 1;
      } else if (mark === "present") {
        entry.confirmed += 1;
        ban(letter, index);
      } else {
        entry.sawAbsent = true;
        ban(letter, index);
      }
      tally.set(letter, entry);
    }
    for (const [letter, entry] of tally) {
      if (entry.confirmed > 0) raiseMin(letter, entry.confirmed);
      if (entry.sawAbsent) lowerMax(letter, entry.confirmed);
      if (entry.sawAbsent && entry.confirmed === 0) absent.add(letter);
    }
  });

  for (const letter of eliminated) {
    absent.add(letter);
    lowerMax(letter, 0);
  }

  const fixedCounts = new Map<string, number>();
  for (const letter of fixed) {
    if (!letter) continue;
    fixedCounts.set(letter, (fixedCounts.get(letter) ?? 0) + 1);
    absent.delete(letter);
  }
  for (const [letter, count] of fixedCounts) raiseMin(letter, count);

  return { fixed, min, max, bannedAt, absent };
}

export function hardModeViolation(guess: string, constraints: HardConstraints) {
  const counts = new Map<string, number>();
  for (let index = 0; index < guess.length; index += 1) {
    const letter = guess[index];
    const required = constraints.fixed[index];
    if (required && letter !== required) {
      return `Hard mode keeps ${required.toUpperCase()} in position ${index + 1}.`;
    }
    if (constraints.bannedAt.get(letter)?.has(index)) {
      return `Hard mode: ${letter.toUpperCase()} cannot be used in position ${index + 1}.`;
    }
    counts.set(letter, (counts.get(letter) ?? 0) + 1);
  }

  for (const [letter, minimum] of constraints.min) {
    if ((counts.get(letter) ?? 0) < minimum) {
      return `Hard mode: include ${letter.toUpperCase()} at least ${minimum} ${minimum === 1 ? "time" : "times"}.`;
    }
  }

  for (const [letter, maximum] of constraints.max) {
    if (!Number.isFinite(maximum)) continue;
    if ((counts.get(letter) ?? 0) > maximum) {
      const label = maximum === 0 ? "is ruled out" : `can be used only ${maximum} ${maximum === 1 ? "time" : "times"}`;
      return `Hard mode: ${letter.toUpperCase()} ${label}.`;
    }
  }

  for (const letter of constraints.absent) {
    if ((counts.get(letter) ?? 0) > 0 && (constraints.max.get(letter) ?? 1) === 0) {
      return `Hard mode: ${letter.toUpperCase()} is ruled out.`;
    }
  }

  return null;
}
