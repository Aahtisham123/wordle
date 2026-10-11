import { WORD_LENGTHS, type WordLength } from "@/lib/game/types";
import { cn } from "@/lib/cn";

export function WordLengthSelector({
  value,
  onChange,
}: {
  value: WordLength;
  onChange: (value: WordLength) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Word length</p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Word length">
        {WORD_LENGTHS.map((length) => (
          <button
            key={length}
            type="button"
            role="radio"
            aria-checked={value === length}
            onClick={() => onChange(length)}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl border text-sm font-semibold",
              value === length ? "border-accent bg-accent text-white" : "border-[var(--line)]",
            )}
          >
            {length}
          </button>
        ))}
      </div>
    </div>
  );
}
