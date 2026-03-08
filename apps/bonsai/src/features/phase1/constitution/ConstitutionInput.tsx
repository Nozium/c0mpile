"use client";

import { useState } from "react";
import type { Constitution, ConstitutionRawInput } from "@/lib/schema";

export function ConstitutionInput({
  constitutions,
  selectedId,
  onSelect,
  onParsed,
}: {
  constitutions: Constitution[];
  selectedId: string;
  onSelect: (id: string) => void;
  onParsed?: (constitution: Constitution) => void;
}) {
  const [customMode, setCustomMode] = useState(false);
  const [rawInput, setRawInput] = useState<ConstitutionRawInput>({
    we_are: "",
    we_never: "",
    we_value: "",
  });
  const [parsing, setParsing] = useState(false);
  const [preview, setPreview] = useState<Constitution | null>(null);

  const handleParseCustom = async () => {
    setParsing(true);
    try {
      const res = await fetch("/api/parse-constitution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rawInput),
      });
      const data = await res.json();
      if (res.ok) {
        setPreview(data);
        onParsed?.(data);
      }
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      <h2 className="font-bold text-gray-900 mb-3">Constitution</h2>

      {/* Preset selector */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {constitutions.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setCustomMode(false);
              setPreview(null);
              onSelect(c.id);
            }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !customMode && selectedId === c.id
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
            }`}
          >
            {c.label}
          </button>
        ))}
        <button
          onClick={() => setCustomMode(true)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            customMode
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
          }`}
        >
          Custom
        </button>
      </div>

      {/* Show selected constitution clauses */}
      {!customMode && (
        <div className="text-xs space-y-1 text-gray-600">
          {constitutions
            .find((c) => c.id === selectedId)
            ?.clauses.slice(0, 5)
            .map((cl) => (
              <div key={cl.id} className="flex gap-2">
                <span
                  className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    cl.type === "hard"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {cl.axis}
                </span>
                <span>{cl.text}</span>
              </div>
            ))}
        </div>
      )}

      {/* Custom constitution input */}
      {customMode && (
        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              We are...
            </label>
            <input
              type="text"
              value={rawInput.we_are}
              onChange={(e) =>
                setRawInput({ ...rawInput, we_are: e.target.value })
              }
              placeholder="a privacy-first productivity tool for knowledge workers..."
              className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              We never...
            </label>
            <input
              type="text"
              value={rawInput.we_never}
              onChange={(e) =>
                setRawInput({ ...rawInput, we_never: e.target.value })
              }
              placeholder="sell user data, show ads, or use dark patterns..."
              className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              We value...
            </label>
            <input
              type="text"
              value={rawInput.we_value}
              onChange={(e) =>
                setRawInput({ ...rawInput, we_value: e.target.value })
              }
              placeholder="simplicity over feature count, user trust over growth metrics..."
              className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleParseCustom}
            disabled={
              parsing ||
              !rawInput.we_are ||
              !rawInput.we_never ||
              !rawInput.we_value
            }
            className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {parsing ? "Parsing..." : "Parse & Preview"}
          </button>

          {/* Clause preview */}
          {preview && (
            <div className="mt-2 text-xs space-y-1 text-gray-600 bg-gray-50 rounded-lg p-3">
              <div className="font-medium text-gray-700 mb-1">
                Generated {preview.clauses.length} clauses:
              </div>
              {preview.clauses.map((cl) => (
                <div key={cl.id} className="flex gap-2">
                  <span
                    className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      cl.type === "hard"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {cl.polarity}
                  </span>
                  <span>{cl.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
