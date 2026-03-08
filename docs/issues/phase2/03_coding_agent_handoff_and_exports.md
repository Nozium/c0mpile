# Phase2-3 Coding Agent Handoff And Exports

- Status: Proposed
- Depends on: `00_chat_agent_promote_and_decision_log.md`, `02_execution_packet_generation.md`

## 背景

BONSAI は判断系で終わらず、coding agent が実行できる形に落とす必要がある。ただし MVP では handoff は stretch であり、Execution Packet が pre-computed でも export を出せればよい。

## 目的

execution packet から coding agent 向け task breakdown と export artifact を生成する。

## スコープ

- `coding_agent_tasks` schema
- markdown / JSON export
- task dependency 表現
- frontend / backend / data / integration / test 分類

## 非スコープ

- 実際の agent orchestration platform 構築
- チケット自動起票の全自動化

## 実装タスク

- task breakdown 生成ロジックを作る
- packet fixture から export 形式へ変換する
- dependency と effort を含める
- agent 実行時に参照しやすい summary を作る

## 受け入れ条件

- 1 proposal の packet から agent task list を出せる
- task の依存関係と種別が分かる
- markdown / JSON の少なくとも一方で出力できる

## 確定していること

- coding agent handoff は RFS の必須要件に近い
- MVP では live 生成でなくてもよい

## 未確定 / 要確認

- export 先をどのツールに合わせるか
- task 粒度をどこまで細かくするか
