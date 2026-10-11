export function DailyChallenge({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <p className="rounded-2xl border border-[var(--line)] px-3 py-2 text-sm text-muted">
      Daily puzzle for this word length and language. Everyone gets the same answer until 00:00 UTC. Unlimited play stays available beside it.
    </p>
  );
}
