import { z } from "zod";

// --- Reviewer Persona ---

export const ReviewerTypeSchema = z.enum([
  "yc_partner",
  "first_principles",
  "customer_advocate",
  "strategic_skeptic",
]);
export type ReviewerType = z.infer<typeof ReviewerTypeSchema>;

export const EvaluationAxisSchema = z.object({
  axis_id: z.string(),
  axis_name: z.string(),
  description: z.string(),
});
export type EvaluationAxis = z.infer<typeof EvaluationAxisSchema>;

export const ReviewerPersonaSchema = z.object({
  id: z.string(),
  type: ReviewerTypeSchema,
  display_name: z.string(),
  framework: z.string(),
  evaluation_axes: z.array(EvaluationAxisSchema),
  system_prompt_template: z.string(),
});
export type ReviewerPersona = z.infer<typeof ReviewerPersonaSchema>;

// --- Review Question ---

export const SeveritySchema = z.enum([
  "fatal",
  "critical",
  "important",
  "probe",
]);
export type Severity = z.infer<typeof SeveritySchema>;

export const ReviewQuestionSchema = z.object({
  id: z.string(),
  reviewer_type: ReviewerTypeSchema,
  axis_id: z.string(),
  question: z.string(),
  why_this_matters: z.string(),
  severity: SeveritySchema,
  evidence_refs: z.array(z.string()).optional(),
  related_proposal_ids: z.array(z.string()).optional(),
  related_clause_ids: z.array(z.string()).optional(),
});
export type ReviewQuestion = z.infer<typeof ReviewQuestionSchema>;

// --- Staff Review (one review run result) ---

export const ReviewTargetTypeSchema = z.enum([
  "constitution",
  "proposal",
  "pipeline_run",
]);
export type ReviewTargetType = z.infer<typeof ReviewTargetTypeSchema>;

export const ReviewSummarySchema = z.object({
  total_questions: z.number(),
  fatal_count: z.number(),
  critical_count: z.number(),
  important_count: z.number(),
  probe_count: z.number(),
  top_blind_spot: z.string(),
  overall_assessment: z.string(),
});
export type ReviewSummary = z.infer<typeof ReviewSummarySchema>;

export const StaffReviewSchema = z.object({
  id: z.string(),
  target_type: ReviewTargetTypeSchema,
  target_id: z.string(),
  reviewer_types: z.array(ReviewerTypeSchema),
  questions: z.array(ReviewQuestionSchema),
  summary: ReviewSummarySchema,
  created_at: z.string(),
});
export type StaffReview = z.infer<typeof StaffReviewSchema>;

// --- Review Response (user answer) ---

export const ResponseStatusSchema = z.enum([
  "answered",
  "acknowledged",
  "dismissed",
  "action_taken",
]);
export type ResponseStatus = z.infer<typeof ResponseStatusSchema>;

export const ReviewResponseSchema = z.object({
  id: z.string(),
  review_id: z.string(),
  question_id: z.string(),
  response_text: z.string(),
  status: ResponseStatusSchema,
  dismiss_reason: z.string().optional(),
  created_at: z.string(),
});
export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;

// --- API request schema ---

export const RunReviewRequestSchema = z.object({
  target_type: ReviewTargetTypeSchema,
  target_id: z.string(),
  reviewer_types: z.array(ReviewerTypeSchema).optional(),
});
export type RunReviewRequest = z.infer<typeof RunReviewRequestSchema>;

export const SubmitResponseRequestSchema = z.object({
  question_id: z.string(),
  response_text: z.string(),
  status: ResponseStatusSchema,
  dismiss_reason: z.string().optional(),
});
export type SubmitResponseRequest = z.infer<typeof SubmitResponseRequestSchema>;
