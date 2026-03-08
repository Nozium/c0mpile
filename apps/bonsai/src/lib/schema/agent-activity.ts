import { z } from "zod";

export const AgentActivityItemSchema = z.object({
  id: z.string(),
  agent_type: z.enum(["evidence", "judgment", "handoff"]),
  event_type: z.string(),
  summary: z.string(),
  status: z.enum(["ready", "running", "waiting"]),
  related_decision_ids: z.array(z.string()).optional(),
  related_observation_ids: z.array(z.string()).optional(),
});
export type AgentActivityItem = z.infer<typeof AgentActivityItemSchema>;
