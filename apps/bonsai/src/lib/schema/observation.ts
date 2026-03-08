import { z } from "zod";

export const ActorSchema = z.object({
  person_role: z.string().optional(),
  person_seniority: z.string().optional(),
  company_name: z.string().optional(),
  company_stage: z.string().optional(),
  company_size: z.number().optional(),
  company_industry: z.string().optional(),
  company_arr: z.string().optional(),
});
export type Actor = z.infer<typeof ActorSchema>;

export const ObservationSchema = z.object({
  id: z.string(),
  source: z.string(),
  channel_type: z.string(),
  raw_text: z.string(),
  extracted_intent: z.string(),
  inferred_need: z.string(),
  signal_type: z.string(),
  severity: z.enum(["critical", "major", "minor", "neutral"]),
  confidence: z.number().min(0).max(1),
  sentiment: z.number().optional(),
  actor: ActorSchema.optional(),
  weight: z.number().optional(),
  evidence_url: z.string().optional(),
  timestamp: z.string(),
});
export type Observation = z.infer<typeof ObservationSchema>;

export const ThemeSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  anti_theme: z.string(),
  observation_ids: z.array(z.string()),
  evidence_count: z.number(),
  urgency: z.enum(["high", "medium", "low"]),
  affected_state_clusters: z.array(z.string()),
  predicted_transition: z.string(),
});
export type Theme = z.infer<typeof ThemeSchema>;
