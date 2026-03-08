"use client";

import { useEffect, useRef, useState } from "react";

type AgentType = "evidence" | "judgment" | "handoff";

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
}

interface AgentChatPanelProps {
  agentType: AgentType;
  context: {
    constitution?: { we_are: string; we_never: string; we_value: string; label: string };
    decision?: {
      theme_label: string;
      verdict: string;
      confidence: number;
      kill_reason?: string;
      defer_reason?: string;
      build_rationale?: string;
      feature_outline_summary: string;
      supporting_evidence: { observation_id: string; raw_text: string }[];
    };
    observations?: { id: string; raw_text: string; source: string; channel_type: string; severity: string }[];
    run_summary?: { build_count: number; defer_count: number; kill_count: number };
  };
  onClose: () => void;
}

const agentMeta: Record<AgentType, { label: string; dot: string; bg: string; bubble: string }> = {
  evidence: {
    label: "Evidence Agent",
    dot: "bg-blue-500",
    bg: "border-blue-200",
    bubble: "bg-blue-50 text-blue-900",
  },
  judgment: {
    label: "Judgment Agent",
    dot: "bg-emerald-500",
    bg: "border-emerald-200",
    bubble: "bg-emerald-50 text-emerald-900",
  },
  handoff: {
    label: "Handoff Agent",
    dot: "bg-purple-500",
    bg: "border-purple-200",
    bubble: "bg-purple-50 text-purple-900",
  },
};

const quickPrompts: Record<AgentType, string[]> = {
  evidence: ["このエビデンスの要約は?", "追加で必要な証拠は?", "観測データの偏りは?"],
  judgment: ["なぜこの判断になった?", "違う判断になる条件は?", "確信度の根拠は?"],
  handoff: ["Rorkブリーフを生成", "実装の優先順位は?", "コーディングタスクの分解"],
};

export function AgentChatPanel({ agentType, context, onClose }: AgentChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const meta = agentMeta[agentType];

  // Slide-in on mount
  useEffect(() => {
    requestAnimationFrame(() => setOpen(true));
    inputRef.current?.focus();
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 200);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_type: agentType, message: text.trim(), context }),
      });
      const data = await res.json();

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: "agent",
        content: data.response ?? "No response.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "agent",
          content: "Connection error. Please try again.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`relative h-full w-[380px] bg-white shadow-2xl flex flex-col transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${meta.bg}`}>
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
            <span className="text-sm font-bold text-gray-900">{meta.label}</span>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 text-lg leading-none"
          >
            &times;
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && !loading && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 text-center mb-3">
                {meta.label} に質問してみましょう
              </p>
              {quickPrompts[agentType].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => void sendMessage(prompt)}
                  className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 ${
                  msg.role === "user"
                    ? "bg-gray-100 text-gray-900"
                    : meta.bubble
                }`}
              >
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p className="text-[10px] text-gray-400 mt-1 text-right">{msg.timestamp}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className={`rounded-xl px-4 py-2.5 ${meta.bubble}`}>
                <span className="text-xs animate-pulse">...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t px-3 py-3 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`${meta.label} に質問...`}
            disabled={loading}
            className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="text-xs bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-30 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
