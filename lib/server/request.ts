import { hashIp } from "@/lib/server/puzzles";

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "local";
  return request.headers.get("x-real-ip") ?? "local";
}

export function clientKey(request: Request) {
  return hashIp(clientIp(request));
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
