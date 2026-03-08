# Phase2-1 Evidence Drill-Down

- Status: Proposed
- Depends on: `04_build_next_and_kill_defer_surfaces.md`

## 背景

`bonsai_mvp.md` の demo では、kill された候補を開いて violated clause, evidence quote, pre-mortem を見せる必要がある。Phase1 の board だけでは説明可能性が浅く、judge に伝わりにくい。

## 目的

proposal から clause と evidence へ遡れる drill-down を実装する。

## スコープ

- proposal detail view
- violated clause 表示
- evidence quote / evidence refs 表示
- pre-mortem 表示
- observation への trace

## 非スコープ

- 派手な visualization
- review layer の自動起動
- execution packet 本体

## 実装タスク

- proposal detail の情報設計を固める
- violated clause と evidence quote を表示する
- pre-mortem を詳細表示する
- observation trace を辿れるようにする

## 受け入れ条件

- kill 候補で violated clause を見せられる
- evidence quote または evidence refs を見せられる
- pre-mortem を確認できる
- build 候補と kill 候補の両方から detail に遷移できる

## 確定していること

- explainability は MVP の必須要素
- evidence drill-down は demo 画面に含まれる

## 未確定 / 要確認

- quote をどこまで verbatim に出すか
- detail を modal にするか standalone view にするか
