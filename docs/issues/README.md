# BONSAI Issue Roadmap

`docs/design/bonsai_mvp.md` を source of truth として、実行可能な issue に分解したロードマップです。`docs/design/bonsai_mvp_feedback.md` の絞り込みも反映し、MVP は `3-step core + stretch handoff` として扱います。補助資料として `bonsai.md`, `bonsai_claude.md`, `bonsai_codex.md`, `hypothesis-brief.md`, `pre-mortem.md`, `virtual_staff.md` も参照しますが、実装順序は `bonsai_mvp.md` とその feedback を優先します。

## 前提

- MVP の core line は `Constitution -> Data -> Build / Kill`
- evidence drill-down で説明可能性を閉じる
- execution packet と coding agent export は Phase2 の stretch / handoff として扱う
- Phase1 は Rork-first ではなく allocation-first / demo-shortest-path で進める
- Constitution 3 行と pre-shaped dataset を Phase1 の最初の入力に置く
- Rork の深い統合依存は MVP から外す
- Virtual Staff / trust harness / CRM native / observability の本格化は post-MVP に回す

## Phase 概要

### Phase1

MVP の 3-step core を成立させる。
pre-shaped dataset, Constitution input / parser, observation normalization, Extract / Cluster / Constitutional Filter, Build Next / Kill-Defer surface をこの phase の主線にする。

### Phase2

MVP の explainability を完成させ、builder handoff の stretch を足す。
まず Chat / Agent / Promote / Decision Log で判断を artifact 化し、その上で evidence drill-down で demo core を閉じ、execution packet と coding agent export は pre-computed を許容しながら追加する。

### Phase3

post-MVP の実験・判断品質拡張を行う。
Rork 補助導線、Virtual Staff、より深い user state / allocation refinement はこの phase に置く。

### Phase4

post-MVP の運用拡張を行う。
CRM native integration, observability, UX evaluation 基盤を整える。

## 補足

- 未確定事項は各 issue の `未確定 / 要確認` に残す
- MVP から外れたものは削除ではなく post-MVP phase に移す
- phase 名は実装順序であり、必ずしも開発スプリント名ではない
