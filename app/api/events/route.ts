import { recordCommunityEvent } from "@/lib/server/community";
import { allowRequest } from "@/lib/server/rate-limit";
import { readJson } from "@/lib/server/http";
import { clientKey, jsonError } from "@/lib/server/request";
import type { CategoryId, Difficulty, GameMode, WordLength } from "@/lib/game/types";

export async function POST(request: Request) {
  if (!allowRequest(`event:${clientKey(request)}`, 60, 60 * 60 * 1000)) {
    return jsonError("Too many stat updates. Try again later.", 429);
  }
  const body = await readJson(request);
  if (!body) return jsonError("Send a game result.");
  try {
    const inserted = await recordCommunityEvent({
      id: String(body.id ?? ""),
      won: Boolean(body.won),
      difficulty: String(body.difficulty ?? "medium") as Difficulty,
      length: Number(body.length) as WordLength,
      category: String(body.category ?? "random") as CategoryId,
      mode: String(body.mode ?? "unlimited") as GameMode,
      hints: Number(body.hints ?? 0),
      attempts: Number(body.attempts ?? 0),
      durationMs: Number(body.durationMs ?? 0),
    });
    return Response.json({ ok: true, inserted });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not record the game.");
  }
}
