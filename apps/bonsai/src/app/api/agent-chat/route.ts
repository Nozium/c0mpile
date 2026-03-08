import { NextRequest, NextResponse } from "next/server";
import { spawnSync } from "child_process";
import { z } from "zod";
import { buildAgentPrompt } from "@/lib/agent-prompts";
import { AgentChatContextSchema } from "@/lib/schema";

const RequestSchema = z.object({
  agent_type: z.enum(["evidence", "judgment", "handoff"]),
  message: z.string().min(1),
  context: AgentChatContextSchema.optional().default({}),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { agent_type, message, context } = parsed.data;
    const prompt = buildAgentPrompt(agent_type, message, context);

    const result = spawnSync("claude", ["-p", prompt], {
      timeout: 30_000,
      encoding: "utf-8",
      env: { ...process.env },
    });

    if (result.error || result.status !== 0) {
      const fallback =
        agent_type === "evidence"
          ? "Evidence Agent is currently processing. Please try again."
          : agent_type === "judgment"
          ? "Judgment Agent is currently evaluating. Please try again."
          : "Handoff Agent is currently preparing. Please try again.";

      return NextResponse.json({
        response: fallback,
        agent_type,
        error: true,
      });
    }

    const response = (result.stdout ?? "").trim();

    return NextResponse.json({
      response: response || "No response generated.",
      agent_type,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
