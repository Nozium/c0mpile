import type { AgentActivityItem, AllocationRun, ConnectionsData, ExecutionPacket } from "@/lib/schema";

export function deriveBoardAgentActivity(
  run: AllocationRun,
  executionPackets: ExecutionPacket[]
): AgentActivityItem[] {
  return [
    {
      id: "activity-evidence",
      agent_type: "evidence",
      event_type: "normalized",
      summary: `Normalized ${run.observation_count} observations into ${run.theme_count} judgment-ready themes.`,
      status: "ready",
    },
    {
      id: "activity-judgment",
      agent_type: "judgment",
      event_type: "evaluated",
      summary: `Evaluated ${run.decisions.length} candidates and returned ${run.summary.build_count} build, ${run.summary.defer_count} defer, ${run.summary.kill_count} kill.`,
      status: "ready",
      related_decision_ids: run.decisions.map((decision) => decision.id),
    },
    {
      id: "activity-handoff",
      agent_type: "handoff",
      event_type: "prepared",
      summary: `Prepared ${executionPackets.length} execution packets and ${executionPackets.length} coding-agent exports for surviving build paths.`,
      status: executionPackets.length > 0 ? "ready" : "waiting",
    },
  ];
}

export function deriveConnectionsAgentActivity(
  data: ConnectionsData
): AgentActivityItem[] {
  const buildCount = data.decisions.filter((decision) => decision.verdict === "build").length;
  const packetCount = data.decisions.filter((decision) => decision.has_execution_packet).length;

  return [
    {
      id: "connections-evidence",
      agent_type: "evidence",
      event_type: "linked",
      summary: `${data.observations.length} observations linked into the console graph.`,
      status: "ready",
    },
    {
      id: "connections-judgment",
      agent_type: "judgment",
      event_type: "connected",
      summary: `${data.decisions.length} judgments connected to evidence with ${buildCount} build-ready paths.`,
      status: "ready",
      related_decision_ids: data.decisions.map((decision) => decision.decision_id),
    },
    {
      id: "connections-handoff",
      agent_type: "handoff",
      event_type: "staged",
      summary: `${packetCount} packet-backed handoff artifacts are ready for builders or coding agents.`,
      status: packetCount > 0 ? "ready" : "waiting",
    },
  ];
}
