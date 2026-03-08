import { NextRequest, NextResponse } from "next/server";
import { loadConstitutions, loadObservations, loadThemes } from "@/data/fixtures/loader";
import { ConstitutionSchema } from "@/lib/schema";
import { runAllocation, diffAllocationRuns } from "@/features/phase1/allocation/engine";
import { saveRunContext } from "@/features/phase2/connections/run-store";

/**
 * POST /api/allocate
 * Body: { constitution_id: string } — use a preset constitution
 * Body: { constitution: Constitution } — use a custom constitution inline
 * Body: { compare: true } — compare all preset constitutions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const observations = loadObservations();
    const themes = loadThemes();

    if (body.compare) {
      const constitutions = loadConstitutions();
      const runs = constitutions.map((constitution) => {
        const run = runAllocation({ constitution, observations, themes });
        saveRunContext(run, observations);
        return run;
      });
      const diffs = runs.length >= 2
        ? diffAllocationRuns(runs[0], runs[1])
        : [];

      return NextResponse.json({ runs, diffs });
    }

    // Custom constitution passed inline
    if (body.constitution) {
      const parsed = ConstitutionSchema.safeParse(body.constitution);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid constitution", issues: parsed.error.issues },
          { status: 400 }
        );
      }
      const run = runAllocation({ constitution: parsed.data, observations, themes });
      saveRunContext(run, observations);
      return NextResponse.json(run);
    }

    // Preset constitution by id
    const constitutions = loadConstitutions();
    const constitution = constitutions.find((c) => c.id === body.constitution_id);
    if (!constitution) {
      return NextResponse.json(
        { error: `Constitution not found: ${body.constitution_id}` },
        { status: 404 }
      );
    }

    const run = runAllocation({ constitution, observations, themes });
    saveRunContext(run, observations);
    return NextResponse.json(run);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
