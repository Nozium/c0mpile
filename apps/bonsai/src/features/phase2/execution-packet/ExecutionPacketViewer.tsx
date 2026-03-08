"use client";

import type { ExecutionPacket } from "@/lib/schema";

interface ExecutionPacketViewerProps {
  packet: ExecutionPacket;
  onClose: () => void;
}

const typeBadgeColors: Record<string, string> = {
  frontend: "bg-blue-100 text-blue-800",
  backend: "bg-purple-100 text-purple-800",
  data: "bg-orange-100 text-orange-800",
  integration: "bg-cyan-100 text-cyan-800",
  test: "bg-green-100 text-green-800",
};

const effortBadgeColors: Record<string, string> = {
  small: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  large: "bg-red-100 text-red-700",
};

const effortLabels: Record<string, string> = {
  small: "S",
  medium: "M",
  large: "L",
};

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
      {children}
    </h3>
  );
}

export function ExecutionPacketViewer({
  packet,
  onClose,
}: ExecutionPacketViewerProps) {
  // Parse intended_transition into from/to if it contains an arrow
  const transitionParts = packet.intended_transition.includes("→")
    ? packet.intended_transition.split("→").map((s) => s.trim())
    : packet.intended_transition.includes("->")
      ? packet.intended_transition.split("->").map((s) => s.trim())
      : null;

  // Build a lookup of task_id to title for dependency display
  const taskTitleById = new Map(
    packet.coding_agent_tasks.map((t) => [t.task_id, t.title])
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Execution Packet
            </h2>
            <p className="text-sm text-gray-500">
              Proposal: {packet.proposal_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Problem & Context */}
          <section className="space-y-4">
            <SectionHeader>Problem &amp; Context</SectionHeader>

            <p className="text-lg font-medium text-gray-900">
              {packet.problem_statement}
            </p>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
              <div>
                <span className="text-xs font-semibold uppercase text-gray-500">
                  Target User State
                </span>
                <p className="mt-0.5 text-sm text-gray-700">
                  {packet.target_user_state}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-gray-500">
                  Intended Transition
                </span>
                {transitionParts ? (
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <span className="rounded bg-gray-200 px-2 py-0.5 text-gray-700">
                      {transitionParts[0]}
                    </span>
                    <span className="text-gray-400">&rarr;</span>
                    <span className="rounded bg-green-100 px-2 py-0.5 text-green-800">
                      {transitionParts[1]}
                    </span>
                  </div>
                ) : (
                  <p className="mt-0.5 text-sm text-gray-700">
                    {packet.intended_transition}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <span className="text-xs font-semibold uppercase text-amber-700">
                Why Now
              </span>
              <p className="mt-0.5 text-sm text-amber-900">{packet.why_now}</p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Evidence Summary */}
          <section>
            <SectionHeader>Evidence Summary</SectionHeader>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {packet.supporting_evidence_summary}
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Change Outlines */}
          <section>
            <SectionHeader>Change Outlines</SectionHeader>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">
                  UI Changes
                </h4>
                <p className="text-sm text-blue-900 whitespace-pre-line">
                  {packet.ui_change_outline}
                </p>
              </div>
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <h4 className="text-sm font-semibold text-purple-800 mb-2">
                  Data Model Changes
                </h4>
                <p className="text-sm text-purple-900 whitespace-pre-line">
                  {packet.data_model_change_outline}
                </p>
              </div>
              <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                <h4 className="text-sm font-semibold text-teal-800 mb-2">
                  Workflow Changes
                </h4>
                <p className="text-sm text-teal-900 whitespace-pre-line">
                  {packet.workflow_change_outline}
                </p>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Success & Experiment */}
          <section>
            <SectionHeader>Success &amp; Experiment</SectionHeader>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Success Metric
                </h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {packet.success_metric}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Experiment Plan
                </h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {packet.experiment_plan}
                </p>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Coding Agent Tasks */}
          <section>
            <SectionHeader>
              Coding Agent Tasks ({packet.coding_agent_tasks.length})
            </SectionHeader>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Effort</th>
                    <th className="px-4 py-3">Dependencies</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {packet.coding_agent_tasks.map((task) => (
                    <tr key={task.task_id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">
                        {task.task_id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {task.title}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500">
                          {task.description}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${typeBadgeColors[task.type] ?? "bg-gray-100 text-gray-800"}`}
                        >
                          {task.type}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${effortBadgeColors[task.effort] ?? "bg-gray-100 text-gray-700"}`}
                        >
                          {effortLabels[task.effort] ?? task.effort}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {task.dependencies.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {task.dependencies.map((dep) => (
                              <span
                                key={dep}
                                className="inline-block rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-600"
                                title={taskTitleById.get(dep) ?? dep}
                              >
                                {dep}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">&mdash;</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
