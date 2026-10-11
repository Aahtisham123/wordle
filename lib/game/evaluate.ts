import { constraintsFromPlay, hardModeViolation } from "@/lib/game/hard-mode";
import { scoreGuess } from "@/lib/game/score";
import type { TileMark } from "@/lib/game/types";

export function evaluateSubmission(input: {
  guess: string;
  answer: string;
  previousGuesses: string[];
  previousMarks: TileMark[][];
  revealed: Array<string | null>;
  eliminated: string[];
  hardMode: boolean;
}) {
  if (input.guess.length !== input.answer.length) {
    return { ok: false as const, message: `Enter a ${input.answer.length}-letter word.` };
  }
  if (input.hardMode) {
    const violation = hardModeViolation(
      input.guess,
      constraintsFromPlay(
        input.previousGuesses,
        input.previousMarks,
        input.revealed,
        input.eliminated,
      ),
    );
    if (violation) return { ok: false as const, message: violation };
  }
  return { ok: true as const, marks: scoreGuess(input.guess, input.answer) };
}
