import { emptyStats, isPlayerStats } from "@/lib/game/stats";
import type { GameState, Locale, PlayerStats } from "@/lib/game/types";

export const STORAGE_KEYS = {
  stats: "wordle-unlimited-stats",
  game: "wordle-unlimited-game",
  preferences: "wordle-unlimited-preferences",
  theme: "wordle-unlimited-theme",
  daily: "wordle-unlimited-daily",
} as const;

export type Preferences = {
  sound: boolean;
  highContrast: boolean;
  colorblind: boolean;
  vibration: boolean;
  locale: Locale;
  animation: "full" | "subtle" | "off";
  hintsEnabled: boolean;
  hardHints: boolean;
};

export const defaultPreferences: Preferences = {
  sound: true,
  highContrast: false,
  colorblind: false,
  vibration: false,
  locale: "us",
  animation: "full",
  hintsEnabled: true,
  hardHints: true,
};

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadStats(): PlayerStats {
  const stored = readJson<PlayerStats>(STORAGE_KEYS.stats);
  if (!stored || !isPlayerStats(stored)) return emptyStats();
  return { ...emptyStats(), ...stored, byDifficulty: { ...emptyStats().byDifficulty, ...stored.byDifficulty } };
}

export function saveStats(stats: PlayerStats) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(stats));
  window.dispatchEvent(new Event("wordle-stats"));
}

export function loadSavedGame() {
  const stored = readJson<{ version: 1; state: GameState }>(STORAGE_KEYS.game);
  if (!stored || stored.version !== 1 || !stored.state?.config) return null;
  return stored.state;
}

export function saveGame(state: GameState | null) {
  if (typeof window === "undefined") return;
  if (!state || state.status !== "playing") {
    window.localStorage.removeItem(STORAGE_KEYS.game);
    return;
  }
  window.localStorage.setItem(
    STORAGE_KEYS.game,
    JSON.stringify({ version: 1, state }),
  );
}

export function loadPreferences(): Preferences {
  const stored = readJson<Partial<Preferences>>(STORAGE_KEYS.preferences);
  return { ...defaultPreferences, ...stored };
}

export function savePreferences(preferences: Preferences) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(preferences));
}

export function loadDailyCompletions() {
  return readJson<Record<string, { won: boolean; attempts: number }>>(STORAGE_KEYS.daily) ?? {};
}

export function saveDailyCompletion(key: string, value: { won: boolean; attempts: number }) {
  if (typeof window === "undefined") return;
  const all = loadDailyCompletions();
  all[key] = value;
  window.localStorage.setItem(STORAGE_KEYS.daily, JSON.stringify(all));
}
