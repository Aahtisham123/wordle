import { createChallenge } from "@/lib/server/puzzles";
import { allowRequest } from "@/lib/server/rate-limit";
import { clientKey, jsonError } from "@/lib/server/request";
import { readJson } from "@/lib/server/http";
import { absoluteUrl } from "@/lib/site";
import type { CategoryId, Difficulty, Locale, WordLength } from "@/lib/game/types";
import { toPublicChallenge } from "@/lib/server/puzzles";

const DIFFICULTIES = new Set(["easy", "medium", "hard"]);
const LOCALES = new Set(["us", "uk"]);

export async function POST(request: Request) {
  const key = clientKey(request);
  if (!allowRequest(`challenge:${key}`, 20, 60 * 60 * 1000)) {
    return jsonError("Too many challenges were created. Try again later.", 429);
  }
  const body = await readJson(request);
  if (!body) return jsonError("Send a JSON challenge request.");
  const source = body.source === "custom" ? "custom" : body.source === "shared" ? "shared" : null;
  if (!source) return jsonError("Choose a custom word or a shared puzzle.");
  const difficulty = String(body.difficulty ?? "medium") as Difficulty;
  const locale = String(body.locale ?? "us") as Locale;
  if (!DIFFICULTIES.has(difficulty) || !LOCALES.has(locale)) {
    return jsonError("Choose a valid difficulty and language.");
  }
  try {
    const challenge = await createChallenge({
      source,
      word: typeof body.word === "string" ? body.word : undefined,
      length: Number(body.length ?? 5) as WordLength,
      difficulty,
      locale,
      category: String(body.category ?? "random") as CategoryId,
      clue: typeof body.clue === "string" ? body.clue : undefined,
      maxGuesses: Number(body.maxGuesses ?? 6),
      countdownMs: typeof body.countdownMs === "number" ? body.countdownMs : null,
    });
    const publicChallenge = toPublicChallenge(challenge);
    return Response.json({
      ...publicChallenge,
      url: absoluteUrl(`/challenge/${challenge.id}`),
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not create the challenge.");
  }
}
