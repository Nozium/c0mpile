import { describe, it, expect, beforeEach } from "vitest";
import {
  addLogEntry,
  getLogEntries,
  clearLog,
  generateShareableSummary,
} from "../../src/features/phase2/decision-log/store";
import type { DecisionLogEntry, AllocationRun } from "../../src/lib/schema";

const mockEntry: DecisionLogEntry = {
  id: "log-1",
  decision_id: "decision-theme-t1",
  timestamp: "2026-03-08T00:00:00Z",
  action: "override",
  actor: "user",
  previous_verdict: "kill",
  new_verdict: "build",
  reason: "New evidence suggests alignment",
};

const mockRun: AllocationRun = {
  id: "run-test",
  constitution_id: "const-a",
  constitution_label: "Privacy-First",
  timestamp: "2026-03-08T00:00:00Z",
  observation_count: 10,
  theme_count: 3,
  decisions: [
    {
      id: "decision-theme-t1",
      theme_id: "theme-t1",
      theme_label: "Offline Storage",
      verdict: "build",
      confidence: 0.9,
      feature_outline_summary: "Build offline storage",
      violated_clauses: [],
      supporting_evidence: [],
      build_rationale: "Aligned with privacy-first",
    },
    {
      id: "decision-theme-t2",
      theme_id: "theme-t2",
      theme_label: "Ad Monetization",
      verdict: "kill",
      confidence: 0.95,
      feature_outline_summary: "Kill ad monetization",
      violated_clauses: [
        {
          clause_id: "c1",
          clause_text: "Never sell user data",
          axis: "prohibited_business_model",
          violation_reason: "Directly sells user data",
        },
      ],
      supporting_evidence: [],
      kill_reason: "Violates prohibited_business_model",
    },
    {
      id: "decision-theme-t3",
      theme_id: "theme-t3",
      theme_label: "Team Collab",
      verdict: "defer",
      confidence: 0.6,
      feature_outline_summary: "Defer team collab",
      violated_clauses: [],
      supporting_evidence: [],
      defer_reason: "Insufficient evidence",
    },
  ],
  summary: { build_count: 1, defer_count: 1, kill_count: 1 },
};

describe("decision-log store", () => {
  beforeEach(() => {
    clearLog();
  });

  it("adds and retrieves log entries", () => {
    addLogEntry(mockEntry);
    const entries = getLogEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].id).toBe("log-1");
  });

  it("filters entries by decision_id", () => {
    addLogEntry(mockEntry);
    addLogEntry({ ...mockEntry, id: "log-2", decision_id: "decision-theme-t2" });
    const filtered = getLogEntries("decision-theme-t1");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].decision_id).toBe("decision-theme-t1");
  });

  it("clears log", () => {
    addLogEntry(mockEntry);
    clearLog();
    expect(getLogEntries()).toHaveLength(0);
  });
});

describe("generateShareableSummary", () => {
  beforeEach(() => {
    clearLog();
  });

  it("generates summary with correct counts", () => {
    const summary = generateShareableSummary(mockRun);
    expect(summary.build_count).toBe(1);
    expect(summary.defer_count).toBe(1);
    expect(summary.kill_count).toBe(1);
    expect(summary.total_decisions).toBe(3);
  });

  it("includes key kills with violated clauses", () => {
    const summary = generateShareableSummary(mockRun);
    expect(summary.key_kills).toHaveLength(1);
    expect(summary.key_kills[0].theme_label).toBe("Ad Monetization");
    expect(summary.key_kills[0].violated_clauses.length).toBeGreaterThan(0);
  });

  it("includes key builds", () => {
    const summary = generateShareableSummary(mockRun);
    expect(summary.key_builds).toHaveLength(1);
    expect(summary.key_builds[0].theme_label).toBe("Offline Storage");
  });

  it("includes overrides when present", () => {
    addLogEntry(mockEntry);
    const summary = generateShareableSummary(mockRun);
    expect(summary.overrides).toHaveLength(1);
    expect(summary.overrides[0].from).toBe("kill");
    expect(summary.overrides[0].to).toBe("build");
  });
});
