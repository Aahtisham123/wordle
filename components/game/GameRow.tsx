import { GameTile } from "@/components/game/GameTile";
import { cn } from "@/lib/cn";
import type { TileMark } from "@/lib/game/types";

export function GameRow({
  letters,
  marks,
  shake = false,
  bounce = false,
}: {
  letters: Array<string | null>;
  marks?: TileMark[] | null;
  shake?: boolean;
  bounce?: boolean;
}) {
  return (
    <div
      className={cn("grid gap-1 sm:gap-1.5", shake && "row-shake", bounce && "win-grid")}
      style={{ gridTemplateColumns: `repeat(${letters.length}, minmax(0, 1fr))` }}
    >
      {letters.map((letter, index) => (
        <GameTile
          key={index}
          letter={letter ?? ""}
          mark={marks?.[index]}
          delay={index * 90}
          pop={Boolean(letter) && !marks}
        />
      ))}
    </div>
  );
}
