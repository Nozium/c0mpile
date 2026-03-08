# Phase1: MVP Allocation Spine

## 目的

`bonsai_mvp.md` と `bonsai_mvp_feedback.md` で確定した MVP の 3-step core を先に成立させる。
この phase では `Constitution -> Data -> Build / Kill` を通し、Rork や post-MVP 機能には寄らない。

## 完了条件

- Constitution 3 行を入力し、clause に正規化できる
- pre-shaped dataset を元に安定して run できる
- observation CSV / JSON を取り込める
- build / defer / kill を evidence 付きで返せる
- Build Next / Kill-Defer surface で判断結果を見せられる
- Constitution の変更で結果が変わることを live で示せる

## ガードレール

- Constitution parser は Phase1 の必須要素
- explicit な user state vector と allocation score は Phase1 の必須要素にしない
- Rork の深い統合は入れない
- live scraping はやらない
- CRM native integration はやらない
- polished dashboard はやらない
- trust / delegation / Virtual Staff は post-MVP に回す
- execution packet の live 生成は Phase1 に入れない

## Phase1 で最低限集めるデータ

- pre-shaped demo dataset と Constitution A / B fixture
- Constitution の raw input と normalized clauses
- raw observation と normalized observation
- build / defer / kill 判定結果
- violated clause, evidence refs, feature outline summary
- H-1 / H-4 系の仮説検証メモ

## Issues

- `00_pre_shaped_demo_dataset.md`
- `01_constitution_input_and_parser.md`
- `02_observation_intake_and_normalization.md`
- `03_allocation_engine_and_decision_trace.md`
- `04_build_next_and_kill_defer_surfaces.md`
- `05_mvp_hypothesis_validation_and_demo_gates.md`
