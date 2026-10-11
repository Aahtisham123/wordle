"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  defaultPreferences,
  loadPreferences,
  savePreferences,
  STORAGE_KEYS,
  type Preferences,
} from "@/lib/game/storage";

type Theme = "light" | "dark";

type PreferencesContextValue = {
  theme: Theme;
  preferences: Preferences;
  ready: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  updatePreferences: (patch: Partial<Preferences>) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);
const THEME_EVENT = "wordle-theme";
const PREFS_EVENT = "wordle-preferences";

function subscribe(eventName: string) {
  return (onStoreChange: () => void) => {
    window.addEventListener(eventName, onStoreChange);
    return () => window.removeEventListener(eventName, onStoreChange);
  };
}

function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

let cachedPreferenceRaw: string | null | undefined;
let cachedPreferences: Preferences = defaultPreferences;

function readPreferences() {
  const raw = window.localStorage.getItem(STORAGE_KEYS.preferences);
  if (raw === cachedPreferenceRaw) return cachedPreferences;
  cachedPreferenceRaw = raw;
  cachedPreferences = loadPreferences();
  return cachedPreferences;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(STORAGE_KEYS.theme, theme);
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(subscribe(THEME_EVENT), readTheme, () => "dark");
  const preferences = useSyncExternalStore(subscribe(PREFS_EVENT), readPreferences, () => defaultPreferences);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.contrast = preferences.highContrast ? "high" : "normal";
    root.dataset.colorblind = preferences.colorblind ? "true" : "false";
    const systemReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.dataset.motion = preferences.animation === "off" || systemReduce ? "reduce" : preferences.animation;
  }, [preferences]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      theme,
      preferences,
      ready: true,
      toggleTheme: () => applyTheme(readTheme() === "dark" ? "light" : "dark"),
      setTheme: applyTheme,
      updatePreferences: (patch) => {
        savePreferences({ ...loadPreferences(), ...patch });
        window.dispatchEvent(new Event(PREFS_EVENT));
      },
    }),
    [preferences, theme],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error("usePreferences must be used within PreferencesProvider");
  return value;
}
