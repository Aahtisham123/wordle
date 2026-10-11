import { submitSessionHint } from "@/lib/server/puzzles";
import { allowRequest } from "@/lib/server/rate-limit";
import { clientKey, jsonError } from "@/lib/server/request";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!allowRequest(`hint:${clientKey(request)}`, 40, 60 * 60 * 1000)) {
    return jsonError("Too many hint requests. Try again later.", 429);
  }
  const { id } = await context.params;
  try {
    return Response.json(await submitSessionHint(id));
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "No hint is available.");
  }
}
