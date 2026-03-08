"use client";

import { useState } from "react";
import type { AgentActivityItem, AgentChatContext } from "@/lib/schema";
import { AgentChatPanel } from "./AgentChatPanel";

const toneByAgent: Record<AgentActivityItem["agent_type"], string> = {
  evidence: "border-blue-200 bg-blue-50 text-blue-900",
  judgment: "border-emerald-200 bg-emerald-50 text-emerald-900",
  handoff: "border-purple-200 bg-purple-50 text-purple-900",
};

const labelByAgent: Record<AgentActivityItem["agent_type"], string> = {
  evidence: "Evidence Agent",
  judgment: "Judgment Agent",
  handoff: "Handoff Agent",
};

interface AgentActivityStripProps {
  items: AgentActivityItem[];
  chatContext?: AgentChatContext;
}

export function AgentActivityStrip({ items, chatContext }: AgentActivityStripProps) {
  const [chatAgent, setChatAgent] = useState<AgentActivityItem["agent_type"] | null>(null);

  if (items.length === 0) return null;

  return (
    <>
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Agent Activity</h2>
            <p className="text-xs text-gray-500">
              Backend agents are structuring evidence, updating judgment, and preparing handoff artifacts.
            </p>
          </div>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-600">
            {items.length} active
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setChatAgent(item.agent_type)}
              className={`rounded-lg border px-3 py-3 text-left transition-shadow hover:shadow-md cursor-pointer ${toneByAgent[item.agent_type]}`}
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-current opacity-60" />
                <span className="text-[11px] font-semibold">
                  {labelByAgent[item.agent_type]}
                </span>
                <span className="ml-auto text-[9px] opacity-50">Chat</span>
              </div>
              <p className="text-xs leading-relaxed">{item.summary}</p>
            </button>
          ))}
        </div>
      </section>

      {chatAgent && (
        <AgentChatPanel
          agentType={chatAgent}
          context={chatContext ?? {}}
          onClose={() => setChatAgent(null)}
        />
      )}
    </>
  );
}
