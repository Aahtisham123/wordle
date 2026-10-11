import {
  Bird,
  Clapperboard,
  Cpu,
  Drum,
  Flower2,
  Globe2,
  GraduationCap,
  Lamp,
  Leaf,
  Map,
  PawPrint,
  Rocket,
  Shuffle,
  Trophy,
  Utensils,
  Atom,
} from "lucide-react";
import { CATEGORIES, CATEGORY_ORDER, categoryHasLength } from "@/lib/game/categories";
import type { CategoryId, Locale } from "@/lib/game/types";
import { cn } from "@/lib/cn";

const ICONS = {
  random: Shuffle,
  nature: Leaf,
  animals: PawPrint,
  birds: Bird,
  technology: Cpu,
  science: Atom,
  food: Utensils,
  sports: Trophy,
  countries: Globe2,
  geography: Map,
  movies: Clapperboard,
  education: GraduationCap,
  music: Drum,
  space: Rocket,
  plants: Flower2,
  objects: Lamp,
} as const;

export function CategorySelector({
  value,
  length,
  locale,
  disabled,
  onChange,
}: {
  value: CategoryId;
  length: number;
  locale: Locale;
  disabled?: boolean;
  onChange: (value: CategoryId) => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Category</p>
      <div className="flex w-full min-w-0 gap-2 overflow-x-auto pb-1" role="radiogroup" aria-label="Word category">
        {CATEGORY_ORDER.map((id) => {
          const available = !disabled && categoryHasLength(id, length, locale);
          const Icon = ICONS[id];
          const reason = available ? CATEGORIES[id].description : `No ${length}-letter ${CATEGORIES[id].label} answers are available.`;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={value === id}
              disabled={!available}
              title={reason}
              onClick={() => onChange(id)}
              className={cn(
                "flex min-w-28 shrink-0 flex-col items-start gap-2 rounded-2xl border px-3 py-3 text-left text-sm",
                value === id ? "border-accent bg-accent/15" : "border-[var(--line)]",
                !available && "cursor-not-allowed opacity-45",
              )}
            >
              <Icon size={16} aria-hidden="true" />
              <span className="font-semibold">{CATEGORIES[id].label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs leading-5 text-muted">
        {CATEGORIES[value].properNouns
          ? `${CATEGORIES[value].description} Proper nouns are accepted in this theme.`
          : CATEGORIES[value].description}{" "}
        Themes with no words at this length are disabled.
      </p>
    </div>
  );
}
