import type { GameConfig, GameState, HintResult, TileMark } from "@/lib/game/types";

export function emptySlots(length: number, revealed: Array<string | null> = []) {
  return Array.from({ length }, (_, index) => revealed[index] ?? null);
}

export function createGame(config: GameConfig, now = Date.now()): GameState {
  const revealed = emptySlots(config.length);
  return {
    config,
    slots: emptySlots(config.length),
    guesses: [],
    evaluations: [],
    revealed,
    eliminated: [],
    hintsUsed: 0,
    hintNotes: [],
    definitionShown: false,
    categoryHintShown: false,
    status: "playing",
    startedAt: now,
    endedAt: null,
    message: null,
    shake: false,
    statsRecorded: false,
  };
}

export function currentGuess(state: GameState) {
  if (state.slots.some((slot) => !slot)) return null;
  return state.slots.join("");
}

export function typeLetter(state: GameState, letter: string): GameState {
  if (state.status !== "playing") return state;
  const normalized = letter.toLowerCase();
  if (!/^[a-z]$/.test(normalized)) return state;
  const slots = state.slots.slice();
  const index = slots.findIndex((slot, slotIndex) => !slot && !state.revealed[slotIndex]);
  if (index < 0) return state;
  slots[index] = normalized;
  return { ...state, slots, message: null, shake: false };
}

export function deleteLetter(state: GameState): GameState {
  if (state.status !== "playing") return state;
  const slots = state.slots.slice();
  for (let index = slots.length - 1; index >= 0; index -= 1) {
    if (state.revealed[index]) continue;
    if (slots[index]) {
      slots[index] = null;
      break;
    }
  }
  return { ...state, slots, message: null, shake: false };
}

export function rejectGuess(state: GameState, message: string): GameState {
  return { ...state, message, shake: true };
}

export function clearNotice(state: GameState): GameState {
  return { ...state, shake: false };
}

export function commitGuess(state: GameState, marks: TileMark[], now = Date.now()): GameState {
  const guess = state.slots.join("");
  const guesses = [...state.guesses, guess];
  const evaluations = [...state.evaluations, marks];
  const won = marks.every((mark) => mark === "correct");
  const lost = !won && guesses.length >= state.config.maxGuesses;
  const finished = won || lost;
  return {
    ...state,
    guesses,
    evaluations,
    slots: emptySlots(state.config.length, state.revealed),
    status: won ? "won" : lost ? "lost" : "playing",
    endedAt: finished ? now : null,
    message: null,
    shake: false,
  };
}

export function applyHint(state: GameState, hint: HintResult): GameState {
  const revealed = state.revealed.slice();
  const eliminated = state.eliminated.slice();
  let definitionShown = state.definitionShown;
  let categoryHintShown = state.categoryHintShown;
  let note = "";

  if (hint.type === "definition") {
    definitionShown = true;
    note = hint.text;
  } else if (hint.type === "category") {
    categoryHintShown = true;
    note = hint.text;
  } else if (hint.type === "eliminate") {
    eliminated.push(hint.letter);
    note = `${hint.letter.toUpperCase()} is not in the word.`;
  } else {
    revealed[hint.index] = hint.letter;
    note = `${hint.letter.toUpperCase()} is in position ${hint.index + 1}.`;
  }

  return {
    ...state,
    revealed,
    eliminated,
    definitionShown,
    categoryHintShown,
    hintsUsed: state.hintsUsed + 1,
    hintNotes: [...state.hintNotes, note],
    slots: state.slots.map((slot, index) => revealed[index] ?? slot),
    message: note,
    shake: false,
  };
}

export function revealAnswer(state: GameState, answer: string, now = Date.now()): GameState {
  return {
    ...state,
    config: { ...state.config, answer },
    status: "lost",
    endedAt: state.endedAt ?? now,
  };
}

export function markRecorded(state: GameState): GameState {
  return { ...state, statsRecorded: true };
}

export function remainingMs(state: GameState, now = Date.now()) {
  if (!state.config.countdownMs) return null;
  return Math.max(0, state.config.countdownMs - (now - state.startedAt));
}

export function elapsedMs(state: GameState, now = Date.now()) {
  return (state.endedAt ?? now) - state.startedAt;
}
