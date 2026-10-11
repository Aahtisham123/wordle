"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES, categoryHasLength, wordsForCategory } from "@/lib/game/categories";
import { clueFor } from "@/lib/game/clues";
import { loadDictionary } from "@/lib/game/dictionary";
import {
  applyHint,
  clearNotice,
  commitGuess,
  createGame,
  currentGuess,
  deleteLetter,
  elapsedMs,
  markRecorded,
  rejectGuess,
  remainingMs,
  revealAnswer,
  typeLetter,
} from "@/lib/game/engine";
import { evaluateSubmission } from "@/lib/game/evaluate";
import { categoryHintText, nextHint } from "@/lib/game/hints";
import { keyboardMarks } from "@/lib/game/keyboard";
import { hintBudgetFor, maxGuessesFor } from "@/lib/game/rules";
import { answerPool, pickAnswer } from "@/lib/game/selection";
import { playSound, vibrateKeys } from "@/lib/game/sound";
import { recordGame } from "@/lib/game/stats";
import {
  loadPreferences,
  loadSavedGame,
  loadStats,
  saveDailyCompletion,
  saveGame,
  saveStats,
  type Preferences,
} from "@/lib/game/storage";
import type {
  CategoryId,
  Difficulty,
  GameMode,
  GameState,
  LoadedDictionary,
  Locale,
  PlayerStats,
  WordLength,
} from "@/lib/game/types";
import { guessError } from "@/lib/game/validation";

export type Setup = {
  difficulty: Difficulty;
  length: WordLength;
  category: CategoryId;
  mode: GameMode;
  locale: Locale;
  countdown: boolean;
};

const DEFAULT_SETUP: Setup = {
  difficulty: "medium",
  length: 5,
  category: "random",
  mode: "unlimited",
  locale: "us",
  countdown: false,
};

export function useWordleGame(options: {
  preset?: Partial<Setup>;
  challengeId?: string;
  sound: boolean;
  vibration: boolean;
  hintsEnabled: boolean;
  hardHints: boolean;
}) {
  const [setup, setSetup] = useState<Setup>({ ...DEFAULT_SETUP, ...options.preset, locale: options.preset?.locale ?? "us" });
  const [state, setState] = useState<GameState | null>(null);
  const [stats, setStats] = useState<PlayerStats>(loadStats());
  const [dictionary, setDictionary] = useState<LoadedDictionary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const stateRef = useRef<GameState | null>(null);
  const dictRef = useRef<LoadedDictionary | null>(null);
  const busy = useRef(false);
  const booted = useRef(false);
  useEffect(() => {
    stateRef.current = state;
    dictRef.current = dictionary;
  });

  const finish = useCallback((next: GameState) => {
    if ((next.status === "won" || next.status === "lost") && !next.statsRecorded) {
      const duration = elapsedMs(next);
      const recorded = recordGame(loadStats(), {
        id: next.config.id,
        won: next.status === "won",
        mode: next.config.mode,
        difficulty: next.config.difficulty,
        length: next.config.length,
        category: next.config.category,
        attempts: next.guesses.length,
        hintsUsed: next.hintsUsed,
        durationMs: duration,
        perfect: next.status === "won" && next.guesses.length === 1 && next.hintsUsed === 0,
      });
      saveStats(recorded);
      setStats(recorded);
      next = markRecorded(next);
      if (next.config.mode === "daily") {
        saveDailyCompletion(`${next.config.locale}:${next.config.length}:${new Date().toISOString().slice(0, 10)}`, {
          won: next.status === "won",
          attempts: next.guesses.length,
        });
      }
      void fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: next.config.id,
          won: next.status === "won",
          difficulty: next.config.difficulty,
          length: next.config.length,
          category: next.config.category,
          mode: next.config.mode,
          hints: next.hintsUsed,
          attempts: next.guesses.length,
          durationMs: duration,
        }),
      }).catch(() => undefined);
      playSound(next.status === "won" ? "win" : "bad", options.sound);
    }
    saveGame(next);
    setState(next);
  }, [options.sound]);

  const launchLocal = useCallback(async (nextSetup: Setup, preferences: Preferences, exclude?: string | null) => {
    if (nextSetup.category !== "random" && !categoryHasLength(nextSetup.category, nextSetup.length, nextSetup.locale)) {
      throw new Error(`${CATEGORIES[nextSetup.category].label} has no ${nextSetup.length}-letter answers in this language.`);
    }
    const loaded = await loadDictionary(nextSetup.locale, nextSetup.length);
    const pool = answerPool(loaded, nextSetup.category, nextSetup.difficulty, nextSetup.locale);
    const answer = pickAnswer(pool, exclude);
    const mode = nextSetup.mode === "challenge" ? "unlimited" : nextSetup.mode;
    const game = createGame({
      id: crypto.randomUUID(),
      length: nextSetup.length,
      difficulty: nextSetup.difficulty,
      category: nextSetup.category,
      locale: nextSetup.locale,
      mode,
      maxGuesses: maxGuessesFor(nextSetup.difficulty, mode),
      hintBudget: hintBudgetFor(nextSetup.difficulty, mode, preferences.hintsEnabled, preferences.hardHints),
      hintsEnabled: preferences.hintsEnabled,
      hardMode: nextSetup.difficulty === "hard",
      answer,
      clue: clueFor(answer),
      remote: false,
      countdownMs: nextSetup.countdown || mode === "countdown" ? (90 + nextSetup.length * 12) * 1000 : null,
      custom: false,
    });
    setDictionary(loaded);
    dictRef.current = loaded;
    setSetup({ ...nextSetup, mode });
    setError(null);
    setState(game);
    saveGame(game);
  }, []);

  const launchRemote = useCallback(async (session: RemoteSession, mode: GameMode) => {
    const loaded = await loadDictionary(session.locale, session.length);
    const game = createGame({
      id: crypto.randomUUID(),
      length: session.length,
      difficulty: session.difficulty,
      category: session.category,
      locale: session.locale,
      mode,
      maxGuesses: session.maxGuesses,
      hintBudget: session.hintBudget,
      hintsEnabled: session.hintBudget > 0,
      hardMode: session.hardMode,
      answer: null,
      clue: session.clue,
      challengeId: session.kind === "challenge" ? options.challengeId : undefined,
      sessionId: session.id,
      remote: true,
      countdownMs: session.countdownMs,
      custom: session.custom,
    });
    if (session.guesses.length) {
      game.guesses = session.guesses;
      game.evaluations = session.evaluations;
      game.revealed = session.revealed;
      game.eliminated = session.eliminated;
      game.hintsUsed = session.hintsUsed;
      game.status = session.status;
      game.slots = session.revealed.map((letter) => letter);
    }
    setDictionary(loaded);
    dictRef.current = loaded;
    setSetup({
      difficulty: session.difficulty,
      length: session.length,
      category: session.category,
      mode,
      locale: session.locale,
      countdown: Boolean(session.countdownMs),
    });
    setState(game);
    saveGame(game);
  }, [options.challengeId]);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    const preferences = loadPreferences();
    const preset = { ...DEFAULT_SETUP, locale: preferences.locale, ...options.preset };
    setStats(loadStats());
    void (async () => {
      try {
        if (options.challengeId) {
          const meta = await fetch(`/api/challenges/${options.challengeId}`).then(async (response) => {
            if (!response.ok) throw new Error("This challenge link is unavailable.");
            return response.json();
          });
          const session = await postJson<RemoteSession>("/api/sessions", {
            kind: "challenge",
            challengeId: options.challengeId,
          });
          session.countdownMs = meta.countdownMs ?? null;
          await launchRemote(session, "challenge");
          return;
        }
        const explicit = Boolean(options.preset && Object.keys(options.preset).length > 0);
        const saved = explicit ? null : loadSavedGame();
        if (saved?.status === "playing") {
          if (!saved.config.remote) {
            setDictionary(await loadDictionary(saved.config.locale, saved.config.length));
          }
          setSetup({
            difficulty: saved.config.difficulty,
            length: saved.config.length,
            category: saved.config.category,
            mode: saved.config.mode,
            locale: saved.config.locale,
            countdown: Boolean(saved.config.countdownMs),
          });
          setState(saved);
          return;
        }
        if (preset.mode === "daily") {
          const session = await postJson<RemoteSession>("/api/sessions", {
            kind: "daily",
            length: preset.length,
            locale: preset.locale,
            difficulty: preset.difficulty,
          });
          await launchRemote(session, "daily");
          return;
        }
        await launchLocal(preset, preferences);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "The puzzle could not be prepared.");
      } finally {
        setLoading(false);
      }
    })();
  }, [launchLocal, launchRemote, options.challengeId, options.preset]);

  useEffect(() => {
    if (!state || state.status !== "playing") return;
    if (state.config.mode !== "timed" && state.config.mode !== "countdown" && !state.config.countdownMs) return;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [state]);

  useEffect(() => {
    if (!state || state.status !== "playing" || !state.config.countdownMs) return;
    if ((remainingMs(state, now) ?? 1) > 0) return;
    void (async () => {
      if (busy.current) return;
      busy.current = true;
      try {
        let next = stateRef.current;
        if (!next || next.status !== "playing") return;
        if (next.config.remote && next.config.sessionId) {
          const result = await postJson<RemoteResult>(`/api/sessions/${next.config.sessionId}/forfeit`, {});
          next = revealAnswer({ ...next, status: "lost" }, result.answer ?? "");
          if (result.clue) next = { ...next, config: { ...next.config, clue: result.clue } };
        } else if (next.config.answer) {
          next = revealAnswer(next, next.config.answer);
        }
        finish(next);
      } finally {
        busy.current = false;
      }
    })();
  }, [finish, now, state]);

  const startWith = useCallback(async (nextSetup: Setup) => {
    setLoading(true);
    try {
      const preferences = { ...loadPreferences(), hintsEnabled: options.hintsEnabled, hardHints: options.hardHints };
      if (nextSetup.mode === "daily") {
        const session = await postJson<RemoteSession>("/api/sessions", {
          kind: "daily",
          length: nextSetup.length,
          locale: nextSetup.locale,
          difficulty: nextSetup.difficulty,
        });
        await launchRemote(session, "daily");
      } else {
        await launchLocal(nextSetup, preferences, stateRef.current?.config.answer);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not start a new puzzle.");
    } finally {
      setLoading(false);
    }
  }, [launchLocal, launchRemote, options.hardHints, options.hintsEnabled]);

  const submitRef = useRef<() => void>(() => undefined);

  const press = useCallback((key: string) => {
    const current = stateRef.current;
    if (!current || current.status !== "playing") return;
    if (key === "enter") {
      submitRef.current();
      return;
    }
    if (key === "backspace") {
      setState(deleteLetter(current));
      return;
    }
    vibrateKeys(options.vibration);
    playSound("tap", options.sound);
    setState(typeLetter(current, key));
  }, [options.sound, options.vibration]);

  async function submit() {
    const current = stateRef.current;
    if (!current || current.status !== "playing" || busy.current) return;
    const guess = currentGuess(current);
    if (!guess) {
      setState(rejectGuess(current, `Enter all ${current.config.length} letters.`));
      playSound("bad", options.sound);
      return;
    }
    busy.current = true;
    try {
      if (!current.config.remote) {
        const invalid = guessError({
          guess,
          length: current.config.length,
          dictionary: dictRef.current,
          category: current.config.category,
          locale: current.config.locale,
          custom: current.config.custom,
        });
        if (invalid) {
          setState(rejectGuess(current, invalid));
          playSound("bad", options.sound);
          return;
        }
        const evaluated = evaluateSubmission({
          guess,
          answer: current.config.answer ?? "",
          previousGuesses: current.guesses,
          previousMarks: current.evaluations,
          revealed: current.revealed,
          eliminated: current.eliminated,
          hardMode: current.config.hardMode,
        });
        if (!evaluated.ok) {
          setState(rejectGuess(current, evaluated.message));
          playSound("bad", options.sound);
          return;
        }
        finish(commitGuess(current, evaluated.marks));
        return;
      }
      const result = await postJson<RemoteResult>(`/api/sessions/${current.config.sessionId}/guess`, { guess });
      if (result.error) {
        setState(rejectGuess(current, result.error));
        playSound("bad", options.sound);
        return;
      }
      let next = commitGuess(current, result.marks ?? []);
      if (result.status) next = { ...next, status: result.status, endedAt: result.status === "playing" ? null : Date.now() };
      if (result.answer) next = { ...next, config: { ...next.config, answer: result.answer, clue: result.clue ?? next.config.clue } };
      finish(next);
    } catch (cause) {
      setState(rejectGuess(current, cause instanceof Error ? cause.message : "Could not submit that guess."));
      playSound("bad", options.sound);
    } finally {
      busy.current = false;
    }
  }
  useEffect(() => {
    submitRef.current = () => {
      void submit();
    };
  });

  const hint = useCallback(async () => {
    const current = stateRef.current;
    if (!current || current.status !== "playing") return;
    if (current.hintsUsed >= current.config.hintBudget) {
      setState(rejectGuess(current, "No hints remaining for this puzzle."));
      return;
    }
    try {
      if (current.config.remote && current.config.sessionId) {
        const result = await postJson<{ hint: Parameters<typeof applyHint>[1]; error?: string }>(
          `/api/sessions/${current.config.sessionId}/hint`,
          {},
        );
        if (result.error || !result.hint) throw new Error(result.error || "No hint is available.");
        setState(applyHint(current, result.hint));
        return;
      }
      const answer = current.config.answer;
      if (!answer) return;
      const taken = nextHint({
        answer,
        guesses: current.guesses,
        evaluations: current.evaluations,
        revealed: current.revealed,
        eliminated: current.eliminated,
        definitionShown: current.definitionShown,
        categoryHintShown: current.categoryHintShown,
        definition: current.config.clue ?? clueFor(answer),
        categoryText: categoryHintText(current.config.category, CATEGORIES[current.config.category].hint),
      });
      if ("error" in taken) {
        setState(rejectGuess(current, taken.error));
        return;
      }
      setState(applyHint(current, taken.hint));
    } catch (cause) {
      setState(rejectGuess(current, cause instanceof Error ? cause.message : "No hint is available."));
    }
  }, []);

  useEffect(() => {
    if (!state) return;
    saveGame(state);
    if (!state.shake) return;
    const timer = window.setTimeout(() => setState((current) => (current ? clearNotice(current) : current)), 450);
    return () => window.clearTimeout(timer);
  }, [state]);

  const startCustom = useCallback(async (word: string, clue: string | null, maxGuesses: number) => {
    const length = word.length as WordLength;
    const loaded = await loadDictionary(setup.locale, length);
    const game = createGame({
      id: crypto.randomUUID(),
      length,
      difficulty: setup.difficulty,
      category: "random",
      locale: setup.locale,
      mode: "unlimited",
      maxGuesses,
      hintBudget: hintBudgetFor(setup.difficulty, "unlimited", options.hintsEnabled, options.hardHints),
      hintsEnabled: options.hintsEnabled,
      hardMode: false,
      answer: word,
      clue,
      remote: false,
      countdownMs: null,
      custom: true,
    });
    setDictionary(loaded);
    setSetup((current) => ({ ...current, length, mode: "unlimited", category: "random", countdown: false }));
    setState(game);
    saveGame(game);
  }, [options.hardHints, options.hintsEnabled, setup.difficulty, setup.locale]);

  const keyMarks = state
    ? keyboardMarks(state.guesses, state.evaluations, state.revealed, state.eliminated)
    : new Map();

  return {
    setup,
    state,
    stats,
    setStats,
    dictionary,
    loading,
    error,
    now,
    keyMarks,
    wordsForCategory,
    press,
    hint,
    startWith,
    startCustom,
    refreshStats: () => setStats(loadStats()),
  };
}

type RemoteSession = {
  id: string;
  kind: "daily" | "challenge";
  length: WordLength;
  locale: Locale;
  difficulty: Difficulty;
  category: CategoryId;
  clue: string | null;
  custom: boolean;
  hardMode: boolean;
  maxGuesses: number;
  hintBudget: number;
  guesses: string[];
  evaluations: GameState["evaluations"];
  revealed: Array<string | null>;
  eliminated: string[];
  hintsUsed: number;
  status: GameState["status"];
  countdownMs: number | null;
};

type RemoteResult = {
  error?: string;
  marks?: GameState["evaluations"][number];
  status?: GameState["status"];
  answer?: string;
  clue?: string | null;
};

async function postJson<T>(url: string, body: object): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(payload.error || "Request failed.");
  return payload;
}
