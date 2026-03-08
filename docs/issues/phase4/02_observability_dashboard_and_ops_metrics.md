# Phase4-2 Observability Dashboard And Ops Metrics

- Status: Proposed
- Depends on: `01_crm_native_integration_and_writeback.md`

## 背景

MVP ではダッシュボードを意図的に作り込まない。運用に入る段階で初めて、pipeline と judgment と post-MVP actuator を観測する read model を整える。

## 目的

BONSAI の実行状態と品質を継続観測するための observability / dashboard を作る。

## スコープ

- run success / failure metrics
- stage latency
- import health
- proposal distribution
- execution packet 生成率

## 非スコープ

- 見栄え重視の可視化
- 初期 phase の operator 体験置き換え

## 実装タスク

- 監視対象の KPI を決める
- run / stage / proposal / packet の read model を作る
- alert 条件を定義する
- 最小の ops dashboard を実装する

## 受け入れ条件

- pipeline の健全性を継続観測できる
- 失敗傾向と詰まり箇所が分かる
- Phase1-3 の運用判断に必要な最小 KPI を見られる

## 確定していること

- ダッシュボード本格化は後続でよい

## 未確定 / 要確認

- 監視基盤の選定
- alert をどこに送るか
