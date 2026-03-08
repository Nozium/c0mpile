import { z } from "zod";

/** A single task for coding agents, derived from an execution packet */
export const CodingAgentTaskSchema = z.object({
  task_id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(["frontend", "backend", "data", "integration", "test"]),
  effort: z.enum(["small", "medium", "large"]),
  dependencies: z.array(z.string()),
});
export type CodingAgentTask = z.infer<typeof CodingAgentTaskSchema>;

/** Execution packet — builder handoff artifact from a build proposal */
export const ExecutionPacketSchema = z.object({
  id: z.string(),
  proposal_id: z.string(),
  problem_statement: z.string(),
  target_user_state: z.string(),
  intended_transition: z.string(),
  why_now: z.string(),
  supporting_evidence_summary: z.string(),
  ui_change_outline: z.string(),
  data_model_change_outline: z.string(),
  workflow_change_outline: z.string(),
  success_metric: z.string(),
  experiment_plan: z.string(),
  coding_agent_tasks: z.array(CodingAgentTaskSchema),
});
export type ExecutionPacket = z.infer<typeof ExecutionPacketSchema>;
