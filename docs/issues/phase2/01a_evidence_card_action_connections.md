# Phase2-1a Evidence Card Action Connections

- Status: Proposed
- Depends on: `00_chat_agent_promote_and_decision_log.md`, `01_evidence_drill_down.md`

## 背景

現在の Phase2-1 は `card -> detail drawer` の drill-down を中心にしているが、BONSAI を `Cursor for PM` として成立させるにはそれだけでは足りない。

PdM が本当に重いのは、1枚の card を読むことではなく、複数の evidence と複数の card を同じ constitutional lens で整合的に結びつけ、次の action まで進めることである。

そのため、Phase2 では `detail view` に加えて、以下の N:N connection を見せる最小 surface が必要になる。

- `Observation -> Card`
- `Card -> Action`
- 将来は `Action -> Runtime Signal -> Observation` へ戻す

この issue は full graph visualization ではなく、今の board-centric UI を壊さずに `console-centric` へ寄せる最小実装を定義する。

## 目的

Evidence / Card / Action の N:N 関係を、PdM が一画面内で追える最小 connection surface を実装する。
ただし既存の Allocation Board を壊さないため、board への埋め込みではなく `別ページの console` として切り出す。

## スコープ

- `Allocation Board` とは別 route の `Connections Console` を追加する
  - 例: `/connections` または `/console`
- 3カラムの最小 console layout
  - 左: Evidence Layer
  - 中央: Judgment / Card Layer
  - 右: Action Layer
- card 選択時に関連 evidence を複数ハイライトする
- evidence 選択時に関連 card を複数ハイライトする
- card ごとの next action を右カラムに表示する
- source / verdict の軽い filter
- `n linked cards`, `n supporting evidence`, `n actions available` の read model

## 非スコープ

- canvas ベースの graph visualization
- edge animation や force-directed graph
- live CRM / analytics sync
- deploy 後 signal の本格表示
- full learning loop

## 最小 UI イメージ

### route

- 既存: `/`
  - build / defer / kill board
- 追加: `/connections`
  - Evidence / Card / Action connection surface

Board から `Open Connections Console` で遷移できるようにする。

### 左: Evidence Layer

- observation 一覧
- source badge
  - interview
  - crm
  - support
  - usage
  - market
- severity / signal type
- `linked cards: 3` のような件数表示

### 中央: Card Layer

- build / defer / kill cards
- current verdict
- clause / confidence / evidence count
- 選択中 card に対する supporting / contradicting evidence の状態表示

### 右: Action Layer

- primary action
- secondary actions
- execution packet availability
- external handoff status は placeholder 可

## 実装タスク

- `ObservationConnection` read model を定義する
  - `observation_id`
  - `linked_theme_ids`
  - `linked_proposal_ids`
  - `linked_decision_ids`
  - `source`
  - `channel_type`
- `DecisionConnection` read model を定義する
  - `decision_id`
  - `linked_observation_ids`
  - `available_actions`
  - `has_execution_packet`
- board state に `selectedObservationId` と `selectedDecisionId` を追加する
- `/connections` page を追加する
- `EvidencePanel` を追加し、observation を source 別に一覧表示する
- `CardPanel` を追加し、decision / proposal を verdict 別に表示する
- card 選択時に左カラムの linked observations を強調表示する
- evidence 選択時に中央カラムの linked cards を強調表示する
- 右カラムに `ActionPanel` を追加し、選択中 card の next action をまとめて表示する
- proposal drawer を残しつつ、drawer に入る前の overview connection が見えるようにする
- `/` の board から console への導線を追加する

## 受け入れ条件

- 1つの card を選ぶと、複数の supporting evidence が左カラムで強調表示される
- 1つの evidence を選ぶと、それに関係する複数の card が中央カラムで強調表示される
- Build / Defer / Kill それぞれで右カラムの推奨アクションが変わる
- full detail drawer を開かなくても、`why this card / why these actions` が一画面で分かる
- 少なくとも 1 件で `1 evidence -> 2+ cards` または `1 card -> 3+ evidence` を確認できる

## 確定していること

- full graph はやらない
- Phase2 では `highlight + filter + side panel` の最小 surface に留める
- `drill-down` は残しつつ、その手前に `connections overview` を置く
- 既存 board には最小のリンク導線だけ足し、connection 可視化の本体は別ページに置く
- data provenance は observation source として残す

## 未確定 / 要確認

- highlighting のみで十分か、thin line overlay を出すか
- right action panel を固定にするか drawer にするか
- evidence の並びを source 優先にするか relevance 優先にするか
- route 名を `/connections` にするか `/console` にするか
