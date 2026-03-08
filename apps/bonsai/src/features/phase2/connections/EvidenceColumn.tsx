"use client";

import type { ObservationConnection } from "@/lib/schema";

const severityStyles: Record<string, { bg: string; badge: string; border: string }> = {
  critical: {
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
    border: "border-red-300",
  },
  major: {
    bg: "bg-orange-50",
    badge: "bg-orange-100 text-orange-700",
    border: "border-orange-300",
  },
  minor: {
    bg: "bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-700",
    border: "border-yellow-300",
  },
  neutral: {
    bg: "bg-gray-50",
    badge: "bg-gray-100 text-gray-600",
    border: "border-gray-300",
  },
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

  const criticalCount = observations.filter((o) => o.severity === "critical").length;
  const majorCount = observations.filter((o) => o.severity === "major").length;
  const minorCount = observations.filter((o) => o.severity === "minor" || o.severity === "neutral").length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b bg-gray-50 flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-800">Evidence</h2>
        <div className="flex gap-2 mt-0.5">
          <span className="text-[10px] text-red-700 font-medium">
            {criticalCount} critical
          </span>
          <span className="text-[10px] text-orange-700 font-medium">
            {majorCount} major
          </span>
          <span className="text-[10px] text-gray-600 font-medium">
            {minorCount} other
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {sorted.map((obs) => {
          const style = severityStyles[obs.severity] ?? severityStyles.neutral;
          const isSelected = selectedObservationId === obs.observation_id;
          const isHighlighted = highlightedObservationIds.has(obs.observation_id);
          const isDimmed = highlightedObservationIds.size > 0 && !isHighlighted && !isSelected;
          const linkedCount = obs.linked_proposal_ids.length;

          return (
            <button
              key={obs.observation_id}
              onClick={() => onSelect(isSelected ? null : obs.observation_id)}
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
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${style.badge}`}
                >
                  {obs.severity}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                    channelBadge[obs.channel_type] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {obs.channel_type.replace(/_/g, " ")}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {(obs.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed mb-1.5">
                &ldquo;{obs.raw_text}&rdquo;
              </p>
              <div className="flex items-center gap-2 text-[9px] text-gray-400">
                <span className="font-mono">{obs.observation_id}</span>
                {linkedCount > 0 && (
                  <span>
                    → {linkedCount} card{linkedCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
