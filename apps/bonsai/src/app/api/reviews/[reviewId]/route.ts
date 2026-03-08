import { NextRequest, NextResponse } from "next/server";
import { getReview } from "@/features/phase3/virtual-staff/engine";
import { loadDemoReviewById } from "@/features/phase3/virtual-staff/demo-reviews";

/**
 * GET /api/reviews/:reviewId
 * Retrieve a specific review result.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  const { reviewId } = await params;

  // Check in-memory store first, then demo data
  const review = getReview(reviewId) ?? loadDemoReviewById(reviewId);

  if (!review) {
    return NextResponse.json(
      { error: `Review not found: ${reviewId}` },
      { status: 404 },
    );
  }

  return NextResponse.json(review);
}
