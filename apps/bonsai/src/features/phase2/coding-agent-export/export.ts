import type { ExecutionPacket } from "@/lib/schema";

/**
 * Generate a markdown document from an execution packet,
 * suitable for handing off to a coding agent.
 */
export function exportTasksAsMarkdown(packet: ExecutionPacket): string {
  const title = packet.problem_statement.slice(0, 80);

  const taskSections = packet.coding_agent_tasks
    .map(
      (task) =>
        `### ${task.task_id}: ${task.title}\n` +
        `- **Type**: ${task.type}\n` +
        `- **Effort**: ${task.effort}\n` +
        `- **Dependencies**: ${task.dependencies.length > 0 ? task.dependencies.join(", ") : "None"}\n\n` +
        task.description
    )
    .join("\n\n");

  const depLines = packet.coding_agent_tasks
    .flatMap((task) =>
      task.dependencies.map((dep) => `${task.task_id} \u2192 ${dep}`)
    )
    .join("\n");

  const depGraph = depLines.length > 0 ? depLines : "No dependencies";

  return `# Execution Packet: ${title}

## Problem
${packet.problem_statement}

## Target User
${packet.target_user_state}

## Transition
${packet.intended_transition}

## Why Now
${packet.why_now}

## Evidence Summary
${packet.supporting_evidence_summary}

---

## Changes Required

### UI Changes
${packet.ui_change_outline}

### Data Model Changes
${packet.data_model_change_outline}

### Workflow Changes
${packet.workflow_change_outline}

---

## Success Criteria
- **Metric**: ${packet.success_metric}
- **Experiment Plan**: ${packet.experiment_plan}

---

## Tasks

${taskSections}

## Dependency Graph

${depGraph}
`;
}

/**
 * Return a pretty-printed JSON string containing the packet metadata
 * and coding agent tasks with a dependency graph.
 */
export function exportTasksAsJSON(packet: ExecutionPacket): string {
  const dependencyGraph: Record<string, string[]> = {};
  for (const task of packet.coding_agent_tasks) {
    if (task.dependencies.length > 0) {
      dependencyGraph[task.task_id] = task.dependencies;
    }
  }

  const output = {
    packet_id: packet.id,
    proposal_id: packet.proposal_id,
    problem_statement: packet.problem_statement,
    success_metric: packet.success_metric,
    tasks: packet.coding_agent_tasks,
    dependency_graph: dependencyGraph,
  };

  return JSON.stringify(output, null, 2);
}
