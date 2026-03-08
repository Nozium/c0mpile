# Phase3-1 Rork Experiment Loop Post-MVP

- Status: Proposed
- Depends on: Phase2 完了

## 背景

`bonsai_mvp.md` では Rork の深い統合依存は cut されている。Rork は BONSAI core ではなく、MVP 後に build 候補を補助的に試す actuator として扱う。

## 目的

build 候補や execution packet を Rork へ渡し、補助的な実験ループとして使えるようにする。

## スコープ

- Rork 実行方法の標準化
- build 候補 / execution packet からの prompt package 生成
- variant registry の作成
- 生成 artifact の保存
- 軽量な validation log

## 収集するデータ

- `variant_id`, `proposal_id`, `execution_packet_id`
- Rork prompt / 実行パラメータ
- 生成物リンク, screenshot, operator memo
- validation session の日時, 対象ユーザー種別, 実施シナリオ
- task completion, drop-off, qualitative feedback, notable quote
- 次回 allocation / packet 改善へ返す keep / revise / kill の判断メモ

## 非スコープ

- BONSAI core allocation の置き換え
- 本格的な UX score system
- 実験分析ダッシュボード
- Rork 以外の actuation platform 追加

## 実装タスク

- Rork 実行経路を定義する
- proposal / execution packet から prompt package を生成する
- variant ごとに prompt, link, screenshot, generated notes を残す
- validation record schema を定義する
- operator note, user reaction, basic usage signal を記録する

## 受け入れ条件

- 1 つの build 候補から複数 variant を Rork で生成できる
- variant ごとに生成 artifact と validation 結果を紐付けられる
- validation 結果から proposal / packet の改善案を出せる
- keep / revise / kill のいずれで次へ進むかを variant 単位で残せる

## 確定していること

- Rork は post-MVP の補助 actuator に留める
- BONSAI core demo に Rork は必須でない
- UX評価の本格化は Phase4 に回す

## 未確定 / 要確認

- Rork の API / CLI が使えるか、browser automation か、operator step か
- validation に誰を参加させるか
- success threshold を定量中心にするか、定性中心にするか
