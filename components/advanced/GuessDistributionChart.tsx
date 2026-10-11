export function GuessDistributionChart({ distribution }: { distribution: number[] }) {
  const max = Math.max(1, ...distribution.slice(1));
  return (
    <div className="grid gap-2" aria-label="Guess distribution">
      {distribution.slice(1).map((count, index) => (
        <div key={index} className="grid grid-cols-[1.5rem_1fr_2rem] items-center gap-2 text-sm">
          <span>{index + 1}</span>
          <div className="h-6 overflow-hidden rounded-lg bg-white/10">
            <div className="h-full rounded-lg bg-accent" style={{ width: `${Math.max(count ? 8 : 0, (count / max) * 100)}%` }} />
          </div>
          <span className="text-right">{count}</span>
        </div>
      ))}
    </div>
  );
}
