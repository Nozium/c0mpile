# Phase1-4 Build Next And Kill Defer Surfaces

- Status: Done
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
- verdict 別カードアクション (Send to Rork / Linear / GitHub Issue)
- Constitutional Lens (cross-card clause 比較マトリクス)
- オンボーディングガイド (Cursor-to-BONSAI mapping, JA/EN toggle)

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

## 実装結果

- `AllocationBoard.tsx` — 2カラム split view (Build Next | Kill/Defer)、summary bar、toast notifications
- `DecisionCard.tsx` — verdict badge、reason bar、violated clauses、evidence count、drill-down link、CardActionBar
- `CardActionBar.tsx` — verdict 別 primary CTA (build→Send to Rork, defer→Linear, kill→GitHub Issue) + secondary dropdown
- `card-actions.ts` — verdict 別の issue body 生成 (`buildIssueBody`)、clipboard 連携
- `EvidencePanel.tsx` — modal で violated clauses と supporting evidence をブロック引用表示
- `ConstitutionLens.tsx` — 全候補 × 全 clause axis のマトリクス表示。card 間の整合性を「同じ物差し」で横断比較
- `/guide` — Cursor-to-BONSAI mapping (8項目) のオンボーディングページ、JA/EN toggle、"DO NOT GENAI SLOP TO USER" バナー
- Constitution A/B compare toggle + diff badge on cards
- Custom constitution → allocation への inline 接続 (`/api/allocate` が `{ constitution }` を受付)

## 未確定 / 要確認 (解決済み)

- ~~board をタブにするか、split view にするか~~ → 2カラム split view に決定
- ~~feature outline の表示密度~~ → card 内に summary 1行 + drill-down で詳細
