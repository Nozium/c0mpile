import type { Decision } from "@/lib/schema";

export type CardAction =
  | "send_rork"
  | "add_github_issue"
  | "add_linear_issue"
  | "create_salvage_proposal"
  | "request_more_evidence"
  | "override_decision"
  | "copy_rationale"
  | "virtual_staff_review";

export type DecisionActionConfig = {
  primary: CardAction;
  secondary: CardAction[];
};

export const defaultActions: Record<Decision["verdict"], DecisionActionConfig> = {
  build: {
    primary: "send_rork",
    secondary: ["virtual_staff_review", "add_linear_issue", "add_github_issue", "copy_rationale"],
  },
  defer: {
    primary: "add_linear_issue",
    secondary: ["virtual_staff_review", "add_github_issue", "request_more_evidence", "send_rork", "copy_rationale"],
  },
  kill: {
    primary: "add_github_issue",
    secondary: ["virtual_staff_review", "add_linear_issue", "create_salvage_proposal", "copy_rationale"],
  },
};

export const actionLabels: Record<CardAction, string> = {
  send_rork: "Send to Rork",
  add_github_issue: "Add to GitHub Issue",
  add_linear_issue: "Add to Linear",
  create_salvage_proposal: "Create Salvage Proposal",
  request_more_evidence: "Request More Evidence",
  override_decision: "Override",
  copy_rationale: "Copy Rationale",
  virtual_staff_review: "Virtual Staff Review",
};

/** Build issue body content that varies by verdict */
export function buildIssueBody(decision: Decision): string {
  const evidenceList = decision.supporting_evidence
    .slice(0, 5)
    .map((e) => `- [${e.observation_id}] "${e.raw_text.slice(0, 120)}..."`)
    .join("\n");

  switch (decision.verdict) {
    case "build":
      return [
        `## Feature: ${decision.theme_label}`,
        "",
        `### Outline`,
        decision.feature_outline_summary,
        "",
        `### Build Rationale`,
        decision.build_rationale ?? "—",
        "",
        `### Evidence (${decision.supporting_evidence.length} refs)`,
        evidenceList,
        "",
        `### Confidence: ${(decision.confidence * 100).toFixed(0)}%`,
      ].join("\n");

    case "defer":
      return [
        `## Deferred: ${decision.theme_label}`,
        "",
        `### Reason`,
        decision.defer_reason ?? "—",
        "",
        `### Re-evaluation Conditions`,
        "- [ ] Additional evidence collected",
        "- [ ] Constitution updated to align",
        "- [ ] Urgency increased based on new signals",
        "",
        `### Evidence (${decision.supporting_evidence.length} refs)`,
        evidenceList,
        "",
        `### Confidence: ${(decision.confidence * 100).toFixed(0)}%`,
      ].join("\n");

    case "kill":
      return [
        `## Kill Decision: ${decision.theme_label}`,
        "",
        `### Kill Reason`,
        decision.kill_reason ?? "—",
        "",
        `### Violated Clauses`,
        ...decision.violated_clauses.map(
          (vc) => `- **[${vc.axis}]** ${vc.clause_text}\n  _${vc.violation_reason}_`
        ),
        "",
        `### Evidence (${decision.supporting_evidence.length} refs)`,
        evidenceList,
        "",
        `### Confidence: ${(decision.confidence * 100).toFixed(0)}%`,
      ].join("\n");
  }
}

/** Build a rationale summary for clipboard */
export function buildRationale(decision: Decision): string {
  const reason =
    decision.build_rationale ?? decision.defer_reason ?? decision.kill_reason ?? "—";
  const clauses = decision.violated_clauses
    .map((vc) => `[${vc.axis}] ${vc.clause_text}`)
    .join("; ");

  return [
    `${decision.verdict.toUpperCase()}: ${decision.theme_label}`,
    `Confidence: ${(decision.confidence * 100).toFixed(0)}%`,
    `Reason: ${reason}`,
    clauses ? `Violated: ${clauses}` : "",
    `Evidence: ${decision.supporting_evidence.length} refs`,
  ]
    .filter(Boolean)
    .join("\n");
}
