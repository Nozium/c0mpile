import { NextRequest, NextResponse } from "next/server";
import { generateShareableSummary } from "@/features/phase2/decision-log/store";
import type { AllocationRun } from "@/lib/schema";

/** POST /api/decision-log/summary — generate a shareable summary for a run */
export async function POST(request: NextRequest) {
  try {
    const run: AllocationRun = await request.json();
    const summary = generateShareableSummary(run);
    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
