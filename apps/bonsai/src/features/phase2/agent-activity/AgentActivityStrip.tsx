"use client";

import type { AgentActivityItem } from "@/lib/schema";

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

export function AgentActivityStrip({ items }: { items: AgentActivityItem[] }) {
  if (items.length === 0) return null;

  return (
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
          <div
            key={item.id}
            className={`rounded-lg border px-3 py-3 ${toneByAgent[item.agent_type]}`}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-current opacity-60" />
              <span className="text-[11px] font-semibold">
                {labelByAgent[item.agent_type]}
              </span>
            </div>
            <p className="text-xs leading-relaxed">{item.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
