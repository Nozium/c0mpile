"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ConnectionsData } from "@/lib/schema";
import { ConnectionsConsole } from "@/features/phase2/connections/ConnectionsConsole";
import { deriveConnectionsAgentActivity } from "@/features/phase2/agent-activity/derive";
import { AgentChatPanel } from "@/features/phase2/agent-activity/AgentChatPanel";

export default function ConnectionsPage() {
  const [data, setData] = useState<ConnectionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [runId, setRunId] = useState<string | null>(null);
  const [initialDecisionId, setInitialDecisionId] = useState<string | null>(null);
  const [initialObservationId, setInitialObservationId] = useState<string | null>(null);
  const [chatAgent, setChatAgent] = useState<"evidence" | "judgment" | "handoff" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextRunId = params.get("run_id");
    const nextDecisionId = params.get("decision_id");
    const nextObservationId = params.get("observation_id");

    setRunId(nextRunId);
    setInitialDecisionId(nextDecisionId);
    setInitialObservationId(nextObservationId);

    const query = new URLSearchParams();
    if (nextRunId) {
      query.set("run_id", nextRunId);
    }

    fetch(`/api/connections${query.size > 0 ? `?${query.toString()}` : ""}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load connections:", err);
        setLoading(false);
      });
  }, []);
  const activity = data ? deriveConnectionsAgentActivity(data) : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              ← Board
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                BONSAI Connections
              </h1>
              <p className="text-[10px] text-gray-500">
                Evidence → Judgment → Action
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            {data && (
              <>
                {runId && <span>run {runId}</span>}
                {runId && <span>·</span>}
                <span>{data.observations.length} evidence</span>
                <span>·</span>
                <span>{data.decisions.length} judgments</span>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-gray-400">Loading connections...</p>
          </div>
        ) : data ? (
          <div className="h-full">
            <div className="border-b bg-white px-6 py-3">
              <div className="flex flex-wrap gap-2">
                {activity.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setChatAgent(item.agent_type)}
                    className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {item.summary} · Chat
                  </button>
                ))}
              </div>
            </div>
            <ConnectionsConsole
              observations={data.observations}
              decisions={data.decisions}
              initialDecisionId={initialDecisionId}
              initialObservationId={initialObservationId}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-red-500">Failed to load connections data.</p>
          </div>
        )}
      </main>

      {chatAgent && (
        <AgentChatPanel
          agentType={chatAgent}
          context={{
            observations: data?.observations.map((o) => ({
              id: o.observation_id,
              raw_text: o.raw_text,
              source: o.source,
              channel_type: o.channel_type,
              severity: o.severity,
            })),
          }}
          onClose={() => setChatAgent(null)}
        />
      )}
    </div>
  );
}
