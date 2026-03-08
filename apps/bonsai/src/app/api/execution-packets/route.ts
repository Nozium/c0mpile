import { NextResponse } from "next/server";
import { loadExecutionPackets } from "@/data/fixtures/loader";

/** GET /api/execution-packets — list all pre-computed execution packets */
export async function GET() {
  try {
    const packets = loadExecutionPackets();
    return NextResponse.json({ execution_packets: packets });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
