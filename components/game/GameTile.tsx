import { cn } from "@/lib/cn";
import type { TileMark } from "@/lib/game/types";

const SYMBOL: Record<TileMark, string> = {
  correct: "●",
  present: "◐",
  absent: "○",
};

const LABEL: Record<TileMark, string> = {
  correct: "correct position",
  present: "in the word, wrong position",
  absent: "not available",
};

export function GameTile({
  letter,
  mark,
  delay = 0,
  pop = false,
  small = false,
}: {
  letter?: string;
  mark?: TileMark | null;
  delay?: number;
  pop?: boolean;
  small?: boolean;
}) {
  const label = letter
    ? `${letter.toUpperCase()}${mark ? `, ${LABEL[mark]}` : ""}`
    : "Empty";
  return (
    <div
      className={cn(
        "tile",
        small ? "text-sm" : "text-[clamp(0.85rem,2.6vw,1.7rem)]",
        letter && "tile-filled",
        pop && "tile-pop",
        mark && "tile-flip",
        mark && `tile-${mark}`,
      )}
      style={mark ? { animationDelay: `${delay}ms` } : undefined}
      aria-label={label}
      role="img"
    >
      <span aria-hidden="true">{letter?.toUpperCase()}</span>
      {mark ? (
        <span className="tile-mark" aria-hidden="true">
          {SYMBOL[mark]}
        </span>
      ) : null}
    </div>
  );
}
