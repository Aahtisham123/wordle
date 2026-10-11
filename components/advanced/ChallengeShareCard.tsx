"use client";

import { resultCard } from "@/components/advanced/StatisticsExport";
import { shareText } from "@/lib/game/share";
import type { GameState } from "@/lib/game/types";

export function ChallengeShareCard({
  state,
  theme,
}: {
  state: GameState;
  theme: "light" | "dark";
}) {
  const text = shareText(state);
  return (
    <button type="button" className="rounded-full border border-[var(--line)] px-3 py-2 text-sm" onClick={() => resultCard(text.split("\n"), theme)}>
      Download result card
    </button>
  );
}
