import { z } from "zod";

export const AgentChatContextSchema = z.object({
  constitution: z
    .object({
      we_are: z.string(),
      we_never: z.string(),
      we_value: z.string(),
      label: z.string(),
    })
    .optional(),
  decision: z
    .object({
      theme_label: z.string(),
      verdict: z.string(),
      confidence: z.number(),
      kill_reason: z.string().optional(),
      defer_reason: z.string().optional(),
      build_rationale: z.string().optional(),
      feature_outline_summary: z.string(),
      supporting_evidence: z.array(
        z.object({ observation_id: z.string(), raw_text: z.string() })
      ),
    })
    .optional(),
  observations: z
    .array(
      z.object({
        id: z.string(),
        raw_text: z.string(),
        source: z.string(),
        channel_type: z.string(),
        severity: z.string(),
      })
    )
    .optional(),
  run_summary: z
    .object({
      build_count: z.number(),
      defer_count: z.number(),
      kill_count: z.number(),
    })
    .optional(),
});
export type AgentChatContext = z.infer<typeof AgentChatContextSchema>;

export const AgentChatMessageSchema = z.object({
  id: z.string(),
  agent_type: z.enum(["evidence", "judgment", "handoff"]),
  role: z.enum(["user", "agent"]),
  content: z.string(),
  timestamp: z.string(),
});
export type AgentChatMessage = z.infer<typeof AgentChatMessageSchema>;
