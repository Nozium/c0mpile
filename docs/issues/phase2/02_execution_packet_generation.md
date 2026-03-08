# Phase2-2 Execution Packet Generation

- Status: Proposed
- Depends on: `01_evidence_drill_down.md`

## 背景

`bonsai_mvp.md` では、surviving build decisions を execution packet に落とすことが builder handoff の接続点になっている。一方で `bonsai_mvp_feedback.md` では、Execution Packet は live core ではなく stretch / pre-computed demo extension として扱うべきと整理された。ここで `ExecutionPacket` を first-class に定義するが、live 生成は必須にしない。

## 目的

build 候補に対して、UI変更、データモデル変更、ワークフロー変更、実験計画を含む execution packet を定義し、少なくとも 1 件を demo 用に成立させる。

## スコープ

- execution packet schema
- proposal から packet を作る生成フロー
- pre-computed packet artifact
- why now / target state / intended transition の要約
- experiment plan と success metric

## 非スコープ

- 実装そのものの自動実行
- 外部チケットシステム同期

## 実装タスク

- `ExecutionPacket` schema を確定する
- proposal から packet を出す API か semi-manual flow を作る
- packet と evidence summary を紐付ける
- packet の version 管理を行う
- エンジニア / coding agent に渡して、そのまま着手できるかを検証する
- 使い物にならない場合の fallback として `PRD draft` への格下げ条件を定義する

## 受け入れ条件

- build 候補に packet を少なくとも 1 件用意できる
- UI / data / workflow change outline を含む
- success metric と experiment plan を含む
- live 生成がなくても pre-computed packet で demo できる
- packet の有用性を利用者に確認し、使えない場合は failure を明示できる

## 確定していること

- execution packet は BONSAI を builder handoff に接続する橋
- Phase2 では pre-computed を許容する

## 未確定 / 要確認

- packet を markdown 主体にするか JSON 主体にするか
- design mock を含めるか
- コードベース context がない状態でどこまで具体化できるか
