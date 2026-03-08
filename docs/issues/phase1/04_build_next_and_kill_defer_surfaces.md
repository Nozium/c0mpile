# Phase1-4 Build Next And Kill Defer Surfaces

- Status: Proposed
- Depends on: `03_allocation_engine_and_decision_trace.md`

## 背景

`bonsai_mvp.md` では、Constitution Input の次に `Build Next Board` と `Kill / Defer Board` を見せるのが core demo になっている。Allocation 結果を最初に理解できる画面が Phase1 に必要である。

## 目的

次に作るべきものと、今切るべきものを並べて比較できる MVP 主画面を実装する。

## スコープ

- Build Next Board
- Kill / Defer Board
- feature outline summary
- Constitution 変更時の再評価導線
- demo 用の Constitution A / B 切り替えシナリオ
- Evidence drill-down への導線

## 非スコープ

- full evidence drill-down 実装
- execution packet 実装
- 派手な charts
- 複数組織比較 UI

## 実装タスク

- board 情報設計を固める
- build / defer / kill card を実装する
- Constitution 更新後に結果が変わる導線をつなぐ
- 同一候補の decision 差分を見せるための card 表現を決める
- evidence drill-down への遷移をつなぐ

## 受け入れ条件

- `What should we build next?` に直接答える UI がある
- kill / defer の理由が主画面から読める
- Constitution 変更で board 内容が変わることを確認できる
- 同一候補について Constitution A / B で decision が変わることを確認できる
- proposal から evidence drill-down に辿れる

## 確定していること

- Build Next と Kill / Defer は二層で持つ
- build-next を前に、kill を差別化に使う

## 未確定 / 要確認

- board をタブにするか、split view にするか
- feature outline の表示密度
