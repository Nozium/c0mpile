import { NextRequest, NextResponse } from "next/server";
import { loadExecutionPacketByProposalId } from "@/data/fixtures/loader";

/** GET /api/execution-packets/:proposalId — get execution packet for a proposal */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ proposalId: string }> }
) {
  try {
    const { proposalId } = await params;
    const packet = loadExecutionPacketByProposalId(proposalId);
    if (!packet) {
      return NextResponse.json(
        { error: `No execution packet for proposal: ${proposalId}` },
        { status: 404 }
      );
    }
    return NextResponse.json(packet);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
