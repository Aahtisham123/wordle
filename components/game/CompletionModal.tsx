"use client";

import { Dialog } from "@/components/ui/Dialog";
import { ChallengeShareCard } from "@/components/advanced/ChallengeShareCard";
import { copyText, shareText } from "@/lib/game/share";
import { elapsedMs } from "@/lib/game/engine";
import type { GameState } from "@/lib/game/types";

export function CompletionModal({
  state,
  theme,
  onClose,
  onAgain,
  onStats,
}: {
  state: GameState | null;
  theme: "light" | "dark";
  onClose: () => void;
  onAgain: () => void;
  onStats: () => void;
}) {
  if (!state || state.status === "playing") return null;
  const won = state.status === "won";
  const seconds = Math.round(elapsedMs(state) / 1000);
  return (
    <Dialog
      open
      title={won ? "Puzzle solved" : "Puzzle finished"}
      description={won ? "Nice work. The share text leaves the word out." : "The answer is shown here so you can start another round."}
      onClose={onClose}
    >
      {won ? <Confetti /> : null}
      <div className="grid gap-2 text-sm leading-6">
        {!won && state.config.answer ? <p className="text-lg font-semibold">{state.config.answer.toUpperCase()}</p> : null}
        {state.config.clue ? <p className="text-muted">{state.config.clue}</p> : null}
        <p>{won ? `${state.guesses.length}/${state.config.maxGuesses} guesses` : "Out of guesses"} · {seconds}s · {state.config.difficulty} · {state.config.length} letters</p>
        <p>{state.hintsUsed > 0 ? `Assisted win · ${state.hintsUsed} hint${state.hintsUsed === 1 ? "" : "s"} used` : "No hints used"}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white" onClick={() => void copyText(shareText(state))}>Share results</button>
        <ChallengeShareCard state={state} theme={theme} />
        <button type="button" className="rounded-full border border-[var(--line)] px-4 py-2 text-sm" onClick={onStats}>View statistics</button>
        <button type="button" className="rounded-full border border-[var(--line)] px-4 py-2 text-sm" onClick={onAgain}>Play again</button>
      </div>
    </Dialog>
  );
}

function Confetti() {
  return (
    <div className="pointer-events-none mb-3 flex justify-center gap-2" aria-hidden="true">
      {["#22C55E", "#EAB308", "#8B5CF6", "#22D3EE", "#F8FAFC"].map((color, index) => (
        <span key={color} className="h-2 w-2 rounded-full" style={{ background: color, transform: `translateY(${index % 2 ? 4 : 0}px)` }} />
      ))}
    </div>
  );
}
