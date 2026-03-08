"use client";

import { useState, useCallback } from "react";
import type { ExecutionPacket } from "@/lib/schema";
import { exportTasksAsMarkdown, exportTasksAsJSON } from "./export";

interface CodingAgentExportPanelProps {
  packet: ExecutionPacket;
  onClose: () => void;
}

type ExportFormat = "markdown" | "json";

export function CodingAgentExportPanel({
  packet,
  onClose,
}: CodingAgentExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>("markdown");
  const [copied, setCopied] = useState(false);

  const content =
    format === "markdown"
      ? exportTasksAsMarkdown(packet)
      : exportTasksAsJSON(packet);

  const taskCountByType = packet.coding_agent_tasks.reduce<
    Record<string, number>
  >((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1;
    return acc;
  }, {});

  const effortMap: Record<string, number> = {
    small: 1,
    medium: 2,
    large: 4,
  };
  const totalEffort = packet.coding_agent_tasks.reduce(
    (sum, task) => sum + (effortMap[task.effort] ?? 0),
    0
  );

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  const handleDownload = useCallback(() => {
    const ext = format === "markdown" ? "md" : "json";
    const mimeType =
      format === "markdown" ? "text/markdown" : "application/json";
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `execution-packet-${packet.id}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, format, packet.id]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Coding Agent Export
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Task summary */}
        <div className="border-b bg-gray-50 px-6 py-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="font-medium text-gray-900">
              {packet.coding_agent_tasks.length} tasks
            </span>
            <span className="text-gray-300">|</span>
            {Object.entries(taskCountByType).map(([type, count]) => (
              <span
                key={type}
                className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700"
              >
                {type}: {count}
              </span>
            ))}
            <span className="text-gray-300">|</span>
            <span>
              Total effort:{" "}
              <span className="font-medium text-gray-900">
                ~{totalEffort} story points
              </span>
            </span>
          </div>
        </div>

        {/* Format selector */}
        <div className="flex gap-0 border-b px-6">
          <button
            onClick={() => setFormat("markdown")}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              format === "markdown"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Markdown
          </button>
          <button
            onClick={() => setFormat("json")}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              format === "json"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            JSON
          </button>
        </div>

        {/* Preview area */}
        <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
          <pre className="overflow-auto rounded-lg bg-gray-900 p-4 text-sm leading-relaxed text-gray-100">
            <code>{content}</code>
          </pre>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              copied
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {copied ? (
              <>
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied!
              </>
            ) : (
              "Copy to Clipboard"
            )}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Download .{format === "markdown" ? "md" : "json"}
          </button>
        </div>
      </div>
    </div>
  );
}
