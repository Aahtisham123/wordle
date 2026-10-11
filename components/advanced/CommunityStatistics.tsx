"use client";

type Community = {
  played: number;
  won: number;
  lost: number;
  winRate: number;
  byLength: Record<string, { played: number; won: number }>;
  byDifficulty: Record<string, { played: number; won: number }>;
  days: Array<{ date: string; played: number; won: number }>;
  label: string;
};

export function CommunityStatistics({ data }: { data: Community | null }) {
  if (!data || data.played === 0) {
    return (
      <div className="glass rounded-3xl p-5">
        <h3 className="font-semibold">Community totals</h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          Completed games on this server will show up here. No estimated player counts are shown before that data exists.
        </p>
      </div>
    );
  }
  const popularLength = top(data.byLength);
  const popularDifficulty = top(data.byDifficulty);
  const max = Math.max(1, ...data.days.map((day) => day.played));
  return (
    <div className="glass rounded-3xl p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-muted">{data.label}</p>
      <h3 className="mt-2 font-semibold">Community totals</h3>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <Stat label="Games recorded" value={data.played} />
        <Stat label="Puzzles solved" value={data.won} />
        <Stat label="Win rate" value={`${data.winRate}%`} />
        {popularLength ? <Stat label="Most played length" value={`${popularLength} letters`} /> : null}
        {popularDifficulty ? <Stat label="Most played difficulty" value={popularDifficulty} /> : null}
      </dl>
      {data.days.length ? (
        <div className="mt-5">
          <h4 className="text-sm font-semibold">Recorded play by day</h4>
          <p className="mt-1 text-xs text-muted">Each bar is completed games on that date. The tallest bar is the highest count in this range.</p>
          <div className="mt-3 flex items-end gap-1" aria-label="Games recorded by day">
            {data.days.map((day) => (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t bg-accent" style={{ height: `${Math.max(8, (day.played / max) * 72)}px` }} title={`${day.date}: ${day.played} games`} role="img" aria-label={`${day.date}: ${day.played} games`} />
                <span className="text-[10px] text-muted">{day.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="text-lg font-semibold capitalize">{value}</dd>
    </div>
  );
}

function top(data: Record<string, { played: number }>) {
  const entries = Object.entries(data);
  if (!entries.length) return null;
  return entries.sort((a, b) => b[1].played - a[1].played)[0]?.[0] ?? null;
}
