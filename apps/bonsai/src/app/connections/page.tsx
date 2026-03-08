"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ConnectionsData } from "@/lib/schema";
import { ConnectionsConsole } from "@/features/phase2/connections/ConnectionsConsole";

export default function ConnectionsPage() {
  const [data, setData] = useState<ConnectionsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/connections")
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
          <ConnectionsConsole
            observations={data.observations}
            decisions={data.decisions}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-red-500">Failed to load connections data.</p>
          </div>
        )}
      </main>
    </div>
  );
}
