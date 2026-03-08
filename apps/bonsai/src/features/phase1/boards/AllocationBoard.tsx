"use client";

import { useState } from "react";
import type { AllocationRun, Decision } from "@/lib/schema";
import { DecisionCard } from "./DecisionCard";
import { EvidencePanel } from "./EvidencePanel";

export function AllocationBoard({
  run,
  compareRun,
  diffs,
}: {
  run: AllocationRun;
  compareRun?: AllocationRun;
  diffs?: { theme_id: string; verdict_a: string; verdict_b: string }[];
}) {
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  const buildDecisions = run.decisions.filter((d) => d.verdict === "build");
  const deferDecisions = run.decisions.filter((d) => d.verdict === "defer");
  const killDecisions = run.decisions.filter((d) => d.verdict === "kill");

  const diffMap = new Map(diffs?.map((d) => [d.theme_id, d.verdict_b]) ?? []);

  return (
    <div>
      {/* Summary bar */}
      <div className="flex gap-4 mb-6 text-sm">
        <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
          Build: {run.summary.build_count}
        </div>
        <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
          Defer: {run.summary.defer_count}
        </div>
        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
          Kill: {run.summary.kill_count}
        </div>
        <div className="text-gray-500 px-3 py-1">
          {run.observation_count} observations / {run.theme_count} themes
        </div>
      </div>

      {/* Two-column layout: Build Next | Kill / Defer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Build Next Board */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full" />
            What should we build next?
          </h2>
          <div className="space-y-3">
            {buildDecisions.map((d) => (
              <DecisionCard
                key={d.id}
                decision={d}
                compareVerdict={diffMap.get(d.theme_id)}
                onDrillDown={setSelectedDecision}
              />
            ))}
            {buildDecisions.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                No build candidates with current constitution.
              </p>
            )}
          </div>
        </section>

        {/* Kill / Defer Board */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full" />
            What should we kill or defer?
          </h2>
          <div className="space-y-3">
            {killDecisions.map((d) => (
              <DecisionCard
                key={d.id}
                decision={d}
                compareVerdict={diffMap.get(d.theme_id)}
                onDrillDown={setSelectedDecision}
              />
            ))}
            {deferDecisions.map((d) => (
              <DecisionCard
                key={d.id}
                decision={d}
                compareVerdict={diffMap.get(d.theme_id)}
                onDrillDown={setSelectedDecision}
              />
            ))}
            {killDecisions.length + deferDecisions.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                No kill/defer candidates with current constitution.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Evidence drill-down panel */}
      {selectedDecision && (
        <EvidencePanel
          decision={selectedDecision}
          onClose={() => setSelectedDecision(null)}
        />
      )}
    </div>
  );
}
