import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ logId: string }> }
): Promise<Response> {
  const { logId } = await params;

  let rating: unknown;
  try {
    ({ rating } = (await req.json()) as { rating: unknown });
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (rating !== 1 && rating !== -1 && rating !== null) {
    return new Response(
      JSON.stringify({ error: "rating must be 1, -1, or null" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    await db.coachLog.update({
      where: { id: logId },
      data: { rating: rating as number | null },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Log not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(null, { status: 204 });
}
