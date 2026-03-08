# BONSAI — Constitutional Product Allocation System

> AIネイティブ企業のための継続的死亡前診断と剪定システム

---

## 0. Field Evidence (ハッカソン聞き取り結果)

2026-03-08 YC RFS Hackathon での聞き取りから得られた示唆。以降の設計判断の前提。

### 聞き取りから得られた事実

| 質問 | 回答傾向 | 示唆 |
|---|---|---|
| プロダクトの最終評価を他者 (AI) に委ねていいか | **多くが NO** | BONSAI は judge replacement ではない。judgment support / policy externalization |
| なぜそのプロダクトが誰かにとって大事なのか聞けているか | 聞けていない人が多い | 課題の深さより機能の話に流れている。pain の言語化が弱い |
| ユーザーの日常をどのサイクルで更新するか評価できているか | 市場投入→インタビューは考えているが、評価の津波は未考慮 | **評価疲れ (evaluation fatigue)** が新しい pain として浮上 |
| 要求に対して自動開発できるか | おおよそ Yes | 自動開発は差別化にならない。作る前後の判断・体験設計・ブランド整合が本丸 |
| coding agent にもポリシーを規定できるか | 考えられていない人が多い | **体験設計とブランド整合の judgment gap** が存在する |

### 設計への反映

1. **ポジショニング修正**: 「AIが判断する」ではなく「AIが判断材料と境界条件を整え、最終判断は人が持つ」
2. **新ペイン発見**: 評価の津波 — AI が大量の実験を回すと、ユーザーが evaluation fatigue に陥る。ただし **今日の PM の pain はフィードバック不足の方** (yc_review.md)。exposure allocation は post-MVP
3. **H-1 の修正**: 「判断負荷が増えたか」に加えて「最終判断は人が持ちたいが、その前段は支援してほしい」
4. **語り方**: 「PMを置き換える」とは言わない。「判断基準を外在化し、build/kill を説明可能にする」

### yc_review.md からの構造的指摘 (2026-03-08)

1. **Trust Harness の類推の限界**: coder にはテスト/CI/git revert という安全網がある。PM には判断の事後検証手段がない。「テストが通ったから OK」が言えない。→ decision_log に事後検証フィールドを将来追加。MVP では不要
2. **委譲ラダーは内部概念**: UIに段階選択は出さない。ユーザーが求めているのは「使ううちに自然に信頼が上がる」体験。MVP はデフォルトで explain まで自動、recommend は「提案」ラベル付き
3. **スコープクリープ警告**: 6.6-6.9 (委譲ラダー/Trust Harness/daily cycle/exposure allocation) は全て「正しいが MVP に入れるべきではない」。設計の密度が上がるほど実装が遠のく
4. **F4: アイデンティティ問題**: BONSAI は PM ツールか、AI ガバナンス FW か → **PM ツール**。委譲ラダーは全 AI ツールに共通する問題であり、BONSAI 固有の価値ではない

---

## 1. Concept (コンセプト)

### 一行定義

**BONSAIは、案を増やすのではなく、案がどう死ぬかを先に診て、切るべきものを切るための judgment support system である。**

最終判断は人が持つ。BONSAI は判断材料 (evidence)、境界条件 (constitution)、判断の説明 (clause-based reasoning) を整える。

### BONSAI 比喩マッピング

| 盆栽の要素 | システム対応 | 意味 |
|---|---|---|
| 盆 (鉢) | Brand Constitution | 何を育てるかより先に、どこまで伸ばしてよいかの境界がある |
| 剪定 | Kill Decision | 価値は成長量ではなく、捨て方の精度で決まる |
| 針金 | Guided Autonomy | 自律成長させながら、方向だけ与える |
| 樹勢管理 | Pre-mortem Diagnosis | 枯れてから対処するのでは遅い。葉色・芽・根の変化で先に診る |

### ポジショニング

- **ではないもの**: AI PMツール、feature suggestion tool、市場の声をまとめるダッシュボード、**PM/Founder の判断を置き換えるもの**、**AI ガバナンスフレームワーク** (F4: BONSAI は PM ツールであり、汎用 AI 委譲 FW ではない)
- **であるもの**: Constitutional Product Judgment Support System — 判断材料 (evidence)、境界条件 (constitution)、判断の説明 (clause-based reasoning) を整え、最終判断は人に委ねる
- **カテゴリ移動**: `feature suggestion tool` → `judgment support + policy externalization + evidence-backed pruning`
- **語り方**: 「AIが決める」ではなく「AIが判断の前段を支援し、build/kill を説明可能にする」
- **Trust Harness の位置づけ** (yc_review.md): coder の LLM 受容 (テスト/CI が安全網) と PM の AI 判断受容は構造が異なる。PM には「テスト」に相当する事後検証手段がない。BONSAI は判断の事後検証ループ (decision_log + outcome tracking) をロードマップに含む。ただし MVP では判断を出すところまで

### YC RFS #1 との関係

外向けの入口: **Cursor for Product Managers**
内部アーキテクチャ: **BONSAI: Constitutional Product Allocation and Pre-Mortem Pruning System**

RFS #1 の全要件を満たしつつ、カテゴリを「PM copilot」から「organizational judgment system」へ引き上げる:

| RFS要件 | BONSAI での実現 |
|---|---|
| 顧客会話の取り込み | InterviewTranscript → Observation 正規化 |
| Product usage data の取り込み | UsageEvent → Observation 正規化 |
| フィードバック統合 | Extract → Cluster pipeline |
| "何を作るべきか" への回答 | Build Next Board + Feature Outline |
| なぜその判断かの説明 | clause-based reason + evidence trail + allocation score |
| UI/data/workflow 変更提案 | ExecutionPacket |
| coding agent 向け分解 | ExecutionPacket.coding_agent_tasks |

### Fatal Questions と回答 (yc_review.md)

| # | 質問 | 回答 |
|---|---|---|
| F1 | 今日月$100払うPMを3人挙げられるか？ | まだいない。だからまず1人のPMに1週間使ってもらうことが最優先。設計はそのために削る |
| F2 | ChatGPTに直接聞くのと何が違うか？ | ChatGPT は聞かれたら答える。BONSAI は constitution という制約の下で、何を作らないかを先に決める。判断の再現性と追跡可能性が違う |
| F3 | Constitution を書けるPMはそもそも困っていないのでは？ | 逆。constitution を書ける founder ほど、それをチーム全体の判断基準として機能させる仕組みがない。書けることと、それでチームが動くことは別 |
| F4 | これはPMツールなのかAIガバナンスFWなのか？ | PMチームが次に何を作るか決めるためのシステム。差別化は、何を作らないかの判断を constitution と evidence で追跡可能にしていること |

---

## 2. Architecture (アーキテクチャ)

```
┌─────────────────────────────────────────────┐
│            Brand Constitution (憲法層)        │
│  "We are / We never / We value" → 5判定軸    │
│  + desired transitions + forbidden patterns  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│        Persona-State Simulation (状態推定層)  │
│  Observation Channels → State Estimation     │
│  App Store=pain / X=trend / PH=intent        │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│      Allocation / Kill Engine (配分・剪定層)  │
│  build / defer / kill + clause-based reason  │
│  + pre-mortem diagnosis per proposal         │
└─────────────────────────────────────────────┘
```

### Layer 1: Brand Constitution (憲法層)

会社として許される体験空間を定義する。何を build して良いかだけでなく、どの user transition を望ましいとみなすかまで記述する。

入力は3行テキスト（"We are / We never / We value"）だが、内部的には **5つの判定軸** に正規化する:

| 入力 | 判定軸 | 例 |
|---|---|---|
| We are | `target_user` | privacy-conscious knowledge workers |
| We are | `strategic_terrain` | offline-first productivity |
| We never | `prohibited_business_model` | sell user data, show ads |
| We never | `forbidden_pattern` | dark patterns, engagement tricks |
| We value | `quality_bar` | simplicity over feature count |

### Layer 2: Persona-State Simulation (状態推定層)

ユーザーを static persona ではなく **stateful agents** として保持する。

データソースは「同列のシグナル」ではなく、state estimation の **observation channel** として扱う:

データソースは2層で構成する: **Observation Channels** (何を言っているか) と **Enrichment Layer** (誰が言っているか)。

#### Observation Channels

| Source | Channel Type | 性質 |
|---|---|---|
| Customer Interviews | `direct_signal` | 一次情報。最も文脈が豊かで信頼性が高い |
| Product Usage Data | `behavior_signal` | 行動ベースの客観的シグナル。発言と行動の乖離を検出 |
| App Store Reviews | `pain_signal` | 強い pain/reward の事後反応 |
| X/Twitter | `trend_signal` | 軽量で社会的に演出された反応 |
| ProductHunt | `intent_signal` | early adopter 的な公開評価 |
| Support Tickets | `friction_signal` | 具体的な障害・摩擦の報告 |

#### Enrichment Layer: People & Company Data

Observation 単体では「何を言っているか」はわかるが「誰が言っているか」がわからない。People & Company Search API (例: CrustData) を enrichment layer として結合し、observation の重みと文脈を強化する。

```
[Raw Observation]                    [People & Company API]
"This export feature crashes"    +    Company: Series C SaaS, 200名, $30M ARR
                                      Person: Head of Product, PM歴8年
         │                                     │
         └──────────────┬──────────────────────┘
                        ▼
              [Enriched Observation]
              - pain signal の重みが跳ね上がる (大口顧客の Head of Product)
              - company segment が判明 → state cluster の精度向上
              - "どの規模・業種の会社にこの pain があるか" が見える
```

**Enrichment がもたらす価値**:

| 結合データ | 効果 |
|---|---|
| Company stage (Seed/A/B/C) | ターゲットセグメントの自動分類。H-3 の検証を加速 |
| Company size (従業員数) | observation の重みづけ。10名の会社と1000名の会社では pain の意味が違う |
| Person role (PM/Eng/Exec) | 発言者の decision power。Exec の pain は PM の pain より allocation に影響 |
| Industry | vertical ごとの pain pattern 検出。"SaaS の PM はここで困る" が見える |
| Funding / ARR | 支払能力の推定。"この pain を持つ会社は月 $X 払える" |
| Tech stack | Execution Packet の具体性向上。相手の技術スタックがわかれば提案が具体的になる |

**H-14 (Moat) への貢献**: Enriched observation が蓄積されることで、「どの company segment × person role にどの pain があるか」の cross-company pattern が生まれる。これは observation 単体では得られない learning loop であり、moat の候補になる。

> MVP Note: この層は pre-shaped dataset で静的に実装。ライブ推定は post-MVP。Customer Interviews と Usage Data を first-class input として優先する。People & Company enrichment は MVP では手動マッピング、post-MVP で API 自動結合。

### Layer 3: Allocation / Kill Engine (配分・剪定層)

各候補体験に対して以下を判定:

- どの state cluster に効くか
- どの遷移を生むか
- その遷移がブランド上望ましいか
- どれだけ全体資源を食うか
- **ユーザーへの evaluation exposure は適切か** (評価の津波問題)

#### Evaluation Fatigue 制御 (post-MVP — yc_review.md F4/6.9 対応)

> **MVP では実装しない。** yc_review.md の指摘: 「評価の津波」は将来起こりうるが、今日の PM の pain ではない。今のユーザーは「フィードバックが足りない」方。将来ビジョンとして設計文書に残すが、MVP Cut に明示移動。

AI が大量の実験を回すと、ユーザーが evaluation fatigue に陥る。「誰に何をどの頻度で見せるか」の制御が必要。

- 各候補に `exposure_budget` を設定: このユーザーセグメントに対して、一定期間に何回の評価を要求してよいか
- `evaluation_load` が閾値を超える候補は自動 defer
- これにより「build しても良いが、今このユーザーに見せるべきではない」という判断が可能になる

出力: `build` / `continue` / `defer` / `kill` + clause-based reason + evidence trail

**Decision 4値**:

| Decision | 意味 |
|---|---|
| `build` | constitutionally aligned, 証拠十分, リスク管理可能。新規着手 |
| `continue` | 既に active で、証拠が改善しており、kill trigger 未到達。継続 |
| `defer` | hard violation なし、しかし証拠不足または uncertainty が高い。保留 |
| `kill` | hard clause violation、または death risk が閾値超え + salvage path なし。停止 |

**Allocation Score** (説明可能なスコアリング):

```
allocation_score =
  0.30 * constitutional_fit_score +
  0.25 * transition_value_score +
  0.20 * evidence_strength_score -
  0.15 * death_risk_score -
  0.10 * effort_cost_score
```

重みは設定可能。重要なのはスコアが説明可能であること。

**Kill Type 分類** (5種):

| Kill Type | 意味 |
|---|---|
| `constitutional_violation` | ブランド憲法の明示的違反 |
| `low_value_transition` | 予測されるユーザー状態遷移が低価値 |
| `trust_decay` | 短期ポジティブだが長期的に信頼を毀損 |
| `constitutional_misalignment` | 高エンゲージメントだが方向が不整合 |
| `narrow_unstable_state` | 狭い不安定なマイクロステートのみに有効 |

---

## 3. Data Model (データモデル)

### BrandConstitution

```typescript
import { z } from "zod";

export const BrandConstitutionSchema = z.object({
  id: z.string().uuid(),
  raw_input: z.object({
    we_are: z.string(),
    we_never: z.string(),
    we_value: z.string(),
  }),
  axes: z.object({
    target_user: z.string(),
    prohibited_business_model: z.string(),
    quality_bar: z.string(),
    strategic_terrain: z.string(),
    trust_compliance_rule: z.string(),
  }),
  desired_transitions: z.array(z.string()),
  forbidden_patterns: z.array(z.string()),
});

export type BrandConstitution = z.infer<typeof BrandConstitutionSchema>;
```

### UserState

```typescript
export const UserStateSchema = z.object({
  id: z.string(),
  need_intensity: z.number().min(0).max(1),
  trust_level: z.number().min(0).max(1),
  novelty_seeking: z.number().min(0).max(1),
  effort_tolerance: z.number().min(0).max(1),
  switching_cost_sensitivity: z.number().min(0).max(1),
  social_signaling_tendency: z.number().min(0).max(1),
  adoption_readiness: z.number().min(0).max(1),
  constitutional_fit: z.number().min(0).max(1),
});

export type UserState = z.infer<typeof UserStateSchema>;
```

### Observation

```typescript
// People & Company enrichment data (CrustData 等の API から取得)
export const ActorEnrichmentSchema = z.object({
  person_role: z.string().optional(),         // e.g. "Head of Product", "Senior PM"
  person_seniority: z.enum(["ic", "lead", "director", "vp", "c_level"]).optional(),
  company_name: z.string().optional(),
  company_stage: z.enum(["pre_seed", "seed", "series_a", "series_b", "series_c_plus", "public"]).optional(),
  company_size: z.number().optional(),        // 従業員数
  company_industry: z.string().optional(),    // e.g. "SaaS", "Fintech", "Healthcare"
  company_arr: z.string().optional(),         // e.g. "$1M-5M", "$10M-30M"
  tech_stack: z.array(z.string()).optional(), // e.g. ["React", "PostgreSQL", "AWS"]
});

export const ObservationSchema = z.object({
  id: z.string(),
  source: z.enum([
    "customer_interview", "product_usage", "app_store",
    "x_twitter", "producthunt", "support_ticket", "community",
  ]),
  channel_type: z.enum([
    "direct_signal", "behavior_signal", "pain_signal",
    "trend_signal", "intent_signal", "friction_signal",
  ]),
  raw_text: z.string(),
  extracted_intent: z.string(),   // ユーザーが言っていること (what_user_says)
  inferred_need: z.string(),      // ユーザーが本当に求めていること (what_user_wants)
  signal_type: z.enum([
    "pain", "desire", "adoption", "retention_risk",
    "trust_risk", "praise", "question",
  ]),
  severity: z.enum(["critical", "major", "minor", "neutral"]),
  confidence: z.number().min(0).max(1),
  sentiment: z.number().min(-1).max(1),
  evidence_url: z.string().optional(),
  actor: ActorEnrichmentSchema.optional(),    // People & Company enrichment
  weight: z.number().min(0).max(1).optional(), // enrichment により算出される重み
  timestamp: z.string().datetime(),
});

export type Observation = z.infer<typeof ObservationSchema>;
```

### InterviewTranscript (RFS入力要件)

```typescript
export const InterviewTranscriptSchema = z.object({
  id: z.string(),
  participant_role: z.string(),           // e.g. "PM at Series B SaaS"
  participant_segment: z.string(),        // e.g. "power_user", "churned_user"
  date: z.string().datetime(),
  raw_transcript: z.string(),
  key_quotes: z.array(z.object({
    text: z.string(),
    topic: z.string(),
    sentiment: z.number().min(-1).max(1),
  })),
  extracted_observations: z.array(z.string()), // observation IDs generated from this interview
});

export type InterviewTranscript = z.infer<typeof InterviewTranscriptSchema>;
```

### UsageEvent (RFS入力要件)

```typescript
export const UsageEventSchema = z.object({
  id: z.string(),
  event_name: z.string(),                // e.g. "feature_x_clicked", "onboarding_step_3_dropped"
  user_segment: z.string(),
  funnel_step: z.string().optional(),
  count: z.number(),
  drop_off_rate: z.number().min(0).max(1).optional(),
  retention_signal: z.enum(["improving", "stable", "declining"]).optional(),
  feature_adoption_rate: z.number().min(0).max(1).optional(),
  period: z.string(),                    // e.g. "2026-W10"
});

export type UsageEvent = z.infer<typeof UsageEventSchema>;
```

### Theme

```typescript
export const ThemeSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  anti_theme: z.string(),         // 対になるアンチテーマ (counterfactual)
  observation_ids: z.array(z.string()),
  evidence_count: z.number(),
  urgency: z.enum(["high", "medium", "low"]),
  affected_state_clusters: z.array(z.string()),
  predicted_transition: z.string(),
});

export type Theme = z.infer<typeof ThemeSchema>;
```

### Proposal

```typescript
export const PreMortemSchema = z.object({
  death_cause: z.string(),                    // この案は何によって死ぬか
  early_signals: z.array(z.string()),         // 死因の兆候は今どこまで見えているか
  untested_hypotheses: z.array(z.string()),   // どの仮説が未検証か
  mitigation: z.string().optional(),          // どの体験変更で死亡確率を下げられるか
});

export const KillTypeSchema = z.enum([
  "constitutional_violation",
  "low_value_transition",
  "trust_decay",
  "constitutional_misalignment",
  "narrow_unstable_state",
]);

export const EvidenceSchema = z.object({
  observation_id: z.string(),
  relevance: z.number().min(0).max(1),
  quote: z.string(),
});

export const AllocationScoreSchema = z.object({
  constitutional_fit: z.number().min(0).max(1),
  transition_value: z.number().min(0).max(1),
  evidence_strength: z.number().min(0).max(1),
  death_risk: z.number().min(0).max(1),
  effort_cost: z.number().min(0).max(1),
  total: z.number().min(-1).max(1),
});

export const FeatureOutlineSchema = z.object({
  feature_name: z.string(),
  target_user: z.string(),
  problem_statement: z.string(),
  why_this_now: z.string(),
  supporting_feedback: z.array(z.string()),
  expected_outcome: z.string(),
  success_metric: z.string(),
});

export const ProposalSchema = z.object({
  id: z.string(),
  theme_id: z.string(),
  title: z.string(),
  description: z.string(),
  decision: z.enum(["build", "continue", "defer", "kill"]),
  build_if: z.string(),            // counterfactual: この条件なら build
  kill_because: z.string(),        // counterfactual: この理由で kill
  violated_clauses: z.array(z.string()),
  kill_type: KillTypeSchema.optional(),
  allocation_score: AllocationScoreSchema,
  evidence_trail: z.array(EvidenceSchema),
  salvage_path: z.string().optional(),
  pre_mortem: PreMortemSchema,
  feature_outline: FeatureOutlineSchema.optional(), // build/continue のみ
  confidence: z.number().min(0).max(1),
});

export type Proposal = z.infer<typeof ProposalSchema>;
```

### DecisionLog (事後検証ループ — yc_review.md C1/C2 対応)

> Trust Harness の類推の限界: coder にはテスト/CI が安全網としてあるが、PM の判断には事後検証手段がない。
> この構造差を埋めるために、decision の事後結果を追跡する。MVP では出力まで。事後検証フィールドは post-MVP。

```typescript
export const DecisionLogSchema = z.object({
  id: z.string(),
  proposal_id: z.string(),
  decision: z.enum(["build", "continue", "defer", "kill"]),
  decided_at: z.string().datetime(),
  clause_reasons: z.array(z.string()),
  evidence_refs: z.array(z.string()),
  override: z.object({           // ユーザーが BONSAI の判定を覆した場合
    overridden: z.boolean(),
    original_decision: z.enum(["build", "continue", "defer", "kill"]).optional(),
    override_reason: z.string().optional(),
  }).optional(),
  // --- post-MVP: 事後検証フィールド ---
  // outcome_review: z.object({
  //   reviewed_at: z.string().datetime(),
  //   was_correct: z.boolean(),
  //   outcome_notes: z.string(),
  // }).optional(),
});

export type DecisionLog = z.infer<typeof DecisionLogSchema>;
```

### 判断委譲ラダー (内部概念 — yc_review.md 5.2 対応)

> **UI には出さない。** yc_review.md の指摘: ラダーは正しいが、ユーザーが求めているのは「使っているうちに自然に信頼が上がる」体験であり、「委譲レベルを選ぶ」UX ではない。
> ラダーは内部ロジックとして保持し、外には出さない。

| 段階 | 内部ラベル | MVP での実装 |
|---|---|---|
| observe | データ収集 | ★ Observation import |
| summarize | evidence 要約 | ★ Extract + Cluster |
| rank | 候補順位付け | ★ Allocation score |
| explain | 理由の説明 | ★ clause-based reason + evidence trail |
| recommend | build/kill 提案 | ★ 常に「提案」ラベル付きで表示。override ボタン常時表示 |
| auto-act | 条件付き自動実行 | post-MVP。ユーザーが recommend を N 回連続 accept 後にオプトイン |

**MVP のデフォルト**: summarize → rank → explain を自動実行。recommend は常に表示するが「提案」として扱い、最終判断は人が override できる。

### ExecutionPacket (Builder Handoff — RFS要件)

`build` または `continue` を通過した候補のみ生成可能。これが BONSAI を "Cursor for PM" の要件へ接続する橋になる。

```typescript
export const ExecutionPacketSchema = z.object({
  id: z.string(),
  proposal_id: z.string(),
  problem_statement: z.string(),
  target_user_state: z.string(),
  intended_transition: z.string(),
  why_now: z.string(),
  supporting_evidence_summary: z.string(),
  ui_change_outline: z.string(),           // UI変更の提案
  data_model_change_outline: z.string(),   // データモデル変更の提案
  workflow_change_outline: z.string(),     // ワークフロー変更の提案
  success_metric: z.string(),
  experiment_plan: z.string(),
  coding_agent_tasks: z.array(z.object({   // coding agent 向けタスク分解
    task_id: z.string(),
    title: z.string(),
    description: z.string(),
    type: z.enum(["frontend", "backend", "data", "integration", "test"]),
    effort: z.enum(["small", "medium", "large"]),
    dependencies: z.array(z.string()),
  })),
});

export type ExecutionPacket = z.infer<typeof ExecutionPacketSchema>;
```

---

## 4. LLM Pipeline (LLMパイプライン)

Vercel AI SDK の `generateObject()` を3段チェーンで実行。各ステップに **counterfactual** を組み込む。

```
[Observations + Interviews + Usage Data]
       │
       ▼
  Step 1: Extract (Claude Haiku 4.5)
  "what user says" vs "what user actually wants"
       │
       ▼
  Step 2: Cluster (Claude Haiku 4.5)
  "theme" vs "anti-theme"
       │
       ▼
  Step 3: Constitutional Filter + Propose (Claude Sonnet 4.5)
  "build if..." vs "kill because..." + pre-mortem + allocation score
       │
       ▼
  [Proposals with kill reasoning + feature outline]
       │
       ▼ (build/continue のみ)
  Step 4: Execution Packet Generation (Claude Sonnet 4.5)
  UI/data/workflow changes + coding agent task breakdown
       │
       ▼
  [Builder-ready execution packets]
```

### Step 1: Extract (抽出)

- **Model**: Claude Haiku 4.5 (~$0.02/100 posts)
- **Input**: Raw observations (pre-shaped dataset JSON)
- **Output**: `Observation[]`
- **Counterfactual**: `extracted_intent` (言っていること) vs `inferred_need` (本当に求めていること)
- 各 observation から `UserState` の推定値も出力

### Step 2: Cluster (構造化)

- **Model**: Claude Haiku 4.5 (~$0.05)
- **Input**: Step 1 の filtered observations + user states
- **Output**: `Theme[]` (5-8個)
- **Counterfactual**: `label` (テーマ) vs `anti_theme` (対になるアンチテーマ)
- 各テーマを affected state clusters と predicted transition にマッピング

### Step 3: Constitutional Filter + Propose (憲法判定・提案)

- **Model**: Claude Sonnet 4.5 (~$0.07)
- **Input**: Step 2 の themes + Brand Constitution (5軸正規化済み)
- **Output**: `Proposal[]`
- **Counterfactual**: `build_if` vs `kill_because`
- 各 proposal に `pre_mortem` を付与
- Kill には `violated_clauses`, `kill_type`, `salvage_path` を含む
- Evidence trail で原文 observation まで遡及可能

### Step 4: Execution Packet Generation (Builder Handoff)

- **Model**: Claude Sonnet 4.5 (~$0.10)
- **Input**: `build` / `continue` の Proposal + Constitution + Theme + Observations
- **Output**: `ExecutionPacket`
- build/continue を通過した候補のみ発火
- UI変更、データモデル変更、ワークフロー変更を具体的に提案
- coding agent 向けタスク分解 (frontend/backend/data/integration/test)
- 依存関係付きで実装順序を提示

**Total cost per pipeline run**: ~$0.25-0.30 (Step 4 は build/continue 数に依存)

---

## 5. API Design (API設計)

Next.js 15 App Router (`/app/api/`)

### Constitution

```
POST /api/constitution/parse
  Input:  { we_are: string, we_never: string, we_value: string }
  Output: BrandConstitution
  LLM:    Claude Sonnet 4.5 (1 call)
  Note:   3行テキストを5判定軸 + desired_transitions + forbidden_patterns に正規化
```

### Pipeline

```
POST /api/pipeline/run
  Input:  { constitution_id: string, dataset_id?: string }
  Output: { themes: Theme[], proposals: Proposal[], user_states: UserState[] }
  LLM:    Haiku → Haiku → Sonnet (3 chained calls)
  Note:   Server-Sent Events でステップごとの進捗を返す
```

### Proposals

```
GET /api/proposals?constitution_id={id}
  Output: Proposal[] (sorted by decision, then confidence desc)

GET /api/kill-board?constitution_id={id}
  Output: Proposal[] (kill/defer only, Kill Board のメインデータソース)

GET /api/proposals/{id}/evidence
  Output: {
    proposal: Proposal,
    theme: Theme,
    observations: Observation[],
    violated_constitution_axes: string[]
  }
```

### Execution Packet

```
POST /api/proposals/{id}/execution-packet
  Input:  (proposal_id from path)
  Output: ExecutionPacket
  LLM:    Claude Sonnet 4.5 (1 call)
  Note:   build/continue の proposal のみ。coding agent tasks 付き

GET /api/proposals/{id}/execution-packet
  Output: ExecutionPacket (生成済みの場合)
```

### Observations Import

```
POST /api/observations/import
  Input:  { observations: Observation[], interviews?: InterviewTranscript[], usage_events?: UsageEvent[] }
  Output: { imported: number, observation_ids: string[] }
  Note:   JSON/CSV から手動取り込み。interviews と usage data は observation に正規化される
```

### People & Company Enrichment

```
POST /api/observations/enrich
  Input:  { observation_ids: string[] }
  Output: { enriched: number, observations: Observation[] }
  External API: CrustData (People & Company Search)
  Note:   observation に紐づく actor 情報を外部 API で取得し、
          enrichment data を付与。weight を自動算出。
          MVP: 手動マッピング (JSON upload)
          Post-MVP: API 自動結合

GET /api/observations/segments
  Output: { segments: { company_stage, company_size, industry, pain_count }[] }
  Note:   Enriched observation を集計し、どのセグメントにどの pain が集中しているかを返す
```

### Dataset

```
GET /api/datasets
  Output: { id: string, name: string, observation_count: number }[]
  Note:   MVP では1データセットのみ
```

---

## 6. UI/UX (画面設計)

shadcn/ui + Tailwind CSS。主画面を二層タブで構成し、RFS要件と差別化を両立する。

### 6.1 Allocation Board (メイン画面 — 二層タブ)

```
┌─────────────────────────────────────────────────────┐
│  BONSAI                                              │
│  [ Build Next ]  [ Kill / Defer ]                    │
│  ─────────────────────────────────────────────────── │
```

#### Tab 1: Build Next Board (RFS主要件 — "何を作るべきか")

**「次に何を build すべきか」に直接回答する画面。**

```
│  ┌─── BUILD ────────────────────────────────────┐  │
│  │ Feature Z                          score 0.78 │  │
│  │ Target: privacy-conscious PM                  │  │
│  │ Problem: "手動でのフィードバック統合に..."      │  │
│  │ Why Now: retention_risk signal 増加中          │  │
│  │ Success Metric: feedback integration time -50% │  │
│  │ Evidence: 18 observations                     │  │
│  │ [Feature Outline] [Execution Packet →]        │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─── CONTINUE ─────────────────────────────────┐  │
│  │ Experiment A                       score 0.65 │  │
│  │ Status: active, evidence improving            │  │
│  │ Kill trigger: 未到達                           │  │
│  │ [Execution Packet →]                          │  │
│  └───────────────────────────────────────────────┘  │
```

- build/continue 候補を allocation score 降順で表示
- 各カードに: feature outline summary, target user, why now, success metric
- 展開で: full feature outline, execution packet (UI/data/workflow changes + coding agent tasks)

#### Tab 2: Kill / Defer Board (差別化 — "何を作らないか")

**「この案は何によって死ぬか」が最上位の情報階層。**

```
│  ┌─── KILL ─────────────────────────────────────┐  │
│  │ [!] Feature X                                 │  │
│  │ Kill Type: constitutional_violation           │  │
│  │ Death Cause: "ユーザーデータ販売への依存..."    │  │
│  │ Violated: prohibited_business_model           │  │
│  │ Evidence: 12 observations                     │  │
│  │ Confidence: 0.92                              │  │
│  │ [Salvage Path] [Evidence →]                   │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─── DEFER ────────────────────────────────────┐  │
│  │ [?] Feature Y                                 │  │
│  │ Kill Type: narrow_unstable_state              │  │
│  │ Untested: 3 hypotheses remaining              │  │
│  │ [Details →]                                   │  │
│  └───────────────────────────────────────────────┘  │
```

- Kill/defer 項目を赤系で目立たせる
- 各カードに: title, decision badge, kill_type, violated clauses数, evidence数, confidence
- 展開で: pre-mortem全体, salvage_path, build_if / kill_because の counterfactual対

### 6.2 Constitution Editor (憲法エディタ)

```
┌─────────────────────────────────────────────────────┐
│  Brand Constitution                                  │
│                                                      │
│  We are:   [________________________]                │
│            placeholder: "a privacy-first..."         │
│                                                      │
│  We never: [________________________]                │
│            placeholder: "sell user data or..."       │
│                                                      │
│  We value: [________________________]                │
│            placeholder: "simplicity over..."         │
│                                                      │
│  ┌── 5-Axis Preview ──────────────────────────┐     │
│  │ target_user:              (リアルタイム表示) │     │
│  │ prohibited_business_model: ...              │     │
│  │ quality_bar:               ...              │     │
│  │ strategic_terrain:         ...              │     │
│  │ trust_compliance_rule:     ...              │     │
│  └─────────────────────────────────────────────┘     │
│                                                      │
│  [ Run Pipeline → ]                                  │
└──────────────────────────────────────────────────────┘
```

### 6.3 Evidence Drill-down (証拠画面)

選択した Proposal から Theme → Observation まで遡及:

- 原文引用（raw_text）とソース表記
- Counterfactual 対: extracted_intent vs inferred_need
- Theme vs anti-theme 比較
- 違反した Constitution 軸のハイライト

---

## 7. Tech Stack (技術スタック)

| Layer | Tool | 選定理由 |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | 最速のプロトタイピング |
| UI | shadcn/ui + Tailwind CSS | プリビルトコンポーネント |
| LLM Orchestration | Vercel AI SDK + `@ai-sdk/anthropic` + Zod | `generateObject()` で構造化JSON保証 |
| Fast Extraction | Claude Haiku 4.5 | $1/M input tokens, サブ秒レイテンシ |
| Reasoning | Claude Sonnet 4.5 | $3/M input, clustering + proposals に最適 |
| Deploy | Cloudflare Pages + `@cloudflare/next-on-pages` | Edge functions, グローバルCDN |
| State | Cloudflare KV (MVP) | セッション単位の簡易永続化 |
| Data | Static JSON (`/public/data/`) | Pre-shaped dataset をビルド時にバンドル |

---

## 8. MVP Scope (MVPスコープ)

### Build (絶対作る)

> **H-13 対応**: MVP は3ステップ版 (Constitution → Data → Kill/Build判定) を優先する。
> full pipeline (state inference / pre-mortem / allocation scoring / execution packet) は
> 3ステップ版で traction が出てから追加する。以下は full scope。3ステップ版は ★ 付きのみ。

- [ ] ★ Pre-shaped dataset 1個 (interviews + usage data + reviews, 事前整形済みJSON)
- [ ] ★ Observation import (JSON/CSV 手動取り込み、interviews / usage events 対応)
- [ ] ★ Constitution parser (3行テキスト → 5軸正規化, Sonnet 1 call)
- [ ] ★ 3-step LLM pipeline: Extract → Cluster → Constitutional Filter (kill/build 判定 + clause-based reason)
- [ ] ★ Allocation Board UI (Build Next タブ + Kill/Defer タブの二層構成)
- [ ] ★ Evidence drill-down (proposal → theme → observation の遡及)
- [ ] ★ Cloudflare Pages デプロイ
- [ ] Feature outline (build/continue 候補の仕様概要)
- [ ] Execution packet (UI/data/workflow 変更案 + coding agent タスク分解) — Step 4
- [ ] Pre-mortem diagnosis per proposal
- [ ] Allocation score (5軸スコアリング、説明可能)

### Cut (捨てる)

- ~~Live scraping / リアルタイムデータ取得~~
- ~~ProductHunt API 連携~~
- ~~Rork MAX プロトタイプ生成~~
- ~~Fancy charts / ダッシュボード装飾~~
- ~~Multi-constitution 比較~~
- ~~ABM ライブシミュレーション~~
- ~~ユーザー認証 / セッション永続化~~
- ~~スポンサーツール連携 (Blaxel 等)~~
- ~~**判断委譲ラダーの明示的 UI**~~ (yc_review.md 5.2: 内部概念として保持、UI に出さない)
- ~~**Exposure Allocation / evaluation fatigue 制御**~~ (yc_review.md 6.9: 将来ビジョン、今の pain ではない)
- ~~**Daily cycle / stress reduction の追加入力**~~ (yc_review.md 3.3: 入力で聞かず、BONSAI が推論して出力に含める)
- ~~**Trust Harness 8 項目の完全実装**~~ (yc_review.md I1: MVP は constitution + evidence trace + clause reason で十分)
- ~~**事後検証ループ (decision outcome tracking)**~~ (yc_review.md C1: ロードマップに含むが MVP 不要)
- Note: CrustData (People & Company Search) は enrichment layer として採用。MVP は手動マッピング、post-MVP で API 自動結合

### 受け入れ条件 (Acceptance Criteria)

MVP は以下をすべて満たしたときに成立とみなす:

- [ ] Customer interviews を observation として取り込める
- [ ] Product usage data を observation として取り込める
- [ ] `We are / We never / We value` を入力し、normalized clauses に変換できる
- [ ] "What should we build next?" に対して ranked proposals を返せる
- [ ] 各 proposal に理由説明 (clause-based reason + evidence) がある
- [ ] 少なくとも1件を explicit clause violation 付きで kill できる
- [ ] build/continue 候補に feature outline がある
- [ ] build/continue 候補に execution packet (UI/data/workflow変更 + coding agent tasks) を生成できる
- [ ] すべての decision を evidence reference 付きで追跡できる

### 失敗パターン (Anti-patterns)

以下のいずれかになった場合、このシステムは失敗である:

- generic feedback summarizer (フィードバックをまとめるだけ)
- opaque LLM output を並べるだけの dashboard (説明不能)
- kill discipline のない feature ideation tool (案を増やすだけ)
- allocation logic のない prototype generator (判断なき生成)
- state transition を持たない shallow persona tool (静的ラベル止まり)
- builder handoff のない judgment system (判断だけで実行に渡せない)
- PM ツールではなく AI ガバナンス FW になっている (yc_review.md F4: 委譲ラダーが主役になったらアイデンティティ崩壊)

---

## 9. Deploy (デプロイ)

### Cloudflare Pages

```bash
# next.config.ts
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

const nextConfig = {
  // Cloudflare Pages compatible settings
};

export default nextConfig;
```

- **Build**: `npx @cloudflare/next-on-pages`
- **Environment Variables**: `ANTHROPIC_API_KEY` を Cloudflare Dashboard で設定
- **Dataset**: `/public/data/dataset.json` としてバンドル (ビルド時に静的インポート)
- **Edge Functions**: API routes は Cloudflare Workers として動作
- **Domain**: Cloudflare Pages の自動生成URL (MVP)

### CI/CD

```
push to develop → GitHub Actions → build → deploy to Cloudflare Pages
```
