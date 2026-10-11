import { createSession } from "@/lib/server/puzzles";
import { allowRequest } from "@/lib/server/rate-limit";
import { readJson } from "@/lib/server/http";
import { clientKey, jsonError } from "@/lib/server/request";
import type { Difficulty, Locale, WordLength } from "@/lib/game/types";

export async function POST(request: Request) {
  if (!allowRequest(`session:${clientKey(request)}`, 30, 60 * 60 * 1000)) {
    return jsonError("Too many puzzle sessions. Try again later.", 429);
  }
  const body = await readJson(request);
  if (!body) return jsonError("Send a JSON session request.");
  try {
    const session = await createSession({
      kind: body.kind === "daily" ? "daily" : "challenge",
      challengeId: typeof body.challengeId === "string" ? body.challengeId : undefined,
      length: Number(body.length ?? 5) as WordLength,
      locale: (body.locale === "uk" ? "uk" : "us") as Locale,
      difficulty: (["easy", "medium", "hard"].includes(String(body.difficulty))
        ? body.difficulty
        : "medium") as Difficulty,
    });
    return Response.json(session);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not start the session.", 404);
  }
}
