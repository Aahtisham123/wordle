import type { GameState, TileMark } from "@/lib/game/types";

const SQUARES: Record<TileMark, string> = {
  correct: "🟩",
  present: "🟨",
  absent: "⬜",
};

const LETTERS: Record<TileMark, string> = {
  correct: "G",
  present: "Y",
  absent: "-",
};

export function resultSquares(evaluations: TileMark[][]) {
  return evaluations.map((row) => row.map((mark) => SQUARES[mark]).join("")).join("\n");
}

export function shareText(state: GameState) {
  const attempts = state.status === "won" ? state.guesses.length : "X";
  const header = `Wordle Unlimited ${attempts}/${state.config.maxGuesses}`;
  const detail = `${labelMode(state)} · ${state.config.length} letters · ${state.config.difficulty} · ${state.config.locale === "uk" ? "UK English" : "US English"}`;
  const accessible = state.evaluations
    .map((row) => row.map((mark) => LETTERS[mark]).join(""))
    .join("\n");
  return `${header}\n${detail}\n${resultSquares(state.evaluations)}\n\nLetter key: G correct, Y present, - absent\n${accessible}`;
}

function labelMode(state: GameState) {
  switch (state.config.mode) {
    case "daily":
      return "Daily";
    case "practice":
      return "Practice";
    case "timed":
      return "Timed";
    case "countdown":
      return "Countdown";
    case "challenge":
      return "Challenge";
    default:
      return "Unlimited";
  }
}

export async function copyText(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

export async function nativeShare(data: { title: string; text: string; url?: string }) {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    await navigator.share(data);
    return true;
  }
  return false;
}
