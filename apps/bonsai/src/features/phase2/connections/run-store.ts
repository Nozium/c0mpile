import type { AllocationRun, Observation } from "@/lib/schema";

type RunContext = {
  run: AllocationRun;
  observations: Observation[];
};

const runContexts = new Map<string, RunContext>();

export function saveRunContext(run: AllocationRun, observations: Observation[]): void {
  runContexts.set(run.id, { run, observations });
}

export function getRunContext(runId: string): RunContext | undefined {
  return runContexts.get(runId);
}
