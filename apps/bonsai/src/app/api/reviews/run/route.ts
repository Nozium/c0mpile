import { NextRequest, NextResponse } from "next/server";
import { RunReviewRequestSchema } from "@/lib/schema";
import { runReview, storeReview } from "@/features/phase3/virtual-staff/engine";

/**
 * POST /api/reviews/run
 * Start a virtual staff review.
 *
 * Body: {
 *   target_type: "constitution" | "proposal" | "pipeline_run",
 *   target_id: string,
 *   reviewer_types?: ReviewerType[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RunReviewRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const review = runReview(parsed.data);
    storeReview(review);

    return NextResponse.json(review);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
