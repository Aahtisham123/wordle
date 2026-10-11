import { readCollection, updateCollection } from "@/lib/server/json-store";
import type { CategoryId, Difficulty, GameMode, WordLength } from "@/lib/game/types";

type CommunityFile = {
  played: number;
  won: number;
  lost: number;
  hints: number;
  byLength: Record<string, { played: number; won: number }>;
  byDifficulty: Record<string, { played: number; won: number }>;
  byCategory: Record<string, { played: number; won: number }>;
  days: Record<string, { played: number; won: number }>;
  seen: string[];
};

const FILE = "community.json";

function empty(): CommunityFile {
  return {
    played: 0,
    won: 0,
    lost: 0,
    hints: 0,
    byLength: {},
    byDifficulty: {},
    byCategory: {},
    days: {},
    seen: [],
  };
}

export function readCommunity() {
  const stored = readCollection<CommunityFile>(FILE)[0];
  return stored ?? empty();
}

export function publicCommunity() {
  const data = readCommunity();
  const days = Object.entries(data.days)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-21)
    .map(([date, value]) => ({ date, ...value }));
  return {
    played: data.played,
    won: data.won,
    lost: data.lost,
    hints: data.hints,
    winRate: data.played ? Math.round((data.won / data.played) * 100) : 0,
    byLength: data.byLength,
    byDifficulty: data.byDifficulty,
    byCategory: data.byCategory,
    days,
    label: "Recorded on this server",
  };
}

export async function recordCommunityEvent(input: {
  id: string;
  won: boolean;
  difficulty: Difficulty;
  length: WordLength;
  category: CategoryId;
  mode: GameMode;
  hints: number;
  attempts: number;
  durationMs: number;
}) {
  if (!/^[a-zA-Z0-9_-]{8,80}$/.test(input.id)) {
    throw new Error("Invalid game id.");
  }
  if (input.attempts < 0 || input.attempts > 8) throw new Error("Invalid attempt count.");
  if (input.hints < 0 || input.hints > 3) throw new Error("Invalid hint count.");
  if (input.durationMs < 0 || input.durationMs > 1000 * 60 * 60 * 2) {
    throw new Error("Invalid duration.");
  }

  let inserted = false;
  await updateCollection<CommunityFile>(FILE, (items) => {
    const current = items[0] ?? empty();
    if (current.seen.includes(input.id)) return [current];
    inserted = true;
    const bump = (map: Record<string, { played: number; won: number }>, key: string) => {
      const bucket = map[key] ?? { played: 0, won: 0 };
      map[key] = { played: bucket.played + 1, won: bucket.won + (input.won ? 1 : 0) };
    };
    bump(current.byLength, String(input.length));
    bump(current.byDifficulty, input.difficulty);
    bump(current.byCategory, input.category);
    const day = new Date().toISOString().slice(0, 10);
    bump(current.days, day);
    current.played += 1;
    current.hints += input.hints;
    if (input.won) current.won += 1;
    else current.lost += 1;
    current.seen = [...current.seen, input.id].slice(-5000);
    return [current];
  });
  return inserted;
}
