import type {
  ReviewerType,
  ReviewQuestion,
  StaffReview,
  ReviewResponse,
  Severity,
} from "@/lib/schema";
import { getPersonasByTypes } from "./personas";
import { loadConstitutionById } from "@/data/fixtures/loader";
import { loadDemoReview } from "./demo-reviews";

/**
 * Run a virtual staff review against a target.
 *
 * Current implementation uses pre-computed demo data.
 * Future: replace with LLM calls via Vercel AI SDK generateObject().
 */
export function runReview(params: {
  target_type: "constitution" | "proposal" | "pipeline_run";
  target_id: string;
  reviewer_types?: ReviewerType[];
}): StaffReview {
  const { target_type, target_id, reviewer_types } = params;

  // Try demo data first
  const demo = loadDemoReview(target_type, target_id);
  if (demo) return demo;

  // Fallback: generate deterministic review from persona axes
  const personas = getPersonasByTypes(reviewer_types);
  const questions: ReviewQuestion[] = [];
  let qIndex = 0;

  for (const persona of personas) {
    // Load target context for question generation
    const context = loadTargetContext(target_type, target_id);

    for (const axis of persona.evaluation_axes) {
      const q = generateDeterministicQuestion(
        persona.type,
        axis.axis_id,
        axis.axis_name,
        axis.description,
        context,
        qIndex++,
      );
      questions.push(q);
    }
  }

  const summary = computeSummary(questions);
  const reviewId = `review-${target_type}-${target_id}-${Date.now()}`;

  return {
    id: reviewId,
    target_type,
    target_id,
    reviewer_types: personas.map((p) => p.type),
    questions,
    summary,
    created_at: new Date().toISOString(),
  };
}

function loadTargetContext(
  targetType: string,
  targetId: string,
): string {
  if (targetType === "constitution") {
    const c = loadConstitutionById(targetId);
    if (c) {
      return [
        `Constitution: ${c.label}`,
        `We are: ${c.raw_input.we_are}`,
        `We never: ${c.raw_input.we_never}`,
        `We value: ${c.raw_input.we_value}`,
        `Clauses: ${c.clauses.map((cl) => cl.text).join("; ")}`,
      ].join("\n");
    }
  }
  return `${targetType}: ${targetId}`;
}

function generateDeterministicQuestion(
  reviewerType: ReviewerType,
  axisId: string,
  axisName: string,
  axisDescription: string,
  _context: string,
  index: number,
): ReviewQuestion {
  // Assign severity based on axis importance patterns
  const severity = inferSeverity(reviewerType, axisId);

  return {
    id: `rq-${reviewerType}-${axisId}-${index}`,
    reviewer_type: reviewerType,
    axis_id: axisId,
    question: `[${axisName}] ${axisDescription}`,
    why_this_matters: `This axis evaluates whether the target adequately addresses ${axisName.toLowerCase()}. Gaps here indicate a structural blind spot.`,
    severity,
  };
}

function inferSeverity(reviewerType: ReviewerType, axisId: string): Severity {
  const fatalAxes: Record<string, string[]> = {
    yc_partner: ["problem_reality", "traction"],
    first_principles: ["bottleneck_physics", "10x_test"],
    customer_advocate: ["job_clarity", "target_paradox"],
    strategic_skeptic: ["moat_type", "incumbent_response"],
  };
  const criticalAxes: Record<string, string[]> = {
    yc_partner: ["market_size", "competition", "unit_economics"],
    first_principles: ["irreducible_core", "complexity_audit"],
    customer_advocate: ["switching_motivation", "willingness_to_pay"],
    strategic_skeptic: ["category_risk", "dependency_risk"],
  };

  if (fatalAxes[reviewerType]?.includes(axisId)) return "fatal";
  if (criticalAxes[reviewerType]?.includes(axisId)) return "critical";
  return "important";
}

export function computeSummary(questions: ReviewQuestion[]): StaffReview["summary"] {
  const fatal = questions.filter((q) => q.severity === "fatal");
  const critical = questions.filter((q) => q.severity === "critical");
  const important = questions.filter((q) => q.severity === "important");
  const probe = questions.filter((q) => q.severity === "probe");

  const topBlindSpot = fatal.length > 0
    ? fatal[0].question
    : critical.length > 0
      ? critical[0].question
      : "No major blind spots detected";

  return {
    total_questions: questions.length,
    fatal_count: fatal.length,
    critical_count: critical.length,
    important_count: important.length,
    probe_count: probe.length,
    top_blind_spot: topBlindSpot,
    overall_assessment:
      fatal.length > 0
        ? `${fatal.length} fatal question(s) require immediate attention before proceeding.`
        : critical.length > 0
          ? `No fatal issues, but ${critical.length} critical question(s) need resolution.`
          : "Advisory review complete. No blocking issues found.",
  };
}

// --- In-memory response store (demo only) ---

const responseStore = new Map<string, ReviewResponse[]>();

export function getResponses(reviewId: string): ReviewResponse[] {
  return responseStore.get(reviewId) ?? [];
}

export function addResponse(response: ReviewResponse): void {
  const existing = responseStore.get(response.review_id) ?? [];
  // Replace if same question_id already answered
  const filtered = existing.filter((r) => r.question_id !== response.question_id);
  filtered.push(response);
  responseStore.set(response.review_id, filtered);
}

// --- In-memory review store (demo only) ---

const reviewStore = new Map<string, StaffReview>();

export function storeReview(review: StaffReview): void {
  reviewStore.set(review.id, review);
}

export function getReview(reviewId: string): StaffReview | undefined {
  return reviewStore.get(reviewId);
}

export function getReviewsByTarget(
  targetType: string,
  targetId: string,
): StaffReview[] {
  return Array.from(reviewStore.values()).filter(
    (r) => r.target_type === targetType && r.target_id === targetId,
  );
}
