"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BarChart3, CircleHelp, Maximize, Minimize, Settings } from "lucide-react";
import { CategorySelector } from "@/components/game/CategorySelector";
import { CompletionModal } from "@/components/game/CompletionModal";
import { DailyChallenge } from "@/components/game/DailyChallenge";
import { DifficultySelector } from "@/components/game/DifficultySelector";
import { useFullscreen } from "@/components/game/FullscreenGame";
import { GameBoard } from "@/components/game/GameBoard";
import { GameKeyboard } from "@/components/game/GameKeyboard";
import { GameSettings } from "@/components/game/GameSettings";
import { GameStatus } from "@/components/game/GameStatus";
import { GameToolbar } from "@/components/game/GameToolbar";
import { HintManager } from "@/components/game/HintManager";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { WordLengthSelector } from "@/components/game/WordLengthSelector";
import { useWordleGame, type Setup } from "@/components/game/useWordleGame";
import { ChallengeFriendModal } from "@/components/advanced/ChallengeFriendModal";
import { CustomWordCreator } from "@/components/advanced/CustomWordCreator";
import { StatisticsDashboard } from "@/components/advanced/StatisticsDashboard";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Dialog } from "@/components/ui/Dialog";
import { copyText, shareText } from "@/lib/game/share";
import { emptyStats } from "@/lib/game/stats";
import { saveStats } from "@/lib/game/storage";
import { cn } from "@/lib/cn";
import type { GameMode } from "@/lib/game/types";

const MODES: Array<{ id: GameMode; label: string }> = [
  { id: "unlimited", label: "Unlimited" },
  { id: "daily", label: "Daily" },
  { id: "practice", label: "Practice" },
  { id: "timed", label: "Stopwatch" },
  { id: "countdown", label: "Countdown" },
];

export function GameExperience({
  preset,
  challengeId,
  openCustom = false,
}: {
  preset?: Partial<Setup>;
  challengeId?: string;
  openCustom?: boolean;
}) {
  const { theme, preferences, toggleTheme } = usePreferences();
  const stablePreset = useMemo(() => preset, [preset]);
  const game = useWordleGame({
    preset: stablePreset,
    challengeId,
    sound: preferences.sound,
    vibration: preferences.vibration,
    hintsEnabled: preferences.hintsEnabled,
    hardHints: preferences.hardHints,
  });
  const shellRef = useRef<HTMLDivElement>(null);
  const fullscreen = useFullscreen(shellRef);
  const [settings, setSettings] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [help, setHelp] = useState(false);
  const [challenge, setChallenge] = useState(false);
  const [customOpen, setCustomOpen] = useState(openCustom);
  const [pending, setPending] = useState<Setup | null>(null);
  const [hiddenResult, setHiddenResult] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const showResult = Boolean(
    game.state && game.state.status !== "playing" && hiddenResult !== game.state.config.id,
  );
  const dialogOpen = settings || statsOpen || help || challenge || customOpen || Boolean(pending) || showResult;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable)) return;
      if (dialogOpen) return;
      const key = event.key.toLowerCase();
      if (event.altKey && key === "n") {
        event.preventDefault();
        requestSetup(game.setup);
        return;
      }
      if (event.altKey && key === "h") {
        event.preventDefault();
        void game.hint();
        return;
      }
      if (event.altKey && key === "s") {
        event.preventDefault();
        setSettings(true);
        return;
      }
      if (event.altKey && key === "t") {
        event.preventDefault();
        setStatsOpen(true);
        return;
      }
      if (event.altKey && key === "f") {
        event.preventDefault();
        void fullscreen.toggle();
        return;
      }
      if (event.altKey && key === "m") {
        event.preventDefault();
        toggleTheme();
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (key === "enter" || key === "backspace" || /^[a-z]$/.test(key)) {
        event.preventDefault();
        game.press(key === "backspace" ? "backspace" : key);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function requestSetup(next: Setup) {
    if (game.state?.status === "playing" && game.state.guesses.length > 0) {
      setPending(next);
      return;
    }
    void game.startWith(next);
  }

  function patchSetup(patch: Partial<Setup>) {
    const next = { ...game.setup, ...patch };
    if (next.mode === "daily") next.category = "random";
    requestSetup(next);
  }

  async function share() {
    if (!game.state) return;
    try {
      await copyText(shareText(game.state));
      setNotice("Result copied.");
    } catch {
      setNotice("Could not copy the result.");
    }
  }

  return (
    <div ref={shellRef} className={cn("game-shell", fullscreen.fallback && "is-immersive")}>
      <div className="site-container py-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Logo compact />
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/" className="rounded-full border border-[var(--line)] px-3 py-2 text-sm">Back to Home</Link>
            <IconButton label="Game settings" onClick={() => setSettings(true)}><Settings size={18} /></IconButton>
            <IconButton label="Statistics" onClick={() => setStatsOpen(true)}><BarChart3 size={18} /></IconButton>
            <IconButton label="Help" onClick={() => setHelp(true)}><CircleHelp size={18} /></IconButton>
            <ThemeToggle />
            <IconButton label={fullscreen.active ? "Exit fullscreen" : "Enter fullscreen"} onClick={() => void fullscreen.toggle()}>
              {fullscreen.active ? <Minimize size={18} /> : <Maximize size={18} />}
            </IconButton>
          </div>
        </div>
        <div className="glass min-w-0 rounded-[2rem] p-3 sm:p-6">
          {game.loading && !game.state ? <p className="py-16 text-center">Preparing the word list…</p> : null}
          {game.error ? <p className="mb-4 text-sm text-red-500">{game.error}</p> : null}
          {game.state ? (
            <div className="grid min-w-0 gap-4">
              <div className="grid min-w-0 gap-4">
                <DifficultySelector value={game.setup.difficulty} onChange={(difficulty) => patchSetup({ difficulty })} />
                <WordLengthSelector value={game.setup.length} onChange={(length) => patchSetup({ length })} />
                <CategorySelector value={game.setup.category} length={game.setup.length} locale={game.setup.locale} disabled={game.setup.mode === "daily"} onChange={(category) => patchSetup({ category })} />
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Game mode">
                  {MODES.map((mode) => (
                    <button key={mode.id} type="button" className={cn("rounded-full border px-3 py-2 text-sm", game.setup.mode === mode.id ? "border-accent bg-accent text-white" : "border-[var(--line)]")} onClick={() => patchSetup({ mode: mode.id, countdown: mode.id === "countdown" })}>
                      {mode.label}
                    </button>
                  ))}
                  <button type="button" className="rounded-full border border-[var(--line)] px-3 py-2 text-sm" onClick={() => setCustomOpen(true)}>Custom word</button>
                </div>
              </div>
              <DailyChallenge active={game.setup.mode === "daily"} />
              <GameStatus state={game.state} now={game.now} />
              <GameBoard state={game.state} />
              <GameKeyboard marks={game.keyMarks} onKey={game.press} />
              <div className="flex flex-wrap items-center justify-center gap-3">
                <HintManager remaining={Math.max(game.state.config.hintBudget - game.state.hintsUsed, 0)} notes={game.state.hintNotes} onHint={() => void game.hint()} />
                <GameToolbar
                  onNew={() => requestSetup(game.setup)}
                  onShare={() => void share()}
                  onChallenge={() => setChallenge(true)}
                  onStats={() => setStatsOpen(true)}
                />
              </div>
              {notice ? <p className="text-center text-sm text-muted">{notice}</p> : null}
              {fullscreen.active ? (
                <button type="button" className="mx-auto rounded-full border border-[var(--line)] px-4 py-2 text-sm" onClick={() => void fullscreen.toggle()}>Exit fullscreen</button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <GameSettings
        open={settings}
        setup={game.setup}
        onClose={() => setSettings(false)}
        onSetup={patchSetup}
        onReset={() => requestSetup(game.setup)}
        onClearStats={() => {
          saveStats(emptyStats());
          game.refreshStats();
        }}
        onFullscreen={() => void fullscreen.toggle()}
      />
      <Dialog open={statsOpen} title="Statistics" description="Saved on this device." onClose={() => setStatsOpen(false)} wide>
        <StatisticsDashboard stats={game.stats} theme={theme} onReset={() => { saveStats(emptyStats()); game.refreshStats(); }} />
      </Dialog>
      <Dialog open={help} title="Help and shortcuts" onClose={() => setHelp(false)}>
        <div className="grid gap-3 text-sm leading-6 text-muted">
          <p>Green means the right letter and position. Yellow means the letter is in the word in another position. Gray means that copy of the letter is not available. Symbols repeat the same clue.</p>
          <p>Easy gives 8 guesses and 3 hints. Medium gives 6 guesses and 2 hints. Hard gives 6 guesses, at most 1 hint, harder words, and must reuse confirmed letters and positions.</p>
          <ul className="list-disc pl-5">
            <li>Letters, Enter, and Backspace play the puzzle</li>
            <li>Alt+N new game</li>
            <li>Alt+H hint</li>
            <li>Alt+S settings</li>
            <li>Alt+T statistics</li>
            <li>Alt+F fullscreen</li>
            <li>Alt+M theme</li>
            <li>Escape closes a dialog</li>
          </ul>
        </div>
      </Dialog>
      <Dialog open={challenge} title="Challenge a friend" onClose={() => setChallenge(false)}>
        <ChallengeFriendModal setup={game.setup} answer={game.state?.config.answer ?? null} sessionId={game.state?.config.sessionId} />
      </Dialog>
      <Dialog open={customOpen} title="Create a custom word" onClose={() => setCustomOpen(false)}>
        <CustomWordCreator locale={game.setup.locale} difficulty={game.setup.difficulty} onPlay={(word, clue, maxGuesses) => { void game.startCustom(word, clue, maxGuesses); setCustomOpen(false); }} />
      </Dialog>
      <Dialog open={Boolean(pending)} title="Start a new puzzle?" description="The current puzzle is unfinished. It will not be counted as a loss." onClose={() => setPending(null)}>
        <div className="flex gap-2">
          <button type="button" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white" onClick={() => { if (pending) void game.startWith(pending); setPending(null); }}>Start new puzzle</button>
          <button type="button" className="rounded-full border border-[var(--line)] px-4 py-2 text-sm" onClick={() => setPending(null)}>Keep playing</button>
        </div>
      </Dialog>
      <CompletionModal state={showResult ? game.state : null} theme={theme} onClose={() => setHiddenResult(game.state?.config.id ?? null)} onAgain={() => { setHiddenResult(game.state?.config.id ?? null); void game.startWith(game.setup); }} onStats={() => { setHiddenResult(game.state?.config.id ?? null); setStatsOpen(true); }} />
    </div>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)]" onClick={onClick}>
      {children}
    </button>
  );
}
