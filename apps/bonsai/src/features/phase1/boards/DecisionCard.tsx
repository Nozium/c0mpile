"use client";

import type { Decision } from "@/lib/schema";
import { CardActionBar } from "./CardActionBar";
import type { CardAction } from "./card-actions";

const verdictStyles = {
  build: { bg: "bg-emerald-50", border: "border-emerald-400", badge: "bg-emerald-600", label: "BUILD" },
  defer: { bg: "bg-amber-50", border: "border-amber-400", badge: "bg-amber-600", label: "DEFER" },
  kill: { bg: "bg-red-50", border: "border-red-400", badge: "bg-red-600", label: "KILL" },
} as const;

export function DecisionCard({
  decision,
  compareVerdict,
  hasPacket,
  onDrillDown,
  onViewPacket,
  onCodingExport,
  onAction,
}: {
  decision: Decision;
  compareVerdict?: string;
  hasPacket?: boolean;
  onDrillDown?: (decision: Decision) => void;
  onViewPacket?: (decision: Decision) => void;
  onCodingExport?: (decision: Decision) => void;
  onAction?: (action: CardAction, decision: Decision) => void;
}) {
  const style = verdictStyles[decision.verdict];
  const changed = compareVerdict && compareVerdict !== decision.verdict;

  return (
    <div
      className={`rounded-lg border-2 ${style.border} ${style.bg} p-4 transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
          {decision.theme_label}
        </h3>
        <span
          className={`${style.badge} text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0`}
        >
          {style.label}
        </span>
      </div>

      {changed && (
        <div className="mb-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
          Constitution B: {compareVerdict?.toUpperCase()}
        </div>
      )}

      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {decision.feature_outline_summary}
      </p>

      {/* Reason */}
      {decision.kill_reason && (
        <div className="text-xs text-red-700 bg-red-100 rounded px-2 py-1 mb-2">
          {decision.kill_reason}
        </div>
      )}
      {decision.defer_reason && (
        <div className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 mb-2">
          {decision.defer_reason}
        </div>
      )}
      {decision.build_rationale && (
        <div className="text-xs text-emerald-700 bg-emerald-100 rounded px-2 py-1 mb-2">
          {decision.build_rationale}
        </div>
      )}

      {/* Violated clauses */}
      {decision.violated_clauses.length > 0 && (
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-500">
            Violated clauses:
          </span>
          {decision.violated_clauses.map((vc) => (
            <div key={vc.clause_id} className="text-xs text-red-600 mt-0.5">
              [{vc.axis}] {vc.clause_text}
            </div>
          ))}
        </div>
      )}

      {/* Evidence count + drill-down */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          {decision.supporting_evidence.length} evidence refs
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            confidence: {(decision.confidence * 100).toFixed(0)}%
          </span>
          {onDrillDown && (
            <button
              onClick={() => onDrillDown(decision)}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              detail
            </button>
          )}
        </div>
      </div>

      {/* Phase2: Execution packet / coding export links for build cards */}
      {hasPacket && (
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-200">
          {onViewPacket && (
            <button
              onClick={() => onViewPacket(decision)}
              className="text-xs text-purple-600 hover:text-purple-800 underline"
            >
              Execution Packet
            </button>
          )}
          {onCodingExport && (
            <button
              onClick={() => onCodingExport(decision)}
              className="text-xs text-indigo-600 hover:text-indigo-800 underline"
            >
              Agent Export
            </button>
          )}
        </div>
      )}

      {/* Actions: primary CTA + More dropdown */}
      <CardActionBar decision={decision} onAction={onAction} />
    </div>
  );
}
