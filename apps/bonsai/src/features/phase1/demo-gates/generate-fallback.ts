/**
 * Generate pre-computed fallback artifact for demo.
 * Run with: npx tsx src/features/phase1/demo-gates/generate-fallback.ts
 *
 * Produces a JSON file with allocation runs for Constitution A and B,
 * plus the diff between them. This is the demo fallback if live run fails.
 */
import { writeFileSync } from "fs";
import { resolve } from "path";
import { loadConstitutions, loadObservations, loadThemes } from "@/data/fixtures/loader";
import { runAllocation, diffAllocationRuns } from "../allocation/engine";

function main() {
  const constitutions = loadConstitutions();
  const observations = loadObservations();
  const themes = loadThemes();

  const runs = constitutions.map((constitution) =>
    runAllocation({ constitution, observations, themes })
  );

  const diffs = runs.length >= 2 ? diffAllocationRuns(runs[0], runs[1]) : [];

  const artifact = {
    generated_at: new Date().toISOString(),
    runs,
    diffs,
    meta: {
      constitution_count: constitutions.length,
      observation_count: observations.length,
      theme_count: themes.length,
    },
  };

  const outPath = resolve(process.cwd(), "../../data/demo/fallback-run.json");
  writeFileSync(outPath, JSON.stringify(artifact, null, 2));
  console.log(`Fallback artifact written to ${outPath}`);
  console.log(`  Constitutions: ${constitutions.length}`);
  console.log(`  Observations: ${observations.length}`);
  console.log(`  Themes: ${themes.length}`);
  console.log(`  Decisions per run: ${runs.map((r) => r.decisions.length).join(", ")}`);
  console.log(`  A/B diffs: ${diffs.length}`);
}

main();
