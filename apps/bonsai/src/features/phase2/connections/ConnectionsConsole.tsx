"use client";

import { useMemo, useRef, useState } from "react";
import type { ObservationConnection, DecisionConnection } from "@/lib/schema";
import { EvidenceColumn } from "./EvidenceColumn";
import { CardColumn } from "./CardColumn";
import { ActionColumn } from "./ActionColumn";
import { ConnectionLines } from "./ConnectionLines";

interface ConnectionsConsoleProps {
  observations: ObservationConnection[];
  decisions: DecisionConnection[];
}

export function ConnectionsConsole({
  observations,
  decisions,
}: ConnectionsConsoleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedObservationId, setSelectedObservationId] = useState<string | null>(null);
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);

  // Cross-highlighting: observation selected → highlight linked decisions
  const highlightedDecisionIds = useMemo(() => {
    if (!selectedObservationId) return new Set<string>();
    const obs = observations.find(
      (o) => o.observation_id === selectedObservationId
    );
    if (!obs) return new Set<string>();
    // Find decisions that reference this observation
    return new Set(
      decisions
        .filter((d) => d.linked_observation_ids.includes(selectedObservationId))
        .map((d) => d.decision_id)
    );
  }, [selectedObservationId, observations, decisions]);

  // Cross-highlighting: decision selected → highlight linked observations
  const highlightedObservationIds = useMemo(() => {
    if (!selectedDecisionId) return new Set<string>();
    const dec = decisions.find((d) => d.decision_id === selectedDecisionId);
    if (!dec) return new Set<string>();
    return new Set(dec.linked_observation_ids);
  }, [selectedDecisionId, decisions]);

  // Selected decision for action panel
  const selectedDecision = useMemo(
    () => decisions.find((d) => d.decision_id === selectedDecisionId) ?? null,
    [selectedDecisionId, decisions]
  );

  // Connection lines between evidence and cards
  const connectionPairs = useMemo(() => {
    if (selectedObservationId) {
      return decisions
        .filter((d) => d.linked_observation_ids.includes(selectedObservationId))
        .map((d) => ({
          sourceId: `obs-${selectedObservationId}`,
          targetId: `dec-${d.decision_id}`,
        }));
    }
    if (selectedDecisionId) {
      const dec = decisions.find((d) => d.decision_id === selectedDecisionId);
      if (!dec) return [];
      return dec.linked_observation_ids.map((obsId) => ({
        sourceId: `obs-${obsId}`,
        targetId: `dec-${selectedDecisionId}`,
      }));
    }
    return [];
  }, [selectedObservationId, selectedDecisionId, decisions]);

  const handleSelectObservation = (id: string | null) => {
    setSelectedObservationId(id);
    if (id) setSelectedDecisionId(null); // Clear other selection
  };

  const handleSelectDecision = (id: string | null) => {
    setSelectedDecisionId(id);
    if (id) setSelectedObservationId(null); // Clear other selection
  };

  return (
    <div ref={containerRef} className="relative grid grid-cols-[35%_35%_30%] h-[calc(100vh-4rem)]">
      <ConnectionLines
        connections={connectionPairs}
        containerRef={containerRef}
      />

      {/* Left: Evidence */}
      <div className="border-r border-gray-200 bg-white overflow-hidden">
        <EvidenceColumnWithIds
          observations={observations}
          selectedObservationId={selectedObservationId}
          highlightedObservationIds={highlightedObservationIds}
          onSelect={handleSelectObservation}
        />
      </div>

      {/* Center: Cards */}
      <div className="border-r border-gray-200 bg-white overflow-hidden">
        <CardColumnWithIds
          decisions={decisions}
          selectedDecisionId={selectedDecisionId}
          highlightedDecisionIds={highlightedDecisionIds}
          onSelect={handleSelectDecision}
        />
      </div>

      {/* Right: Actions */}
      <div className="bg-white overflow-hidden">
        <ActionColumn selectedDecision={selectedDecision} />
      </div>
    </div>
  );
}

/** Wrapper that adds DOM IDs to evidence items for connection lines */
function EvidenceColumnWithIds(props: {
  observations: ObservationConnection[];
  selectedObservationId: string | null;
  highlightedObservationIds: Set<string>;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b bg-gray-50 flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-800">Evidence</h2>
        <p className="text-[10px] text-gray-500">
          {props.observations.length} observations
        </p>
      </div>
      <div className="flex-1 overflow-y-auto" data-scroll-area>
        {sortObservations(props.observations).map((obs) => {
          const isSelected =
            props.selectedObservationId === obs.observation_id;
          const isHighlighted = props.highlightedObservationIds.has(
            obs.observation_id
          );
          const isDimmed =
            props.highlightedObservationIds.size > 0 &&
            !isHighlighted &&
            !isSelected;
          const linkedCount = obs.linked_proposal_ids.length;

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

          return (
            <button
              key={obs.observation_id}
              id={`obs-${obs.observation_id}`}
              onClick={() =>
                props.onSelect(isSelected ? null : obs.observation_id)
              }
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

/** Wrapper that adds DOM IDs to decision cards for connection lines */
function CardColumnWithIds(props: {
  decisions: DecisionConnection[];
  selectedDecisionId: string | null;
  highlightedDecisionIds: Set<string>;
  onSelect: (id: string | null) => void;
}) {
  const verdictStyles: Record<
    string,
    { bg: string; badge: string; border: string }
  > = {
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

  const builds = props.decisions.filter((d) => d.verdict === "build");
  const defers = props.decisions.filter((d) => d.verdict === "defer");
  const kills = props.decisions.filter((d) => d.verdict === "kill");
  const ordered = [...builds, ...defers, ...kills];

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b bg-gray-50 flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-800">Judgment</h2>
        <div className="flex gap-2 mt-0.5">
          <span className="text-[10px] text-green-700 font-medium">
            {builds.length} build
          </span>
          <span className="text-[10px] text-yellow-700 font-medium">
            {defers.length} defer
          </span>
          <span className="text-[10px] text-red-700 font-medium">
            {kills.length} kill
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2" data-scroll-area>
        {ordered.map((dec) => {
          const style = verdictStyles[dec.verdict];
          const isSelected = props.selectedDecisionId === dec.decision_id;
          const isHighlighted = props.highlightedDecisionIds.has(
            dec.decision_id
          );
          const isDimmed =
            props.highlightedDecisionIds.size > 0 &&
            !isHighlighted &&
            !isSelected;

          const reason =
            dec.verdict === "kill"
              ? dec.kill_reason
              : dec.verdict === "defer"
              ? dec.defer_reason
              : dec.build_rationale;

          return (
            <button
              key={dec.decision_id}
              id={`dec-${dec.decision_id}`}
              onClick={() =>
                props.onSelect(isSelected ? null : dec.decision_id)
              }
              className={`w-full text-left rounded-lg border p-3 transition-all ${
                isSelected
                  ? `${style.bg} ${style.border} border-2 ring-2 ring-blue-200`
                  : isHighlighted
                  ? `${style.bg} ${style.border} border-2`
                  : isDimmed
                  ? "opacity-30 border-gray-200"
                  : "border-gray-200 hover:bg-gray-50"
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

              <h3 className="text-xs font-semibold text-gray-800 mb-1">
                {dec.title}
              </h3>

              {reason && (
                <p className="text-[11px] text-gray-600 line-clamp-2 mb-1.5">
                  {reason}
                </p>
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

function sortObservations(observations: ObservationConnection[]) {
  const severityOrder = { critical: 0, major: 1, minor: 2, neutral: 3 };
  return [...observations].sort((a, b) => {
    const aLinked = a.linked_proposal_ids.length > 0 ? 0 : 1;
    const bLinked = b.linked_proposal_ids.length > 0 ? 0 : 1;
    if (aLinked !== bLinked) return aLinked - bLinked;
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}
