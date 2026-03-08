# Phase1-3 Allocation Engine And Decision Trace

- Status: Proposed
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

## 未確定 / 要確認

- extract / cluster をどこまで deterministic に寄せるか
- theme cluster の粒度
- evidence quote をどこまで UI に露出するか
- 最低何件の observation があれば allocation を信頼してよいか
