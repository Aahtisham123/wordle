export function HintManager({
  remaining,
  notes,
  onHint,
}: {
  remaining: number;
  notes: string[];
  onHint: () => void;
}) {
  return (
    <div>
      <button type="button" className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold" onClick={onHint}>
        Hint ({remaining})
      </button>
      {notes.length ? <p className="mt-2 text-sm text-muted">{notes[notes.length - 1]}</p> : null}
    </div>
  );
}
