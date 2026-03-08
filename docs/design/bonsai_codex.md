---
Title: BONSAI
Abstract: `Cursor for Product Managers` を constitutional allocation / pruning system として実装するための内部設計文書。中核は案を増やすことではなく、何を build / continue / defer / kill するかを、証拠と pre-mortem reasoning 付きで決めることにある。
Status: Draft v0.1
---

# BONSAI システムドキュメント

## 1. 目的

BONSAI は、このリポジトリにおける `Cursor for Product Managers` の実装形です。
ただし実装上の主語は PM 支援ツールではなく、`allocation system` です。

このシステムの主出力は「より多くのアイデア」ではありません。
主出力は以下です。

- 何を今 build すべきか
- 何を continue すべきか
- 何を defer すべきか
- 何を今 kill すべきか
- その判断をなぜ下したか

つまり、PM の判断を `Brand Constitution + evidence + pre-mortem` によって外在化し、追跡可能な決定系にすることが目的です。

## 2. プロダクト定義

### 2.1 一文定義

BONSAI は、AI ネイティブなチームのための `Constitutional Product Allocation System` である。

### 2.2 なぜ allocation なのか

AI によって実装コストが下がるほど、希少資源は build ability から judgment, attention, experiment capacity に移る。
したがって最適化対象は生成量ではなく配分である。

### 2.3 `Cursor for Product Managers` との接続

YC RFS が要求しているのは、概ね以下です。

- 顧客会話やプロダクトデータを取り込む
- フィードバックを統合する
- 次に何を作るかを優先順位付けする
- なぜそう判断したかを説明する
- builder / coding agent に渡せる形に落とす

BONSAI はこれを次の順序で満たします。

1. 観測データを正規化する
2. user state と demand signal を推定する
3. candidate experience を constitution と state transition の両面で評価する
4. `build / continue / defer / kill` を返す
5. 通過した候補にだけ execution packet を生成する

これにより、RFS の要件は維持しつつ、カテゴリを「PM copilot」から「organizational judgment system」へ引き上げる。

## 3. 設計原則

### 3.1 Allocation over ideation

attention、実験枠、実装キャパシティを有限資源として扱う。

### 3.2 Kill quality over build quantity

差別化の中心は build 提案の数ではなく kill の質にある。
各 kill は最低でも以下を持つ。

- violated clause または failed transition
- evidence references
- death hypothesis
- salvage path

### 3.3 Constitution must be executable

`We are / We never / We value` は入力 UX としては有効だが、内部表現としては不十分である。
内部では clause に正規化され、機械的に評価できなければならない。

### 3.4 Persona ではなく state を扱う

`busy PM` や `early adopter` のような静的ラベルではなく、体験によって変化する user state を扱う。

### 3.5 Prototype generation is downstream

仕様化、チケット分解、プロトタイプ生成は allocator の後段に置く。
候補が allocation を通過した場合のみ発火する。

### 3.6 Explainability beats theatricality

MVP では live scraping や派手な可視化より、説明可能性を優先する。

## 4. スコープ

### 4.1 MVP に含める

- JSON / CSV からの observation 手動取り込み
- constitution authoring
- constitution clause 正規化
- state inference
- candidate experience 取り込み
- pre-mortem diagnosis
- constitutional evaluation
- allocation decision board
- evidence drill-down
- build / continue 向け execution packet 生成

### 4.2 MVP から外す

- X / Product Hunt / App Store の live scraping
- 自動 iOS prototype generation
- multi-agent autonomous launch loop
- multi-constitution 比較 UI
- 長期 horizon の本格 ABM simulator
- billing / pricing / org management

### 4.3 命名ルール

`BONSAI` は内部コードネームまたは方式名として扱う。
外部向けの最終プロダクト名とはみなさない。

## 5. システム境界

### 5.1 Inputs

- `Brand Constitution`
- `Observations`
- `Candidate Experiences`

### 5.2 Core

- constitution parser
- observation normalizer
- user state inference
- transition evaluator
- pre-mortem engine
- allocation engine

### 5.3 Outputs

- decision board
- evidence trace
- kill / defer reasons
- salvage suggestions
- execution packet for `build` / `continue`

## 6. コアドメインモデル

### 6.1 Brand Constitution

入力 UI は以下の 3 項を維持する。

- `we_are`
- `we_never`
- `we_value`

内部では以下の clause 群へ正規化する。

| Field | Description |
| --- | --- |
| `target_user` | まず誰のために価値を作るべきか |
| `strategic_terrain` | 参入してよい問題空間 / 市場 |
| `prohibited_models` | 禁止する収益モデルや体験パターン |
| `quality_bar` | 許容される最低品質・UX 水準 |
| `trust_rules` | privacy / safety / compliance / trust の制約 |
| `desired_transitions` | 会社として増やしたい user-state transition |
| `forbidden_transitions` | 絶対に生んではいけない user-state transition |

各 clause は最低でも以下を持つ。

- `clause_id`
- `clause_type`
- `priority` (`hard` or `soft`)
- `source_text`
- `normalized_rule`

### 6.2 Observation

Observation は市場証拠の最小単位である。
channel は固定ソース名ではなく汎用化する。

- interview
- support ticket
- product analytics note
- app review
- social post
- community comment
- sales call note

必須フィールド:

| Field | Description |
| --- | --- |
| `observation_id` | 一意 ID |
| `channel` | 入力チャネル |
| `actor_ref` | 分かる場合のみ user / segment 参照 |
| `timestamp` | 観測時刻 |
| `raw_text` | 元テキストまたは要約 |
| `what_user_says` | 表面上の complaint / request |
| `what_user_wants` | 背後の need / desire |
| `signal_type` | `pain`, `desire`, `adoption`, `retention_risk`, `trust_risk`, `praise`, `question` |
| `severity` | `low`, `medium`, `high`, `critical` |
| `confidence` | 抽出信頼度 |
| `evidence_url` | 任意の証拠リンク |

`what_user_says` と `what_user_wants` は必ず分離する。
これをしないと、単なる要約ツールに戻る。

### 6.3 User State

推論対象は static persona ではなく user state である。

MVP の state vector は以下を最小構成とする。

| Field | Description |
| --- | --- |
| `need_intensity` | 解決欲求の強さ |
| `trust_level` | データや workflow を預ける信頼度 |
| `effort_tolerance` | 導入・設定・移行コストへの耐性 |
| `switching_cost_sensitivity` | 既存ツールから離れにくさ |
| `novelty_seeking` | 新しいやり方への志向 |
| `adoption_readiness` | 今すぐ試す準備度 |
| `social_signaling_tendency` | 共有・発信・推奨に向かう傾向 |
| `constitutional_fit` | ブランド意図との適合度 |

MVP で完全な ABM は不要。
ただし、一貫した state abstraction は必要である。

### 6.4 Candidate Experience

評価単位は feature に限らず `candidate experience` とする。
候補には以下を含みうる。

- feature
- workflow change
- onboarding step
- pricing boundary
- retention intervention
- experiment

必須フィールド:

| Field | Description |
| --- | --- |
| `candidate_id` | 一意 ID |
| `title` | 短い名称 |
| `summary` | 何を変えるのか |
| `target_state` | どの state cluster に効かせたいか |
| `intended_transition` | 期待する state change |
| `stage` | `idea`, `experiment`, `active` |
| `effort_estimate` | `small`, `medium`, `large` |
| `owner` | PM / founder / team |

### 6.5 Pre-Mortem Hypothesis

Pre-mortem は説明文ではなく first-class object とする。

| Field | Description |
| --- | --- |
| `hypothesis_id` | 一意 ID |
| `candidate_id` | 対象候補 |
| `failure_mode` | この案がどう死ぬか |
| `leading_indicators` | 死ぬ前に何を見ればよいか |
| `current_signals` | すでに見えている死の兆候 |
| `mitigation` | 最小の延命・修正策 |
| `kill_trigger` | kill 推奨に切り替える条件 |
| `confidence` | 仮説信頼度 |

### 6.6 Allocation Decision

decision enum は以下とする。

- `build`
- `continue`
- `defer`
- `kill`

各 decision は最低でも以下を含む。

- `decision_reason`
- `constitutional_result`
- `transition_result`
- `death_risk_result`
- `evidence_refs`
- `salvage_path`
- `execution_packet_ref` for `build` / `continue`

## 7. 判定パイプライン

### 7.1 Stage 0: Input intake

入力は以下の 3 系統。

- 1 つの constitution
- 1 つ以上の observation batch
- 1 つ以上の candidate experience

MVP の前提:
すべて手入力または手動アップロードでよい。

### 7.2 Stage 1: Observation normalization

目的:
raw note / text を canonical observation schema に変換する。

出力:

- `what_user_says`
- `what_user_wants`
- `signal_type`
- `severity`
- evidence metadata

実装ルール:
LLM を使ってもよいが、保存前に schema validation を必須とする。

### 7.3 Stage 2: State inference

目的:
観測群から、どの user state がどれだけ存在しているかを推定する。

出力:

- state clusters
- cluster ごとの supporting evidence
- confidence score

実装ルール:
MVP は LLM inference + deterministic bucketing でよい。
full ABM を ship 条件にしない。

### 7.4 Stage 3: Candidate evaluation

各 candidate について以下を見積もる。

- どの state cluster に効くか
- どの transition を意図しているか
- どのような reaction が起こりうるか
- その効果の信頼度

この段階で必ず両方を出す。

- `build if ...`
- `kill because ...`

必要なのは recommendation ではなく judgment trace である。

### 7.5 Stage 4: Constitution evaluation

各 candidate を clause ベースで評価する。

- clause satisfaction
- clause violation
- hard-stop violations
- desired transition alignment
- forbidden transition risk

判定ルール:

- `hard` clause 違反は単独で `kill` を成立させうる
- `soft` clause の衝突は減点し、理由説明を要求する

### 7.6 Stage 5: Pre-mortem diagnosis

build コストを使い切る前に、この案がどう死ぬかを予測する。

必須出力:

- likely death mode
- current evidence for that death mode
- smallest salvage experiment
- kill trigger threshold

有効な failure mode の例:

- short-term engagement but long-term trust decay
- works only for a narrow unstable state cluster
- constitutional misalignment despite positive demand
- high pain relevance but too much workflow friction
- evidence too weak to justify allocation

### 7.7 Stage 6: Allocation scoring

説明文だけではなく、inspectable な score を出す。

最低限必要な score 軸:

| Score | Meaning |
| --- | --- |
| `constitutional_fit_score` | constitution との整合性 |
| `transition_value_score` | 予測される state transition の価値 |
| `evidence_strength_score` | 証拠の強さと十分性 |
| `death_risk_score` | 失敗・劣化する可能性 |
| `effort_cost_score` | 実装・検証コスト |

参照用の decision formula:

```text
allocation_score =
  0.30 * constitutional_fit_score +
  0.25 * transition_value_score +
  0.20 * evidence_strength_score -
  0.15 * death_risk_score -
  0.10 * effort_cost_score
```

重みは設定可能でよい。
重要なのは score が説明可能であること。

### 7.8 Stage 7: Decision emission

MVP の decision policy:

- `kill`
  - `hard` constitutional violation がある
  - または death risk が閾値を超え、salvage path がない
- `defer`
  - hard violation はないが、evidence が弱いか uncertainty が高い
- `continue`
  - すでに active で、証拠が改善しており、kill trigger 未到達
- `build`
  - constitutionally aligned で、value transition が高く、evidence が十分で、risk が管理可能

各 output card は最低でも以下を表示する。

- decision
- score summary
- key clause
- key death hypothesis
- supporting evidence count
- one-line salvage option

## 8. Execution Packet

`build` または `continue` を通過した候補のみ execution packet を生成できる。
これが BONSAI を元の `Cursor for Product Managers` 要件へ接続する橋になる。

packet の必須項目:

- `problem_statement`
- `target_user_state`
- `intended_transition`
- `why_now`
- `supporting_evidence_summary`
- `ui_change_outline`
- `data_model_change_outline`
- `workflow_change_outline`
- `success_metric`
- `experiment_plan`
- `coding_agent_tasks`

これにより BONSAI は、downstream coding system の前段 allocator として機能する。

## 9. 推奨 MVP UI

MVP は 1 画面 + 1 detail drawer に収める。

### 9.1 Main layout

- left panel: Constitution
- center panel: User State Board
- right panel: Allocation Board

### 9.2 Constitution panel

表示項目:

- raw fields: `We are / We never / We value`
- normalized clauses
- desired / forbidden transitions

### 9.3 User State Board

表示項目:

- inferred state clusters
- cluster size または evidence count
- dominant needs
- trust / risk flags

### 9.4 Allocation Board

各 candidate card の表示項目:

- title
- stage
- allocation score
- decision
- clause result
- transition summary
- death hypothesis summary
- salvage CTA

### 9.5 Evidence drawer

各 card から詳細表示し、以下を見せる。

- raw supporting observations
- inferred user wants
- state mapping
- clause reasoning
- decision trace

MVP では複雑な chart は不要。
読みやすい evidence trace を優先する。

## 10. API Surface

参照 API shape:

### 10.1 `POST /api/constitutions`

active constitution を作成または更新する。

### 10.2 `POST /api/observations/import`

JSON / CSV から observation batch を取り込む。

### 10.3 `POST /api/candidates`

candidate experience を作成する。

### 10.4 `POST /api/evaluations/run`

active constitution と selected candidates に対して allocation pipeline を実行する。

### 10.5 `GET /api/evaluations/:runId`

score、reason、evidence reference を返す。

### 10.6 `POST /api/candidates/:candidateId/execution-packet`

承認済み候補に対して execution output を生成する。

## 11. Persistence Model

推奨テーブル:

- `constitutions`
- `constitution_clauses`
- `observation_batches`
- `observations`
- `user_state_clusters`
- `candidates`
- `pre_mortem_hypotheses`
- `evaluation_runs`
- `candidate_evaluations`
- `execution_packets`

保持ルール:

- raw input と normalized output の両方を保存する
- evaluation run を再現可能にする
- 全 decision に evidence references を残す
- clause version を時系列で追えるようにする

## 12. 実装順序

### Phase 1: Core allocation spine

- constitution editor
- clause normalization
- observation import
- candidate CRUD
- evaluation result rendering

### Phase 2: Judgment trace

- state inference
- pre-mortem object generation
- clause-based kill explanation
- evidence drawer

### Phase 3: Execution bridge

- execution packet generation
- markdown / JSON export
- coding agents への handoff

### Phase 4: Optional extensions

- automated connectors
- active bet の continuous monitoring
- multi-constitution scenario comparison
- fuller transition simulation

## 13. 受け入れ条件

MVP は、少なくとも以下を満たしたときに成立とみなす。

- `We are / We never / We value` を入力できる
- それを normalized clauses に変換できる
- live scraping なしで observation data を取り込める
- 少なくとも 1 つの user state cluster を evidence 付きで推定できる
- 少なくとも 3 件の candidate を評価できる
- 少なくとも 1 件を explicit clause または transition reason 付きで kill できる
- `build` / `continue` 候補に execution packet を生成できる
- すべての decision を evidence reference 付きで追跡できる

## 14. 非目標と失敗パターン

以下のいずれかになった場合、このシステムは失敗である。

- generic feedback summarizer
- opaque LLM output を並べるだけの dashboard
- kill discipline のない feature ideation tool
- allocation logic のない prototype generator
- state transition を持たない shallow persona tool

## 15. 最終ポジショニング

外向けの入口は維持する。

`Cursor for Product Managers`

内部アーキテクチャ定義は以下とする。

`BONSAI: Constitutional Product Allocation and Pre-Mortem Pruning System`

この二層構造により、YC RFS の入口を失わずに、実装としては allocation system としての defensibility を持たせる。
