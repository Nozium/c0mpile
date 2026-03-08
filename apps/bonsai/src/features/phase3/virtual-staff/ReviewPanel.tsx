"use client";

import { useState, useCallback } from "react";
import type {
  StaffReview,
  ReviewQuestion,
  ReviewResponse,
  ReviewerType,
  Severity,
  ResponseStatus,
} from "@/lib/schema";

const severityConfig: Record<Severity, { color: string; bg: string; border: string; label: string }> = {
  fatal: { color: "text-red-800", bg: "bg-red-50", border: "border-red-300", label: "FATAL" },
  critical: { color: "text-orange-800", bg: "bg-orange-50", border: "border-orange-300", label: "CRITICAL" },
  important: { color: "text-blue-800", bg: "bg-blue-50", border: "border-blue-300", label: "IMPORTANT" },
  probe: { color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-300", label: "PROBE" },
};

const reviewerLabels: Record<ReviewerType, string> = {
  yc_partner: "YC Partner",
  first_principles: "First Principles",
  customer_advocate: "Customer Advocate",
  strategic_skeptic: "Strategic Skeptic",
};

export function ReviewPanel({
  review,
  onClose,
}: {
  review: StaffReview;
  onClose: () => void;
}) {
  const [activeFilter, setActiveFilter] = useState<ReviewerType | "all">("all");
  const [responses, setResponses] = useState<Map<string, ReviewResponse>>(new Map());
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const filteredQuestions = activeFilter === "all"
    ? review.questions
    : review.questions.filter((q) => q.reviewer_type === activeFilter);

  // Sort by severity: fatal > critical > important > probe
  const severityOrder: Severity[] = ["fatal", "critical", "important", "probe"];
  const sortedQuestions = [...filteredQuestions].sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity),
  );

  const handleSubmitResponse = useCallback(
    async (questionId: string, status: ResponseStatus, dismissReason?: string) => {
      const text = status === "dismissed"
        ? dismissReason ?? ""
        : status === "acknowledged"
          ? "(Acknowledged)"
          : responseText;

      try {
        const res = await fetch(`/api/reviews/${review.id}/responses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question_id: questionId,
            response_text: text,
            status,
            dismiss_reason: status === "dismissed" ? dismissReason : undefined,
          }),
        });
        if (res.ok) {
          const resp: ReviewResponse = await res.json();
          setResponses((prev) => new Map(prev).set(questionId, resp));
          setRespondingTo(null);
          setResponseText("");
        }
      } catch (error) {
        console.error("Failed to submit response:", error);
      }
    },
    [review.id, responseText],
  );

  // Count unresolved fatal/critical
  const unresolvedFatal = review.questions
    .filter((q) => q.severity === "fatal")
    .filter((q) => {
      const r = responses.get(q.id);
      return !r || r.status === "acknowledged";
    }).length;

  const unresolvedCritical = review.questions
    .filter((q) => q.severity === "critical")
    .filter((q) => {
      const r = responses.get(q.id);
      return !r || r.status === "acknowledged";
    }).length;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="font-bold text-gray-900">Virtual Staff Review</h2>
            <span className="text-xs text-gray-500">
              Target: {review.target_type} / {review.target_id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none px-2"
          >
            x
          </button>
        </div>

        {/* Summary bar */}
        <div className="px-5 py-3 border-b bg-gray-50">
          <div className="flex gap-3 mb-2 flex-wrap">
            <SeverityBadge severity="fatal" count={review.summary.fatal_count} unresolved={unresolvedFatal} />
            <SeverityBadge severity="critical" count={review.summary.critical_count} unresolved={unresolvedCritical} />
            <SeverityBadge severity="important" count={review.summary.important_count} />
            <SeverityBadge severity="probe" count={review.summary.probe_count} />
          </div>
          <p className="text-xs text-gray-600">
            <span className="font-medium">Top blind spot:</span>{" "}
            {review.summary.top_blind_spot}
          </p>
        </div>

        {/* Reviewer filter tabs */}
        <div className="px-5 py-2 border-b flex gap-2 flex-wrap">
          <FilterTab
            label="All"
            active={activeFilter === "all"}
            count={review.questions.length}
            onClick={() => setActiveFilter("all")}
          />
          {review.reviewer_types.map((rt) => (
            <FilterTab
              key={rt}
              label={reviewerLabels[rt]}
              active={activeFilter === rt}
              count={review.questions.filter((q) => q.reviewer_type === rt).length}
              onClick={() => setActiveFilter(rt)}
            />
          ))}
        </div>

        {/* Question list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {sortedQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              response={responses.get(q.id)}
              isResponding={respondingTo === q.id}
              responseText={responseText}
              onStartRespond={() => {
                setRespondingTo(q.id);
                setResponseText("");
              }}
              onChangeText={setResponseText}
              onSubmit={(status, dismissReason) =>
                handleSubmitResponse(q.id, status, dismissReason)
              }
              onCancel={() => setRespondingTo(null)}
            />
          ))}
          {sortedQuestions.length === 0 && (
            <p className="text-sm text-gray-400 italic text-center py-8">
              No questions for this filter.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-3 bg-gray-50 text-xs text-gray-500 rounded-b-xl">
          {review.summary.overall_assessment}
        </div>
      </div>
    </div>
  );
}

function SeverityBadge({
  severity,
  count,
  unresolved,
}: {
  severity: Severity;
  count: number;
  unresolved?: number;
}) {
  const cfg = severityConfig[severity];
  return (
    <span className={`${cfg.bg} ${cfg.color} text-xs font-medium px-2 py-1 rounded-full`}>
      {cfg.label}: {count}
      {unresolved != null && unresolved > 0 && (
        <span className="ml-1 font-bold">({unresolved} open)</span>
      )}
    </span>
  );
}

function FilterTab({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1 rounded-full transition-colors ${
        active
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label} ({count})
    </button>
  );
}

function QuestionCard({
  question,
  response,
  isResponding,
  responseText,
  onStartRespond,
  onChangeText,
  onSubmit,
  onCancel,
}: {
  question: ReviewQuestion;
  response?: ReviewResponse;
  isResponding: boolean;
  responseText: string;
  onStartRespond: () => void;
  onChangeText: (text: string) => void;
  onSubmit: (status: ResponseStatus, dismissReason?: string) => void;
  onCancel: () => void;
}) {
  const cfg = severityConfig[question.severity];
  const [dismissReason, setDismissReason] = useState("");
  const [showDismiss, setShowDismiss] = useState(false);

  return (
    <div className={`rounded-lg border ${cfg.border} ${cfg.bg} p-4`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`${cfg.color} text-xs font-bold`}>{cfg.label}</span>
          <span className="text-xs text-gray-500">
            {reviewerLabels[question.reviewer_type]} &gt; {question.axis_id}
          </span>
        </div>
        {response && (
          <ResponseBadge status={response.status} />
        )}
      </div>

      {/* Question */}
      <p className="text-sm text-gray-900 font-medium mb-1">
        {question.question}
      </p>
      <p className="text-xs text-gray-600 mb-3">
        <span className="font-medium">Why:</span> {question.why_this_matters}
      </p>

      {/* Existing response */}
      {response && !isResponding && (
        <div className="bg-white/70 rounded p-2 mb-2 text-sm">
          <div className="text-xs text-gray-500 mb-1">
            {response.status === "dismissed" && response.dismiss_reason
              ? `Dismissed: ${response.dismiss_reason}`
              : response.status.charAt(0).toUpperCase() + response.status.slice(1)}
          </div>
          {response.response_text && response.status !== "acknowledged" && (
            <p className="text-gray-700 text-xs">{response.response_text}</p>
          )}
        </div>
      )}

      {/* Response form */}
      {isResponding ? (
        <div className="space-y-2">
          {!showDismiss ? (
            <>
              <textarea
                value={responseText}
                onChange={(e) => onChangeText(e.target.value)}
                placeholder="Your response..."
                className="w-full text-sm border rounded p-2 h-20 resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => onSubmit("answered")}
                  disabled={!responseText.trim()}
                  className="text-xs bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-800 disabled:opacity-40"
                >
                  Answer
                </button>
                <button
                  onClick={() => onSubmit("acknowledged")}
                  className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded hover:bg-amber-200"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => onSubmit("action_taken")}
                  disabled={!responseText.trim()}
                  className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded hover:bg-emerald-200 disabled:opacity-40"
                >
                  Action Taken
                </button>
                <button
                  onClick={() => setShowDismiss(true)}
                  className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Dismiss
                </button>
                <button
                  onClick={onCancel}
                  className="text-xs text-gray-500 px-3 py-1 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                value={dismissReason}
                onChange={(e) => setDismissReason(e.target.value)}
                placeholder="Reason for dismissing (required)..."
                className="w-full text-sm border rounded p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onSubmit("dismissed", dismissReason);
                    setShowDismiss(false);
                    setDismissReason("");
                  }}
                  disabled={!dismissReason.trim()}
                  className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-40"
                >
                  Confirm Dismiss
                </button>
                <button
                  onClick={() => setShowDismiss(false)}
                  className="text-xs text-gray-500 px-3 py-1 rounded hover:bg-gray-100"
                >
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        !response && (
          <button
            onClick={onStartRespond}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Respond
          </button>
        )
      )}
    </div>
  );
}

function ResponseBadge({ status }: { status: ResponseStatus }) {
  const styles: Record<ResponseStatus, string> = {
    answered: "bg-emerald-100 text-emerald-800",
    acknowledged: "bg-amber-100 text-amber-800",
    dismissed: "bg-red-100 text-red-800",
    action_taken: "bg-blue-100 text-blue-800",
  };
  const labels: Record<ResponseStatus, string> = {
    answered: "Answered",
    acknowledged: "Acknowledged",
    dismissed: "Dismissed",
    action_taken: "Action Taken",
  };

  return (
    <span className={`${styles[status]} text-xs px-2 py-0.5 rounded-full font-medium`}>
      {labels[status]}
    </span>
  );
}
