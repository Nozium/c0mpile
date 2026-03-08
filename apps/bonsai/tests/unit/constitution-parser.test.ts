import { describe, it, expect } from "vitest";
import {
  parseConstitution,
  findViolations,
  findAlignments,
} from "../../src/features/phase1/constitution/parser";

describe("parseConstitution", () => {
  const rawInput = {
    we_are:
      "a privacy-first productivity tool for knowledge workers who value deep focus",
    we_never:
      "sell user data, show ads, or use dark patterns to increase engagement",
    we_value:
      "simplicity over feature count, user trust over growth metrics, offline-first over cloud-dependency",
  };

  it("generates clauses from 3-line input", () => {
    const result = parseConstitution("test-a", "Test Constitution A", rawInput);

    expect(result.id).toBe("test-a");
    expect(result.clauses.length).toBeGreaterThan(0);

    // we_are produces target_user clauses
    const targetClauses = result.clauses.filter(
      (c) => c.source_line === "we_are"
    );
    expect(targetClauses.length).toBeGreaterThan(0);
    expect(targetClauses.every((c) => c.polarity === "desired")).toBe(true);

    // we_never produces hard forbidden clauses
    const forbiddenClauses = result.clauses.filter(
      (c) => c.source_line === "we_never"
    );
    expect(forbiddenClauses.length).toBeGreaterThan(0);
    expect(forbiddenClauses.every((c) => c.type === "hard")).toBe(true);
    expect(forbiddenClauses.every((c) => c.polarity === "forbidden")).toBe(true);

    // we_value produces quality_bar clauses
    const valueClauses = result.clauses.filter(
      (c) => c.source_line === "we_value"
    );
    expect(valueClauses.length).toBeGreaterThan(0);
  });

  it("normalizes to 5 axes", () => {
    const result = parseConstitution("test-a", "Test", rawInput);
    expect(result.axes.target_user).toBeTruthy();
    expect(result.axes.prohibited_business_model).toBeTruthy();
    expect(result.axes.quality_bar).toBeTruthy();
    expect(result.axes.strategic_terrain).toBeTruthy();
    expect(result.axes.trust_compliance_rule).toBeTruthy();
  });

  it("infers desired transitions from 'X over Y' patterns", () => {
    const result = parseConstitution("test-a", "Test", rawInput);
    expect(result.desired_transitions.length).toBeGreaterThan(0);
  });

  it("infers forbidden patterns from we_never", () => {
    const result = parseConstitution("test-a", "Test", rawInput);
    expect(result.forbidden_patterns.length).toBeGreaterThan(0);
    expect(
      result.forbidden_patterns.some((p) => p.includes("sell user data"))
    ).toBe(true);
  });
});

describe("findViolations", () => {
  const constitution = parseConstitution("test-a", "Test", {
    we_are: "a privacy-first tool",
    we_never:
      "sell user data, show ads, or use dark patterns to increase engagement",
    we_value: "simplicity over feature count",
  });

  it("detects hard violation when theme matches forbidden clause keywords", () => {
    const violations = findViolations(
      constitution.clauses,
      "A feature that shows ads and uses dark patterns to sell user data",
      ["We should show ads to monetize", "Dark patterns increase engagement"]
    );
    expect(violations.length).toBeGreaterThan(0);
  });

  it("returns empty when theme does not violate clauses", () => {
    const violations = findViolations(
      constitution.clauses,
      "An offline sync feature for local storage",
      ["Users want to work offline without internet"]
    );
    expect(violations.length).toBe(0);
  });
});

describe("findAlignments", () => {
  const constitution = parseConstitution("test-a", "Test", {
    we_are: "a privacy-first productivity tool for knowledge workers",
    we_never: "sell user data",
    we_value: "simplicity over feature count, user trust over growth metrics",
  });

  it("finds alignment when theme matches desired clauses", () => {
    const alignments = findAlignments(
      constitution.clauses,
      "Privacy and productivity improvements for knowledge workers",
      ["We need privacy-first tools for our knowledge workers"]
    );
    expect(alignments.length).toBeGreaterThan(0);
  });
});
