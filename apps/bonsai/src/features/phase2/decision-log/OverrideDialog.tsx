"use client";

import { useState } from "react";
import type { Decision } from "@/lib/schema";

const verdictOptions = ["build", "defer", "kill"] as const;

export function OverrideDialog({
  decision,
  onConfirm,
  onCancel,
}: {
  decision: Decision;
  onConfirm: (newVerdict: "build" | "defer" | "kill", reason: string) => void;
  onCancel: () => void;
}) {
  const otherVerdicts = verdictOptions.filter((v) => v !== decision.verdict);
  const [newVerdict, setNewVerdict] = useState<"build" | "defer" | "kill">(otherVerdicts[0]);
  const [reason, setReason] = useState("");

  const verdictColors = {
    build: "bg-emerald-600 text-white",
    defer: "bg-amber-600 text-white",
    kill: "bg-red-600 text-white",
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900">Override Decision</h2>
          <p className="text-xs text-gray-500 mt-1">
            {decision.theme_label} — currently{" "}
            <span className="font-bold uppercase">{decision.verdict}</span>
          </p>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New verdict
            </label>
            <div className="flex gap-2">
              {otherVerdicts.map((v) => (
                <button
                  key={v}
                  onClick={() => setNewVerdict(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    newVerdict === v
                      ? verdictColors[v]
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for override <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why are you overriding this decision?"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(newVerdict, reason)}
            disabled={!reason.trim()}
            className="px-4 py-2 text-xs bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Override
          </button>
        </div>
      </div>
    </div>
  );
}
