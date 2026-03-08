# Phase3-3 User State And Theme Inference Refinement

- Status: Proposed
- Depends on: Phase2 完了

## 背景

`bonsai_mvp_feedback.md` により、explicit な user state inference と full allocation scoring は MVP core から外れた。post-MVP では、より深い state abstraction, theme quality, allocation quality を改善したくなる。

## 目的

observation 群からの user state / theme 推定と allocation quality を MVP より高精度にし、判断関数を洗練する。

## スコープ

- より深い user state vector
- observation からの高精度 state inference
- theme / anti-theme clustering の改善
- full allocation scoring の導入 / 改善
- usage data を state 推定へ深く接続
- state cluster と build / kill pattern の対応付け

## 非スコープ

- 本格的な ABM simulator
- リアルタイム state 更新
- 大規模 personalization

## 実装タスク

- post-MVP 用 `UserState` と `Theme` schema を見直す
- observation -> state inference の改善ポイントを実装する
- theme / anti-theme の品質を上げる
- allocation score の入力軸と重みを見直す
- state cluster ごとの pain / adoption / trust signal を見える化する

## 受け入れ条件

- MVP より良い state cluster を出せる
- theme と anti-theme を evidence 付きで返せる
- explicit な allocation score を導入しても判断品質が改善する
- usage data が refinement に寄与していることを説明できる

## 確定していること

- state abstraction は BONSAI の中核
- MVP には最小版だけ入れ、深掘りは後ろに回す

## 未確定 / 要確認

- state vector の最終次元数
- clustering を deterministic に寄せるか、LLM 主体にするか
- usage data のどの指標を最低限使うか
