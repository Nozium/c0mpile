import { NextRequest, NextResponse } from "next/server";
import { loadConstitutions, loadObservations, loadThemes } from "@/data/fixtures/loader";
import { runAllocation, diffAllocationRuns } from "@/features/phase1/allocation/engine";

/**
 * POST /api/allocate
 * Body: { constitution_id: string }
 * Returns allocation run for the specified constitution.
 *
 * POST /api/allocate with { compare: true }
 * Returns both runs + diff for Constitution A/B demo.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const constitutions = loadConstitutions();
    const observations = loadObservations();
    const themes = loadThemes();

    if (body.compare) {
      // A/B comparison mode
      const runs = constitutions.map((constitution) =>
        runAllocation({ constitution, observations, themes })
      );
      const diffs = runs.length >= 2
        ? diffAllocationRuns(runs[0], runs[1])
        : [];

      return NextResponse.json({ runs, diffs });
    }

    // Single constitution mode
    const constitution = constitutions.find((c) => c.id === body.constitution_id);
    if (!constitution) {
      return NextResponse.json(
        { error: `Constitution not found: ${body.constitution_id}` },
        { status: 404 }
      );
    }

    const run = runAllocation({ constitution, observations, themes });
    return NextResponse.json(run);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
