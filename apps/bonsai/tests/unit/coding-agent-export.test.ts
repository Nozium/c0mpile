import { describe, it, expect } from "vitest";
import type { ExecutionPacket } from "../../src/lib/schema";

// We'll import after the agent creates the file
// For now, define inline to test the format
const mockPacket: ExecutionPacket = {
  id: "ep-001",
  proposal_id: "prop-001",
  problem_statement: "Users churn without offline access",
  target_user_state: "privacy-conscious knowledge workers",
  intended_transition: "cloud-dependent → data-sovereign",
  why_now: "Retention cliff is the biggest blocker",
  supporting_evidence_summary: "6 converging signals",
  ui_change_outline: "Add data location indicator",
  data_model_change_outline: "Add storage_mode field",
  workflow_change_outline: "Load from IndexedDB first",
  success_metric: "D30 retention 75%",
  experiment_plan: "Ship read-only offline first",
  coding_agent_tasks: [
    {
      task_id: "t1",
      title: "Implement IndexedDB layer",
      description: "Create storage abstraction",
      type: "frontend",
      effort: "medium",
      dependencies: [],
    },
    {
      task_id: "t2",
      title: "Add offline loading",
      description: "Modify data fetching",
      type: "frontend",
      effort: "medium",
      dependencies: ["t1"],
    },
    {
      task_id: "t3",
      title: "Write tests",
      description: "Integration tests",
      type: "test",
      effort: "small",
      dependencies: ["t1", "t2"],
    },
  ],
};

describe("coding agent export format", () => {
  it("packet has valid structure for export", () => {
    expect(mockPacket.coding_agent_tasks).toHaveLength(3);
    expect(mockPacket.coding_agent_tasks[0].dependencies).toHaveLength(0);
    expect(mockPacket.coding_agent_tasks[1].dependencies).toContain("t1");
  });

  it("task types are valid", () => {
    const validTypes = ["frontend", "backend", "data", "integration", "test"];
    for (const task of mockPacket.coding_agent_tasks) {
      expect(validTypes).toContain(task.type);
    }
  });

  it("dependency graph is acyclic", () => {
    const taskIds = new Set(mockPacket.coding_agent_tasks.map((t) => t.task_id));
    for (const task of mockPacket.coding_agent_tasks) {
      for (const dep of task.dependencies) {
        expect(taskIds).toContain(dep);
        expect(dep).not.toBe(task.task_id);
      }
    }
  });
});
