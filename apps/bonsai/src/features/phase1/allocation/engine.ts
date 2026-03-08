import type {
  Constitution,
  Observation,
  Theme,
  Decision,
  AllocationRun,
  EvidenceRef,
  ViolatedClause,
} from "@/lib/schema";
import { findViolations, findAlignments } from "../constitution/parser";

/**
 * Allocation Engine — Phase1 MVP core.
 *
 * Pipeline: Extract -> Cluster (themes) -> Constitutional Filter -> Decision
 *
 * Phase1 uses pre-shaped themes from demo dataset.
 * LLM-powered extract/cluster is deferred; deterministic filter logic is the core.
 */

export interface AllocationInput {
  constitution: Constitution;
  observations: Observation[];
  themes: Theme[];
}

/**
 * Run the allocation engine:
 * For each theme, evaluate against constitution clauses and observations.
 * Return build / defer / kill decisions with evidence and clause references.
 */
export function runAllocation(input: AllocationInput): AllocationRun {
  const { constitution, observations, themes } = input;
  const observationMap = new Map(observations.map((o) => [o.id, o]));
  const decisions: Decision[] = [];

  for (const theme of themes) {
    const decision = evaluateTheme(theme, constitution, observationMap);
    decisions.push(decision);
  }

  const summary = {
    build_count: decisions.filter((d) => d.verdict === "build").length,
    defer_count: decisions.filter((d) => d.verdict === "defer").length,
    kill_count: decisions.filter((d) => d.verdict === "kill").length,
  };

  return {
    id: `run-${constitution.id}-${Date.now()}`,
    constitution_id: constitution.id,
    constitution_label: constitution.label,
    timestamp: new Date().toISOString(),
    observation_count: observations.length,
    theme_count: themes.length,
    decisions,
    summary,
  };
}

/**
 * Evaluate a single theme against constitution.
 * Returns build, defer, or kill with evidence trail.
 */
function evaluateTheme(
  theme: Theme,
  constitution: Constitution,
  observationMap: Map<string, Observation>
): Decision {
  const themeObservations = theme.observation_ids
    .map((id) => observationMap.get(id))
    .filter((o): o is Observation => o !== undefined);

  const observationTexts = themeObservations.map((o) => o.raw_text);

  // Step 1: Check for hard clause violations (forbidden patterns)
  const violations = findViolations(
    constitution.clauses,
    theme.description,
    observationTexts
  );

  // Step 2: Check for positive alignment with desired clauses
  const alignments = findAlignments(
    constitution.clauses,
    theme.description,
    observationTexts
  );

  // Step 3: Build evidence refs from observations
  const evidenceRefs = buildEvidenceRefs(themeObservations);

  // Step 4: Calculate signals
  const urgencyScore = theme.urgency === "high" ? 1.0 : theme.urgency === "medium" ? 0.6 : 0.3;
  const avgConfidence = themeObservations.length > 0
    ? themeObservations.reduce((sum, o) => sum + o.confidence, 0) / themeObservations.length
    : 0.5;
  const criticalCount = themeObservations.filter((o) => o.severity === "critical").length;

  // Step 5: Decision logic
  const violatedClauses: ViolatedClause[] = violations.map((v) => ({
    clause_id: v.clause.id,
    clause_text: v.clause.text,
    axis: v.clause.axis,
    violation_reason: v.reason,
  }));

  let verdict: "build" | "defer" | "kill";
  let killReason: string | undefined;
  let deferReason: string | undefined;
  let buildRationale: string | undefined;

  if (violations.length > 0) {
    // Hard violation -> kill
    verdict = "kill";
    killReason = `Violates ${violations.length} constitutional clause(s): ${violations.map((v) => v.clause.text).join("; ")}`;
  } else if (alignments.length === 0 && urgencyScore < 0.7) {
    // No alignment and low urgency -> defer
    verdict = "defer";
    deferReason = `No strong constitutional alignment found and urgency is ${theme.urgency}. Evidence is insufficient to prioritize.`;
  } else if (alignments.length > 0 && (urgencyScore >= 0.7 || criticalCount >= 2)) {
    // Strong alignment + urgent -> build
    verdict = "build";
    buildRationale = `Aligns with ${alignments.length} clause(s) and supported by ${criticalCount} critical observations. ${alignments.map((a) => a.reason).join("; ")}`;
  } else if (alignments.length > 0) {
    // Some alignment but not urgent enough -> defer
    verdict = "defer";
    deferReason = `Partial alignment with constitution (${alignments.length} clause(s)) but urgency is ${theme.urgency}. Consider for next cycle.`;
  } else {
    // No clear signal -> defer
    verdict = "defer";
    deferReason = `Insufficient evidence to decide. ${themeObservations.length} observations evaluated, no strong constitutional signal.`;
  }

  const confidence = calculateDecisionConfidence(
    violations.length,
    alignments.length,
    avgConfidence,
    themeObservations.length
  );

  return {
    id: `decision-${theme.id}`,
    theme_id: theme.id,
    theme_label: theme.label,
    verdict,
    confidence,
    feature_outline_summary: generateFeatureOutline(theme, verdict),
    violated_clauses: violatedClauses,
    supporting_evidence: evidenceRefs,
    kill_reason: killReason,
    defer_reason: deferReason,
    build_rationale: buildRationale,
  };
}

function buildEvidenceRefs(observations: Observation[]): EvidenceRef[] {
  return observations.map((obs) => ({
    observation_id: obs.id,
    raw_text: obs.raw_text,
    relevance: `${obs.signal_type} signal (${obs.severity}, confidence: ${obs.confidence})`,
  }));
}

function calculateDecisionConfidence(
  violationCount: number,
  alignmentCount: number,
  avgObsConfidence: number,
  observationCount: number
): number {
  // Hard violations give high confidence in kill
  if (violationCount > 0) {
    return Math.min(0.95, 0.7 + violationCount * 0.1);
  }
  // More alignments + higher observation confidence = more confident build
  const alignmentBoost = Math.min(alignmentCount * 0.15, 0.3);
  const observationBoost = observationCount >= 3 ? 0.1 : 0;
  return Math.min(0.95, Math.max(0.3, avgObsConfidence * 0.5 + alignmentBoost + observationBoost));
}

function generateFeatureOutline(
  theme: Theme,
  verdict: "build" | "defer" | "kill"
): string {
  if (verdict === "kill") {
    return `[KILL] ${theme.label}: ${theme.description}. This direction conflicts with constitutional constraints.`;
  }
  if (verdict === "defer") {
    return `[DEFER] ${theme.label}: ${theme.description}. Revisit when more evidence supports prioritization.`;
  }
  return `[BUILD] ${theme.label}: ${theme.description}. Aligned with constitutional direction and supported by customer evidence.`;
}

/**
 * Compare two allocation runs and find decisions that differ.
 * Used for Constitution A/B demo.
 */
export function diffAllocationRuns(
  runA: AllocationRun,
  runB: AllocationRun
): { theme_id: string; theme_label: string; verdict_a: string; verdict_b: string }[] {
  const diffs: { theme_id: string; theme_label: string; verdict_a: string; verdict_b: string }[] = [];
  const bMap = new Map(runB.decisions.map((d) => [d.theme_id, d]));

  for (const decisionA of runA.decisions) {
    const decisionB = bMap.get(decisionA.theme_id);
    if (decisionB && decisionA.verdict !== decisionB.verdict) {
      diffs.push({
        theme_id: decisionA.theme_id,
        theme_label: decisionA.theme_label,
        verdict_a: decisionA.verdict,
        verdict_b: decisionB.verdict,
      });
    }
  }

  return diffs;
}
