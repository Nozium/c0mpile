"use client";

import { useState, useRef, useEffect } from "react";
import type { Decision } from "@/lib/schema";
import {
  defaultActions,
  actionLabels,
  buildIssueBody,
  buildRationale,
  type CardAction,
} from "./card-actions";

const primaryStyles = {
  build: "bg-emerald-600 hover:bg-emerald-700 text-white",
  defer: "bg-amber-600 hover:bg-amber-700 text-white",
  kill: "bg-red-600 hover:bg-red-700 text-white",
} as const;

export function CardActionBar({
  decision,
  onAction,
}: {
  decision: Decision;
  onAction?: (action: CardAction, decision: Decision) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const config = defaultActions[decision.verdict];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleAction = async (action: CardAction) => {
    setOpen(false);

    if (action === "copy_rationale") {
      await navigator.clipboard.writeText(buildRationale(decision));
      return;
    }

    // For external integrations, pass action + decision to parent
    // Parent can handle Rork/Linear/GitHub API calls
    onAction?.(action, decision);
  };

  return (
    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200">
      {/* Primary CTA */}
      <button
        onClick={() => handleAction(config.primary)}
        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${primaryStyles[decision.verdict]}`}
      >
        {actionLabels[config.primary]}
      </button>

      {/* More dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          More
        </button>

        {open && (
          <div className="absolute right-0 bottom-full mb-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            {config.secondary.map((action) => (
              <button
                key={action}
                onClick={() => handleAction(action)}
                className="w-full text-left text-xs text-gray-700 hover:bg-gray-50 px-3 py-2 transition-colors"
              >
                {actionLabels[action]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
