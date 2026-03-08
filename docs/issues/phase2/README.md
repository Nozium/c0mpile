# Phase2: MVP Explainability And Builder Handoff

## 目的

Phase1 で出した build / kill 判断を、より説明可能な artifact に変え、必要なら builder handoff まで延ばす。Phase2-1 で demo core を閉じ、Phase2-2 以降は stretch として扱う。

## 完了条件

- evidence drill-down が成立する
- build 候補に execution packet を少なくとも pre-computed で用意できる
- coding agent 向け export を stretch として出力できる

## ガードレール

- Phase2-1 は demo gating。これが閉じなければ Phase2-2 以降に進まない
- Phase2-2, 2-3 は stretch。pre-computed 出力で demo を成立させてもよい
- Phase2-4 は allocation-first を維持した上での actuation stretch
- generation は build に通った proposal のみに限定する
- generation の出力も constitution で再チェックする
- 自動反映はしない。human approval required

## Issues

### Core
- `01_evidence_drill_down.md`
- `02_execution_packet_generation.md`
- `03_coding_agent_handoff_and_exports.md`

### Stretch (Phase2.5)
- `04_experience_actuation_stretch.md`
