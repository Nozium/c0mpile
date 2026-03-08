import { z } from "zod";

/** Evidence trail entry in a proposal */
export const ProposalEvidenceSchema = z.object({
  observation_id: z.string(),
  relevance: z.number(),
  quote: z.string(),
});
export type ProposalEvidence = z.infer<typeof ProposalEvidenceSchema>;

/** Allocation score breakdown */
export const AllocationScoreSchema = z.object({
  constitutional_fit: z.number(),
  transition_value: z.number(),
  evidence_strength: z.number(),
  death_risk: z.number(),
  effort_cost: z.number(),
  total: z.number(),
});
export type AllocationScore = z.infer<typeof AllocationScoreSchema>;

/** Pre-mortem analysis */
export const PreMortemSchema = z.object({
  death_cause: z.string(),
  early_signals: z.array(z.string()),
  untested_hypotheses: z.array(z.string()),
  mitigation: z.string().nullable(),
});
export type PreMortem = z.infer<typeof PreMortemSchema>;

/** Feature outline in a proposal */
export const FeatureOutlineSchema = z.object({
  feature_name: z.string(),
  target_user: z.string(),
  problem_statement: z.string(),
  why_this_now: z.string(),
  supporting_feedback: z.array(z.string()),
  expected_outcome: z.string(),
  success_metric: z.string(),
});
export type FeatureOutline = z.infer<typeof FeatureOutlineSchema>;

/** Full proposal from the allocation pipeline — enriched version used in demo data */
export const ProposalSchema = z.object({
  id: z.string(),
  theme_id: z.string(),
  title: z.string(),
  description: z.string(),
  decision: z.enum(["build", "defer", "kill"]),
  build_if: z.string(),
  kill_because: z.string(),
  violated_clauses: z.array(z.string()),
  allocation_score: AllocationScoreSchema,
  evidence_trail: z.array(ProposalEvidenceSchema),
  salvage_path: z.string().nullable(),
  pre_mortem: PreMortemSchema,
  feature_outline: FeatureOutlineSchema.optional(),
  kill_type: z.string().optional(),
  confidence: z.number(),
});
export type Proposal = z.infer<typeof ProposalSchema>;
