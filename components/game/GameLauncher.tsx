"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { GameExperience } from "@/components/game/GameExperience";
import { CATEGORIES } from "@/lib/game/categories";
import { WORD_LENGTHS, type CategoryId, type Difficulty, type GameMode, type WordLength } from "@/lib/game/types";
import type { Setup } from "@/components/game/useWordleGame";

const MODES = new Set<GameMode>(["unlimited", "daily", "practice", "timed", "countdown"]);
const DIFFICULTIES = new Set<Difficulty>(["easy", "medium", "hard"]);

export function GameLauncher({ challengeId }: { challengeId?: string }) {
  const params = useSearchParams();
  const preset = useMemo(() => {
    const next: Partial<Setup> = {};
    const difficulty = params.get("difficulty");
    const mode = params.get("mode");
    const category = params.get("category");
    const length = Number(params.get("length"));
    if (difficulty && DIFFICULTIES.has(difficulty as Difficulty)) next.difficulty = difficulty as Difficulty;
    if (mode && MODES.has(mode as GameMode)) next.mode = mode as GameMode;
    if (WORD_LENGTHS.includes(length as WordLength)) next.length = length as WordLength;
    if (category && category in CATEGORIES) next.category = category as CategoryId;
    return next;
  }, [params]);

  return <GameExperience preset={preset} challengeId={challengeId} openCustom={params.get("mode") === "custom"} />;
}
