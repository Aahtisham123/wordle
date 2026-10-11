"use client";

import { useMemo, useState } from "react";
import { GameRow } from "@/components/game/GameRow";
import { GameKeyboard } from "@/components/game/GameKeyboard";
import { GradientButton } from "@/components/layout/GradientButton";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { scoreGuess } from "@/lib/game/score";
import type { TileMark } from "@/lib/game/types";

const ANSWER = "crane";

export function InteractiveDemo() {
  const [slots, setSlots] = useState<Array<string | null>>(Array(5).fill(null));
  const [guesses, setGuesses] = useState<string[]>([]);
  const [marks, setMarks] = useState<TileMark[][]>([]);
  const [message, setMessage] = useState("This preview uses the sample word CRANE.");
  const status = useMemo(() => {
    if (marks.some((row) => row.every((mark) => mark === "correct"))) return "won";
    if (guesses.length >= 6) return "lost";
    return "playing";
  }, [guesses.length, marks]);

  function press(key: string) {
    if (status !== "playing") return;
    if (key === "enter") {
      if (slots.some((slot) => !slot)) {
        setMessage("Fill all five tiles first.");
        return;
      }
      const guess = slots.join("");
      const evaluation = scoreGuess(guess, ANSWER);
      setGuesses((current) => [...current, guess]);
      setMarks((current) => [...current, evaluation]);
      setSlots(Array(5).fill(null));
      setMessage(evaluation.every((mark) => mark === "correct") ? "Solved. Open the full game for a new word." : "Check the colors, then try another word.");
      return;
    }
    if (key === "backspace") {
      const next = slots.slice();
      for (let index = next.length - 1; index >= 0; index -= 1) {
        if (next[index]) {
          next[index] = null;
          break;
        }
      }
      setSlots(next);
      return;
    }
    const index = slots.findIndex((slot) => !slot);
    if (index < 0) return;
    const next = slots.slice();
    next[index] = key;
    setSlots(next);
  }

  const rows = Array.from({ length: 6 }, (_, index) => guesses[index]?.split("") ?? (index === guesses.length ? slots : Array(5).fill(null)));

  return (
    <section className="site-container py-16">
      <SectionHeading
        eyebrow="Preview"
        title="Try a five-letter sample"
        text="This Wordle Unlimited Game demonstration always uses CRANE. It is here to show the tiles and keyboard, not to replace the full game."
      />
      <div className="glass mx-auto mt-8 max-w-md rounded-[2rem] p-4 sm:p-6">
        <p className="sr-only" aria-live="polite">{message}</p>
        <p className="mb-4 text-center text-sm text-muted">{message}</p>
        <div className="mx-auto grid max-w-sm gap-1.5">
          {rows.map((letters, index) => (
            <GameRow key={index} letters={letters} marks={marks[index]} />
          ))}
        </div>
        <div className="mt-4">
          <GameKeyboard marks={new Map()} onKey={press} />
        </div>
        <div className="mt-4 flex justify-center">
          <GradientButton href="/wordle-unlimited">Play the Full Game</GradientButton>
        </div>
      </div>
    </section>
  );
}
