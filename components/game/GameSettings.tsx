"use client";

import { DifficultySelector } from "@/components/game/DifficultySelector";
import { WordLengthSelector } from "@/components/game/WordLengthSelector";
import { CategorySelector } from "@/components/game/CategorySelector";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import type { Setup } from "@/components/game/useWordleGame";
import type { GameMode } from "@/lib/game/types";

const MODES: Array<{ id: GameMode; label: string }> = [
  { id: "unlimited", label: "Unlimited" },
  { id: "daily", label: "Daily" },
  { id: "practice", label: "Practice" },
  { id: "timed", label: "Stopwatch" },
  { id: "countdown", label: "Countdown" },
];

export function GameSettings({
  open,
  setup,
  onClose,
  onSetup,
  onReset,
  onClearStats,
  onFullscreen,
}: {
  open: boolean;
  setup: Setup;
  onClose: () => void;
  onSetup: (patch: Partial<Setup>) => void;
  onReset: () => void;
  onClearStats: () => void;
  onFullscreen: () => void;
}) {
  const { theme, setTheme, preferences, updatePreferences } = usePreferences();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button type="button" className="absolute inset-0 bg-slate-950/50" aria-label="Close settings" onClick={onClose} />
      <aside role="dialog" aria-modal="true" aria-labelledby="settings-title" className="glass absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto p-5">
        <div className="flex items-center justify-between">
          <h2 id="settings-title" className="display text-2xl font-semibold">Settings</h2>
          <button type="button" className="rounded-full border border-[var(--line)] px-3 py-2 text-sm" onClick={onClose}>Close</button>
        </div>
        <section className="mt-6">
          <h3 className="text-sm font-semibold">Applies immediately</h3>
          <div className="mt-3 grid gap-3 text-sm">
            <Toggle label="Sound effects" checked={preferences.sound} onChange={(sound) => updatePreferences({ sound })} />
            <Toggle label="High contrast" checked={preferences.highContrast} onChange={(highContrast) => updatePreferences({ highContrast })} />
            <Toggle label="Colorblind-friendly tiles" checked={preferences.colorblind} onChange={(colorblind) => updatePreferences({ colorblind })} />
            <Toggle label="Keyboard vibration" checked={preferences.vibration} onChange={(vibration) => updatePreferences({ vibration })} />
            <Toggle label="Hints" checked={preferences.hintsEnabled} onChange={(hintsEnabled) => updatePreferences({ hintsEnabled })} />
            <Toggle label="Hard mode hint" checked={preferences.hardHints} onChange={(hardHints) => updatePreferences({ hardHints })} />
            <label className="grid gap-1">
              Animation
              <select className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-3" value={preferences.animation} onChange={(event) => updatePreferences({ animation: event.target.value as "full" | "subtle" | "off" })}>
                <option value="full">Full</option>
                <option value="subtle">Subtle</option>
                <option value="off">Off</option>
              </select>
            </label>
            <p className="text-xs leading-5 text-muted">If your system asks for reduced motion, animations stay off even when this is set to full.</p>
            <div className="flex gap-2">
              <button type="button" className="rounded-full border border-[var(--line)] px-3 py-2" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Theme: {theme}</button>
              <button type="button" className="rounded-full border border-[var(--line)] px-3 py-2" onClick={onFullscreen}>Fullscreen</button>
            </div>
          </div>
        </section>
        <section className="mt-8 grid gap-5">
          <h3 className="text-sm font-semibold">Starts a new puzzle</h3>
          <p className="text-xs leading-5 text-muted">Difficulty, length, category, language, and mode begin a new puzzle. If the current one is unfinished, you will be asked to confirm. Hard mode uses less common words, six guesses, at most one hint, and requires later guesses to keep revealed positions and letter counts.</p>
          <DifficultySelector value={setup.difficulty} onChange={(difficulty) => onSetup({ difficulty })} />
          <WordLengthSelector value={setup.length} onChange={(length) => onSetup({ length })} />
          <CategorySelector value={setup.category} length={setup.length} locale={setup.locale} disabled={setup.mode === "daily"} onChange={(category) => onSetup({ category })} />
          <label className="grid gap-1 text-sm">
            Language
            <select className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-3" value={setup.locale} onChange={(event) => onSetup({ locale: event.target.value === "uk" ? "uk" : "us" })}>
              <option value="us">US English</option>
              <option value="uk">UK English</option>
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            {MODES.map((mode) => (
              <button key={mode.id} type="button" className="rounded-full border border-[var(--line)] px-3 py-2 text-sm" onClick={() => onSetup({ mode: mode.id, countdown: mode.id === "countdown", category: mode.id === "daily" ? "random" : setup.category })}>
                {mode.label}
              </button>
            ))}
          </div>
          <button type="button" className="rounded-full border border-[var(--line)] px-3 py-2 text-sm" onClick={onReset}>Reset current puzzle</button>
          <button type="button" className="rounded-full border border-red-400/40 px-3 py-2 text-sm text-red-500" onClick={onClearStats}>Clear saved statistics</button>
        </section>
      </aside>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
