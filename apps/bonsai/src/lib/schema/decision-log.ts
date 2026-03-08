import { z } from "zod";

/** Promote action — elevate a conversation artifact to a persistent record */
export const PromoteActionSchema = z.object({
  id: z.string(),
  source_type: z.enum(["chat", "agent"]),
  target_type: z.enum(["policy_update", "card", "evidence_note", "execution_packet", "issue_draft"]),
  source_summary: z.string(),
  promoted_at: z.string(),
  promoted_by: z.string(),
});
export type PromoteAction = z.infer<typeof PromoteActionSchema>;

/** A single entry in the decision log — tracks overrides, promotes, and verdict changes */
export const DecisionLogEntrySchema = z.object({
  id: z.string(),
  decision_id: z.string(),
  timestamp: z.string(),
  action: z.enum(["override", "accept", "defer", "promote", "comment"]),
  actor: z.string(),
  previous_verdict: z.enum(["build", "defer", "kill"]).optional(),
  new_verdict: z.enum(["build", "defer", "kill"]).optional(),
  reason: z.string(),
  promote_action: PromoteActionSchema.optional(),
});
export type DecisionLogEntry = z.infer<typeof DecisionLogEntrySchema>;

/** Aggregated decision log for an allocation run */
export const DecisionLogSchema = z.object({
  run_id: z.string(),
  entries: z.array(DecisionLogEntrySchema),
});
export type DecisionLog = z.infer<typeof DecisionLogSchema>;

/** Shareable summary — read model for team sharing */
export const ShareableSummarySchema = z.object({
  run_id: z.string(),
  constitution_label: z.string(),
  generated_at: z.string(),
  total_decisions: z.number(),
  build_count: z.number(),
  defer_count: z.number(),
  kill_count: z.number(),
  overrides: z.array(
    z.object({
      theme_label: z.string(),
      from: z.string(),
      to: z.string(),
      reason: z.string(),
    })
  ),
  key_kills: z.array(
    z.object({
      theme_label: z.string(),
      reason: z.string(),
      violated_clauses: z.array(z.string()),
    })
  ),
  key_builds: z.array(
    z.object({
      theme_label: z.string(),
      rationale: z.string(),
    })
  ),
});
export type ShareableSummary = z.infer<typeof ShareableSummarySchema>;
