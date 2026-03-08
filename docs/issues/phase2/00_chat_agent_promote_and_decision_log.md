# Phase2-0 Chat Agent Promote And Decision Log

- Status: Proposed
- Depends on: `../phase1/05_mvp_hypothesis_validation_and_demo_gates.md`

## 背景

Phase1 で BONSAI は build / defer / kill を返せるようになるが、そのままでは会話と操作が flow として流れてしまい、組織の判断が artifact として残らない。

Cursor が強いのは chat で終わらず diff と file に落ちる点であり、BONSAI でも同様に conversation を source of truth にしてはいけない。

Phase2 では execution packet や外部連携に進む前に、以下を先に固める必要がある。

- Chat は探索用
- Agent は state-changing action 用
- 会話から artifact へ昇格する `Promote`
- 判断の変更履歴を残す `Decision Log`

## 目的

AI とのやり取りを、`thinking surface` と `state-changing operator` に分離し、policy / card / packet / issue 更新が履歴つきで永続化される基盤を作る。

## スコープ

- Chat と Agent の役割分離
- `Promote` action の定義
- `DecisionLog` schema
- policy / card / packet の diff 記録
- override reason 記録
- team sharing 用の read model

## 非スコープ

- 高度な multi-agent orchestration
- full meeting transcript の完全保存 UX
- Slack / email / docs 自動配布の本格運用
- 権限モデルの本格化

## 実装タスク

- Chat artifact と Agent artifact の状態遷移を定義する
- `Promote to Policy Update / Card / Evidence Note / Execution Packet / Issue Draft` を定義する
- `DecisionLog` schema を確定する
- card の build / defer / kill 変更履歴を記録する
- policy update の version diff を記録する
- override reason と approver を記録する
- 他チームが参照する shareable summary read model を作る

## 受け入れ条件

- Chat の内容がそのまま source of truth にならない
- 重要な会話を `Promote` で artifact に昇格できる
- build / defer / kill の変更履歴が残る
- override した場合に reason と actor が残る
- policy / card / packet の更新が diff として辿れる
- PM / build team / leadership 向けに共有しやすい summary を出せる

## 確定していること

- Chat = exploration
- Agent = state-changing operator
- 共有の単位は会話ではなく artifact
- transcript 全文より decision diff を重視する

## 未確定 / 要確認

- `Promote` を card 単位にするか message 選択単位にするか
- transcript の保存期間
- Decision Log の UI を card detail に置くか独立 timeline に置くか
- external action log（GitHub / Linear / Rork）を同じ timeline に入れるか
