import { NextResponse } from "next/server";
import type { AgentActivityItem } from "@/lib/schema";
import {
  loadObservations,
  loadProposals,
  loadExecutionPackets,
  loadThemes,
} from "@/data/fixtures/loader";

export async function GET() {
  const observations = loadObservations();
  const themes = loadThemes();
  const proposals = loadProposals();
  const packets = loadExecutionPackets();

  const items: AgentActivityItem[] = [
    {
      id: "api-evidence",
      agent_type: "evidence",
      event_type: "normalized",
      summary: `Structured ${observations.length} observations into ${themes.length} themes.`,
      status: "ready",
    },
    {
      id: "api-judgment",
      agent_type: "judgment",
      event_type: "evaluated",
      summary: `Evaluated ${proposals.length} proposal candidates against the active constitution.`,
      status: "ready",
      related_decision_ids: proposals.map((proposal) => proposal.id),
    },
    {
      id: "api-handoff",
      agent_type: "handoff",
      event_type: "prepared",
      summary: `Prepared ${packets.length} execution packets for surviving build paths.`,
      status: packets.length > 0 ? "ready" : "waiting",
    },
  ];

  return NextResponse.json({ items });
}
