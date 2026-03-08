import type { Decision, ExecutionPacket } from "@/lib/schema";

export function buildRorkBrief(
  packet: ExecutionPacket,
  decision: Decision
): string {
  return [
    `# Rork Brief: ${decision.theme_label}`,
    "",
    "## Decision",
    `${decision.verdict.toUpperCase()} (${(decision.confidence * 100).toFixed(0)}% confidence)`,
    "",
    "## What to Build",
    decision.feature_outline_summary,
    "",
    "## Why This Survived",
    decision.build_rationale ?? packet.why_now,
    "",
    "## Must Preserve",
    packet.target_user_state,
    packet.intended_transition,
    "",
    "## UI Changes",
    packet.ui_change_outline,
    "",
    "## Workflow Changes",
    packet.workflow_change_outline,
    "",
    "## Success Metric",
    packet.success_metric,
  ].join("\n");
}
