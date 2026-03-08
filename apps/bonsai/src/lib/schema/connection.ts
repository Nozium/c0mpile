import { z } from "zod";

/** Read model: an observation with its N:N links to themes, proposals, and decisions */
export const ObservationConnectionSchema = z.object({
  observation_id: z.string(),
  source: z.string(),
  channel_type: z.string(),
  raw_text: z.string(),
  extracted_intent: z.string(),
  severity: z.enum(["critical", "major", "minor", "neutral"]),
  confidence: z.number(),
  sentiment: z.number().optional(),
  timestamp: z.string(),
  linked_theme_ids: z.array(z.string()),
  linked_proposal_ids: z.array(z.string()),
  linked_decision_ids: z.array(z.string()),
});
export type ObservationConnection = z.infer<typeof ObservationConnectionSchema>;

/** Read model: a decision/proposal with its N:N links to observations and available actions */
export const DecisionConnectionSchema = z.object({
  decision_id: z.string(),
  proposal_id: z.string().nullable(),
  theme_id: z.string(),
  theme_label: z.string(),
  title: z.string(),
  verdict: z.enum(["build", "defer", "kill"]),
  confidence: z.number(),
  violated_clauses: z.array(z.string()),
  kill_reason: z.string().optional(),
  defer_reason: z.string().optional(),
  build_rationale: z.string().optional(),
  linked_observation_ids: z.array(z.string()),
  available_actions: z.array(z.string()),
  has_execution_packet: z.boolean(),
  has_coding_export: z.boolean(),
  primary_action: z.string(),
  actuation_status: z
    .enum(["not_started", "brief_ready", "preview_ready", "approved", "rejected"])
    .optional(),
});
export type DecisionConnection = z.infer<typeof DecisionConnectionSchema>;

/** Full connections response for the console view */
export const ConnectionsDataSchema = z.object({
  observations: z.array(ObservationConnectionSchema),
  decisions: z.array(DecisionConnectionSchema),
});
export type ConnectionsData = z.infer<typeof ConnectionsDataSchema>;
