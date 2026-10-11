import type { TileMark } from "@/lib/game/types";

export const KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as const;

const RANK: Record<TileMark, number> = {
  absent: 1,
  present: 2,
  correct: 3,
};

export function keyboardMarks(
  guesses: string[],
  evaluations: TileMark[][],
  revealed: Array<string | null>,
  eliminated: string[],
) {
  const marks = new Map<string, TileMark>();
  const place = (letter: string, mark: TileMark) => {
    const current = marks.get(letter);
    if (!current || RANK[mark] > RANK[current]) marks.set(letter, mark);
  };

  guesses.forEach((guess, index) => {
    const evaluation = evaluations[index] ?? [];
    for (let cursor = 0; cursor < guess.length; cursor += 1) {
      const mark = evaluation[cursor];
      if (mark) place(guess[cursor], mark);
    }
  });

  for (const letter of revealed) {
    if (letter) place(letter, "correct");
  }
  for (const letter of eliminated) place(letter, "absent");
  return marks;
}
