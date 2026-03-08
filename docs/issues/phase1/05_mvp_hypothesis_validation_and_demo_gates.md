# Phase1-5 MVP Hypothesis Validation And Demo Gates

- Status: Done
- Depends on: `01_constitution_input_and_parser.md`, `03_allocation_engine_and_decision_trace.md`

## 背景

`bonsai_mvp.md` では、Demo は H-1 と H-4 が前に進むだけの mechanism を見せる場と定義されている。Phase1 では core line を作るのと同時に、Constitution と evidence を軸にした MVP が前に進めるかを検証する必要がある。

## 目的

Phase1 の MVP spine と並行して、BONSAI の中核仮説に対する Go / No-Go 材料と demo gate を収集する。

## スコープ

- Founder evidence の整理
- PM インタビューによる problem validation
- Constitution parser の H-4 検証
- `Build Next` vs `Kill` 訴求の需要比較
- allocation-first demo の message check
- Constitution A / B による decision 差分シナリオ
- 質的 acceptance criteria の運用
- demo fallback の準備
- 仮説ごとの kill trigger 管理

## 非スコープ

- 長期 moat の確立
- 本格的な pricing モデル設計
- 大規模 go-to-market 実行
- すべての仮説を Phase1 で閉じること

## 実装タスク

- Founder pain を 30 秒で説明できる evidence note にまとめる
- PM 20 名規模の interview guide と evidence log を作る
- `Build Next` 訴求と `Kill` 訴求の LP / waitlist 比較方法を定義する
- Constitution 変更で結果が変わるデモシナリオを定義する
- H-4 の評価方法を constitution parser issue と揃える
- kill 理由と build 候補の質的評価ルーブリックを定義する
- pre-computed run artifact と録画 fallback の運用を決める
- 仮説ごとに success criteria / kill trigger / next action を管理する

## 受け入れ条件

- problem validation の証拠が run とは別に残る
- `Kill` 訴求の需要を `Build Next` と比較できる
- Constitution と evidence を軸にした demo シナリオが成立する
- Constitution A / B で同一候補の decision が少なくとも 1 件変わる
- 5軸正規化について対象者が「正しい / ほぼ正しい」と言う根拠を残せる
- kill 理由について 3 件中 2 件以上で「それは確かに kill」と言われる
- build 候補について 3 件中 2 件以上で「次に作る候補として自然」と言われる
- live run 失敗時の fallback が定義されている
- Phase2 へ進めるか、メッセージや scope を調整すべきかの判断メモが残る

## 確定していること

- Founder evidence は重要な入力になる
- 最初の 2 週間では H-1 と H-4 系の検証が重い
- 過剰設計は明示的なリスクとして扱う

## 実装結果

- `data/demo/fallback-run.json` — pre-computed run artifact (Constitution A/B 2セット)
- `generate-fallback.ts` — fallback artifact 再生成スクリプト
- Constitution A/B で 2 件の decision 差分を安定再現 (theme-002: build→kill, theme-003: defer→kill)
- live run + fallback の両方で demo 実行可能
- ConstitutionLens で clause 横断の一貫性を可視化

## 未確定 / 要確認

- interview 対象のセグメント (非実装タスク)
- LP / waitlist への流入手段 (非実装タスク)
- 仮説管理を run artifact に含めるか、別管理にするか (非実装タスク)
