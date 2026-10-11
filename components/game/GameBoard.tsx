import { GameRow } from "@/components/game/GameRow";
import type { GameState } from "@/lib/game/types";

export function GameBoard({ state }: { state: GameState }) {
  return (
    <div
      className="mx-auto grid w-full gap-1.5"
      style={{ maxWidth: `${Math.min(state.config.length * 68, 680)}px` }}
      aria-label="Guesses"
    >
      {Array.from({ length: state.config.maxGuesses }, (_, index) => {
        const played = state.guesses[index];
        const letters = played
          ? played.split("")
          : index === state.guesses.length
            ? state.slots
            : Array.from({ length: state.config.length }, () => null);
        return (
          <GameRow
            key={index}
            letters={letters}
            marks={state.evaluations[index]}
            shake={Boolean(state.shake && index === state.guesses.length)}
            bounce={state.status === "won" && index === state.guesses.length - 1}
          />
        );
      })}
    </div>
  );
}
