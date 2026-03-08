import { NextResponse } from "next/server";
import {
  loadObservations,
  loadThemes,
  loadProposals,
  loadExecutionPackets,
} from "@/data/fixtures/loader";
import type { ObservationConnection, DecisionConnection } from "@/lib/schema";

export async function GET() {
  const observations = loadObservations();
  const themes = loadThemes();
  const proposals = loadProposals();
  const executionPackets = loadExecutionPackets();

  // Build reverse index: observation_id → theme_ids
  const obsToThemes = new Map<string, string[]>();
  for (const theme of themes) {
    for (const obsId of theme.observation_ids) {
      const existing = obsToThemes.get(obsId) ?? [];
      existing.push(theme.id);
      obsToThemes.set(obsId, existing);
    }
  }

  // Build reverse index: observation_id → proposal_ids (via evidence_trail)
  const obsToProposals = new Map<string, string[]>();
  for (const proposal of proposals) {
    for (const ev of proposal.evidence_trail) {
      const existing = obsToProposals.get(ev.observation_id) ?? [];
      existing.push(proposal.id);
      obsToProposals.set(ev.observation_id, existing);
    }
  }

  // Build execution packet lookup: proposal_id → boolean
  const proposalHasPacket = new Set(executionPackets.map((ep) => ep.proposal_id));

  // Build ObservationConnections
  const observationConnections: ObservationConnection[] = observations.map((obs) => {
    const linkedThemeIds = obsToThemes.get(obs.id) ?? [];
    const linkedProposalIds = obsToProposals.get(obs.id) ?? [];
    // Decisions use proposal IDs in this demo (proposals are the decision-level entities)
    const linkedDecisionIds = linkedProposalIds;

    return {
      observation_id: obs.id,
      source: obs.source,
      channel_type: obs.channel_type,
      raw_text: obs.raw_text,
      extracted_intent: obs.extracted_intent,
      severity: obs.severity,
      confidence: obs.confidence,
      sentiment: obs.sentiment,
      timestamp: obs.timestamp,
      linked_theme_ids: linkedThemeIds,
      linked_proposal_ids: linkedProposalIds,
      linked_decision_ids: linkedDecisionIds,
    };
  });

  // Build DecisionConnections from proposals
  const decisionConnections: DecisionConnection[] = proposals.map((proposal) => {
    const linkedObsIds = proposal.evidence_trail.map((ev) => ev.observation_id);

    // Available actions based on verdict
    const actions: string[] = ["override_decision", "copy_rationale"];
    if (proposal.decision === "build") {
      actions.unshift("view_execution_packet", "coding_agent_export", "send_rork");
    } else if (proposal.decision === "defer") {
      actions.unshift("request_more_evidence");
    } else if (proposal.decision === "kill") {
      if (proposal.salvage_path) actions.unshift("view_salvage_path");
      actions.unshift("create_salvage_proposal");
    }

    return {
      decision_id: proposal.id,
      proposal_id: proposal.id,
      theme_id: proposal.theme_id,
      theme_label: proposal.title,
      title: proposal.title,
      verdict: proposal.decision,
      confidence: proposal.confidence,
      violated_clauses: proposal.violated_clauses,
      kill_reason: proposal.kill_because,
      defer_reason: proposal.decision === "defer" ? proposal.build_if : undefined,
      build_rationale: proposal.decision === "build" ? proposal.build_if : undefined,
      linked_observation_ids: linkedObsIds,
      available_actions: actions,
      has_execution_packet: proposalHasPacket.has(proposal.id),
    };
  });

  return NextResponse.json({
    observations: observationConnections,
    decisions: decisionConnections,
  });
}
