import { NextRequest, NextResponse } from "next/server";
import { loadProposals, loadObservations } from "@/data/fixtures/loader";

/** GET /api/proposals/:id/evidence — full evidence drill-down for a proposal */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const proposals = loadProposals();
    const proposal = proposals.find((p) => p.id === id);
    if (!proposal) {
      return NextResponse.json({ error: `Proposal not found: ${id}` }, { status: 404 });
    }

    const allObservations = loadObservations();
    const observationIds = proposal.evidence_trail.map((e) => e.observation_id);
    const observations = allObservations.filter((o) => observationIds.includes(o.id));

    return NextResponse.json({
      proposal,
      observations,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
