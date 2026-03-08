import type { AgentChatContext } from "@/lib/schema";

type AgentType = "evidence" | "judgment" | "handoff";

const ROLE_DESCRIPTIONS: Record<AgentType, string> = {
  evidence: `You are the Evidence Agent in BONSAI, a constitutional product allocation system.
Your role: structure raw observations (customer interviews, usage data, reviews, support tickets) into themes.
You can explain observation clustering, identify evidence gaps, and suggest what additional data is needed.
You speak from the perspective of the data — what customers actually said and did.`,

  judgment: `You are the Judgment Agent in BONSAI, a constitutional product allocation system.
Your role: evaluate themes against the brand constitution and decide build/defer/kill.
You can explain why a decision was made, which clauses were violated or aligned, and what conditions would change the verdict.
You speak from the perspective of constitutional reasoning — principled product judgment.`,

  handoff: `You are the Handoff Agent in BONSAI, a constitutional product allocation system.
Your role: prepare execution packets, Rork briefs, and coding agent exports for surviving build decisions.
You can generate implementation briefs, break down coding tasks, and explain what builders need to do.
You speak from the perspective of execution — turning decisions into actionable work.`,
};

function formatContext(ctx: AgentChatContext): string {
  const parts: string[] = [];

  if (ctx.constitution) {
    parts.push(
      `[Constitution: ${ctx.constitution.label}]`,
      `We are: ${ctx.constitution.we_are}`,
      `We never: ${ctx.constitution.we_never}`,
      `We value: ${ctx.constitution.we_value}`
    );
  }

  if (ctx.run_summary) {
    parts.push(
      `[Run Summary] Build: ${ctx.run_summary.build_count}, Defer: ${ctx.run_summary.defer_count}, Kill: ${ctx.run_summary.kill_count}`
    );
  }

  if (ctx.decision) {
    const d = ctx.decision;
    parts.push(
      `[Decision: ${d.theme_label}]`,
      `Verdict: ${d.verdict} (${(d.confidence * 100).toFixed(0)}% confidence)`,
      d.build_rationale ? `Rationale: ${d.build_rationale}` : "",
      d.kill_reason ? `Kill reason: ${d.kill_reason}` : "",
      d.defer_reason ? `Defer reason: ${d.defer_reason}` : "",
      `Outline: ${d.feature_outline_summary}`
    );
    if (d.supporting_evidence.length > 0) {
      const evidenceSnippets = d.supporting_evidence
        .slice(0, 5)
        .map((e) => `  - ${e.raw_text.slice(0, 80)}`)
        .join("\n");
      parts.push(`Evidence:\n${evidenceSnippets}`);
    }
  }

  if (ctx.observations && ctx.observations.length > 0) {
    const obsSnippets = ctx.observations
      .slice(0, 8)
      .map((o) => `  - [${o.source}/${o.severity}] ${o.raw_text.slice(0, 60)}`)
      .join("\n");
    parts.push(`[Observations: ${ctx.observations.length} total]\n${obsSnippets}`);
  }

  return parts.filter(Boolean).join("\n");
}

export function buildAgentPrompt(
  agentType: AgentType,
  userMessage: string,
  context: AgentChatContext
): string {
  const role = ROLE_DESCRIPTIONS[agentType];
  const ctx = formatContext(context);

  return [
    role,
    "",
    "Rules:",
    "- Respond concisely (under 300 chars, max 500). Be direct.",
    "- Match the user's language (Japanese or English).",
    "- Reference specific evidence, clauses, or decisions when relevant.",
    "- Do not hallucinate data — only reference what is in the context below.",
    "",
    ctx ? `--- Context ---\n${ctx}\n--- End Context ---` : "(No context provided)",
    "",
    `User: ${userMessage}`,
  ].join("\n");
}
