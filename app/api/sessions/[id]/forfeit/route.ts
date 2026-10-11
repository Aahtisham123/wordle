import { forfeitSession } from "@/lib/server/puzzles";
import { allowRequest } from "@/lib/server/rate-limit";
import { clientKey, jsonError } from "@/lib/server/request";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!allowRequest(`forfeit:${clientKey(request)}`, 30, 60 * 60 * 1000)) {
    return jsonError("Too many requests. Try again later.", 429);
  }
  const { id } = await context.params;
  try {
    return Response.json(await forfeitSession(id));
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not end the puzzle.", 404);
  }
}