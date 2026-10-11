import type { CategoryId, HintResult, TileMark } from "@/lib/game/types";

const LETTER_ORDER = "etaoinshrdlucmfwypvbgkjqxz".split("");

export function nextHint(input: {
  answer: string;
  guesses: string[];
  evaluations: TileMark[][];
  revealed: Array<string | null>;
  eliminated: string[];
  definitionShown: boolean;
  categoryHintShown: boolean;
  definition: string | null;
  categoryText: string;
}): { hint: HintResult } | { error: string } {
  const answer = input.answer.toLowerCase();
  const known = input.revealed.slice();
  input.evaluations.forEach((marks, guessIndex) => {
    marks.forEach((mark, index) => {
      if (mark === "correct") known[index] = input.guesses[guessIndex]?.[index] ?? known[index];
    });
  });

  const unknownIndexes = known
    .map((letter, index) => (letter ? -1 : index))
    .filter((index) => index >= 0);

  if (!input.definitionShown && input.definition) {
    return { hint: { type: "definition", text: input.definition } };
  }

  const eliminated = new Set(input.eliminated);
  const inAnswer = new Set(answer.split(""));
  const sacrifice = LETTER_ORDER.find((letter) => !inAnswer.has(letter) && !eliminated.has(letter));
  if (sacrifice) {
    return { hint: { type: "eliminate", letter: sacrifice } };
  }

  if (unknownIndexes.length > 1) {
    const index = unknownIndexes[0];
    return { hint: { type: "reveal", index, letter: answer[index] } };
  }

  if (!input.categoryHintShown) {
    return { hint: { type: "category", text: input.categoryText } };
  }

  return { error: "No further hint can be given without revealing the answer." };
}

export function categoryHintText(category: CategoryId, fallback: string) {
  if (category === "random") {
    return "This puzzle uses a general English word rather than a specialist theme.";
  }
  return fallback;
}
