import { z } from "zod";

export const EvidenceRefSchema = z.object({
  observation_id: z.string(),
  raw_text: z.string(),
  relevance: z.string(),
});
export type EvidenceRef = z.infer<typeof EvidenceRefSchema>;

export const ViolatedClauseSchema = z.object({
  clause_id: z.string(),
  clause_text: z.string(),
  axis: z.string(),
  violation_reason: z.string(),
});
export type ViolatedClause = z.infer<typeof ViolatedClauseSchema>;

export const ClauseEvalSchema = z.object({
  clause_id: z.string(),
  clause_text: z.string(),
  axis: z.string(),
  signal: z.enum(["violated", "aligned", "neutral"]),
  detail: z.string().optional(),
});
export type ClauseEval = z.infer<typeof ClauseEvalSchema>;

export const DecisionSchema = z.object({
  id: z.string(),
  theme_id: z.string(),
  theme_label: z.string(),
  verdict: z.enum(["build", "defer", "kill"]),
  confidence: z.number().min(0).max(1),
  feature_outline_summary: z.string(),
  violated_clauses: z.array(ViolatedClauseSchema),
  supporting_evidence: z.array(EvidenceRefSchema),
  clause_evals: z.array(ClauseEvalSchema).optional(),
  kill_reason: z.string().optional(),
  defer_reason: z.string().optional(),
  build_rationale: z.string().optional(),
});
export type Decision = z.infer<typeof DecisionSchema>;

export const AllocationRunSchema = z.object({
  id: z.string(),
  constitution_id: z.string(),
  constitution_label: z.string(),
  timestamp: z.string(),
  observation_count: z.number(),
  theme_count: z.number(),
  decisions: z.array(DecisionSchema),
  summary: z.object({
    build_count: z.number(),
    defer_count: z.number(),
    kill_count: z.number(),
  }),
});
export type AllocationRun = z.infer<typeof AllocationRunSchema>;
