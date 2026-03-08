"use client";

import type { DecisionConnection } from "@/lib/schema";

const verdictStyles: Record<string, { bg: string; badge: string; border: string }> = {
  build: {
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-800",
    border: "border-green-300",
  },
  defer: {
    bg: "bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-800",
    border: "border-yellow-300",
  },
  kill: {
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-800",
    border: "border-red-300",
  },
};

const actionLabels: Record<string, { label: string; icon: string }> = {
  view_execution_packet: { label: "Execution Packet", icon: "📦" },
  coding_agent_export: { label: "Agent Export", icon: "🤖" },
  send_rork: { label: "Send to Rork", icon: "🚀" },
  override_decision: { label: "Override Decision", icon: "↩" },
  copy_rationale: { label: "Copy Rationale", icon: "📋" },
  request_more_evidence: { label: "Request Evidence", icon: "🔍" },
  create_salvage_proposal: { label: "Salvage Proposal", icon: "♻" },
  view_salvage_path: { label: "View Salvage Path", icon: "🔀" },
};

interface ActionColumnProps {
  selectedDecision: DecisionConnection | null;
}

export function ActionColumn({ selectedDecision }: ActionColumnProps) {
  if (!selectedDecision) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 py-2 border-b bg-gray-50 flex-shrink-0">
          <h2 className="text-sm font-bold text-gray-800">Action</h2>
          <div className="flex gap-2 mt-0.5">
            <span className="text-[10px] text-gray-500 font-medium">Select a judgment</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-2">
          <p className="text-xs text-gray-400 text-center px-4">
            Select a judgment in the center panel to view available actions and execution details.
          </p>
        </div>
      </div>
    );
  }

  const style = verdictStyles[selectedDecision.verdict] ?? verdictStyles.build;

  const reason =
    selectedDecision.verdict === "kill"
      ? selectedDecision.kill_reason
      : selectedDecision.verdict === "defer"
      ? selectedDecision.defer_reason
      : selectedDecision.build_rationale;

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b bg-gray-50 flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-800">Action</h2>
        <div className="flex gap-2 mt-0.5">
          <span className={`text-[10px] font-medium ${
            selectedDecision.verdict === "build" ? "text-green-700"
              : selectedDecision.verdict === "kill" ? "text-red-700"
              : "text-yellow-700"
          }`}>
            {selectedDecision.title}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* Decision summary — verdict-colored card like Judgment */}
        <div className={`rounded-lg border p-3 ${style.bg} ${style.border}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${style.badge}`}
            >
              {selectedDecision.verdict}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {(selectedDecision.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <h3 className="text-xs font-semibold text-gray-800 mb-1">
            {selectedDecision.title}
          </h3>
          {reason && (
            <p className="text-[11px] text-gray-600 mb-1.5">{reason}</p>
          )}
          {selectedDecision.violated_clauses.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedDecision.violated_clauses.map((c) => (
                <span
                  key={c}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700"
                >
                  {c.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Execution packet indicator — card style */}
        {selectedDecision.has_execution_packet && (
          <div className="rounded-lg border border-blue-300 bg-blue-50 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-blue-100 text-blue-800"
              >
                packet
              </span>
            </div>
            <h3 className="text-xs font-semibold text-blue-800 mb-1">
              Execution Packet Available
            </h3>
            <p className="text-[11px] text-blue-600">
              Builder handoff with UI/data/workflow specs and coding agent tasks.
            </p>
          </div>
        )}

        {/* Evidence links — card style */}
        <div className="rounded-lg border border-gray-200 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-100 text-amber-800">
              evidence
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {selectedDecision.linked_observation_ids.length} linked
            </span>
          </div>
          <div className="space-y-1">
            {selectedDecision.linked_observation_ids.map((obsId) => (
              <div
                key={obsId}
                className="text-[10px] text-gray-500 font-mono flex items-center gap-1"
              >
                <span className="text-amber-500">←</span> {obsId}
              </div>
            ))}
          </div>
        </div>

        {/* Available actions — card-style buttons */}
        {selectedDecision.available_actions.map((action) => {
          const meta = actionLabels[action] ?? {
            label: action.replace(/_/g, " "),
            icon: "•",
          };
          return (
            <button
              key={action}
              className="w-full text-left rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{meta.icon}</span>
                <span className="text-xs font-semibold text-gray-800">{meta.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
