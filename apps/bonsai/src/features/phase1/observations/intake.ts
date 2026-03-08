import { z } from "zod";
import { ObservationSchema, type Observation } from "@/lib/schema";

/** Import result per item */
export type ImportResult =
  | { status: "ok"; observation: Observation }
  | { status: "error"; index: number; errors: string[] };

/** Import batch summary */
export interface ImportBatch {
  batch_id: string;
  timestamp: string;
  total: number;
  imported: Observation[];
  errors: ImportResult[];
}

/**
 * Import observations from raw JSON array.
 * Validates each item individually so partial imports succeed.
 */
export function importObservationsFromJSON(
  rawItems: unknown[],
  batchId?: string
): ImportBatch {
  const imported: Observation[] = [];
  const errors: ImportResult[] = [];

  for (let i = 0; i < rawItems.length; i++) {
    const result = ObservationSchema.safeParse(rawItems[i]);
    if (result.success) {
      imported.push(result.data);
    } else {
      errors.push({
        status: "error",
        index: i,
        errors: result.error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`
        ),
      });
    }
  }

  return {
    batch_id: batchId ?? `batch-${Date.now()}`,
    timestamp: new Date().toISOString(),
    total: rawItems.length,
    imported,
    errors,
  };
}

/**
 * Parse CSV text into observation-like records.
 * Expects headers: id, source, raw_text, signal_type, severity, confidence, timestamp
 * Minimal columns required; extra columns are preserved as-is.
 */
export function parseCSVToObservations(csvText: string): unknown[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const records: Record<string, string | number>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const record: Record<string, string | number> = {};
    for (let j = 0; j < headers.length; j++) {
      const val = values[j]?.trim() ?? "";
      // Attempt numeric conversion for known numeric fields
      if (["confidence", "weight", "sentiment", "company_size"].includes(headers[j])) {
        const num = Number(val);
        record[headers[j]] = isNaN(num) ? val : num;
      } else {
        record[headers[j]] = val;
      }
    }
    records.push(record);
  }

  return records;
}

/** Simple CSV line parser that handles quoted values */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/** Deduplicate observations by id, keeping the latest */
export function deduplicateObservations(
  observations: Observation[]
): Observation[] {
  const map = new Map<string, Observation>();
  for (const obs of observations) {
    const existing = map.get(obs.id);
    if (!existing || obs.timestamp > existing.timestamp) {
      map.set(obs.id, obs);
    }
  }
  return Array.from(map.values());
}
