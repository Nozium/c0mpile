import { NextRequest, NextResponse } from "next/server";
import { DecisionLogEntrySchema } from "@/lib/schema";
import { addLogEntry, getLogEntries } from "@/features/phase2/decision-log/store";

/** GET /api/decision-log?decision_id=xxx — list log entries */
export async function GET(request: NextRequest) {
  const decisionId = request.nextUrl.searchParams.get("decision_id") ?? undefined;
  const entries = getLogEntries(decisionId);
  return NextResponse.json({ entries });
}

/** POST /api/decision-log — add a log entry (override, accept, promote, etc.) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = DecisionLogEntrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid log entry", issues: parsed.error.issues },
        { status: 400 }
      );
    }
    addLogEntry(parsed.data);
    return NextResponse.json({ ok: true, entry: parsed.data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
