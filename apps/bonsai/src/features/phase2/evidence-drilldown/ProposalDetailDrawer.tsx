"use client";

import type { Proposal } from "@/lib/schema";

interface ProposalDetailDrawerProps {
  proposal: Proposal;
  onClose: () => void;
}

const VERDICT_STYLES: Record<
  string,
  { badge: string; accent: string; bar: string }
> = {
  build: {
    badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    accent: "border-emerald-500",
    bar: "bg-emerald-500",
  },
  defer: {
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    accent: "border-amber-500",
    bar: "bg-amber-500",
  },
  kill: {
    badge: "bg-red-100 text-red-800 border-red-300",
    accent: "border-red-500",
    bar: "bg-red-500",
  },
};

function ScoreBar({
  label,
  value,
  barClass,
}: {
  label: string;
  value: number;
  barClass: string;
}) {
  const pct = Math.min(Math.max(value * 100, 0), 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-36 shrink-0 text-right">
        {label}
      </span>
      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 w-12 text-right">
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  );
}

export function ProposalDetailDrawer({
  proposal,
  onClose,
}: ProposalDetailDrawerProps) {
  const style = VERDICT_STYLES[proposal.decision] ?? VERDICT_STYLES.defer;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* ── Header ── */}
        <div
          className={`sticky top-0 bg-white border-b-2 ${style.accent} rounded-t-2xl px-6 py-4 flex items-start justify-between`}
        >
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {proposal.title}
            </h2>
            <div className="flex items-center gap-3">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.badge}`}
              >
                {proposal.decision.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">
                {(proposal.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {proposal.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4 mt-1"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* ── Scrollable content ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-8">
          {/* ── Counterfactual: build_if vs kill_because ── */}
          <section>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
              Counterfactual
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
                <div className="text-xs font-semibold text-emerald-700 mb-1">
                  Build if&hellip;
                </div>
                <p className="text-sm text-gray-800">{proposal.build_if}</p>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
                <div className="text-xs font-semibold text-red-700 mb-1">
                  Kill because&hellip;
                </div>
                <p className="text-sm text-gray-800">
                  {proposal.kill_because}
                </p>
              </div>
            </div>
          </section>

          {/* ── Violated clauses ── */}
          {proposal.violated_clauses.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
                Violated Clauses
              </h3>
              <div className="flex flex-wrap gap-2">
                {proposal.violated_clauses.map((clause, i) => (
                  <span
                    key={i}
                    className="inline-block px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-800 border border-red-200"
                  >
                    {clause}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ── Pre-mortem ── */}
          <section>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
              Pre-mortem
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Death Cause
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {proposal.pre_mortem.death_cause}
                </p>
              </div>

              {proposal.pre_mortem.early_signals.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Early Signals
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {proposal.pre_mortem.early_signals.map((signal, i) => (
                      <li key={i}>{signal}</li>
                    ))}
                  </ul>
                </div>
              )}

              {proposal.pre_mortem.untested_hypotheses.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Untested Hypotheses
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {proposal.pre_mortem.untested_hypotheses.map((hyp, i) => (
                      <li key={i}>{hyp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {proposal.pre_mortem.mitigation && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Mitigation
                  </div>
                  <p className="text-sm text-gray-700">
                    {proposal.pre_mortem.mitigation}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ── Evidence trail ── */}
          {proposal.evidence_trail.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
                Evidence Trail ({proposal.evidence_trail.length})
              </h3>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {proposal.evidence_trail.map((ev, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-gray-400">
                        {ev.observation_id}
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        relevance {(ev.relevance * 100).toFixed(0)}%
                      </span>
                    </div>
                    <blockquote className="text-sm text-gray-700 italic border-l-2 border-gray-300 pl-3">
                      &ldquo;{ev.quote}&rdquo;
                    </blockquote>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Feature outline (build only) ── */}
          {proposal.feature_outline && (
            <section>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
                Feature Outline
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    label: "Feature Name",
                    value: proposal.feature_outline.feature_name,
                  },
                  {
                    label: "Target User",
                    value: proposal.feature_outline.target_user,
                  },
                  {
                    label: "Problem Statement",
                    value: proposal.feature_outline.problem_statement,
                  },
                  {
                    label: "Why This Now",
                    value: proposal.feature_outline.why_this_now,
                  },
                  {
                    label: "Expected Outcome",
                    value: proposal.feature_outline.expected_outcome,
                  },
                  {
                    label: "Success Metric",
                    value: proposal.feature_outline.success_metric,
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-emerald-50/50 rounded-lg border border-emerald-200 p-3">
                    <div className="text-xs font-semibold text-emerald-700 mb-1">
                      {label}
                    </div>
                    <p className="text-sm text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Allocation score breakdown ── */}
          <section>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
              Allocation Score Breakdown
            </h3>
            <div className="space-y-2.5 bg-gray-50 rounded-lg border border-gray-200 p-4">
              {[
                {
                  label: "Constitutional Fit",
                  value: proposal.allocation_score.constitutional_fit,
                },
                {
                  label: "Transition Value",
                  value: proposal.allocation_score.transition_value,
                },
                {
                  label: "Evidence Strength",
                  value: proposal.allocation_score.evidence_strength,
                },
                {
                  label: "Death Risk",
                  value: proposal.allocation_score.death_risk,
                },
                {
                  label: "Effort Cost",
                  value: proposal.allocation_score.effort_cost,
                },
              ].map(({ label, value }) => (
                <ScoreBar
                  key={label}
                  label={label}
                  value={value}
                  barClass={style.bar}
                />
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <ScoreBar
                  label="Total"
                  value={proposal.allocation_score.total}
                  barClass="bg-gray-800"
                />
              </div>
            </div>
          </section>

          {/* ── Salvage path ── */}
          {proposal.salvage_path && (
            <section>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
                Salvage Path
              </h3>
              <p className="text-sm text-gray-700 bg-amber-50 border border-amber-200 rounded-lg p-4">
                {proposal.salvage_path}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
