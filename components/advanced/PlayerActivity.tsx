"use client";

import { useEffect, useState } from "react";
import { CommunityStatistics } from "@/components/advanced/CommunityStatistics";
import { averageAttempts, winRate } from "@/lib/game/stats";
import { loadStats } from "@/lib/game/storage";
import type { PlayerStats } from "@/lib/game/types";

type Community = Parameters<typeof CommunityStatistics>[0]["data"];

export function PlayerActivity() {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [community, setCommunity] = useState<Community>(null);

  useEffect(() => {
    const refresh = () => setStats(loadStats());
    refresh();
    window.addEventListener("wordle-stats", refresh);
    window.addEventListener("storage", refresh);
    void fetch("/api/community")
      .then((response) => response.json())
      .then((data) => setCommunity(data))
      .catch(() => setCommunity(null));
    return () => {
      window.removeEventListener("wordle-stats", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <section className="site-container py-12" aria-labelledby="activity-heading">
      <h2 id="activity-heading" className="display text-3xl font-semibold">Wordle Community Activity</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Your cards use this browser. Server cards use completed games recorded here, without names or accounts.
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">This device</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-muted">Games played</dt><dd className="text-lg font-semibold">{stats?.played ?? 0}</dd></div>
            <div><dt className="text-muted">Puzzles solved</dt><dd className="text-lg font-semibold">{stats?.won ?? 0}</dd></div>
            <div><dt className="text-muted">Win rate</dt><dd className="text-lg font-semibold">{stats ? `${winRate(stats)}%` : "0%"}</dd></div>
            <div><dt className="text-muted">Average attempts</dt><dd className="text-lg font-semibold">{stats ? averageAttempts(stats) : 0}</dd></div>
          </dl>
        </div>
        <CommunityStatistics data={community} />
      </div>
    </section>
  );
}
