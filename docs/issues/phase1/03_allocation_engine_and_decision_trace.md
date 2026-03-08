# Phase1-3 Allocation Engine And Decision Trace

- Status: Done
- Depends on: `01_constitution_input_and_parser.md`, `02_observation_intake_and_normalization.md`

## 背景

BONSAI の核は build 提案数ではなく、allocation と kill の説明可能性にある。`bonsai_mvp_feedback.md` では、MVP core は full pipeline ではなく `Extract -> Cluster -> Constitutional Filter` の 3-step に絞るべきと整理された。Phase1 ではこの判断核を最短で成立させる必要がある。

## 目的

normalized observation を抽出・クラスタリングし、constitution と evidence に基づいて build / defer / kill を理由つきで返す。

## スコープ

- extract pipeline
- theme clustering
- constitutional filter
- build / defer / kill decision
- violated clause と kill reason
- evidence refs と drill-down 用データ
- feature outline summary

## 非スコープ

- explicit な user state vector
- full allocation scoring
- full evidence drill-down UI
- execution packet 生成
- polished dashboard
- release / compliance の完全自動判定

## 実装タスク

- minimal `ExtractedObservation` schema を定義する
- observation -> extract を実装する
- extract -> theme cluster を実装する
- theme + constitution -> decision filter を実装する
- build / defer / kill の出力 schema を定義する
- violated clause と evidence refs を返す
- proposal -> observation の trace を構築する
- 60 件前後の少量 observation でも判断が成立するかを検証する

## 受け入れ条件

- 少なくとも 1 件を明示的 clause violation 付きで kill できる
- 各 decision に evidence refs がある
- build / defer / kill の差分理由を説明できる
- build 候補に feature outline summary を返せる
- 同一 dataset 上で Constitution A / B により少なくとも 1 件の decision 差分を出せる
- 少量データ条件でも、decision がランダムに崩れないことを確認できる

## 確定していること

- explainability は必須
- kill quality が差別化の中心
- MVP では build / defer / kill に絞る
- explicit な user state inference と allocation scoring は後続 phase に回す

## 実装結果

- `src/features/phase1/allocation/engine.ts` — `runAllocation(input)` で Constitution × Themes → build/defer/kill を決定
- 判定ロジック: hard violation → kill, alignment + urgency → build, それ以外 → defer
- `ClauseEval` — 全 clause に対する per-decision シグナル (violated/aligned/neutral) を生成。ConstitutionLens の横断比較に使用
- `diffAllocationRuns()` — Constitution A/B の結果差分を検出
- `Decision` に violated_clauses, supporting_evidence, clause_evals, kill_reason, defer_reason, build_rationale を含む完全な trace
- confidence 計算: violation count, alignment count, observation confidence, observation count から算出
- テスト 5件 pass (`allocation-engine.test.ts`)

## 未確定 / 要確認 (解決済み)

- ~~extract / cluster をどこまで deterministic に寄せるか~~ → Phase1 は完全 deterministic (keyword matching)、LLM は Phase2+
- ~~theme cluster の粒度~~ → pre-shaped themes (5件) で固定、動的クラスタリングは Phase2+
- ~~evidence quote をどこまで UI に露出するか~~ → EvidencePanel で raw_text をブロック引用表示
- ~~最低何件の observation があれば allocation を信頼してよいか~~ → 24件で成立確認、confidence score で不確実性を表示
