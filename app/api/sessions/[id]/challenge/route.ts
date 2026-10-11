import { shareSession, toPublicChallenge } from "@/lib/server/puzzles";
import { allowRequest } from "@/lib/server/rate-limit";
import { clientKey, jsonError } from "@/lib/server/request";
import { absoluteUrl } from "@/lib/site";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!allowRequest(`share:${clientKey(request)}`, 20, 60 * 60 * 1000)) {
    return jsonError("Too many share links. Try again later.", 429);
  }
  const { id } = await context.params;
  try {
    const challenge = await shareSession(id);
    return Response.json({
      ...toPublicChallenge(challenge),
      url: absoluteUrl(`/challenge/${challenge.id}`),
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not create a challenge link.", 404);
  }
}
