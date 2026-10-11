import { publicCommunity } from "@/lib/server/community";

export async function GET() {
  return Response.json(publicCommunity());
}
