"use client";

import { Delete } from "lucide-react";
import { KEYBOARD_ROWS } from "@/lib/game/keyboard";
import type { TileMark } from "@/lib/game/types";
import { cn } from "@/lib/cn";

export function GameKeyboard({
  marks,
  onKey,
}: {
  marks: Map<string, TileMark>;
  onKey: (key: string) => void;
}) {
  return (
    <div className="grid min-w-0 gap-1.5" role="group" aria-label="Keyboard">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={row} className="flex min-w-0 justify-center gap-1">
          {rowIndex === 2 ? (
            <Key label="Enter" wide onClick={() => onKey("enter")} />
          ) : null}
          {row.split("").map((letter) => {
            const mark = marks.get(letter);
            return (
              <Key
                key={letter}
                label={letter}
                mark={mark}
                onClick={() => onKey(letter)}
              />
            );
          })}
          {rowIndex === 2 ? (
            <Key label="Delete" wide onClick={() => onKey("backspace")}>
              <Delete size={16} aria-hidden="true" />
              <span className="sr-only">Delete</span>
            </Key>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function Key({
  label,
  onClick,
  mark,
  wide = false,
  children,
}: {
  label: string;
  onClick: () => void;
  mark?: TileMark;
  wide?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(
        "keycap min-w-0 flex-1 px-0.5 text-xs sm:px-1 sm:text-sm",
        wide && "max-w-20 flex-[1.4]",
        mark && `keycap-${mark}`,
      )}
      onClick={onClick}
      aria-label={mark ? `${label}, ${mark}` : label}
    >
      {children ?? label}
    </button>
  );
}
