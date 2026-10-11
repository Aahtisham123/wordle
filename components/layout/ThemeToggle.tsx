"use client";

import { Moon, Sun } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = usePreferences();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] bg-[var(--card)]"
      aria-label={`Switch to ${next} theme`}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
