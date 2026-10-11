"use client";

import { GuessDistributionChart } from "@/components/advanced/GuessDistributionChart";
import { StatisticsExport } from "@/components/advanced/StatisticsExport";
import { averageAttempts, averageWinSeconds, winRate } from "@/lib/game/stats";
import type { PlayerStats } from "@/lib/game/types";

export function StatisticsDashboard({
  stats,
  theme,
  onReset,
}: {
  stats: PlayerStats;
  theme: "light" | "dark";
  onReset: () => void;
}) {
  const cards = [
    ["Played", stats.played],
    ["Won", stats.won],
    ["Lost", stats.lost],
    ["Win rate", `${winRate(stats)}%`],
    ["Streak", stats.currentStreak],
    ["Best streak", stats.bestStreak],
    ["Average attempts", averageAttempts(stats)],
    ["Hints used", stats.hintsUsed],
    ["Fastest win", stats.fastestMs ? `${Math.round(stats.fastestMs / 1000)}s` : "—"],
    ["Average win time", `${averageWinSeconds(stats)}s`],
    ["Perfect games", stats.perfectGames],
    ["Assisted wins", stats.assistedWins],
    ["Unassisted wins", stats.unassistedWins],
  ];
  return (
    <div className="grid gap-5">
      <p className="text-sm text-muted">These statistics are saved on this device. They are not tied to an account.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-[var(--line)] p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="mb-3 font-semibold">Guess distribution</h3>
        <GuessDistributionChart distribution={stats.distribution} />
      </div>
      <Breakdown title="By difficulty" data={stats.byDifficulty} />
      <Breakdown title="By word length" data={stats.byLength} />
      <Breakdown title="By category" data={stats.byCategory} />
      <p className="text-xs text-muted">Practice games are included in the totals. Streaks skip practice games. Assisted wins used at least one hint.</p>
      <StatisticsExport stats={stats} theme={theme} />
      <button type="button" className="w-fit rounded-full border border-red-400/40 px-3 py-2 text-sm text-red-500" onClick={onReset}>
        Reset statistics
      </button>
    </div>
  );
}

function Breakdown({ title, data }: { title: string; data: Record<string, { played: number; won: number }> }) {
  const entries = Object.entries(data).filter(([, value]) => value.played > 0);
  if (!entries.length) return null;
  return (
    <div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <ul className="grid gap-1 text-sm text-muted">
        {entries.map(([key, value]) => (
          <li key={key}>{key}: {value.won}/{value.played}</li>
        ))}
      </ul>
    </div>
  );
}
