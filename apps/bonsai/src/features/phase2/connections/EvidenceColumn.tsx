"use client";

import type { ObservationConnection } from "@/lib/schema";

const severityColor: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  major: "bg-orange-100 text-orange-700",
  minor: "bg-yellow-100 text-yellow-700",
  neutral: "bg-gray-100 text-gray-600",
};

const channelBadge: Record<string, string> = {
  customer_interview: "bg-blue-100 text-blue-700",
  usage_data: "bg-purple-100 text-purple-700",
  app_store_review: "bg-green-100 text-green-700",
  support_ticket: "bg-orange-100 text-orange-700",
  sales_call: "bg-indigo-100 text-indigo-700",
  nps_survey: "bg-teal-100 text-teal-700",
};

interface EvidenceColumnProps {
  observations: ObservationConnection[];
  selectedObservationId: string | null;
  highlightedObservationIds: Set<string>;
  onSelect: (id: string | null) => void;
}

export function EvidenceColumn({
  observations,
  selectedObservationId,
  highlightedObservationIds,
  onSelect,
}: EvidenceColumnProps) {
  // Sort: linked observations first, then by severity
  const severityOrder = { critical: 0, major: 1, minor: 2, neutral: 3 };
  const sorted = [...observations].sort((a, b) => {
    const aLinked = a.linked_proposal_ids.length > 0 ? 0 : 1;
    const bLinked = b.linked_proposal_ids.length > 0 ? 0 : 1;
    if (aLinked !== bLinked) return aLinked - bLinked;
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b bg-gray-50 flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-800">Evidence Layer</h2>
        <p className="text-[10px] text-gray-500">{observations.length} observations</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sorted.map((obs) => {
          const isSelected = selectedObservationId === obs.observation_id;
          const isHighlighted = highlightedObservationIds.has(obs.observation_id);
          const isDimmed = highlightedObservationIds.size > 0 && !isHighlighted && !isSelected;
          const linkedCount = obs.linked_proposal_ids.length;

          return (
            <button
              key={obs.observation_id}
              onClick={() => onSelect(isSelected ? null : obs.observation_id)}
              className={`w-full text-left px-3 py-2 border-b transition-all ${
                isSelected
                  ? "bg-blue-50 border-l-2 border-l-blue-500"
                  : isHighlighted
                  ? "bg-amber-50 border-l-2 border-l-amber-400"
                  : isDimmed
                  ? "opacity-30"
                  : "hover:bg-gray-50 border-l-2 border-l-transparent"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-mono text-gray-400">
                  {obs.observation_id}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                    channelBadge[obs.channel_type] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {obs.channel_type.replace(/_/g, " ")}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                    severityColor[obs.severity]
                  }`}
                >
                  {obs.severity}
                </span>
              </div>
              <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
                &ldquo;{obs.raw_text}&rdquo;
              </p>
              <div className="flex items-center gap-2 mt-1">
                {linkedCount > 0 && (
                  <span className="text-[9px] text-gray-500">
                    → {linkedCount} card{linkedCount !== 1 ? "s" : ""}
                  </span>
                )}
                <span className="text-[9px] text-gray-400">
                  {(obs.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
