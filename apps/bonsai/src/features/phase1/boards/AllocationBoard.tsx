"use client";

import { useState } from "react";
import type { AllocationRun, Decision, Proposal, ExecutionPacket } from "@/lib/schema";
import { DecisionCard } from "./DecisionCard";
import { ConstitutionLens } from "./ConstitutionLens";
import { buildIssueBody, type CardAction } from "./card-actions";
import { OverrideDialog } from "@/features/phase2/decision-log/OverrideDialog";
import { ProposalDetailDrawer } from "@/features/phase2/evidence-drilldown/ProposalDetailDrawer";
import { ExecutionPacketViewer } from "@/features/phase2/execution-packet/ExecutionPacketViewer";
import { CodingAgentExportPanel } from "@/features/phase2/coding-agent-export/CodingAgentExportPanel";

type ViewMode = "none" | "evidence" | "execution-packet" | "coding-export";

export function AllocationBoard({
  run,
  compareRun,
  diffs,
  proposals,
  executionPackets,
  onOverride,
}: {
  run: AllocationRun;
  compareRun?: AllocationRun;
  diffs?: { theme_id: string; verdict_a: string; verdict_b: string }[];
  proposals?: Proposal[];
  executionPackets?: ExecutionPacket[];
  onOverride?: (decisionId: string, newVerdict: "build" | "defer" | "kill", reason: string) => void;
}) {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedPacket, setSelectedPacket] = useState<ExecutionPacket | null>(null);
  const [overrideTarget, setOverrideTarget] = useState<Decision | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("none");
  const [actionToast, setActionToast] = useState<string | null>(null);

  const proposalMap = new Map(proposals?.map((p) => [p.theme_id, p]) ?? []);
  const packetMap = new Map(executionPackets?.map((ep) => [ep.proposal_id, ep]) ?? []);

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3000);
  };

  const handleDrillDown = (decision: Decision) => {
    const proposal = proposalMap.get(decision.theme_id);
    if (proposal) {
      setSelectedProposal(proposal);
      setViewMode("evidence");
    }
  };

  const handleViewPacket = (decision: Decision) => {
    const proposal = proposalMap.get(decision.theme_id);
    if (proposal) {
      const packet = packetMap.get(proposal.id);
      if (packet) {
        setSelectedPacket(packet);
        setViewMode("execution-packet");
        return;
      }
    }
    showToast(`No execution packet available for: ${decision.theme_label}`);
  };

  const handleAction = (action: CardAction, decision: Decision) => {
    const body = buildIssueBody(decision);

    switch (action) {
      case "send_rork":
        handleViewPacket(decision);
        break;
      case "add_github_issue":
      case "add_linear_issue": {
        const label = action === "add_github_issue" ? "GitHub Issue" : "Linear";
        navigator.clipboard.writeText(body);
        showToast(`${label} body copied to clipboard: ${decision.theme_label}`);
        break;
      }
      case "create_salvage_proposal":
        navigator.clipboard.writeText(
          `Salvage Proposal: ${decision.theme_label}\n\n${body}`
        );
        showToast(`Salvage proposal copied: ${decision.theme_label}`);
        break;
      case "request_more_evidence":
        showToast(`More evidence requested: ${decision.theme_label}`);
        break;
      case "override_decision":
        setOverrideTarget(decision);
        break;
      default:
        break;
    }
  };

  const handleOverrideConfirm = async (newVerdict: "build" | "defer" | "kill", reason: string) => {
    if (!overrideTarget) return;

    // Log the override to the decision log API
    try {
      await fetch("/api/decision-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `log-${Date.now()}`,
          decision_id: overrideTarget.id,
          timestamp: new Date().toISOString(),
          action: "override",
          actor: "user",
          previous_verdict: overrideTarget.verdict,
          new_verdict: newVerdict,
          reason,
        }),
      });
    } catch {
      // In-memory store may not be available; continue with UI update
    }

    onOverride?.(overrideTarget.id, newVerdict, reason);
    showToast(`Decision overridden: ${overrideTarget.theme_label} → ${newVerdict.toUpperCase()}`);
    setOverrideTarget(null);
  };

  const closeDrawer = () => {
    setSelectedProposal(null);
    setSelectedPacket(null);
    setViewMode("none");
  };

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

      {/* Constitutional Lens — cross-card clause comparison */}
      <ConstitutionLens run={run} />

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
                hasPacket={!!packetMap.get(proposalMap.get(d.theme_id)?.id ?? "")}
                onDrillDown={handleDrillDown}
                onViewPacket={handleViewPacket}
                onAction={handleAction}
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
                onDrillDown={handleDrillDown}
                onAction={handleAction}
              />
            ))}
            {deferDecisions.map((d) => (
              <DecisionCard
                key={d.id}
                decision={d}
                compareVerdict={diffMap.get(d.theme_id)}
                onDrillDown={handleDrillDown}
                onAction={handleAction}
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

      {/* Phase2: Evidence drill-down with proposal detail */}
      {viewMode === "evidence" && selectedProposal && (
        <ProposalDetailDrawer
          proposal={selectedProposal}
          onClose={closeDrawer}
        />
      )}

      {/* Phase2: Execution packet viewer */}
      {viewMode === "execution-packet" && selectedPacket && (
        <ExecutionPacketViewer
          packet={selectedPacket}
          onClose={closeDrawer}
        />
      )}

      {/* Phase2: Coding agent export */}
      {viewMode === "coding-export" && selectedPacket && (
        <CodingAgentExportPanel
          packet={selectedPacket}
          onClose={closeDrawer}
        />
      )}

      {/* Phase2: Override dialog */}
      {overrideTarget && (
        <OverrideDialog
          decision={overrideTarget}
          onConfirm={handleOverrideConfirm}
          onCancel={() => setOverrideTarget(null)}
        />
      )}

      {/* Action toast */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-xs px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">
          {actionToast}
        </div>
      )}
    </div>
  );
}
