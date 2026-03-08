import { describe, it, expect } from "vitest";
import {
  ProposalSchema,
  ExecutionPacketSchema,
  CodingAgentTaskSchema,
  DecisionLogEntrySchema,
  PromoteActionSchema,
  ShareableSummarySchema,
} from "../../src/lib/schema";

describe("Phase2 schemas", () => {
  it("validates a CodingAgentTask", () => {
    const task = {
      task_id: "t1",
      title: "Build UI",
      description: "Create the component",
      type: "frontend",
      effort: "medium",
      dependencies: [],
    };
    expect(CodingAgentTaskSchema.parse(task)).toEqual(task);
  });

  it("rejects invalid CodingAgentTask type", () => {
    expect(() =>
      CodingAgentTaskSchema.parse({
        task_id: "t1",
        title: "X",
        description: "X",
        type: "invalid",
        effort: "small",
        dependencies: [],
      })
    ).toThrow();
  });

  it("validates an ExecutionPacket", () => {
    const packet = {
      id: "ep-1",
      proposal_id: "prop-1",
      problem_statement: "Users churn",
      target_user_state: "privacy workers",
      intended_transition: "cloud -> local",
      why_now: "Retention cliff",
      supporting_evidence_summary: "6 signals",
      ui_change_outline: "Add indicator",
      data_model_change_outline: "Add field",
      workflow_change_outline: "Load offline first",
      success_metric: "D30 75%",
      experiment_plan: "Ship read-only first",
      coding_agent_tasks: [
        {
          task_id: "t1",
          title: "Build",
          description: "Do it",
          type: "frontend",
          effort: "small",
          dependencies: [],
        },
      ],
    };
    const parsed = ExecutionPacketSchema.parse(packet);
    expect(parsed.coding_agent_tasks).toHaveLength(1);
  });

  it("validates a Proposal", () => {
    const proposal = {
      id: "prop-1",
      theme_id: "theme-1",
      title: "Offline Vault",
      description: "Local storage",
      decision: "build",
      build_if: "Retention cliff",
      kill_because: "Complexity",
      violated_clauses: [],
      allocation_score: {
        constitutional_fit: 0.9,
        transition_value: 0.8,
        evidence_strength: 0.9,
        death_risk: 0.1,
        effort_cost: 0.3,
        total: 0.78,
      },
      evidence_trail: [
        { observation_id: "obs-1", relevance: 0.9, quote: "I need this" },
      ],
      salvage_path: null,
      pre_mortem: {
        death_cause: "Sync complexity",
        early_signals: ["Engineer pushback"],
        untested_hypotheses: ["Tolerance for delays"],
        mitigation: "Ship without sync first",
      },
      confidence: 0.91,
    };
    const parsed = ProposalSchema.parse(proposal);
    expect(parsed.decision).toBe("build");
  });

  it("validates a DecisionLogEntry", () => {
    const entry = {
      id: "log-1",
      decision_id: "d1",
      timestamp: "2026-01-01T00:00:00Z",
      action: "override",
      actor: "pm",
      previous_verdict: "kill",
      new_verdict: "build",
      reason: "New evidence",
    };
    const parsed = DecisionLogEntrySchema.parse(entry);
    expect(parsed.action).toBe("override");
  });

  it("validates a PromoteAction", () => {
    const promote = {
      id: "promo-1",
      source_type: "chat",
      target_type: "card",
      source_summary: "User suggested feature X",
      promoted_at: "2026-01-01T00:00:00Z",
      promoted_by: "pm",
    };
    const parsed = PromoteActionSchema.parse(promote);
    expect(parsed.target_type).toBe("card");
  });

  it("validates a ShareableSummary", () => {
    const summary = {
      run_id: "run-1",
      constitution_label: "Privacy-First",
      generated_at: "2026-01-01T00:00:00Z",
      total_decisions: 7,
      build_count: 2,
      defer_count: 2,
      kill_count: 3,
      overrides: [],
      key_kills: [
        { theme_label: "Ads", reason: "Violates policy", violated_clauses: ["no ads"] },
      ],
      key_builds: [
        { theme_label: "Offline", rationale: "Aligned" },
      ],
    };
    const parsed = ShareableSummarySchema.parse(summary);
    expect(parsed.key_kills).toHaveLength(1);
  });
});
