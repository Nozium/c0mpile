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

interface CardColumnProps {
  decisions: DecisionConnection[];
  selectedDecisionId: string | null;
  highlightedDecisionIds: Set<string>;
  onSelect: (id: string | null) => void;
}

export function CardColumn({
  decisions,
  selectedDecisionId,
  highlightedDecisionIds,
  onSelect,
}: CardColumnProps) {
  // Group by verdict
  const builds = decisions.filter((d) => d.verdict === "build");
  const defers = decisions.filter((d) => d.verdict === "defer");
  const kills = decisions.filter((d) => d.verdict === "kill");

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b bg-gray-50 flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-800">Card Layer</h2>
        <div className="flex gap-2 mt-0.5">
          <span className="text-[10px] text-green-700 font-medium">{builds.length} build</span>
          <span className="text-[10px] text-yellow-700 font-medium">{defers.length} defer</span>
          <span className="text-[10px] text-red-700 font-medium">{kills.length} kill</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {[...builds, ...defers, ...kills].map((dec) => {
          const style = verdictStyles[dec.verdict];
          const isSelected = selectedDecisionId === dec.decision_id;
          const isHighlighted = highlightedDecisionIds.has(dec.decision_id);
          const isDimmed =
            highlightedDecisionIds.size > 0 && !isHighlighted && !isSelected;

          const reason =
            dec.verdict === "kill"
              ? dec.kill_reason
              : dec.verdict === "defer"
              ? dec.defer_reason
              : dec.build_rationale;

          return (
            <button
              key={dec.decision_id}
              onClick={() => onSelect(isSelected ? null : dec.decision_id)}
              className={`w-full text-left rounded-lg border p-3 transition-all ${
                isSelected
                  ? `${style.bg} ${style.border} border-2 ring-2 ring-blue-200`
                  : isHighlighted
                  ? `${style.bg} ${style.border} border-2`
                  : isDimmed
                  ? "opacity-30 border-gray-200"
                  : `border-gray-200 hover:${style.bg} hover:${style.border}`
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${style.badge}`}
                >
                  {dec.verdict}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {(dec.confidence * 100).toFixed(0)}%
                </span>
              </div>

              <h3 className="text-xs font-semibold text-gray-800 mb-1">{dec.title}</h3>

              {reason && (
                <p className="text-[11px] text-gray-600 line-clamp-2 mb-1.5">{reason}</p>
              )}

              {dec.violated_clauses.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {dec.violated_clauses.map((clause) => (
                    <span
                      key={clause}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700"
                    >
                      {clause.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 text-[9px] text-gray-400">
                <span>← {dec.linked_observation_ids.length} evidence</span>
                {dec.has_execution_packet && (
                  <span className="text-blue-500 font-medium">→ packet</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
