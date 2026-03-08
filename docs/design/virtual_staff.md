---
Title: Virtual Staff — Adversarial Review Layer
Parent: docs/design/bonsai_claude.md
Status: Draft v0.1
---

# Virtual Staff — 仮想審査レビュー層

## 1. コンセプト

### 一文定義

**Virtual Staff は、Proposal や Constitution に対して「特定の判断フレームワークを持つ仮想審査員」が構造化された批判的質問を生成し、盲点を炙り出す機能である。**

### なぜ BONSAI に必要か

BONSAI の allocation pipeline は「自社の憲法に照らして判断する」システム。
しかし、憲法そのものが甘い場合、パイプライン全体が自己確証バイアスに陥る。

Virtual Staff は**外部視点の adversarial layer** として機能する:

- Constitution が「詩的で曖昧」なとき → 構造的欠陥を指摘する
- Proposal が build 判定を通過したとき → 「本当に市場が欲しているか」を問う
- Kill 判定が出たとき → 「本当に kill すべきか、salvage すべきか」を再検証する

### BONSAI 盆栽比喩との接続

| 盆栽の要素 | Virtual Staff での対応 |
|---|---|
| 品評会の審査員 | 仮想審査員。外部の目で形を見る |
| 「この枝は残すべきか」の問い | 各 reviewer が異なる判断軸で枝を問う |
| 流派の違い | reviewer ごとに異なる evaluation framework |

---

## 2. Reviewer Personas（審査員定義）

### 設計原則

- reviewer は「有名人の物まね」ではなく、**特定の判断フレームワークの具現化**として定義する
- 各 reviewer は明示的な evaluation axes（評価軸）と question templates を持つ
- 出力は「意見」ではなく、**構造化された質問 + severity + 指摘根拠**

### 2.1 Reviewer: YC Partner Panel

**フレームワーク**: Product-Market Fit 検証 + Speed of Execution

| 評価軸 | 問うていること |
|---|---|
| `problem_reality` | この問題は本当に存在するか。誰の髪が燃えているか |
| `solution_simplicity` | もっと単純な解法はないか。over-engineered ではないか |
| `market_size` | 十分に大きい市場か。新カテゴリ創出なら証拠は何か |
| `competition` | 既存プレイヤーがこれをやらない理由は何か |
| `founder_market_fit` | なぜこのチームが作る適任者なのか |
| `traction` | 仮説を支持する証拠は何か。動くものはあるか |
| `why_now` | なぜ今なのか。1年前でも1年後でもなく |
| `go_to_market` | 最初の10社をどうやって獲るか |
| `unit_economics` | pricing は成立するか。LTV > CAC か |

**質問生成の性格**:
- 30秒で答えられない説明は「まだわかっていない」とみなす
- 設計の美しさより「雑でも動くものを使っている人がいるか」を重視
- tarpit idea（魅力的だが成立しない案）を見抜く

### 2.2 Reviewer: First Principles Engineer

**フレームワーク**: 物理学的思考 + 10x テスト + 複雑性の排除

| 評価軸 | 問うていること |
|---|---|
| `bottleneck_physics` | ボトルネックは本当にそこか。問題の根本原因は何か |
| `10x_test` | 既存の方法と比べて10倍良いか。漸進的改善ではないか |
| `irreducible_core` | 不可約な核は何か。1文で言えるか |
| `complexity_audit` | 不要な部分はないか。最良のパーツは無いパーツ |
| `iteration_speed` | どれだけ速く壊して学べるか |
| `bullshit_detection` | 複雑さで賢く見せていないか。本質は何か |

**質問生成の性格**:
- 「なぜ？」を5回繰り返す
- 7ステップのパイプラインを見たら「3ステップにできないか」と問う
- 完成品の設計図より「48時間で何を ship するか」を問う

### 2.3 Reviewer: Customer Advocate

**フレームワーク**: Jobs-to-be-Done + Switching Cost Analysis

| 評価軸 | 問うていること |
|---|---|
| `job_clarity` | ユーザーが雇おうとしている job は何か |
| `current_workaround` | 今日ユーザーはこの問題をどう解決しているか |
| `switching_motivation` | 既存の方法を捨ててまで使う理由は何か |
| `aha_moment` | 「これがないと困る」と思う瞬間は具体的にいつか |
| `willingness_to_pay` | いくら払うか。その根拠は何か |
| `target_paradox` | この機能を使える人は、そもそもこの機能を必要としていないのでは |

**質問生成の性格**:
- 「顧客は〇〇と言っているが、本当に欲しいのは〇〇では？」を常に問う
- 機能の話を始めたら「その機能を使う人の1日を教えて」と引き戻す
- 「全員に少し良い」より「5人に不可欠」を優先する

### 2.4 Reviewer: Strategic Skeptic

**フレームワーク**: Competitive Moat Analysis + Category Risk

| 評価軸 | 問うていること |
|---|---|
| `moat_type` | 防御性は何か。network effect / data / switching cost / brand のどれか |
| `incumbent_response` | 既存大手が3ヶ月で同じ機能を追加したら何が残るか |
| `category_risk` | 新カテゴリを作ろうとしているなら、誰も探していないものを売るリスクは |
| `dependency_risk` | LLM provider / platform への依存度。API が値上げされたら？ |
| `self_review` | このシステム自身をこのシステムに通したら、build / kill どちらが出るか |

**質問生成の性格**:
- 楽観的な見通しに対して必ず worst case を問う
- 「差別化」を主張されたら「それは feature か moat か」を問う

---

## 3. Data Model

### ReviewerPersona

```typescript
import { z } from "zod";

export const ReviewerTypeSchema = z.enum([
  "yc_partner",
  "first_principles",
  "customer_advocate",
  "strategic_skeptic",
]);

export type ReviewerType = z.infer<typeof ReviewerTypeSchema>;

export const EvaluationAxisSchema = z.object({
  axis_id: z.string(),
  axis_name: z.string(),
  description: z.string(),
});

export const ReviewerPersonaSchema = z.object({
  id: z.string(),
  type: ReviewerTypeSchema,
  display_name: z.string(),
  framework: z.string(),
  evaluation_axes: z.array(EvaluationAxisSchema),
  system_prompt_template: z.string(),
});

export type ReviewerPersona = z.infer<typeof ReviewerPersonaSchema>;
```

### ReviewQuestion

```typescript
export const SeveritySchema = z.enum([
  "fatal",      // これに答えられなければ、この案は成立しない
  "critical",   // 重大な盲点。回答次第で build/kill が変わる
  "important",  // 改善が必要だが、致命的ではない
  "probe",      // 思考を深めるための探索的質問
]);

export const ReviewQuestionSchema = z.object({
  id: z.string(),
  reviewer_type: ReviewerTypeSchema,
  axis_id: z.string(),
  question: z.string(),
  why_this_matters: z.string(),
  severity: SeveritySchema,
  evidence_refs: z.array(z.string()).optional(),
  related_proposal_ids: z.array(z.string()).optional(),
  related_clause_ids: z.array(z.string()).optional(),
});

export type ReviewQuestion = z.infer<typeof ReviewQuestionSchema>;
```

### StaffReview（1回のレビュー実行結果）

```typescript
export const StaffReviewSchema = z.object({
  id: z.string(),
  target_type: z.enum([
    "constitution",   // 憲法自体のレビュー
    "proposal",       // 個別 proposal のレビュー
    "pipeline_run",   // パイプライン全体の結果レビュー
  ]),
  target_id: z.string(),
  reviewer_types: z.array(ReviewerTypeSchema),
  questions: z.array(ReviewQuestionSchema),
  summary: z.object({
    total_questions: z.number(),
    fatal_count: z.number(),
    critical_count: z.number(),
    important_count: z.number(),
    probe_count: z.number(),
    top_blind_spot: z.string(),
    overall_assessment: z.string(),
  }),
  created_at: z.string().datetime(),
});

export type StaffReview = z.infer<typeof StaffReviewSchema>;
```

### ReviewResponse（ユーザーの回答）

```typescript
export const ReviewResponseSchema = z.object({
  id: z.string(),
  review_id: z.string(),
  question_id: z.string(),
  response_text: z.string(),
  status: z.enum([
    "answered",       // 回答済み
    "acknowledged",   // 認識したが未対応
    "dismissed",      // 意図的に無視（理由付き）
    "action_taken",   // 対応済み（constitution/proposal を修正した）
  ]),
  dismiss_reason: z.string().optional(),
  created_at: z.string().datetime(),
});

export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;
```

---

## 4. LLM Pipeline

### レビュー生成フロー

```
[Review Target: Constitution / Proposal / Pipeline Run]
       │
       ▼
  Context Assembly
  - target の全データ
  - 関連する observations / themes / evidence
  - constitution clauses
  - allocation scores
       │
       ▼
  Per-Reviewer Generation (並列実行可能)
  ┌──────────────────┐  ┌──────────────────┐
  │ YC Partner Panel │  │ First Principles │
  │ Claude Sonnet    │  │ Claude Sonnet    │
  └──────────────────┘  └──────────────────┘
  ┌──────────────────┐  ┌──────────────────┐
  │ Customer Advocate│  │Strategic Skeptic │
  │ Claude Sonnet    │  │ Claude Sonnet    │
  └──────────────────┘  └──────────────────┘
       │
       ▼
  Merge + Deduplicate + Severity Ranking
       │
       ▼
  [StaffReview with ranked questions]
```

### System Prompt 構造

各 reviewer の system prompt は以下の構造で生成する:

```
You are a {reviewer.display_name}.
Your evaluation framework: {reviewer.framework}

Your evaluation axes:
{reviewer.evaluation_axes の列挙}

You are reviewing: {target_type}
{target の全コンテキスト}

Rules:
- Generate 3-7 questions per evaluation axis
- Each question must have: question, why_this_matters, severity
- severity "fatal" は本当に答えられなければ案が成立しないもののみ
- 既に evidence で裏付けられている点は probe に留める
- 憶測ではなく、提供されたデータの欠落・矛盾を指摘する
- 出力は ReviewQuestion[] の JSON
```

### コスト見積もり

| 実行単位 | Model | 推定コスト |
|---|---|---|
| 1 reviewer × 1 target | Claude Sonnet 4.5 | ~$0.05-0.08 |
| 全4 reviewer × 1 target | Claude Sonnet 4.5 | ~$0.20-0.30 |
| 全4 reviewer × pipeline run (5 proposals) | Claude Sonnet 4.5 | ~$0.50-0.80 |

---

## 5. API Design

```
POST /api/reviews/run
  Input:  {
    target_type: "constitution" | "proposal" | "pipeline_run",
    target_id: string,
    reviewer_types?: ReviewerType[]  // 省略時は全4種
  }
  Output: StaffReview
  LLM:    Claude Sonnet 4.5 (reviewer 数に応じて並列 call)
  Note:   Server-Sent Events で reviewer ごとの進捗を返す

GET /api/reviews/:reviewId
  Output: StaffReview

GET /api/reviews?target_type={type}&target_id={id}
  Output: StaffReview[] (履歴)

POST /api/reviews/:reviewId/responses
  Input:  {
    question_id: string,
    response_text: string,
    status: "answered" | "acknowledged" | "dismissed" | "action_taken",
    dismiss_reason?: string
  }
  Output: ReviewResponse

GET /api/reviews/:reviewId/responses
  Output: ReviewResponse[]
```

---

## 6. UI/UX

### 6.1 起動方法

Allocation Board の各カードおよび Constitution Editor から起動できる:

```
┌─── BUILD ────────────────────────────────────┐
│ Feature Z                          score 0.78 │
│ Target: privacy-conscious PM                  │
│ ...                                           │
│ [Feature Outline] [Execution Packet →]        │
│ [🔍 Virtual Staff Review]                     │
└───────────────────────────────────────────────┘
```

Constitution Editor にも:

```
┌─────────────────────────────────────────────────────┐
│  Brand Constitution                                  │
│  ...                                                 │
│  [ Run Pipeline → ]  [ 🔍 Review Constitution ]     │
└──────────────────────────────────────────────────────┘
```

Pipeline 実行完了後にも:

```
┌─────────────────────────────────────────────────────┐
│  Pipeline Run Complete                               │
│  5 proposals generated (2 build, 1 defer, 2 kill)    │
│  [ View Results ]  [ 🔍 Virtual Staff Review ]       │
└──────────────────────────────────────────────────────┘
```

### 6.2 Review 画面

```
┌─────────────────────────────────────────────────────┐
│  Virtual Staff Review                                │
│  Target: Proposal "Feature Z"                        │
│                                                      │
│  Summary                                             │
│  ┌─────────────────────────────────────────────┐     │
│  │ Fatal: 1  Critical: 3  Important: 5  Probe: 4│    │
│  │ Top blind spot: "顧客の switching cost が..."  │    │
│  └─────────────────────────────────────────────┘     │
│                                                      │
│  [ YC Partner ]  [ First Principles ]                │
│  [ Customer Advocate ]  [ Strategic Skeptic ]        │
│  ─────────────────────────────────────────────────── │
│                                                      │
│  ┌─── FATAL ─────────────────────────────────────┐  │
│  │ 🔴 YC Partner > problem_reality                │  │
│  │ Q: "今日このプロダクトに月$100払うPMを           │  │
│  │    3人挙げられるか？"                            │  │
│  │ Why: 需要の実在証明。挙げられなければ全て仮説     │  │
│  │                                                │  │
│  │ [ Answer ]  [ Acknowledge ]  [ Dismiss ▾ ]     │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─── CRITICAL ──────────────────────────────────┐  │
│  │ 🟠 First Principles > complexity_audit         │  │
│  │ Q: "7ステージパイプラインは本当に必要か？        │  │
│  │    3ステップで同じ結果を出せないか？"            │  │
│  │ Why: 最良のパーツは無いパーツ。...               │  │
│  │                                                │  │
│  │ [ Answer ]  [ Acknowledge ]  [ Dismiss ▾ ]     │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─── CRITICAL ──────────────────────────────────┐  │
│  │ 🟠 Customer Advocate > target_paradox          │  │
│  │ Q: "Brand Constitution を書ける人は、            │  │
│  │    そもそも判断に困っていないのでは？"            │  │
│  │ Why: ターゲット矛盾の可能性。...                 │  │
│  │                                                │  │
│  │ ✅ Answered                                     │  │
│  │ "Constitution は founder が書き、PM チーム全体   │  │
│  │  の判断基盤として機能する。書く人 ≠ 使う人..."    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ...                                                 │
└──────────────────────────────────────────────────────┘
```

### 6.3 情報階層

1. **Summary bar** — fatal/critical/important/probe のカウント + top blind spot
2. **Reviewer tabs** — reviewer 別にフィルタ、または severity 別にソート（デフォルト）
3. **Question cards** — severity badge, reviewer badge, axis, question, why_this_matters
4. **Response actions** — Answer（テキスト入力）/ Acknowledge / Dismiss（理由必須）/ Action Taken

### 6.4 フィードバックループ

Review の回答結果を BONSAI パイプラインに戻す:

```
[StaffReview Questions]
       │
       ▼ ユーザーが回答
[ReviewResponses]
       │
       ▼ 未解決の fatal/critical がある場合
[Constitution 修正を推奨]  or  [Proposal 修正を推奨]
       │
       ▼ 修正後
[Re-run Pipeline]  or  [Re-run Review]
```

- fatal question に "dismissed" が付いた場合、Proposal カードに ⚠️ を表示
- 全 fatal/critical が answered or action_taken の場合、✅ を表示

---

## 7. BONSAI Pipeline との統合

### 7.1 実行タイミング

| タイミング | target_type | 自動/手動 |
|---|---|---|
| Constitution 保存後 | `constitution` | 手動（ボタン） |
| Pipeline 完了後 | `pipeline_run` | 手動（ボタン）、将来的に自動 |
| 個別 Proposal 選択時 | `proposal` | 手動（カード内ボタン） |
| Execution Packet 生成前 | `proposal` | 推奨（build 判定の最終チェック） |

### 7.2 Review が allocation に影響するか

MVP では **影響しない**。Review は advisory layer であり、allocation score を変更しない。

将来的には:
- 未回答の fatal question がある proposal は allocation score に penalty を加算
- review 結果を次回 pipeline run の context に含める

### 7.3 Pre-mortem との関係

Pre-mortem は「この案がどう死ぬか」を内部視点で診断する。
Virtual Staff は「外部の目でどう見えるか」を adversarial に問う。

| | Pre-mortem | Virtual Staff |
|---|---|---|
| 視点 | 内部（自社データ + constitution） | 外部（市場 + 競合 + 顧客） |
| 対象 | Proposal の failure mode | Constitution / Proposal / Pipeline 全体 |
| 出力 | death hypothesis + kill trigger | critical questions + blind spots |
| 自動性 | Pipeline Stage 5 で自動生成 | ユーザーが手動で起動 |

補完関係であり、重複ではない。

---

## 8. MVP Scope

### Build（この機能で絶対作る）

- [ ] 4 reviewer persona の定義（system prompt + axes）
- [ ] `POST /api/reviews/run` — reviewer 選択 + LLM 生成
- [ ] `GET /api/reviews/:id` — 結果取得
- [ ] Review 画面（severity 順、reviewer tabs、question cards）
- [ ] Answer / Acknowledge / Dismiss の response 記録
- [ ] Constitution / Proposal / Pipeline Run への起動ボタン

### Cut（捨てる）

- ~~Review 結果の allocation score への自動反映~~
- ~~カスタム reviewer 作成 UI~~
- ~~Review 回答の pipeline 再実行への自動フィードバック~~
- ~~Reviewer 間のクロスレビュー（reviewer A の質問を reviewer B が評価）~~
- ~~Review 履歴の時系列比較~~

### 受け入れ条件

- [ ] Constitution に対して 4 reviewer がそれぞれ 3-7 個の構造化質問を生成できる
- [ ] 各質問に severity (fatal/critical/important/probe) が付いている
- [ ] 各質問に why_this_matters（なぜこの質問が重要か）が付いている
- [ ] 質問に対して回答を記録できる
- [ ] fatal question の未回答数が一目でわかる

---

## 9. Reviewer Persona 拡張（post-MVP）

MVP 後に追加可能な reviewer:

| Reviewer | フレームワーク | 追加価値 |
|---|---|---|
| Regulatory Analyst | compliance / privacy / legal risk | trust_rules 軸の深掘り |
| Growth Hacker | viral loop / retention / activation | go-to-market 戦術の検証 |
| Technical Architect | scalability / cost / dependency | 実装可能性の検証 |
| Domain Expert (configurable) | ユーザーが定義する専門領域 | 業界固有の盲点検出 |

カスタム reviewer はユーザーが evaluation_axes と system_prompt_template を定義して作成する。
これにより Virtual Staff は「固定の4人」から「設定可能な審査委員会」へ拡張される。
