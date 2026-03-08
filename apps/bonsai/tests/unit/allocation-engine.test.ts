import { describe, it, expect } from "vitest";
import {
  runAllocation,
  diffAllocationRuns,
} from "../../src/features/phase1/allocation/engine";
import { parseConstitution } from "../../src/features/phase1/constitution/parser";
import type { Observation, Theme } from "../../src/lib/schema";

// Minimal test fixtures
const observations: Observation[] = [
  {
    id: "obs-t1",
    source: "interview",
    channel_type: "direct_signal",
    raw_text: "I need offline-first data storage, privacy is critical for our knowledge workers",
    extracted_intent: "Wants offline data storage",
    inferred_need: "Data sovereignty",
    signal_type: "pain",
    severity: "critical",
    confidence: 0.9,
    timestamp: "2026-01-01T00:00:00Z",
  },
  {
    id: "obs-t2",
    source: "interview",
    channel_type: "direct_signal",
    raw_text: "Show me ads and engagement dark patterns to increase monetization, sell user data",
    extracted_intent: "Wants engagement features",
    inferred_need: "Engagement-driven",
    signal_type: "desire",
    severity: "critical",
    confidence: 0.85,
    timestamp: "2026-01-01T00:00:00Z",
  },
  {
    id: "obs-t3",
    source: "interview",
    channel_type: "direct_signal",
    raw_text: "We need real-time team collaboration for our startup",
    extracted_intent: "Wants collaboration",
    inferred_need: "Team collaboration",
    signal_type: "desire",
    severity: "major",
    confidence: 0.8,
    timestamp: "2026-01-01T00:00:00Z",
  },
];

const themes: Theme[] = [
  {
    id: "theme-t1",
    label: "Offline Privacy Storage",
    description: "Users demand privacy-first offline data storage for knowledge workers",
    anti_theme: "Cloud-only storage",
    observation_ids: ["obs-t1"],
    evidence_count: 1,
    urgency: "high",
    affected_state_clusters: ["privacy-workers"],
    predicted_transition: "cloud -> offline",
  },
  {
    id: "theme-t2",
    label: "Engagement Ads Monetization",
    description: "Show ads and dark patterns to sell user data and increase engagement metrics",
    anti_theme: "No ads",
    observation_ids: ["obs-t2"],
    evidence_count: 1,
    urgency: "high",
    affected_state_clusters: ["ad-driven"],
    predicted_transition: "organic -> ad-driven",
  },
  {
    id: "theme-t3",
    label: "Team Collaboration",
    description: "Real-time collaborative features for fast-moving startup teams",
    anti_theme: "Solo-first design",
    observation_ids: ["obs-t3"],
    evidence_count: 1,
    urgency: "medium",
    affected_state_clusters: ["teams"],
    predicted_transition: "solo -> team",
  },
];

describe("runAllocation", () => {
  const constA = parseConstitution("const-a", "Privacy-First", {
    we_are: "a privacy-first productivity tool for knowledge workers who value deep focus",
    we_never: "sell user data, show ads, or use dark patterns to increase engagement",
    we_value: "simplicity over feature count, user trust over growth metrics",
  });

  const constB = parseConstitution("const-b", "Growth-First", {
    we_are: "a data-driven collaboration platform for fast-moving startup teams",
    we_never: "sacrifice speed for perfection, or block users from experimenting",
    we_value: "rapid iteration over polish, team visibility over individual privacy",
  });

  it("returns decisions for all themes", () => {
    const run = runAllocation({
      constitution: constA,
      observations,
      themes,
    });
    expect(run.decisions.length).toBe(themes.length);
    expect(run.summary.build_count + run.summary.defer_count + run.summary.kill_count).toBe(
      themes.length
    );
  });

  it("kills theme that violates hard clauses under Constitution A", () => {
    const run = runAllocation({
      constitution: constA,
      observations,
      themes,
    });
    const adDecision = run.decisions.find((d) => d.theme_id === "theme-t2");
    expect(adDecision).toBeDefined();
    expect(adDecision!.verdict).toBe("kill");
    expect(adDecision!.violated_clauses.length).toBeGreaterThan(0);
    expect(adDecision!.kill_reason).toBeTruthy();
  });

  it("each decision has evidence refs", () => {
    const run = runAllocation({
      constitution: constA,
      observations,
      themes,
    });
    for (const d of run.decisions) {
      expect(d.supporting_evidence.length).toBeGreaterThan(0);
    }
  });

  it("produces at least 1 decision difference between Constitution A and B", () => {
    const runA = runAllocation({ constitution: constA, observations, themes });
    const runB = runAllocation({ constitution: constB, observations, themes });
    const diffs = diffAllocationRuns(runA, runB);
    expect(diffs.length).toBeGreaterThan(0);
  });
});

describe("diffAllocationRuns", () => {
  it("identifies themes with different verdicts", () => {
    const constA = parseConstitution("a", "A", {
      we_are: "privacy-first tool for knowledge workers",
      we_never: "sell user data, show ads, use dark patterns to increase engagement",
      we_value: "simplicity over feature count",
    });
    const constB = parseConstitution("b", "B", {
      we_are: "data-driven collaboration platform for startup teams",
      we_never: "sacrifice speed for perfection",
      we_value: "rapid iteration over polish",
    });

    const runA = runAllocation({ constitution: constA, observations, themes });
    const runB = runAllocation({ constitution: constB, observations, themes });
    const diffs = diffAllocationRuns(runA, runB);

    // At least theme-t2 should differ (kill under A, not kill under B)
    expect(diffs.length).toBeGreaterThan(0);
  });
});
