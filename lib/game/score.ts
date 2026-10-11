import type { TileMark } from "@/lib/game/types";

/**
 * Frequency-aware Wordle scoring.
 * Greens are reserved first, then remaining letter counts can become yellow.
 * Extra copies of a letter are marked absent once the answer's count is used.
 */
export function scoreGuess(guess: string, answer: string): TileMark[] {
  const marks: TileMark[] = Array.from({ length: guess.length }, () => "absent");
  const remaining = new Map<string, number>();

  for (const letter of answer) {
    remaining.set(letter, (remaining.get(letter) ?? 0) + 1);
  }

  for (let index = 0; index < guess.length; index += 1) {
    if (guess[index] !== answer[index]) continue;
    marks[index] = "correct";
    remaining.set(guess[index], (remaining.get(guess[index]) ?? 0) - 1);
  }

  for (let index = 0; index < guess.length; index += 1) {
    if (marks[index] === "correct") continue;
    const count = remaining.get(guess[index]) ?? 0;
    if (count > 0) {
      marks[index] = "present";
      remaining.set(guess[index], count - 1);
    }
  }

  return marks;
}

export function guessIsSolved(marks: TileMark[]) {
  return marks.length > 0 && marks.every((mark) => mark === "correct");
}
