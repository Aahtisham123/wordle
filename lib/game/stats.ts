import type {
  Difficulty,
  GameResult,
  ModeCount,
  PlayerStats,
} from "@/lib/game/types";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

function blankCount(): ModeCount {
  return { played: 0, won: 0 };
}

export function emptyStats(): PlayerStats {
  const byDifficulty = {
    easy: blankCount(),
    medium: blankCount(),
    hard: blankCount(),
  };
  return {
    version: 1,
    played: 0,
    won: 0,
    lost: 0,
    assistedWins: 0,
    unassistedWins: 0,
    currentStreak: 0,
    bestStreak: 0,
    guessTotals: 0,
    winsForAverage: 0,
    distribution: Array.from({ length: 9 }, () => 0),
    hintsUsed: 0,
    fastestMs: null,
    totalWinMs: 0,
    practicePlayed: 0,
    practiceWon: 0,
    perfectGames: 0,
    byDifficulty,
    byLength: {},
    byCategory: {},
    recordedIds: [],
  };
}

function bump(map: Record<string, ModeCount>, key: string, won: boolean) {
  const current = map[key] ?? blankCount();
  map[key] = {
    played: current.played + 1,
    won: current.won + (won ? 1 : 0),
  };
}

export function recordGame(stats: PlayerStats, result: GameResult): PlayerStats {
  if (stats.recordedIds.includes(result.id)) return stats;
  const next: PlayerStats = {
    ...stats,
    byDifficulty: {
      easy: { ...stats.byDifficulty.easy },
      medium: { ...stats.byDifficulty.medium },
      hard: { ...stats.byDifficulty.hard },
    },
    byLength: { ...stats.byLength },
    byCategory: { ...stats.byCategory },
    distribution: stats.distribution.slice(),
    recordedIds: [...stats.recordedIds, result.id].slice(-200),
  };

  next.played += 1;
  next.hintsUsed += result.hintsUsed;
  bump(next.byLength, String(result.length), result.won);
  bump(next.byCategory, result.category, result.won);
  if (DIFFICULTIES.includes(result.difficulty)) {
    const bucket = next.byDifficulty[result.difficulty];
    next.byDifficulty[result.difficulty] = {
      played: bucket.played + 1,
      won: bucket.won + (result.won ? 1 : 0),
    };
  }

  if (result.mode === "practice") {
    next.practicePlayed += 1;
    if (result.won) next.practiceWon += 1;
  }

  if (result.won) {
    next.won += 1;
    if (result.hintsUsed > 0) next.assistedWins += 1;
    else next.unassistedWins += 1;
    next.guessTotals += result.attempts;
    next.winsForAverage += 1;
    const bucket = Math.min(result.attempts, 8);
    next.distribution[bucket] += 1;
    next.totalWinMs += result.durationMs;
    if (next.fastestMs === null || result.durationMs < next.fastestMs) {
      next.fastestMs = result.durationMs;
    }
    if (result.perfect) next.perfectGames += 1;
    if (result.mode !== "practice") {
      next.currentStreak += 1;
      next.bestStreak = Math.max(next.bestStreak, next.currentStreak);
    }
  } else {
    next.lost += 1;
    if (result.mode !== "practice") next.currentStreak = 0;
  }

  return next;
}

export function winRate(stats: PlayerStats) {
  if (stats.played === 0) return 0;
  return Math.round((stats.won / stats.played) * 100);
}

export function averageAttempts(stats: PlayerStats) {
  if (stats.winsForAverage === 0) return 0;
  return Math.round((stats.guessTotals / stats.winsForAverage) * 10) / 10;
}

export function averageWinSeconds(stats: PlayerStats) {
  if (stats.won === 0) return 0;
  return Math.round(stats.totalWinMs / stats.won / 1000);
}

export function perfectGameCount(stats: PlayerStats) {
  return stats.perfectGames;
}

export function statsSummary(stats: PlayerStats) {
  return [
    "Wordle Unlimited",
    `Played ${stats.played} · Won ${stats.won} · Lost ${stats.lost}`,
    `Win rate ${winRate(stats)}% · Streak ${stats.currentStreak} · Best ${stats.bestStreak}`,
    `Average attempts ${averageAttempts(stats)} · Hints used ${stats.hintsUsed}`,
    `Unassisted wins ${stats.unassistedWins} · Assisted wins ${stats.assistedWins}`,
    "Saved on this device.",
  ].join("\n");
}

export function isPlayerStats(value: unknown): value is PlayerStats {
  if (!value || typeof value !== "object") return false;
  const stats = value as PlayerStats;
  return stats.version === 1 && typeof stats.played === "number" && Array.isArray(stats.distribution);
}
