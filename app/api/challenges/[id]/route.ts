import { getChallenge, toPublicChallenge } from "@/lib/server/puzzles";
import { jsonError } from "@/lib/server/request";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const challenge = getChallenge(id);
  if (!challenge) return jsonError("This challenge link is unavailable.", 404);
  return Response.json(toPublicChallenge(challenge));
}
