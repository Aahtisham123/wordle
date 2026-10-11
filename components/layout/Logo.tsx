import Link from "next/link";
import { cn } from "@/lib/cn";

const TILES = [
  { letter: "W", className: "bg-[var(--tile-correct)] text-[var(--tile-correct-text)]" },
  { letter: "U", className: "bg-[var(--tile-present)] text-[var(--tile-present-text)]" },
  { letter: "", className: "bg-accent/80 text-white" },
  { letter: "", className: "border border-[var(--line)]" },
  { letter: "L", className: "bg-accent text-white" },
  { letter: "", className: "bg-accent-2/80 text-slate-950" },
  { letter: "", className: "border border-[var(--line)]" },
  { letter: "", className: "bg-[var(--tile-absent)] text-[var(--tile-absent-text)]" },
  { letter: "", className: "border border-[var(--line)]" },
];

export function Logo({ compact = false, href = "/" }: { compact?: boolean; href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 rounded-xl">
      <span className="grid grid-cols-3 gap-0.5" aria-hidden="true">
        {TILES.map((tile, index) => (
          <span
            key={index}
            className={cn(
              "grid h-2.5 w-2.5 place-items-center rounded-[3px] text-[6px] font-bold leading-none",
              tile.className,
            )}
          >
            {tile.letter}
          </span>
        ))}
      </span>
      <span className={cn("display font-semibold tracking-tight", compact ? "text-base" : "text-lg")}>
        Wordle Unlimited
      </span>
    </Link>
  );
}
