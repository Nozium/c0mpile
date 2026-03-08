# Phase4-3 UX Evaluation Framework And Experiment Analytics

- Status: Proposed
- Depends on: `02_observability_dashboard_and_ops_metrics.md`

## 背景

MVP では UX 評価を作り込まない。post-MVP では、Rork 補助実験を含む variant 間比較と学習蓄積のために、評価軸を標準化する必要がある。

## 目的

複数 UX variant の評価結果を比較可能にし、planning 改善へ安定的に戻せる評価基盤を作る。

## スコープ

- evaluation schema の標準化
- variant comparison
- 定性 / 定量結果の同居
- planning 改善への feedback aggregation

## 非スコープ

- 厳密な実験プラットフォーム化
- 全社 BI の置き換え

## 実装タスク

- UX評価の共通項目を決める
- variant 間比較の read model を作る
- planning 改善へのフィードバック集約を自動化する
- 必要に応じて lightweight scorecard を導入する

## 受け入れ条件

- variant ごとの差分を比較できる
- 定性 / 定量の両結果を保存できる
- planning 改善に再利用できる

## 確定していること

- UX評価の作り込みは Phase4 で行う

## 未確定 / 要確認

- 評価者の種類
- 定量指標の最小セット
- scorecard を必須にするか
