"use client";

import { useState } from "react";
import type { AllocationRun } from "@/lib/schema";

const signalCell = {
  violated: { bg: "bg-red-500", label: "X" },
  aligned: { bg: "bg-emerald-500", label: "O" },
  neutral: { bg: "bg-gray-200", label: "" },
} as const;

const verdictBadge = {
  build: "text-emerald-700 bg-emerald-100",
  defer: "text-amber-700 bg-amber-100",
  kill: "text-red-700 bg-red-100",
} as const;

/**
 * Constitutional Lens — shows every candidate evaluated against
 * the same clause set. Makes the "same yardstick" visible.
 */
export function ConstitutionLens({ run }: { run: AllocationRun }) {
  // Collect unique clauses from all decisions' clause_evals
  const decisions = run.decisions;
  const firstWithEvals = decisions.find((d) => d.clause_evals && d.clause_evals.length > 0);
  if (!firstWithEvals?.clause_evals) return null;

  const clauses = firstWithEvals.clause_evals.map((ce) => ({
    id: ce.clause_id,
    text: ce.clause_text,
    axis: ce.axis,
  }));

  // Deduplicate by axis for compact view
  const axes = [...new Set(clauses.map((c) => c.axis))];

  // For each decision, aggregate clause evals by axis
  // (worst signal wins: violated > aligned > neutral)
  const axisSignals = decisions.map((d) => {
    const evalMap = new Map((d.clause_evals ?? []).map((ce) => [ce.clause_id, ce.signal]));
    return axes.map((axis) => {
      const clausesForAxis = clauses.filter((c) => c.axis === axis);
      const signals = clausesForAxis.map((c) => evalMap.get(c.id) ?? "neutral");
      if (signals.includes("violated")) return "violated" as const;
      if (signals.includes("aligned")) return "aligned" as const;
      return "neutral" as const;
    });
  });

  // Sort decisions: build first, then defer, then kill
  const sortOrder = { build: 0, defer: 1, kill: 2 };
  const sorted = decisions
    .map((d, i) => ({ decision: d, signals: axisSignals[i] }))
    .sort((a, b) => sortOrder[a.decision.verdict] - sortOrder[b.decision.verdict]);

  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <h3 className="text-sm font-bold text-gray-900">
          Constitutional Lens
        </h3>
        <span className="text-gray-400 text-xs">
          {open ? "▲ collapse" : "▼ expand"}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 overflow-x-auto">
          <p className="text-[11px] text-gray-400 mb-3">
            All candidates evaluated against the same clauses.
            <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-sm mx-1 align-middle" /> aligned
            <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-sm mx-1 align-middle" /> violated
            <span className="inline-block w-2.5 h-2.5 bg-gray-200 rounded-sm mx-1 align-middle" /> neutral
          </p>

          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1.5 pr-3 font-medium text-gray-500 whitespace-nowrap">
                  Candidate
                </th>
                <th className="text-left py-1.5 pr-2 font-medium text-gray-500 w-16">
                  Verdict
                </th>
                {axes.map((axis) => (
                  <th
                    key={axis}
                    className="text-center py-1.5 px-1 font-mono text-[10px] text-gray-400 whitespace-nowrap"
                    title={axis}
                  >
                    {axis.replace(/_/g, " ").slice(0, 12)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(({ decision, signals }) => (
                <tr key={decision.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-1.5 pr-3 text-gray-800 font-medium whitespace-nowrap max-w-[200px] truncate">
                    {decision.theme_label}
                  </td>
                  <td className="py-1.5 pr-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${verdictBadge[decision.verdict]}`}
                    >
                      {decision.verdict.toUpperCase()}
                    </span>
                  </td>
                  {signals.map((signal, i) => {
                    const style = signalCell[signal];
                    return (
                      <td key={axes[i]} className="text-center py-1.5 px-1">
                        <span
                          className={`inline-block w-5 h-5 rounded ${style.bg} text-white text-[10px] font-bold leading-5 text-center`}
                        >
                          {style.label}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
