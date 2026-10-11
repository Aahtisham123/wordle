"use client";

import { averageAttempts, averageWinSeconds, statsSummary, winRate } from "@/lib/game/stats";
import type { PlayerStats } from "@/lib/game/types";
import { copyText } from "@/lib/game/share";

export function StatisticsExport({ stats, theme }: { stats: PlayerStats; theme: "light" | "dark" }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className="rounded-full border border-[var(--line)] px-3 py-2 text-sm" onClick={() => downloadCanvas(stats, theme)}>Download PNG</button>
      <button type="button" className="rounded-full border border-[var(--line)] px-3 py-2 text-sm" onClick={() => downloadJson(stats)}>Export JSON</button>
      <button type="button" className="rounded-full border border-[var(--line)] px-3 py-2 text-sm" onClick={() => void copyText(statsSummary(stats))}>Copy summary</button>
    </div>
  );
}

function downloadJson(stats: PlayerStats) {
  const blob = new Blob([JSON.stringify(stats, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "wordle-unlimited-stats.json";
  link.click();
  URL.revokeObjectURL(url);
}

function downloadCanvas(stats: PlayerStats, theme: "light" | "dark") {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 760;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dark = theme === "dark";
  const gradient = ctx.createLinearGradient(0, 0, 1200, 760);
  gradient.addColorStop(0, dark ? "#080D1B" : "#F8FAFC");
  gradient.addColorStop(1, dark ? "#312e81" : "#ddd6fe");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 760);
  ctx.fillStyle = dark ? "#F8FAFC" : "#0F172A";
  ctx.font = "700 54px sans-serif";
  ctx.fillText("Wordle Unlimited", 72, 120);
  ctx.font = "400 28px sans-serif";
  ctx.fillStyle = dark ? "#CBD5E1" : "#475569";
  const lines = [
    `Played ${stats.played}    Won ${stats.won}    Win rate ${winRate(stats)}%`,
    `Streak ${stats.currentStreak}    Best ${stats.bestStreak}`,
    `Average attempts ${averageAttempts(stats)}    Average win ${averageWinSeconds(stats)}s`,
    `Unassisted wins ${stats.unassistedWins}    Assisted wins ${stats.assistedWins}`,
    `Hints used ${stats.hintsUsed}    Perfect games ${stats.perfectGames}`,
    "Saved on this device",
  ];
  lines.forEach((line, index) => ctx.fillText(line, 72, 220 + index * 64));
  const url = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = url;
  link.download = "wordle-unlimited-stats.png";
  link.click();
}

export function resultCard(lines: string[], theme: "light" | "dark") {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 280 + lines.length * 42;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = theme === "dark" ? "#080D1B" : "#F8FAFC";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = theme === "dark" ? "#F8FAFC" : "#0F172A";
  ctx.font = "700 36px sans-serif";
  lines.forEach((line, index) => {
    ctx.font = index === 0 ? "700 36px sans-serif" : "400 24px sans-serif";
    ctx.fillText(line, 48, 80 + index * 42);
  });
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "wordle-unlimited-result.png";
  link.click();
}
