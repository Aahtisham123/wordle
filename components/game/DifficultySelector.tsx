import { difficultySummary } from "@/lib/game/rules";
import type { Difficulty } from "@/lib/game/types";
import { cn } from "@/lib/cn";

const OPTIONS: Difficulty[] = ["easy", "medium", "hard"];

export function DifficultySelector({
  value,
  onChange,
}: {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Difficulty</p>
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Difficulty">
        {OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={value === option}
            title={difficultySummary(option)}
            onClick={() => onChange(option)}
            className={cn(
              "rounded-2xl border px-2 py-2 text-sm font-semibold capitalize",
              value === option ? "border-accent bg-accent text-white" : "border-[var(--line)]",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
