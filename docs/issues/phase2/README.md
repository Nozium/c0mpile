# Phase2: MVP Explainability And Builder Handoff

## 目的

Phase1 で出した build / kill 判断を、artifact として残り、共有できる状態に変えた上で、builder handoff まで延ばす。Phase2-0 で decision memory layer を作り、Phase2-1 で demo core を閉じ、Phase2-2 以降は stretch として扱う。

## 完了条件

- chat と agent の役割が分かれ、判断が decision log に残る
- evidence drill-down が成立する
- build 候補に execution packet を少なくとも pre-computed で用意できる
- coding agent 向け export を stretch として出力できる

## ガードレール

- Chat は source of truth にしない。artifact と diff を残す
- Phase2-0 がない状態で外部 action だけ先に増やさない
- Phase2-1 は demo gating。これが閉じなければ Phase2-2 以降に進まない
- Phase2-2, 2-3 は stretch。pre-computed 出力で demo を成立させてもよい
- Phase2-4 は allocation-first を維持した上での actuation stretch
- generation は build に通った proposal のみに限定する
- generation の出力も constitution で再チェックする
- 自動反映はしない。human approval required

## Issues

### Core
- `00_chat_agent_promote_and_decision_log.md`
- `01_evidence_drill_down.md`
- `01a_evidence_card_action_connections.md`
- `02_execution_packet_generation.md`
- `03_coding_agent_handoff_and_exports.md`

### Stretch (Phase2.5)
- `04_experience_actuation_stretch.md`
