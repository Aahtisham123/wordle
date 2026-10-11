import { saveContactMessage } from "@/lib/server/contact";
import { allowRequest } from "@/lib/server/rate-limit";
import { readJson } from "@/lib/server/http";
import { clientKey, jsonError } from "@/lib/server/request";

export async function POST(request: Request) {
  if (!allowRequest(`contact:${clientKey(request)}`, 5, 60 * 60 * 1000)) {
    return jsonError("Too many messages. Try again later.", 429);
  }
  const body = await readJson(request);
  if (!body) return jsonError("Send a message.");
  try {
    await saveContactMessage({
      name: String(body.name ?? ""),
      email: String(body.email ?? ""),
      message: String(body.message ?? ""),
    });
    return Response.json({ ok: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not send the message.");
  }
}
