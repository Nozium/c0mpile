import { readFileSync } from "fs";
import { resolve } from "path";
import { z } from "zod";
import {
  ConstitutionAxesSchema,
  ConstitutionRawInputSchema,
  ObservationSchema,
  ThemeSchema,
  ProposalSchema,
  ExecutionPacketSchema,
} from "@/lib/schema";
import type { Constitution, Observation, Theme, Clause, Proposal, ExecutionPacket } from "@/lib/schema";

const DATA_DIR = resolve(process.cwd(), "../../data/demo");

/** Raw fixture schema matching data/demo/constitutions.json */
const ConstitutionFixtureSchema = z.object({
  id: z.string(),
  label: z.string(),
  raw_input: ConstitutionRawInputSchema,
  axes: ConstitutionAxesSchema,
  desired_transitions: z.array(z.string()),
  forbidden_patterns: z.array(z.string()),
});

function fixtureToConstitution(
  raw: z.infer<typeof ConstitutionFixtureSchema>
): Constitution {
  const clauses = deriveClausesFromAxes(raw.id, raw.axes, raw.forbidden_patterns);
  return { ...raw, clauses };
}

/** Derive executable clauses from 5-axis normalization + forbidden patterns */
function deriveClausesFromAxes(
  constitutionId: string,
  axes: z.infer<typeof ConstitutionAxesSchema>,
  forbiddenPatterns: string[]
): Clause[] {
  const clauses: Clause[] = [];
  const axisEntries = Object.entries(axes) as [Clause["axis"], string][];

  for (const [axis, text] of axisEntries) {
    const sourceLine =
      axis === "prohibited_business_model" ? "we_never" :
      axis === "target_user" ? "we_are" : "we_value";
    const polarity = axis === "prohibited_business_model" ? "forbidden" : "desired";
    const type = axis === "prohibited_business_model" || axis === "trust_compliance_rule"
      ? "hard"
      : "soft";

    clauses.push({
      id: `${constitutionId}-${axis}`,
      axis,
      source_line: sourceLine,
      text,
      type,
      polarity,
    });
  }

  for (let i = 0; i < forbiddenPatterns.length; i++) {
    clauses.push({
      id: `${constitutionId}-forbidden-${i}`,
      axis: "prohibited_business_model",
      source_line: "we_never",
      text: forbiddenPatterns[i],
      type: "hard",
      polarity: "forbidden",
    });
  }

  return clauses;
}

export function loadConstitutions(): Constitution[] {
  const raw = JSON.parse(readFileSync(resolve(DATA_DIR, "constitutions.json"), "utf-8"));
  return raw.constitutions.map((c: unknown) => {
    const parsed = ConstitutionFixtureSchema.parse(c);
    return fixtureToConstitution(parsed);
  });
}

export function loadObservations(): Observation[] {
  const raw = JSON.parse(readFileSync(resolve(DATA_DIR, "observations.json"), "utf-8"));
  return z.array(ObservationSchema).parse(raw.observations);
}

export function loadThemes(): Theme[] {
  const raw = JSON.parse(readFileSync(resolve(DATA_DIR, "themes.json"), "utf-8"));
  return z.array(ThemeSchema).parse(raw.themes);
}

export function loadConstitutionById(id: string): Constitution | undefined {
  return loadConstitutions().find((c) => c.id === id);
}

export function loadProposals(): Proposal[] {
  const raw = JSON.parse(readFileSync(resolve(DATA_DIR, "proposals.json"), "utf-8"));
  return z.array(ProposalSchema).parse(raw.proposals);
}

export function loadProposalById(id: string): Proposal | undefined {
  return loadProposals().find((p) => p.id === id);
}

export function loadExecutionPackets(): ExecutionPacket[] {
  const raw = JSON.parse(readFileSync(resolve(DATA_DIR, "execution-packets.json"), "utf-8"));
  return z.array(ExecutionPacketSchema).parse(raw.execution_packets);
}

export function loadExecutionPacketByProposalId(proposalId: string): ExecutionPacket | undefined {
  return loadExecutionPackets().find((ep) => ep.proposal_id === proposalId);
}
