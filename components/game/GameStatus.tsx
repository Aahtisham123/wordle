import { remainingMs } from "@/lib/game/engine";
import type { GameState } from "@/lib/game/types";

export function GameStatus({ state, now }: { state: GameState; now: number }) {
  const remaining = remainingMs(state, now);
  const clock = state.config.mode === "timed" || state.config.mode === "countdown" || state.config.countdownMs
    ? format(state.config.countdownMs ? remaining ?? 0 : now - state.startedAt)
    : null;
  return (
    <div className="text-center">
      <p className="text-sm text-muted" aria-live="polite">
        {state.message || statusLine(state)}
      </p>
      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
        {state.config.difficulty} · {state.config.length} letters · {modeLabel(state)}
        {clock ? ` · ${clock}` : ""} · {Math.max(state.config.hintBudget - state.hintsUsed, 0)} hints left
      </p>
    </div>
  );
}

function statusLine(state: GameState) {
  if (state.status === "won") return "Solved.";
  if (state.status === "lost") return state.config.answer ? `The word was ${state.config.answer.toUpperCase()}.` : "Puzzle over.";
  if (state.config.mode === "daily") return "Daily puzzle. The same word is used for this length and language until 00:00 UTC.";
  return "Type a word and press enter.";
}

function modeLabel(state: GameState) {
  if (state.config.mode === "countdown" || state.config.countdownMs) return "Countdown";
  if (state.config.mode === "timed") return "Stopwatch";
  if (state.config.mode === "daily") return "Daily";
  if (state.config.mode === "practice") return "Practice";
  if (state.config.mode === "challenge") return "Challenge";
  return "Unlimited";
}

function format(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
