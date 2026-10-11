import { submitSessionGuess } from "@/lib/server/puzzles";
import { allowRequest } from "@/lib/server/rate-limit";
import { readJson } from "@/lib/server/http";
import { clientKey, jsonError } from "@/lib/server/request";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!allowRequest(`guess:${clientKey(request)}`, 80, 60 * 60 * 1000)) {
    return jsonError("Too many guesses. Try again later.", 429);
  }
  const body = await readJson(request);
  if (!body || typeof body.guess !== "string") return jsonError("Enter a guess.");
  const { id } = await context.params;
  try {
    const result = await submitSessionGuess(id, body.guess);
    if (!result.ok) return jsonError(result.message);
    return Response.json(result);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not score that guess.", 404);
  }
}
