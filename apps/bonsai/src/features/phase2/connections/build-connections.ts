import type {
  AllocationRun,
  ConnectionsData,
  Decision,
  DecisionConnection,
  ExecutionPacket,
  Observation,
  ObservationConnection,
  Proposal,
} from "@/lib/schema";

function buildActions(
  verdict: Decision["verdict"],
  hasPacket: boolean,
  hasSalvagePath: boolean
): {
  availableActions: string[];
  primaryAction: string;
  hasCodingExport: boolean;
  actuationStatus: DecisionConnection["actuation_status"];
} {
  if (verdict === "build") {
    return {
      availableActions: ["view_execution_packet", "coding_agent_export", "send_rork", "override_decision", "copy_rationale"],
      primaryAction: "send_rork",
      hasCodingExport: hasPacket,
      actuationStatus: hasPacket ? "brief_ready" : "not_started",
    };
  }

  if (verdict === "defer") {
    return {
      availableActions: ["request_more_evidence", "override_decision", "copy_rationale"],
      primaryAction: "request_more_evidence",
      hasCodingExport: false,
      actuationStatus: "not_started",
    };
  }

  const availableActions = ["create_salvage_proposal", "override_decision", "copy_rationale"];
  if (hasSalvagePath) {
    availableActions.unshift("view_salvage_path");
  }

  return {
    availableActions,
    primaryAction: "create_salvage_proposal",
    hasCodingExport: false,
    actuationStatus: "not_started",
  };
}

export function buildConnectionsData({
  observations,
  decisions,
  proposals,
  executionPackets,
}: {
  observations: Observation[];
  decisions: Decision[];
  proposals: Proposal[];
  executionPackets: ExecutionPacket[];
}): ConnectionsData {
  const proposalByThemeId = new Map(proposals.map((proposal) => [proposal.theme_id, proposal]));
  const packetProposalIds = new Set(executionPackets.map((packet) => packet.proposal_id));

  const observationToDecisionIds = new Map<string, string[]>();
  for (const decision of decisions) {
    for (const evidence of decision.supporting_evidence) {
      const existing = observationToDecisionIds.get(evidence.observation_id) ?? [];
      existing.push(decision.id);
      observationToDecisionIds.set(evidence.observation_id, existing);
    }
  }

  const observationConnections: ObservationConnection[] = observations.map((observation) => {
    const linkedDecisionIds = observationToDecisionIds.get(observation.id) ?? [];
    const linkedDecisions = decisions.filter((decision) =>
      linkedDecisionIds.includes(decision.id)
    );
    const linkedThemeIds = linkedDecisions.map((decision) => decision.theme_id);
    const linkedProposalIds = linkedDecisions
      .map((decision) => proposalByThemeId.get(decision.theme_id)?.id)
      .filter((proposalId): proposalId is string => Boolean(proposalId));

    return {
      observation_id: observation.id,
      source: observation.source,
      channel_type: observation.channel_type,
      raw_text: observation.raw_text,
      extracted_intent: observation.extracted_intent,
      severity: observation.severity,
      confidence: observation.confidence,
      sentiment: observation.sentiment,
      timestamp: observation.timestamp,
      linked_theme_ids: linkedThemeIds,
      linked_proposal_ids: linkedProposalIds,
      linked_decision_ids: linkedDecisionIds,
    };
  });

  const decisionConnections: DecisionConnection[] = decisions.map((decision) => {
    const proposal = proposalByThemeId.get(decision.theme_id);
    const proposalId = proposal?.id ?? null;
    const hasPacket = proposalId ? packetProposalIds.has(proposalId) : false;
    const actionMeta = buildActions(decision.verdict, hasPacket, Boolean(proposal?.salvage_path));

    return {
      decision_id: decision.id,
      proposal_id: proposalId,
      theme_id: decision.theme_id,
      theme_label: decision.theme_label,
      title: proposal?.title ?? decision.theme_label,
      verdict: decision.verdict,
      confidence: decision.confidence,
      violated_clauses: decision.violated_clauses.map((clause) => clause.clause_text),
      kill_reason: decision.kill_reason,
      defer_reason: decision.defer_reason,
      build_rationale: decision.build_rationale,
      linked_observation_ids: decision.supporting_evidence.map((evidence) => evidence.observation_id),
      available_actions: actionMeta.availableActions,
      has_execution_packet: hasPacket,
      has_coding_export: actionMeta.hasCodingExport,
      primary_action: actionMeta.primaryAction,
      actuation_status: actionMeta.actuationStatus,
    };
  });

  return {
    observations: observationConnections,
    decisions: decisionConnections,
  };
}
