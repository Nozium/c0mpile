import type { DecisionLogEntry, ShareableSummary } from "@/lib/schema";
import type { AllocationRun } from "@/lib/schema";

/**
 * In-memory decision log store for MVP.
 * Replace with persistent storage post-traction.
 */
const entries: DecisionLogEntry[] = [];

export function addLogEntry(entry: DecisionLogEntry): void {
  entries.push(entry);
}

export function getLogEntries(decisionId?: string): DecisionLogEntry[] {
  if (decisionId) {
    return entries.filter((e) => e.decision_id === decisionId);
  }
  return [...entries];
}

export function getLogEntriesByRunId(runId: string): DecisionLogEntry[] {
  return entries.filter((e) => e.decision_id.startsWith("decision-"));
}

export function clearLog(): void {
  entries.length = 0;
}

/** Generate a shareable summary from an allocation run and its decision log */
export function generateShareableSummary(run: AllocationRun): ShareableSummary {
  const overrides = entries
    .filter((e) => e.action === "override" && e.previous_verdict && e.new_verdict)
    .map((e) => {
      const decision = run.decisions.find((d) => d.id === e.decision_id);
      return {
        theme_label: decision?.theme_label ?? e.decision_id,
        from: e.previous_verdict!,
        to: e.new_verdict!,
        reason: e.reason,
      };
    });

  const keyKills = run.decisions
    .filter((d) => d.verdict === "kill")
    .map((d) => ({
      theme_label: d.theme_label,
      reason: d.kill_reason ?? "",
      violated_clauses: d.violated_clauses.map((vc) => `[${vc.axis}] ${vc.clause_text}`),
    }));

  const keyBuilds = run.decisions
    .filter((d) => d.verdict === "build")
    .map((d) => ({
      theme_label: d.theme_label,
      rationale: d.build_rationale ?? "",
    }));

  return {
    run_id: run.id,
    constitution_label: run.constitution_label,
    generated_at: new Date().toISOString(),
    total_decisions: run.decisions.length,
    build_count: run.summary.build_count,
    defer_count: run.summary.defer_count,
    kill_count: run.summary.kill_count,
    overrides,
    key_kills: keyKills,
    key_builds: keyBuilds,
  };
}
