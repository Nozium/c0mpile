# Phase3-2 Virtual Staff Adversarial Review

- Status: Proposed
- Depends on: Phase2 完了

## 背景

`virtual_staff.md` では、BONSAI の自己確証バイアスを崩す外部視点レイヤとして Virtual Staff が定義されている。ただし `bonsai_mvp.md` では trust / delegation 系の本格実装は post-MVP であり、この機能は core MVP の後ろに置く。

## 目的

proposal / constitution / pipeline run に対して、複数 reviewer framework から adversarial review を実行し、盲点と未解決リスクを可視化する。

## スコープ

- 4 reviewer persona の定義
- review 実行 API
- severity 付き question 生成
- review response 記録
- proposal / constitution 画面からの起動

## 非スコープ

- review 結果の allocation score 自動反映
- カスタム reviewer 作成 UI
- reviewer 間クロスレビュー
- review 履歴の高度な時系列分析

## 実装タスク

- reviewer persona と evaluation axes を定義する
- `POST /api/reviews/run` と結果取得 API を作る
- review question の severity と `why_this_matters` を返す
- Answer / Acknowledge / Dismiss / Action Taken を記録する
- Constitution / Proposal / Pipeline Run から review を起動できる UI を作る

## 受け入れ条件

- Constitution に対して 4 reviewer が構造化質問を生成できる
- Proposal に対して fatal / critical / important / probe を出し分けられる
- ユーザーが質問への応答状態を残せる
- fatal / critical の未解決数が一目で分かる

## 確定していること

- Virtual Staff は advisory layer として始める
- Pre-mortem と補完関係にある
- post-MVP の advisory layer として始める

## 未確定 / 要確認

- Phase3 時点で `pipeline_run` review まで入れるか
- reviewer 実行コストをどう抑えるか
- dismiss をどこまで許容するか
