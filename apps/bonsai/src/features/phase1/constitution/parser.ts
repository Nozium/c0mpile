import type {
  ConstitutionRawInput,
  ConstitutionAxes,
  Clause,
  Constitution,
} from "@/lib/schema";

/**
 * Parse raw 3-line constitution input into executable clauses.
 *
 * MVP strategy:
 * - we_are   -> target_user, strategic_terrain
 * - we_never -> prohibited_business_model, trust_compliance_rule
 * - we_value -> quality_bar
 *
 * Splits comma/semicolon-separated phrases into individual clause entries.
 */
export function parseConstitution(
  id: string,
  label: string,
  rawInput: ConstitutionRawInput
): Constitution {
  const axes = normalizeToAxes(rawInput);
  const clauses = extractClauses(id, rawInput);
  const desiredTransitions = inferTransitions(rawInput);
  const forbiddenPatterns = inferForbiddenPatterns(rawInput);

  return {
    id,
    label,
    raw_input: rawInput,
    axes,
    clauses,
    desired_transitions: desiredTransitions,
    forbidden_patterns: forbiddenPatterns,
  };
}

/** Split a raw line into phrase segments */
function splitPhrases(text: string): string[] {
  return text
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** 5-axis normalization from raw input */
function normalizeToAxes(input: ConstitutionRawInput): ConstitutionAxes {
  return {
    target_user: input.we_are,
    prohibited_business_model: input.we_never,
    quality_bar: extractQualityBar(input.we_value),
    strategic_terrain: extractStrategicTerrain(input.we_are),
    trust_compliance_rule: extractTrustRule(input.we_never, input.we_value),
  };
}

function extractQualityBar(weValue: string): string {
  const phrases = splitPhrases(weValue);
  // Quality bar: phrases that express preference ordering ("X over Y")
  const qualityPhrases = phrases.filter((p) => /\bover\b/i.test(p));
  return qualityPhrases.length > 0 ? qualityPhrases.join("; ") : weValue;
}

function extractStrategicTerrain(weAre: string): string {
  // Strategic terrain: derived from identity statement
  return weAre;
}

function extractTrustRule(weNever: string, weValue: string): string {
  const parts: string[] = [];
  const neverPhrases = splitPhrases(weNever);
  for (const p of neverPhrases) {
    if (/trust|data|privacy|compliance|security/i.test(p)) {
      parts.push(p);
    }
  }
  const valuePhrases = splitPhrases(weValue);
  for (const p of valuePhrases) {
    if (/trust|privacy|transparency|security/i.test(p)) {
      parts.push(p);
    }
  }
  return parts.length > 0 ? parts.join("; ") : weNever;
}

/** Extract individual clauses from raw input */
function extractClauses(
  constitutionId: string,
  input: ConstitutionRawInput
): Clause[] {
  const clauses: Clause[] = [];
  let idx = 0;

  // we_are -> desired clauses about target user and strategic terrain
  for (const phrase of splitPhrases(input.we_are)) {
    clauses.push({
      id: `${constitutionId}-clause-${idx++}`,
      axis: "target_user",
      source_line: "we_are",
      text: phrase,
      type: "soft",
      polarity: "desired",
    });
  }

  // we_never -> hard forbidden clauses
  for (const phrase of splitPhrases(input.we_never)) {
    clauses.push({
      id: `${constitutionId}-clause-${idx++}`,
      axis: "prohibited_business_model",
      source_line: "we_never",
      text: phrase,
      type: "hard",
      polarity: "forbidden",
    });
  }

  // we_value -> soft desired clauses about quality bar
  for (const phrase of splitPhrases(input.we_value)) {
    clauses.push({
      id: `${constitutionId}-clause-${idx++}`,
      axis: "quality_bar",
      source_line: "we_value",
      text: phrase,
      type: "soft",
      polarity: "desired",
    });
  }

  return clauses;
}

/** Infer desired state transitions from raw input */
function inferTransitions(input: ConstitutionRawInput): string[] {
  const transitions: string[] = [];
  // Look for "X over Y" patterns in we_value
  for (const phrase of splitPhrases(input.we_value)) {
    const match = phrase.match(/(.+?)\s+over\s+(.+)/i);
    if (match) {
      transitions.push(`${match[2].trim()} → ${match[1].trim()}`);
    }
  }
  return transitions;
}

/** Infer forbidden patterns from we_never */
function inferForbiddenPatterns(input: ConstitutionRawInput): string[] {
  return splitPhrases(input.we_never);
}

/** Check if a feature theme matches any hard forbidden clause */
export function findViolations(
  clauses: Clause[],
  themeDescription: string,
  observationTexts: string[]
): { clause: Clause; reason: string }[] {
  const violations: { clause: Clause; reason: string }[] = [];
  const hardClauses = clauses.filter((c) => c.type === "hard");
  const combined = [themeDescription, ...observationTexts].join(" ").toLowerCase();

  for (const clause of hardClauses) {
    const keywords = extractKeywords(clause.text);
    const matchingKeywords = keywords.filter((kw) => combined.includes(kw));
    if (matchingKeywords.length >= 2) {
      violations.push({
        clause,
        reason: `Theme content matches forbidden clause "${clause.text}" (matched: ${matchingKeywords.join(", ")})`,
      });
    }
  }

  return violations;
}

/** Extract significant keywords from clause text */
function extractKeywords(text: string): string[] {
  const stopwords = new Set([
    "a", "an", "the", "or", "and", "to", "of", "in", "for", "on", "with",
    "that", "is", "are", "was", "were", "be", "been", "any", "not", "no",
  ]);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopwords.has(w));
}

/** Check alignment: does a theme support desired transitions? */
export function findAlignments(
  clauses: Clause[],
  themeDescription: string,
  observationTexts: string[]
): { clause: Clause; reason: string }[] {
  const alignments: { clause: Clause; reason: string }[] = [];
  const desiredClauses = clauses.filter(
    (c) => c.polarity === "desired" && c.type === "soft"
  );
  const combined = [themeDescription, ...observationTexts].join(" ").toLowerCase();

  for (const clause of desiredClauses) {
    const keywords = extractKeywords(clause.text);
    const matchingKeywords = keywords.filter((kw) => combined.includes(kw));
    if (matchingKeywords.length >= 2) {
      alignments.push({
        clause,
        reason: `Theme aligns with "${clause.text}" (matched: ${matchingKeywords.join(", ")})`,
      });
    }
  }

  return alignments;
}
