import { NextRequest, NextResponse } from "next/server";
import { ConstitutionRawInputSchema } from "@/lib/schema";
import { parseConstitution } from "@/features/phase1/constitution/parser";

/**
 * POST /api/parse-constitution
 * Body: { we_are, we_never, we_value }
 * Returns parsed constitution with clauses preview.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ConstitutionRawInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const constitution = parseConstitution(
      `custom-${Date.now()}`,
      "Custom Constitution",
      parsed.data
    );

    return NextResponse.json(constitution);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
