import { NextResponse } from "next/server";
import {
  loadObservations,
  loadProposals,
  loadExecutionPackets,
} from "@/data/fixtures/loader";
import { buildConnectionsData } from "@/features/phase2/connections/build-connections";
import { getRunContext } from "@/features/phase2/connections/run-store";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const runId = request.nextUrl.searchParams.get("run_id");
  const proposals = loadProposals();
  const executionPackets = loadExecutionPackets();

  if (runId) {
    const context = getRunContext(runId);
    if (context) {
      return NextResponse.json(
        buildConnectionsData({
          observations: context.observations,
          decisions: context.run.decisions,
          proposals,
          executionPackets,
        })
      );
    }
  }

  const observations = loadObservations();
  const fixtureDecisions = proposals.map((proposal) => ({
    id: proposal.id,
    theme_id: proposal.theme_id,
    theme_label: proposal.title,
    verdict: proposal.decision,
    confidence: proposal.confidence,
    feature_outline_summary: proposal.description,
    violated_clauses: proposal.violated_clauses.map((clause, index) => ({
      clause_id: `${proposal.id}-clause-${index}`,
      clause_text: clause,
      axis: "prohibited_business_model",
      violation_reason: proposal.kill_because,
    })),
    supporting_evidence: proposal.evidence_trail.map((evidence) => {
      const observation = observations.find((obs) => obs.id === evidence.observation_id);
      return {
        observation_id: evidence.observation_id,
        raw_text: observation?.raw_text ?? evidence.quote,
        relevance: `${Math.round(evidence.relevance * 100)}%`,
      };
    }),
    kill_reason: proposal.decision === "kill" ? proposal.kill_because : undefined,
    defer_reason: proposal.decision === "defer" ? proposal.build_if : undefined,
    build_rationale: proposal.decision === "build" ? proposal.build_if : undefined,
  }));

  return NextResponse.json(
    buildConnectionsData({
      observations,
      decisions: fixtureDecisions,
      proposals,
      executionPackets,
    })
  );
}
