# Presentation Script — 1.5 min

## Requirements

- 1.5 minutes (90 seconds)
- Video recording, upload to GitHub
- 4 sections: Problem → Solution → Approach → How it works

## One-line Frame

- `Problem`
  - AI made building fast, but PM judgment did not get faster.
- `Solution`
  - BONSAI is a constitutional product allocation system for PMs.
- `Approach`
  - Turn product policy and evidence into build / defer / kill with traceable reasons.
- `How it works`
  - Write a constitution, run allocation, inspect the evidence, and turn surviving ideas into handoff artifacts.

## Demo Runbook

### Demo Goal

- `Same evidence, different constitution, different judgment`
- `Every decision is traceable back to evidence and policy`
- `A surviving build candidate becomes a handoff artifact`

### Starting State

- Local app is open on `/`
- `Constitution A: Privacy-First Productivity` is selected
- `A/B Compare` is off
- Build board and Kill / Defer board are visible

### 90-Second Operator Flow

1. `Problem`
   - 話すだけ。まだクリックしない
   - 「AI made building fast, but PM judgment did not get faster」
2. `Show Constitution`
   - 画面上部の Constitution を見せる
   - `Constitution A` の clause を指す
3. `Change Judgment`
   - `Constitution B` を選ぶ
   - 必要なら `Re-evaluate` を押す
   - `Same evidence, different judgment` を言う
4. `Show Board`
   - Build 側の 1 枚を指す
   - Kill 側の 1 枚を指す
   - `build / defer / kill` が分かれたことを言う
5. `Open Evidence`
   - Kill か Defer の card で `detail` を押す
   - violated clause と supporting evidence を見せる
6. `Open Connections`
   - 右上の `Connections Console` を押す
   - Evidence / Judgment / Action の 3 列を見せる
   - 1つの evidence が複数 judgment に効いていることを言う
7. `Show Handoff`
   - Board に戻る
   - Build card の `Execution Packet` を開く
   - 余裕があれば `Prepare Rork Brief` を押して clipboard handoff を見せる

### Fallback Flow

- Constitution 差分が見えにくい場合:
  - `A/B Compare` を ON にする
  - `Re-evaluate` を押して差分バッジを見せる
- Connections まで行く時間がない場合:
  - Board 上の `detail` と `Execution Packet` だけで締める
- Handoff まで行く時間がない場合:
  - `Execution Packet` が見えた時点で止める

### What To Avoid Saying

- `AI replaces PM judgment`
- `Rork is already fully integrated`
- `Agents are autonomously shipping product`

### What To Say Instead

- `BONSAI makes PM judgment explainable and repeatable`
- `Backend agents structure evidence, evaluate candidates, and prepare handoff artifacts`
- `Generation happens after allocation, not before it`

---

## Outline (時間配分)

### 1. Problem (0:00 - 0:25) — 25秒

**言いたいこと**: AI が生産を 10x にした結果、ボトルネックが build から judgment に移った。

**スクリプト案**:

> I shipped 10 products in one month using AI coding tools.
> Revenue: zero. Customer conversations: zero.
>
> AI made building 10x faster. But deciding what to build did not get faster.
> The bottleneck shifted from execution to judgment.
>
> PMs are now overwhelmed by candidates, feedback, prototypes, and requests.
> What they need is not more generation. What they need is a faster, more defensible way to decide what to build, defer, and kill.

**画面**: `10 products -> 0 revenue` と `build faster, decide slower` の 2 行

---

### 2. Solution (0:25 - 0:45) — 20秒

**言いたいこと**: BONSAI は PM judgment を置き換えるのではなく、product policy と evidence を使って judgment を外在化する。

**スクリプト案**:

> We built BONSAI, a constitutional product allocation system for PMs.
>
> You define your product policy in three lines:
> who you are, what you never do, and what you value.
> BONSAI turns evidence into build, defer, or kill decisions, with reasons you can trace back to both policy and data.
>
> It does not replace your judgment.
> It makes your judgment explainable, repeatable, and fast enough to keep up with AI-speed production.

**画面**: Constitution Editor（We are / We never / We value の3行入力）

---

### 3. Approach (0:45 - 1:05) — 20秒

**言いたいこと**: allocation-first。Constitution → Evidence → Allocation の順で判断し、その後に handoff する。

**スクリプト案**:

> Three steps.
>
> First, you write your constitution.
> We normalize it into evaluable clauses.
>
> Second, you import evidence:
> customer interviews, usage data, support tickets.
> We structure what users say and what they actually need.
>
> Third, the allocation engine evaluates candidates against your constitution and the evidence, and returns build, defer, or kill with clause-level reasoning.
>
> Only after allocation do we generate handoff artifacts.
> Generation is downstream of judgment, not a replacement for it.

**画面**: パイプライン図（Constitution → Evidence → Build/Defer/Kill）

---

### 4. How it works (1:05 - 1:30) — 25秒

**言いたいこと**: 同じ evidence でも constitution が変わると判断が変わり、surviving build は handoff に落ちる。

**スクリプト案**:

> Here's the product.
>
> I switch the constitution and re-evaluate.
> Same evidence, different judgment.
>
> This is the allocation board.
> The backend agents normalize evidence, evaluate candidates, and prepare handoff artifacts.
>
> If I open a kill decision, you can see the violated clause and the supporting evidence.
> Then I can open the Connections Console to trace how evidence, judgment, and action connect.
>
> And if a candidate survives, BONSAI turns it into an execution packet for builders or coding agents.
>
> Constitution in, allocation out, handoff ready.

**画面**: Constitution change → Build/Kill Board → Kill detail → Connections Console → Execution Packet

---

## 実装済みの見せ方に合わせた要点

- `Re-evaluate` は live に allocation を再実行する
- `Agent Activity` は backend agent の進捗表示として見せる
- `Connections Console` は `Evidence -> Judgment -> Action` の trace 画面として見せる
- `Prepare Rork Brief` は現時点では clipboard handoff
- `Execution Packet` と `Agent Export` は build card から見せる

---

## 必要な機能（デモで動く必要があるもの）

| # | 機能 | 動作の期待 | 必須/推奨 |
|---|---|---|---|
| 1 | **Constitution Input** | We are / We never / We value の3行を入力できる | 必須 |
| 2 | **Constitution Parse** | 3行テキストを5軸の clause に正規化して表示する | 必須 |
| 3 | **Observation Data** | Pre-shaped dataset が読み込まれた状態で表示される（手動 import 不要、事前ロード可） | 必須 |
| 4 | **Build Next Board** | build 候補を allocation score 降順で表示。各カードに title, score, target user, why now, evidence count | 必須 |
| 5 | **Kill / Defer Board** | kill / defer 候補を表示。各カードに title, kill type, violated clause, evidence count, confidence | 必須 |
| 6 | **Evidence Drill-down** | カードを開くと supporting observations, clause reasoning, pre-mortem が見える | 必須 |
| 7 | **Execution Packet** | build 候補を開くと UI/data/workflow 変更案 + coding agent tasks が表示される。デモでは pre-computed を許容 | 必須 |
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
- build の Proposal を score 降順で表示
- 各カード表示項目:
  - title
  - allocation_score (0-1)
  - decision badge (BUILD)
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
- build の Proposal から表示（デモでは事前生成を許容）
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
