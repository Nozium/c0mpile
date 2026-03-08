"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { AllocationRun, Constitution, Proposal, ExecutionPacket, AgentChatContext } from "@/lib/schema";
import { AllocationBoard } from "@/features/phase1/boards/AllocationBoard";
import { ConstitutionInput } from "@/features/phase1/constitution/ConstitutionInput";
import { AgentActivityStrip } from "@/features/phase2/agent-activity/AgentActivityStrip";
import { deriveBoardAgentActivity } from "@/features/phase2/agent-activity/derive";

export default function Home() {
  const [constitutions, setConstitutions] = useState<Constitution[]>([]);
  const [selectedConstitution, setSelectedConstitution] = useState("const-a");
  const [customConstitution, setCustomConstitution] = useState<Constitution | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  const [run, setRun] = useState<AllocationRun | null>(null);
  const [compareRun, setCompareRun] = useState<AllocationRun | null>(null);
  const [diffs, setDiffs] = useState<
    { theme_id: string; verdict_a: string; verdict_b: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Phase2: proposals and execution packets
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [executionPackets, setExecutionPackets] = useState<ExecutionPacket[]>([]);

  // Load constitutions on mount
  useEffect(() => {
    fetch("/api/constitutions")
      .then((r) => r.json())
      .then(setConstitutions)
      .catch(console.error);
  }, []);

  // Load proposals and execution packets on mount
  useEffect(() => {
    fetch("/api/proposals")
      .then((r) => r.json())
      .then((data) => setProposals(data.proposals ?? []))
      .catch(console.error);

    fetch("/api/execution-packets")
      .then((r) => r.json())
      .then((data) => setExecutionPackets(data.execution_packets ?? []))
      .catch(console.error);
  }, []);

  const runAllocation = useCallback(async () => {
    setLoading(true);
    try {
      if (compareMode) {
        const res = await fetch("/api/allocate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ compare: true }),
        });
        const data = await res.json();
        if (data.runs?.length >= 2) {
          setRun(data.runs[0]);
          setCompareRun(data.runs[1]);
          setDiffs(data.diffs ?? []);
        }
      } else {
        // Use custom constitution if available, otherwise use preset id
        const payload = customConstitution
          ? { constitution: customConstitution }
          : { constitution_id: selectedConstitution };
        const res = await fetch("/api/allocate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setRun(data);
        setCompareRun(null);
        setDiffs([]);
      }
    } catch (error) {
      console.error("Allocation failed:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedConstitution, customConstitution, compareMode]);

  // Auto-run on constitution change
  useEffect(() => {
    if (constitutions.length > 0) {
      runAllocation();
    }
  }, [constitutions, runAllocation]);

  // Phase2: Handle override — update the run in-place
  const handleOverride = (decisionId: string, newVerdict: "build" | "defer" | "kill", reason: string) => {
    if (!run) return;
    const updatedDecisions = run.decisions.map((d) => {
      if (d.id !== decisionId) return d;
      return {
        ...d,
        verdict: newVerdict,
        kill_reason: newVerdict === "kill" ? `Overridden: ${reason}` : d.kill_reason,
        defer_reason: newVerdict === "defer" ? `Overridden: ${reason}` : d.defer_reason,
        build_rationale: newVerdict === "build" ? `Overridden: ${reason}` : d.build_rationale,
      };
    });
    const summary = {
      build_count: updatedDecisions.filter((d) => d.verdict === "build").length,
      defer_count: updatedDecisions.filter((d) => d.verdict === "defer").length,
      kill_count: updatedDecisions.filter((d) => d.verdict === "kill").length,
    };
    setRun({ ...run, decisions: updatedDecisions, summary });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">BONSAI</h1>
            <p className="text-xs text-gray-500">
              Constitutional allocation for product teams
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={compareMode}
                onChange={(e) => setCompareMode(e.target.checked)}
                className="rounded"
              />
              A/B Compare
            </label>
            <button
              onClick={runAllocation}
              disabled={loading}
              className="text-xs bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Running..." : "Re-evaluate"}
            </button>
            <Link
              href={run ? `/connections?run_id=${encodeURIComponent(run.id)}` : "/connections"}
              className="text-xs border border-gray-300 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Connections Console
            </Link>
            <Link
              href="/guide"
              className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors text-sm font-medium"
              title="BONSAI Guide"
            >
              ?
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <ConstitutionInput
          constitutions={constitutions}
          selectedId={selectedConstitution}
          onSelect={(id) => {
            setCustomConstitution(null);
            setSelectedConstitution(id);
          }}
          onParsed={(c) => {
            setCustomConstitution(c);
          }}
        />

        {compareMode && diffs.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-purple-900 mb-2">
              Constitution A/B Differences
            </h3>
            <div className="space-y-1">
              {diffs.map((d) => (
                <div key={d.theme_id} className="text-xs text-purple-700">
                  <span className="font-medium">{d.theme_id}</span>:{" "}
                  <span className="font-mono">
                    {d.verdict_a} → {d.verdict_b}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {run && (
          <div>
            <div className="text-xs text-gray-400 mb-2">
              {run.constitution_label} | {run.timestamp}
            </div>
            <div className="mb-6">
              <AgentActivityStrip
                items={deriveBoardAgentActivity(run, executionPackets)}
                chatContext={{
                  constitution: (() => {
                    const c = customConstitution ?? constitutions.find((c) => c.id === selectedConstitution);
                    if (!c) return undefined;
                    return { we_are: c.raw_input.we_are, we_never: c.raw_input.we_never, we_value: c.raw_input.we_value, label: c.label };
                  })(),
                  run_summary: run.summary,
                } satisfies AgentChatContext}
              />
            </div>
            <AllocationBoard
              run={run}
              compareRun={compareRun ?? undefined}
              diffs={diffs}
              proposals={proposals}
              executionPackets={executionPackets}
              onOverride={handleOverride}
            />
          </div>
        )}
      </main>
    </div>
  );
}
