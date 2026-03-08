"use client";

import { useState } from "react";
import type { DecisionConnection } from "@/lib/schema";

const actionLabels: Record<string, { label: string; icon: string }> = {
  view_execution_packet: { label: "Execution Packet", icon: "📦" },
  coding_agent_export: { label: "Agent Export", icon: "🤖" },
  send_rork: { label: "Prepare Rork Brief", icon: "🚀" },
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
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2400);
  };

  const copyToClipboard = async (label: string, content: string) => {
    await navigator.clipboard.writeText(content);
    showToast(`${label} copied to clipboard`);
  };

  if (!selectedDecision) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 py-2 border-b bg-gray-50 flex-shrink-0">
          <h2 className="text-sm font-bold text-gray-800">Action</h2>
          <p className="text-[10px] text-gray-500">Handoff Agent · select a judgment to see actions</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-gray-400 text-center px-4">
            Select a judgment in the center panel to view available actions and execution details.
          </p>
        </div>
      </div>
    );
  }

  const verdictColor =
    selectedDecision.verdict === "build"
      ? "text-green-700"
      : selectedDecision.verdict === "kill"
      ? "text-red-700"
      : "text-yellow-700";

  const rationale =
    selectedDecision.verdict === "kill"
      ? selectedDecision.kill_reason
      : selectedDecision.verdict === "defer"
      ? selectedDecision.defer_reason
      : selectedDecision.build_rationale;

  const actionStatus =
    selectedDecision.actuation_status === "brief_ready"
      ? "Rork brief can be prepared now"
      : selectedDecision.has_execution_packet
      ? "Execution packet exists and builders can start"
      : "No handoff artifact prepared yet";

  const handleActionClick = async (action: string) => {
    const evidenceLines = selectedDecision.linked_observation_ids
      .map((id) => `- ${id}`)
      .join("\n");

    switch (action) {
      case "copy_rationale":
        await copyToClipboard(
          "Rationale",
          [
            `${selectedDecision.verdict.toUpperCase()}: ${selectedDecision.title}`,
            rationale ?? "—",
            `Evidence links: ${selectedDecision.linked_observation_ids.length}`,
          ].join("\n")
        );
        break;
      case "send_rork":
        await copyToClipboard(
          "Rork brief",
          [
            `# Rork Brief: ${selectedDecision.title}`,
            "",
            `Verdict: ${selectedDecision.verdict.toUpperCase()}`,
            `Why this survived: ${selectedDecision.build_rationale ?? "See execution packet"}`,
            "",
            "Evidence Links",
            evidenceLines,
          ].join("\n")
        );
        break;
      case "request_more_evidence":
        await copyToClipboard(
          "Evidence request",
          [
            `# Evidence Request: ${selectedDecision.title}`,
            "",
            "Need additional evidence before re-evaluation.",
            "",
            "Current linked observations",
            evidenceLines,
          ].join("\n")
        );
        break;
      case "create_salvage_proposal":
        await copyToClipboard(
          "Salvage proposal",
          [
            `# Salvage Proposal: ${selectedDecision.title}`,
            "",
            "Preserve the core user need while removing the violating parts.",
          ].join("\n")
        );
        break;
      case "view_execution_packet":
        showToast("Open the Board screen to inspect the full execution packet");
        break;
      case "coding_agent_export":
        showToast("Open the Board screen to inspect the coding-agent export");
        break;
      case "override_decision":
        showToast("Override from the Board screen to record a decision-log entry");
        break;
      case "view_salvage_path":
        showToast("Salvage path is available in the detailed proposal drawer");
        break;
      default:
        showToast("Action not configured");
        break;
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      <div className="px-3 py-2 border-b bg-gray-50 flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-800">Action</h2>
        <p className="text-[10px] text-gray-500">
          Handoff Agent · {selectedDecision.title}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Decision summary */}
        <div className="rounded-lg border border-gray-200 p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold uppercase ${verdictColor}`}>
              {selectedDecision.verdict}
            </span>
            <span className="text-[10px] text-gray-400">
              {(selectedDecision.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
          <p className="text-[11px] text-gray-600 mb-2">
            {rationale}
          </p>
          {selectedDecision.violated_clauses.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedDecision.violated_clauses.map((c) => (
                <span
                  key={c}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700"
                >
                  ✕ {c.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Execution packet indicator */}
        {selectedDecision.has_execution_packet && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">📦</span>
              <span className="text-xs font-semibold text-blue-800">
                Execution Packet Available
              </span>
            </div>
            <p className="text-[10px] text-blue-600">
              Builder handoff with UI/data/workflow specs and coding agent tasks.
            </p>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs">🧠</span>
            <span className="text-[11px] font-semibold text-gray-700">
              Handoff Status
            </span>
          </div>
          <p className="text-[10px] text-gray-600">
            {actionStatus}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white px-2 py-0.5 text-[9px] text-gray-600 ring-1 ring-gray-200">
              primary: {selectedDecision.primary_action.replace(/_/g, " ")}
            </span>
            {selectedDecision.has_execution_packet && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] text-blue-700 ring-1 ring-blue-200">
                packet ready
              </span>
            )}
            {selectedDecision.has_coding_export && (
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] text-indigo-700 ring-1 ring-indigo-200">
                export ready
              </span>
            )}
          </div>
        </div>

        {/* Evidence summary */}
        <div className="rounded-lg border border-gray-200 p-3">
          <h3 className="text-[11px] font-semibold text-gray-700 mb-1.5">
            Evidence Links
          </h3>
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

        {/* Available actions */}
        <div>
          <h3 className="text-[11px] font-semibold text-gray-700 mb-2 px-1">
            Available Actions
          </h3>
          <div className="space-y-1.5">
            {selectedDecision.available_actions.map((action) => {
              const meta = actionLabels[action] ?? {
                label: action.replace(/_/g, " "),
                icon: "•",
              };
              return (
                <button
                  key={action}
                  onClick={() => void handleActionClick(action)}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm">{meta.icon}</span>
                  <span className="text-xs text-gray-700">{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {toast && (
        <div className="pointer-events-none absolute bottom-4 right-4 rounded-lg bg-gray-900 px-3 py-2 text-[11px] text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
