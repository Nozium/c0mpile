import { z } from "zod";

/** Raw 3-line constitution input from user */
export const ConstitutionRawInputSchema = z.object({
  we_are: z.string().min(1),
  we_never: z.string().min(1),
  we_value: z.string().min(1),
});
export type ConstitutionRawInput = z.infer<typeof ConstitutionRawInputSchema>;

/** 5-axis normalization of a constitution */
export const ConstitutionAxesSchema = z.object({
  target_user: z.string(),
  prohibited_business_model: z.string(),
  quality_bar: z.string(),
  strategic_terrain: z.string(),
  trust_compliance_rule: z.string(),
});
export type ConstitutionAxes = z.infer<typeof ConstitutionAxesSchema>;

/** A single executable clause derived from constitution */
export const ClauseSchema = z.object({
  id: z.string(),
  axis: z.enum([
    "target_user",
    "prohibited_business_model",
    "quality_bar",
    "strategic_terrain",
    "trust_compliance_rule",
  ]),
  source_line: z.enum(["we_are", "we_never", "we_value"]),
  text: z.string(),
  type: z.enum(["hard", "soft"]),
  polarity: z.enum(["desired", "forbidden"]),
});
export type Clause = z.infer<typeof ClauseSchema>;

/** Desired state transition */
export const DesiredTransitionSchema = z.object({
  from: z.string(),
  to: z.string(),
});
export type DesiredTransition = z.infer<typeof DesiredTransitionSchema>;

/** Full parsed constitution */
export const ConstitutionSchema = z.object({
  id: z.string(),
  label: z.string(),
  raw_input: ConstitutionRawInputSchema,
  axes: ConstitutionAxesSchema,
  clauses: z.array(ClauseSchema),
  desired_transitions: z.array(z.string()),
  forbidden_patterns: z.array(z.string()),
});
export type Constitution = z.infer<typeof ConstitutionSchema>;
