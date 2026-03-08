import { NextResponse } from "next/server";
import { loadConstitutions } from "@/data/fixtures/loader";

/** GET /api/constitutions - List available constitutions */
export async function GET() {
  try {
    const constitutions = loadConstitutions();
    return NextResponse.json(constitutions);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
