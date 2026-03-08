# Phase2 Implementation Status

> この文書は Phase2 issue の実装整理と着手状況を追跡する。
> source of truth は各 issue ファイル (00-04)。この文書はそれらの要約と接続を示す。

## Phase1 前提

Phase1 全 issue (00-05) は **Done**。Phase2 の前提は充足している。

## 依存関係

```
Phase1-05 (Done)
  └─ P2-0: Chat/Agent Promote + DecisionLog     [Core — 全 P2 の前提]
       ├─ P2-1: Evidence Drill-Down               [Core — demo gating]
       │    └─ P2-2: Execution Packet Generation   [Stretch — pre-computed OK]
       │         ├─ P2-3: Coding Agent Export       [Stretch]
       │         └─ P2-4: Experience Actuation      [Phase2.5 Stretch]
       └─────────┘
```

## 着手順序とゲート

| 順序 | Issue | 分類 | ゲート条件 |
|------|-------|------|------------|
| 1 | P2-0 Chat/Agent Promote + DecisionLog | Core | Phase1-05 Done ✅ |
| 2 | P2-1 Evidence Drill-Down | Core (demo gating) | P2-0 完了 |
| 3 | P2-2 Execution Packet Generation | Stretch | P2-1 完了 |
| 4 | P2-3 Coding Agent Handoff + Exports | Stretch | P2-2 完了 |
| 5 | P2-4 Experience Actuation | Phase2.5 Stretch | P2 core 全完了 |

## 既存資産マッピング

### P2-0: Chat/Agent Promote + DecisionLog

- **既存 schema**: `DecisionSchema` (`lib/schema/decision.ts`) — verdict, violated_clauses, supporting_evidence を含む
- **拡張方針**: `DecisionLogSchema` を新設。override_reason, actor, timestamp, diff tracking を追加
- **未実装**: Promote action, Chat/Agent 役割分離, shareable summary read model
- **feature dir**: `features/phase2/` 直下に新設が必要（現在ディレクトリなし）

### P2-1: Evidence Drill-Down

- **既存 schema**: `EvidenceRefSchema`, `ViolatedClauseSchema`, `ClauseEvalSchema` が定義済
- **既存 demo data**: `proposals.json` に `evidence_trail` (observation_id, relevance, quote), `pre_mortem`, `violated_clauses` が入っている
- **未実装**: proposal detail view, drill-down UI
- **feature dir**: `features/phase2/evidence-drilldown/` (.gitkeep + CLAUDE.md のみ)

### P2-2: Execution Packet Generation

- **既存 demo data**: `data/demo/execution-packets.json` に 2 件の pre-computed packet
  - ep-001: Offline-First Data Vault (proposal prop-001)
  - ep-002: Kill Board Evidence System (proposal prop-002)
- **packet 構造**: problem_statement, target_user_state, intended_transition, why_now, supporting_evidence_summary, ui/data/workflow_change_outline, success_metric, experiment_plan, coding_agent_tasks
- **未実装**: `ExecutionPacketSchema` (Zod), packet 表示 UI, generation flow
- **feature dir**: `features/phase2/execution-packet/` (.gitkeep + CLAUDE.md のみ)

### P2-3: Coding Agent Handoff + Exports

- **既存 demo data**: `execution-packets.json` 内の `coding_agent_tasks` に task breakdown が存在
  - task_id, title, description, type (frontend/backend/data/test), effort, dependencies
- **未実装**: `CodingAgentTaskSchema` (Zod), export ロジック (markdown/JSON), dependency graph
- **feature dir**: `features/phase2/coding-agent-export/` (.gitkeep + CLAUDE.md のみ)

### P2-4: Experience Actuation (Stretch)

- **依存**: Rork API, Blaxel sandbox — 外部依存あり
- **未実装**: 全て
- **前提**: P2 core (P2-0, P2-1, P2-2, P2-3) が閉じてから着手

## 未確定事項一覧

source of truth の各 issue から引用。実装着手前に確認が必要。

### P2-0

- `Promote` を card 単位にするか message 選択単位にするか
- transcript の保存期間
- Decision Log の UI を card detail に置くか独立 timeline に置くか
- external action log (GitHub / Linear / Rork) を同じ timeline に入れるか

### P2-1

- quote をどこまで verbatim に出すか
- detail を modal にするか standalone view にするか

### P2-2

- packet を markdown 主体にするか JSON 主体にするか
- design mock を含めるか
- コードベース context がない状態でどこまで具体化できるか

### P2-3

- export 先をどのツールに合わせるか
- task 粒度をどこまで細かくするか

### P2-4

- Rork API の安定性と rate limit
- Blaxel sandbox の実行環境制約
- constitution compliance check をどのモデルで実行するか
- Rork が落ちた場合の fallback
- Unbound governance layer の追加タイミング

## ガードレール (README から)

- Chat は source of truth にしない。artifact と diff を残す
- P2-0 がない状態で外部 action だけ先に増やさない
- P2-1 は demo gating。これが閉じなければ P2-2 以降に進まない
- P2-2, P2-3 は stretch。pre-computed 出力で demo を成立させてもよい
- P2-4 は allocation-first を維持した上での actuation stretch
- generation は build に通った proposal のみに限定する
- generation の出力も constitution で再チェックする
- 自動反映はしない。human approval required
