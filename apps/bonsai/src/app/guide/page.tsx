"use client";

import { useState } from "react";
import Link from "next/link";

type Lang = "ja" | "en";

const t = {
  banner: {
    ja: "DO NOT GENAI SLOP TO USER",
    en: "DO NOT GENAI SLOP TO USER",
  },
  headerTitle: { ja: "BONSAI Guide", en: "BONSAI Guide" },
  headerSub: {
    ja: "Cursor for Product Managers — 機能の対応関係",
    en: "Cursor for Product Managers — Feature Mapping",
  },
  backToDashboard: { ja: "Dashboard に戻る", en: "Back to Dashboard" },
  introTitle: {
    ja: "BONSAI = Cursor for Product Managers",
    en: "BONSAI = Cursor for Product Managers",
  },
  introBody: {
    ja: "Cursor がエンジニアに対して「次に書くべきコード」と「書いてはいけないコード」を規約に基づいて判定するように、BONSAI は PM / Founder に対して「次に作るべきもの」と「今切るべきもの」を Constitution と evidence に基づいて判定します。",
    en: 'Just as Cursor helps engineers decide "what code to write next" and "what code must not be written" based on project rules, BONSAI helps PMs and Founders decide "what to build next" and "what to kill now" based on their Constitution and evidence.',
  },
  introQuote: {
    ja: "「本当の Cursor for PM は PRD 生成ではない。テストスイートが『ship するな』と言うのと同じ確信度で『それを作るな、理由はこれ』と言えるシステムだ」",
    en: '"The real Cursor for PM isn\'t about generating PRDs. It\'s about having a system that says \'don\'t build that, and here\'s why\' with the same confidence that a test suite says \'don\'t ship that\'."',
  },
  coreTitle: {
    ja: "核心の対応関係",
    en: "Core Mapping",
  },
  detailTitle: {
    ja: "詳細マッピング",
    en: "Detailed Mapping",
  },
  screenLabel: {
    ja: "画面上の対応",
    en: "On screen",
  },
  whyTitle: {
    ja: "なぜ「生成」ではなく「配分」か",
    en: 'Why "allocation" instead of "generation"?',
  },
  whyBody: {
    ja: "AI によって実装コストが下がるほど、希少資源は build ability から judgment, attention, experiment capacity に移ります。Cursor が「もっと速くコードを書く」ツールであるように、BONSAI は「もっと正確に作らない判断をする」ツールです。",
    en: "As AI lowers the cost of building, the scarce resource shifts from build ability to judgment, attention, and experiment capacity. Just as Cursor is a tool for \"writing code faster,\" BONSAI is a tool for \"making more accurate decisions about what NOT to build.\"",
  },
  whyOutputLabel: {
    ja: "BONSAI の主出力:",
    en: "BONSAI's primary outputs:",
  },
  whyOutputs: {
    ja: [
      "何を build / defer / kill するかの判定",
      "各判定の根拠（clause violation, evidence refs）",
      "build 候補の feature outline と execution packet",
      "Constitution を変えたときの判定差分",
    ],
    en: [
      "Build / defer / kill decisions",
      "Evidence trail for each decision (clause violations, evidence refs)",
      "Feature outline and execution packet for build candidates",
      "Decision diff when Constitution changes",
    ],
  },
} as const;

const corePairs = [
  {
    cursor: ".cursorrules",
    bonsai: { ja: "Constitution（3行の方針）", en: "Constitution (3-line policy)" },
    color: "blue",
  },
  {
    cursor: "Lint error",
    bonsai: { ja: "Kill（clause violation）", en: "Kill (clause violation)" },
    color: "red",
  },
  {
    cursor: "Test pass",
    bonsai: { ja: "Build（evidence + alignment）", en: "Build (evidence + alignment)" },
    color: "emerald",
  },
  {
    cursor: "Code diff",
    bonsai: { ja: "A/B Compare（方針変更の差分）", en: "A/B Compare (policy change diff)" },
    color: "purple",
  },
] as const;

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-900" },
  red: { bg: "bg-red-50", text: "text-red-900" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-900" },
  purple: { bg: "bg-purple-50", text: "text-purple-900" },
};

const mappings = [
  {
    cursor: ".cursorrules",
    cursorDesc: {
      ja: "プロジェクトのコーディング規約・制約を定義",
      en: "Defines project coding conventions and constraints",
    },
    bonsai: "Constitution",
    bonsaiDesc: {
      ja: "「We are / We never / We value」の3行でプロダクト方針を定義",
      en: 'Defines product policy in 3 lines: "We are / We never / We value"',
    },
    screen: {
      ja: "画面上部の Constitution パネル（5軸表示）",
      en: "Constitution panel at top (5-axis display)",
    },
    color: "bg-blue-50 border-blue-200",
  },
  {
    cursor: "Codebase indexing",
    cursorDesc: {
      ja: "ソースコード全体を読み込み、文脈を理解する",
      en: "Indexes entire codebase and understands context",
    },
    bonsai: "Observation intake",
    bonsaiDesc: {
      ja: "顧客インタビュー、usage data、レビュー等を取り込み正規化する",
      en: "Ingests and normalizes customer interviews, usage data, reviews",
    },
    screen: {
      ja: "サマリーバーの「50 observations / 7 themes」",
      en: '"50 observations / 7 themes" in the summary bar',
    },
    color: "bg-gray-50 border-gray-200",
  },
  {
    cursor: "Code completion",
    cursorDesc: {
      ja: "文脈に基づいて「次に書くべきコード」を提案",
      en: 'Suggests "what code to write next" based on context',
    },
    bonsai: "Build Next Board",
    bonsaiDesc: {
      ja: "Constitution と evidence に基づいて「次に作るべきもの」を提案",
      en: 'Proposes "what to build next" based on Constitution and evidence',
    },
    screen: {
      ja: "左カラム（緑の BUILD カード）",
      en: "Left column (green BUILD cards)",
    },
    color: "bg-emerald-50 border-emerald-200",
  },
  {
    cursor: "Lint / Error detection",
    cursorDesc: {
      ja: "コーディング規約違反やバグを検出して警告",
      en: "Detects coding rule violations and bugs",
    },
    bonsai: "Kill Board",
    bonsaiDesc: {
      ja: "Constitution の hard clause 違反を検出し、理由付きで kill 判定",
      en: "Detects hard clause violations and issues kill decisions with reasons",
    },
    screen: {
      ja: "右カラム（赤の KILL カード + violated clauses）",
      en: "Right column (red KILL cards + violated clauses)",
    },
    color: "bg-red-50 border-red-200",
  },
  {
    cursor: "Test suite",
    cursorDesc: {
      ja: "「これを ship していいか」の自動判定",
      en: '"Can we ship this?" — automated pass/fail',
    },
    bonsai: "Constitutional Filter",
    bonsaiDesc: {
      ja: "「これを build していいか」を evidence-based で判定",
      en: '"Should we build this?" — evidence-based decision',
    },
    screen: {
      ja: "各カードの confidence % と evidence refs",
      en: "Confidence % and evidence refs on each card",
    },
    color: "bg-amber-50 border-amber-200",
  },
  {
    cursor: "Diff / Code review",
    cursorDesc: {
      ja: "変更前後の差分を表示",
      en: "Shows before/after diff",
    },
    bonsai: "A/B Compare",
    bonsaiDesc: {
      ja: "Constitution を変えたときの判定差分を表示",
      en: "Shows decision diff when Constitution changes",
    },
    screen: {
      ja: "右上の A/B Compare チェックボックス",
      en: "A/B Compare checkbox in top right",
    },
    color: "bg-purple-50 border-purple-200",
  },
  {
    cursor: "Error message + fix suggestion",
    cursorDesc: {
      ja: "なぜエラーかを説明し、修正を提案",
      en: "Explains why it's an error and suggests fixes",
    },
    bonsai: "Kill reason + violated clause",
    bonsaiDesc: {
      ja: "なぜ kill かを clause 引用付きで説明",
      en: "Explains why it's killed with clause citations",
    },
    screen: {
      ja: "KILL カードの赤い理由バー",
      en: "Red reason bar on KILL cards",
    },
    color: "bg-red-50 border-red-200",
  },
  {
    cursor: "Code execution / Run",
    cursorDesc: {
      ja: "コードを実行して結果を確認",
      en: "Executes code and shows results",
    },
    bonsai: "Execution Packet (Phase2)",
    bonsaiDesc: {
      ja: "build 通過した候補を UI/data/workflow のタスクに分解",
      en: "Decomposes build candidates into UI/data/workflow tasks",
    },
    screen: {
      ja: "Phase2 で実装予定",
      en: "Coming in Phase 2",
    },
    color: "bg-gray-50 border-gray-200",
  },
];

export default function GuidePage() {
  const [lang, setLang] = useState<Lang>("ja");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* DO NOT GENAI SLOP TO USER banner */}
      <div className="bg-red-600 text-white text-center py-2 px-4">
        <span className="font-bold text-sm tracking-wide">
          {t.banner[lang]}
        </span>
      </div>

      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {t.headerTitle[lang]}
            </h1>
            <p className="text-xs text-gray-500">{t.headerSub[lang]}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "ja" ? "en" : "ja")}
              className="text-xs border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              {lang === "ja" ? "EN" : "JA"}
            </button>
            <Link
              href="/"
              className="text-xs bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              {t.backToDashboard[lang]}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Intro */}
        <section className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {t.introTitle[lang]}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t.introBody[lang]}
          </p>
          <blockquote className="mt-4 border-l-4 border-gray-300 pl-4 text-sm text-gray-500 italic">
            {t.introQuote[lang]}
          </blockquote>
        </section>

        {/* Core formula */}
        <section className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">
            {t.coreTitle[lang]}
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {corePairs.map((pair, i) => {
              const c = colorMap[pair.color];
              return (
                <div key={i} className="contents">
                  <div className={`${c.bg} rounded-lg p-3 text-center`}>
                    <div className="font-mono text-xs text-gray-400 mb-1">
                      Cursor
                    </div>
                    <div className={`font-bold ${c.text}`}>{pair.cursor}</div>
                  </div>
                  <div className={`${c.bg} rounded-lg p-3 text-center`}>
                    <div className="font-mono text-xs text-gray-400 mb-1">
                      BONSAI
                    </div>
                    <div className={`font-bold ${c.text}`}>
                      {pair.bonsai[lang]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Detailed mapping */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 mb-4">
            {t.detailTitle[lang]}
          </h2>
          <div className="space-y-3">
            {mappings.map((m, i) => (
              <div key={i} className={`rounded-xl border ${m.color} p-4`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                      Cursor
                    </div>
                    <div className="font-semibold text-sm text-gray-900">
                      {m.cursor}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {m.cursorDesc[lang]}
                    </p>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                      BONSAI
                    </div>
                    <div className="font-semibold text-sm text-gray-900">
                      {m.bonsai}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {m.bonsaiDesc[lang]}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-gray-400">
                  {t.screenLabel[lang]}: {m.screen[lang]}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why allocation, not ideation */}
        <section className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-2">
            {t.whyTitle[lang]}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t.whyBody[lang]}
          </p>
          <div className="mt-4 bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
            <div className="font-medium mb-1">{t.whyOutputLabel[lang]}</div>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
              {t.whyOutputs[lang].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <div className="text-center pb-8">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {t.backToDashboard[lang]}
          </Link>
        </div>
      </main>
    </div>
  );
}
