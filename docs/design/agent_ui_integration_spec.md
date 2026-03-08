# BONSAI Agent UI Integration Spec

## 目的

この文書は、現在の BONSAI UI に backend agent の存在と `Evidence -> Judgment -> Action` のつながりを組み込むための実装指示書である。

対象は 2 画面:

- `Board`
  - 既存の allocation board
- `Connections Console`
  - Evidence / Card / Action の N:N を見る別ページ

方針は一貫している。

- Board は `decision surface`
- Connections Console は `agent trace surface`

agent を会話 UI として見せるのではなく、`artifact-producing backend jobs` として可視化する。

## 1. 期待する体験

### 1.1 Board

PdM が最初に見る画面。

この画面で伝えること:

- 何を build / defer / kill すべきか
- constitution を変えると judgment が変わること
- backend agent が evidence を整理し、judgment と handoff を準備していること

### 1.2 Connections Console

選択した card や evidence に対して、以下を一画面で追えること。

- どの evidence がどの card に効いているか
- どの card にどの action が紐づくか
- handoff artifact がどこまで準備できているか

この画面で伝えること:

- BONSAI は dashboard ではなく PM operating console である
- agent は裏で `evidence -> judgment -> action` をつなぐ

## 2. 画面責務

## 2.1 `/` Board

責務:

- Constitution input
- Build / Defer / Kill の主要判断
- card ごとの primary / secondary action
- agent activity の最小 surfacing
- `Connections Console` への遷移

この画面に入れるもの:

- Constitution panel
- Build board
- Kill / Defer board
- `Agent Activity Strip`
- card ごとの artifact badge
- `Connections Console` button

この画面に入れないもの:

- full N:N graph
- observation list 全展開
- detailed handoff status 全件

## 2.2 `/connections`

責務:

- Evidence / Card / Action の connection を追う
- selected evidence と selected card の相互 highlight
- action / packet / export / actuation 状態の確認

レイアウト:

1. `Evidence Panel`
2. `Judgment Panel`
3. `Action Panel`

## 3. Agent の見せ方

## 3.1 見せる agent

- `Evidence Agent`
  - observation normalization
  - clustering / linkage
- `Judgment Agent`
  - constitution evaluation
  - build / defer / kill
- `Handoff Agent`
  - execution packet
  - issue draft
  - Rork brief

## 3.2 見せないもの

- agent 同士のチャット
- anthropomorphic UI
- 何をしたか分からない `AI working...` spinner

## 3.3 表示原則

agent は必ず artifact を残したものとして表示する。

例:

- `Evidence normalized`
- `7 judgments updated`
- `2 packets ready`
- `1 Rork brief prepared`
- `Approval pending`

## 4. Board への実装指示

## 4.1 Header / top area

追加コンポーネント:

- `AgentActivityStrip`

表示内容:

- `Evidence normalized`
- `7 candidates evaluated`
- `2 execution packets ready`
- `1 Rork brief prepared`

配置:

- Constitution panel の下
- Summary bar の上または直下

実装メモ:

- Board は current run から派生した activity を表示する
- `run_id` がある場合、Connections 側と同じ allocation run を参照する
- source は `/api/agent-activity?run_id=...` か local derived state のどちらでもよい

## 4.2 Card artifact badges

各 `DecisionCard` に以下を追加する。

- `n evidence`
- `packet ready`
- `export ready`
- `brief ready`
- `needs approval`

表示ルール:

- build で packet がある場合のみ `packet ready`
- coding export が生成可能なら `export ready`
- actuation run がある場合 `brief ready` または `preview ready`

## 4.3 CTA のラベル調整

現状の `Send to Rork` は、そのままだと実態とズレる可能性がある。

P2-4 未実装時:

- primary label を `Prepare Rork Brief` にする

P2-4 で actuation run が存在する時:

- `Open Rork Run`

## 4.4 Connections への導線

Board から `/connections` に文脈付きで遷移できるようにする。

推奨 query params:

- `run_id`
- `decision_id`
- `observation_id` optional

例:

`/connections?run_id=run-001&decision_id=decision-002`

## 5. Connections Console への実装指示

## 5.1 route

新規 route:

- `/connections`

ファイル候補:

- `apps/bonsai/src/app/connections/page.tsx`

## 5.2 ページ構成

### Header

表示内容:

- back to board
- page title
- run summary
- agent activity mini summary

### Left: Evidence Panel

表示項目:

- observation id
- raw text preview
- source badge
- channel type
- severity
- linked cards count

操作:

- click で `selectedObservationId` 更新
- 選択時、関連 card を中央で highlight

### Middle: Judgment Panel

表示項目:

- decision title
- verdict
- confidence
- violated clauses
- evidence count
- packet status

操作:

- click で `selectedDecisionId` 更新
- 選択時、関連 evidence を左で highlight
- compare highlight があれば残す

### Right: Action Panel

表示項目:

- primary action
- secondary actions
- execution packet availability
- coding export availability
- Rork brief status
- actuation status
- approval status

操作:

- `Execution Packet`
- `Agent Export`
- `Prepare Rork Brief` / `Open Rork Run`
- `Override`
- `Copy Rationale`

## 5.3 interaction rules

- evidence 未選択かつ decision 未選択時
  - default summary を表示
- decision 選択時
  - linked observations を左で強調
  - action panel はその decision のみ表示
- observation 選択時
  - linked decisions を中央で強調
  - action panel は `linked actions summary` を表示
- decision と observation の両方選択時
  - intersection を優先表示

## 6. データモデル指示

## 6.1 新規 read model

### `ObservationConnection`

```ts
type ObservationConnection = {
  observation_id: string;
  source: string;
  channel_type: string;
  linked_theme_ids: string[];
  linked_proposal_ids: string[];
  linked_decision_ids: string[];
  linked_action_ids: string[];
};
```

### `DecisionConnection`

```ts
type DecisionConnection = {
  decision_id: string;
  proposal_id?: string;
  linked_observation_ids: string[];
  available_actions: string[];
  has_execution_packet: boolean;
  has_coding_export: boolean;
  actuation_status?: "not_started" | "brief_ready" | "preview_ready" | "approved" | "rejected";
};
```

### `AgentActivityItem`

```ts
type AgentActivityItem = {
  id: string;
  run_id: string;
  agent_type: "evidence" | "judgment" | "handoff" | "governance";
  event_type: string;
  summary: string;
  created_at: string;
  related_decision_ids?: string[];
  related_observation_ids?: string[];
};
```

## 6.2 run 単位の必須キー

以下はすべて run 単位で持つ。

- `run_id`
- `constitution_id`
- `decision_id`
- `proposal_id`
- `execution_packet_id`
- `actuation_run_id`

Decision Log も必ず `run_id` を持つこと。

## 7. API 指示

## 7.1 追加 API

### `GET /api/connections?run_id=...`

挙動:

- `run_id` が指定され、対応する allocation run が保存済みなら、その run の decisions と observations から read model を返す
- `run_id` が無い場合は fixture fallback を返す
- これにより Board から遷移した `Connections Console` は live allocation と同じ judgment を表示できる

返却:

```json
{
  "run_id": "run-001",
  "observations": [],
  "decisions": [],
  "actions": []
}
```

### `GET /api/agent-activity?run_id=...`

返却:

```json
{
  "run_id": "run-001",
  "items": []
}
```

### `GET /api/actuation-runs?decision_id=...`

返却:

- brief status
- preview url
- github repo
- approval status

## 7.2 既存 API の活用

既存の以下はそのまま使う。

- `/api/allocate`
- `/api/proposals`
- `/api/proposals/:id/evidence`
- `/api/execution-packets`
- `/api/decision-log`

Board と Connections の両方が同じ run を参照できるように、返却 payload に `run_id` を確実に含める。

## 8. コンポーネント指示

新規コンポーネント候補:

- `features/phase2/connections/ConnectionsPageShell.tsx`
- `features/phase2/connections/EvidencePanel.tsx`
- `features/phase2/connections/JudgmentPanel.tsx`
- `features/phase2/connections/ActionPanel.tsx`
- `features/phase2/connections/ConnectionCard.tsx`
- `features/phase2/agent-activity/AgentActivityStrip.tsx`
- `features/phase2/agent-activity/AgentActivityRail.tsx`

既存変更候補:

- `app/page.tsx`
- `features/phase1/boards/AllocationBoard.tsx`
- `features/phase1/boards/DecisionCard.tsx`
- `features/phase1/boards/card-actions.ts`

## 9. 実装順序

### Step 1

Board に最小 agent surfacing を追加する。

- `AgentActivityStrip`
- card artifact badges
- `Connections Console` button

### Step 2

`/connections` page を追加する。

- fixed 3-column layout
- selected decision / observation state

### Step 3

connections read model を追加する。

- observation to decision
- decision to action

### Step 4

Action Panel を handoff artifact と接続する。

- execution packet
- coding export
- Rork brief status

### Step 5

actuation status と approval status を表示する。

## 10. 受け入れ条件

- Board から `Connections Console` に遷移できる
- Board 上で agent の存在が `job log + artifact readiness` として見える
- `/connections` で observation を選ぶと関連 card が複数強調される
- `/connections` で card を選ぶと関連 evidence が複数強調される
- build / defer / kill ごとに右カラムの推奨 action が変わる
- execution packet / export / Rork brief status が action panel で確認できる
- 既存の board-driven demo は壊れない

## 11. デモ上の話し方

Board ではこう見せる。

> Our agents already normalized the evidence, evaluated the candidates, and prepared handoff artifacts.  
> This screen is where the PM decides.

Connections Console ではこう見せる。

> This is the trace surface.  
> You can see which evidence supports which decision, and what actions are ready next.

## 12. 非スコープ

この実装ではまだやらない。

- force-directed graph
- live CRM sync
- live product analytics sync
- full runtime feedback loop
- agent chat interface
- autonomous publish
