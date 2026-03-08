"use client";

import type { Decision } from "@/lib/schema";

export function EvidencePanel({
  decision,
  onClose,
}: {
  decision: Decision;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              {decision.theme_label}
            </h2>
            <span className="text-xs text-gray-500">
              Verdict: {decision.verdict.toUpperCase()} (
              {(decision.confidence * 100).toFixed(0)}% confidence)
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            x
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Violated clauses */}
          {decision.violated_clauses.length > 0 && (
            <section>
              <h3 className="text-sm font-medium text-red-700 mb-2">
                Violated Clauses
              </h3>
              {decision.violated_clauses.map((vc) => (
                <div
                  key={vc.clause_id}
                  className="bg-red-50 rounded p-2 mb-2 text-sm"
                >
                  <div className="font-medium text-red-800">
                    [{vc.axis}] {vc.clause_text}
                  </div>
                  <div className="text-red-600 text-xs mt-1">
                    {vc.violation_reason}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Supporting evidence */}
          <section>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Supporting Evidence ({decision.supporting_evidence.length})
            </h3>
            {decision.supporting_evidence.map((ev) => (
              <div
                key={ev.observation_id}
                className="bg-gray-50 rounded p-3 mb-2 text-sm"
              >
                <div className="text-xs text-gray-400 mb-1">
                  {ev.observation_id} - {ev.relevance}
                </div>
                <blockquote className="text-gray-700 italic border-l-2 border-gray-300 pl-2">
                  &ldquo;{ev.raw_text}&rdquo;
                </blockquote>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
