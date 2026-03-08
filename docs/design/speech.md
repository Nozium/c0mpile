# Presentation Script — 1.5 min

## Requirements

- 1.5 minutes (90 seconds)
- Video recording, upload to GitHub
- 4 sections: Problem → Solution → Approach → How it works

---

## Outline (時間配分)

### 1. Problem (0:00 - 0:25) — 25秒

**言いたいこと**: AI が生産を 10x にしたが、判断が追いつかない。

**スクリプト案**:

> I shipped 10 products in one month using AI coding tools.
> Revenue: zero. Customer conversations: zero.
>
> AI made building 10x faster. But nobody made deciding-what-to-build faster.
> The bottleneck shifted — from "how to build" to "what to build, and what NOT to build."
>
> This is already happening at scale. Just like App Store review became a bottleneck when submission speed exceeded review speed — product judgment is now the bottleneck when build speed exceeds evaluation speed.

**画面**: なし、または「10 products → 0 revenue」のテキスト表示

---

### 2. Solution (0:25 - 0:45) — 20秒

**言いたいこと**: Constitutional Product Allocation System。判断基準を外在化し、evidence ベースで build/kill を振り分ける。

**スクリプト案**:

> We built a constitutional product allocation system.
>
> You define your product policy in three lines — who you are, what you never do, what you value.
> The system turns customer evidence into build, defer, or kill decisions — with reasons you can trace back to your policy and the data.
>
> It doesn't replace your judgment. It makes your judgment explainable, repeatable, and fast enough to keep up with AI-speed production.

**画面**: Constitution Editor（We are / We never / We value の3行入力）

---

### 3. Approach (0:45 - 1:05) — 20秒

**言いたいこと**: 3ステップ。Constitution → Evidence → Allocation。

**スクリプト案**:

> Three steps.
>
> First, you write your constitution — three lines that define your product boundaries.
> We normalize this into evaluable clauses.
>
> Second, you import evidence — customer interviews, usage data, support tickets.
> We extract what users say versus what they actually need.
>
> Third, the allocation engine scores each candidate against your constitution and the evidence, and returns build, defer, or kill — with clause-level reasoning and a pre-mortem for every decision.

**画面**: パイプライン図（Constitution → Evidence → Build/Defer/Kill）

---

### 4. How it works (1:05 - 1:30) — 25秒

**言いたいこと**: デモ画面を見せる。Constitution が変われば判断が変わる。Build 候補は Execution Packet まで落ちる。

**スクリプト案**:

> Here's the product.
>
> (画面: Build Next Board)
> This is the Build Next board. Each candidate has an allocation score, evidence count, and a feature outline ready for handoff.
>
> (画面: Kill/Defer Board)
> This is the Kill board. Each killed candidate shows which constitutional clause it violated, the evidence, and a salvage path.
>
> (画面: Execution Packet)
> For candidates that survive, we generate an execution packet — UI changes, data model changes, workflow changes, and task breakdowns ready for coding agents.
>
> Constitution in, allocation out. That's it.

**画面**: Build Next Board → Kill Board → Execution Packet の3画面切り替え

---

## 必要な機能（デモで動く必要があるもの）

| # | 機能 | 動作の期待 | 必須/推奨 |
|---|---|---|---|
| 1 | **Constitution Input** | We are / We never / We value の3行を入力できる | 必須 |
| 2 | **Constitution Parse** | 3行テキストを5軸の clause に正規化して表示する | 必須 |
| 3 | **Observation Data** | Pre-shaped dataset が読み込まれた状態で表示される（手動 import 不要、事前ロード可） | 必須 |
| 4 | **Build Next Board** | build / continue 候補を allocation score 降順で表示。各カードに title, score, target user, why now, evidence count | 必須 |
| 5 | **Kill / Defer Board** | kill / defer 候補を表示。各カードに title, kill type, violated clause, evidence count, confidence | 必須 |
| 6 | **Evidence Drill-down** | カードを開くと supporting observations, clause reasoning, pre-mortem が見える | 必須 |
| 7 | **Execution Packet** | build 候補を開くと UI/data/workflow 変更案 + coding agent tasks が表示される | 必須 |
| 8 | **Constitution 変更で結果が変わる** | Constitution を書き換えると build/kill の判定が変化する（Live でやる核心部分） | 必須 |

## 動作の期待（詳細）

### 1. Constitution Input
- 3つの textarea: `We are`, `We never`, `We value`
- placeholder でサンプルを表示（例: "a privacy-first productivity tool for knowledge workers"）
- 入力後「Parse」ボタンで clause 正規化を実行

### 2. Constitution Parse
- LLM call (Claude Sonnet) で3行 → 5軸に変換
- 5軸: target_user, strategic_terrain, prohibited_business_model, quality_bar, trust_compliance_rule
- + desired_transitions, forbidden_patterns
- レスポンス時間: 5秒以内
- Parse 結果を Constitution パネルにリアルタイム表示

### 3. Observation Data
- `/public/data/dataset.json` に pre-shaped dataset をバンドル
- customer interview, usage event, app review, support ticket を含む
- 最低 50-80 件の observation
- ページロード時に自動読み込み、Import UI は不要（デモ用）

### 4. Build Next Board
- build / continue の Proposal を score 降順で表示
- 各カード表示項目:
  - title
  - allocation_score (0-1)
  - decision badge (BUILD / CONTINUE)
  - target_user
  - problem_statement (1行)
  - why_now (1行)
  - evidence count
  - [Feature Outline] ボタン → 展開で feature_name, target_user, problem_statement, why_this_now, expected_outcome, success_metric
  - [Execution Packet →] ボタン → 詳細画面へ

### 5. Kill / Defer Board
- kill / defer の Proposal を confidence 降順で表示
- 各カード表示項目:
  - title
  - decision badge (KILL / DEFER)
  - kill_type
  - violated_clauses (clause ID 列挙)
  - death_cause (1行)
  - evidence count
  - confidence (0-1)
  - [Evidence →] ボタン → drill-down へ
  - [Salvage Path] ボタン → salvage_path テキスト表示

### 6. Evidence Drill-down
- 選択した Proposal の詳細パネル（drawer or modal）
- 表示項目:
  - pre_mortem: death_cause, early_signals, untested_hypotheses, mitigation
  - build_if / kill_because の counterfactual 対
  - allocation_score の5軸内訳 (constitutional_fit, transition_value, evidence_strength, death_risk, effort_cost)
  - evidence_trail: observation の raw_text, extracted_intent vs inferred_need, source, timestamp
  - violated clause の source_text と normalized_rule

### 7. Execution Packet
- build/continue の Proposal から生成（ボタン押下 or 事前生成）
- 表示項目:
  - problem_statement
  - target_user_state
  - intended_transition
  - why_now
  - supporting_evidence_summary
  - ui_change_outline
  - data_model_change_outline
  - workflow_change_outline
  - success_metric
  - experiment_plan
  - coding_agent_tasks: 各タスクに task_id, title, description, type (frontend/backend/data/integration/test), effort (S/M/L), dependencies

### 8. Constitution 変更で結果が変わる
- Constitution を書き換えて再度 Parse → Pipeline 再実行
- **デモの核心**: 同じ observation data に対して、constitution が変わると build/kill が入れ替わることを見せる
- 実装方法の選択肢:
  - A: Full pipeline 再実行（20-30秒。待ち時間が長い）
  - B: Constitution parse + Step 3 (Filter) のみ再実行（5-10秒。theme/observation は pre-computed）
  - **推奨: B** — デモの速度を優先。Step 1-2 は pre-computed、Step 3 のみ Live

---

## Pre-computed vs Live の境界（デモ用）

| 処理 | Pre-computed | Live |
|---|---|---|
| Observation normalization (Step 1) | ✅ | |
| Theme clustering (Step 2) | ✅ | |
| Constitution parse | | ✅ |
| Constitutional filter + allocation (Step 3) | | ✅ |
| Execution packet generation (Step 4) | ✅ (1-2件分) | 余裕があれば Live |

---

## デモで見せない（speech で触れない）

- 判断委譲ラダー
- Trust Harness
- Exposure Allocation
- Release / Submission Gate
- Rork 連携
- CRM integration
- 評価疲れの将来問題
