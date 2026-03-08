import { NextRequest, NextResponse } from "next/server";
import { loadProposals } from "@/data/fixtures/loader";

/** GET /api/proposals?decision=build|defer|kill — list proposals */
export async function GET(request: NextRequest) {
  try {
    const decision = request.nextUrl.searchParams.get("decision");
    let proposals = loadProposals();
    if (decision) {
      proposals = proposals.filter((p) => p.decision === decision);
    }
    return NextResponse.json({ proposals });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
