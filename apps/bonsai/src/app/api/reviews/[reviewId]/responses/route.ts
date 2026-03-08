import { NextRequest, NextResponse } from "next/server";
import { SubmitResponseRequestSchema } from "@/lib/schema";
import { addResponse, getResponses } from "@/features/phase3/virtual-staff/engine";

/**
 * GET /api/reviews/:reviewId/responses
 * List all responses for a review.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  const { reviewId } = await params;
  const responses = getResponses(reviewId);
  return NextResponse.json(responses);
}

/**
 * POST /api/reviews/:reviewId/responses
 * Submit a response to a review question.
 *
 * Body: {
 *   question_id: string,
 *   response_text: string,
 *   status: "answered" | "acknowledged" | "dismissed" | "action_taken",
 *   dismiss_reason?: string
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  try {
    const { reviewId } = await params;
    const body = await request.json();
    const parsed = SubmitResponseRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const response = {
      id: `resp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      review_id: reviewId,
      ...parsed.data,
      created_at: new Date().toISOString(),
    };

    addResponse(response);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
