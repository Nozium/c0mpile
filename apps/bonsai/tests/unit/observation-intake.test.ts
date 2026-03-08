import { describe, it, expect } from "vitest";
import {
  importObservationsFromJSON,
  parseCSVToObservations,
  deduplicateObservations,
} from "../../src/features/phase1/observations/intake";

describe("importObservationsFromJSON", () => {
  it("imports valid observations", () => {
    const items = [
      {
        id: "obs-1",
        source: "interview",
        channel_type: "direct_signal",
        raw_text: "I need offline storage",
        extracted_intent: "Wants offline",
        inferred_need: "Data sovereignty",
        signal_type: "pain",
        severity: "critical",
        confidence: 0.9,
        timestamp: "2026-01-01T00:00:00Z",
      },
    ];
    const batch = importObservationsFromJSON(items);
    expect(batch.imported.length).toBe(1);
    expect(batch.errors.length).toBe(0);
  });

  it("reports individual item errors without blocking others", () => {
    const items = [
      {
        id: "obs-1",
        source: "interview",
        channel_type: "direct_signal",
        raw_text: "Valid",
        extracted_intent: "Valid",
        inferred_need: "Valid",
        signal_type: "pain",
        severity: "critical",
        confidence: 0.9,
        timestamp: "2026-01-01T00:00:00Z",
      },
      { id: "obs-2" }, // invalid - missing required fields
    ];
    const batch = importObservationsFromJSON(items);
    expect(batch.imported.length).toBe(1);
    expect(batch.errors.length).toBe(1);
  });
});

describe("parseCSVToObservations", () => {
  it("parses CSV text into records", () => {
    const csv = `id,source,raw_text,signal_type,severity,confidence,timestamp
obs-1,interview,"I need offline",pain,critical,0.9,2026-01-01T00:00:00Z`;

    const records = parseCSVToObservations(csv);
    expect(records.length).toBe(1);
    expect((records[0] as Record<string, unknown>).id).toBe("obs-1");
    expect((records[0] as Record<string, unknown>).confidence).toBe(0.9);
  });
});

describe("deduplicateObservations", () => {
  it("keeps latest observation per id", () => {
    const obs = [
      {
        id: "obs-1",
        source: "a",
        channel_type: "x",
        raw_text: "old",
        extracted_intent: "x",
        inferred_need: "x",
        signal_type: "pain",
        severity: "critical" as const,
        confidence: 0.5,
        timestamp: "2026-01-01T00:00:00Z",
      },
      {
        id: "obs-1",
        source: "a",
        channel_type: "x",
        raw_text: "new",
        extracted_intent: "x",
        inferred_need: "x",
        signal_type: "pain",
        severity: "critical" as const,
        confidence: 0.9,
        timestamp: "2026-02-01T00:00:00Z",
      },
    ];
    const result = deduplicateObservations(obs);
    expect(result.length).toBe(1);
    expect(result[0].raw_text).toBe("new");
  });
});
