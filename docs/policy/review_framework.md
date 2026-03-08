# Review Framework

## 1. 質問分類（Severity Tiers）

全レビューで共通の 4 段階 severity を使用する。

| Tier | ラベル | 定義 | 対応要件 |
|---|---|---|---|
| **Fatal** | 🔴 | これに答えられなければ、案が成立しない | 回答必須。未回答の場合 build 判定を保留 |
| **Critical** | 🟠 | 重大な盲点。回答次第で build/kill が変わる | 回答必須。acknowledged でも可だが理由を記録 |
| **Important** | 🟡 | 改善が必要だが致命的ではない | 回答推奨。dismissed の場合は理由を記録 |
| **Probe** | 🔵 | 思考を深めるための探索的質問 | 任意。回答すると設計の depth が増す |

## 2. 回答ステータス

各質問に対するレスポンスは以下の 4 状態を取る。

| Status | 意味 | 要件 |
|---|---|---|
| `answered` | 回答済み | 回答テキスト必須 |
| `acknowledged` | 認識したが未対応 | — |
| `dismissed` | 意図的に無視 | dismiss_reason 必須 |
| `action_taken` | 対応済み（設計・コードを修正した） | 対応内容の記録推奨 |

## 3. レビュー対象タイプ

| Target Type | 何をレビューするか | 典型的なタイミング |
|---|---|---|
| `constitution` | Constitution の構造的欠陥、曖昧さ、自己確証バイアス | Constitution 作成・変更後 |
| `proposal` | 個別 Proposal の市場性、実現可能性、盲点 | build 判定後、execution packet 生成前 |
| `pipeline_run` | パイプライン全体の結果の整合性 | Pipeline 実行完了後 |
| `design_doc` | 設計文書間の整合性、スコープ判断の妥当性 | 設計変更時 |
| `mvp_scope` | MVP スコープの適切さ、cut 判断の妥当性 | Phase 開始前 |

## 4. 評価軸（Standard Axes）

### 4.1 YC 評価軸（外部投資家視点）

| 軸 | 問うていること |
|---|---|
| Problem | 問題は実在するか。誰の髪が燃えているか |
| Solution | 解法はシンプルか。over-engineered ではないか |
| Market | 十分に大きい市場か |
| Competition | 既存プレイヤーがやらない理由は何か |
| Founder-Market Fit | なぜこのチームか |
| Traction | 動くものはあるか。paying user はいるか |
| Why Now | なぜ今か |

### 4.2 プロダクト評価軸（内部品質視点）

| 軸 | 問うていること |
|---|---|
| Scope Alignment | 設計文書間でスコープが整合しているか |
| Demo Readiness | デモで証明すべきことが実装されているか |
| Hypothesis Connection | 仮説検証計画と接続しているか |
| Implementation Feasibility | 技術的制約の中で実装可能か |
| Messaging Consistency | 外部メッセージングが一貫しているか |

## 5. レビュー実行ルール

### 5.1 レビュー頻度

| トリガー | レビュータイプ | 必須/推奨 |
|---|---|---|
| Constitution 作成・変更 | `constitution` review | 推奨 |
| Pipeline 実行完了 | `pipeline_run` review | 推奨 |
| build 判定後 → execution packet 生成前 | `proposal` review | 推奨（build 案の最終チェック） |
| 設計文書の大幅変更 | `design_doc` review | 必須 |
| Phase 開始前 | `mvp_scope` review | 必須 |

### 5.2 レビュー結果の扱い

- **Fatal が未回答の場合**: build 判定を保留。Constitution / Proposal の修正を推奨
- **Fatal に "dismissed" が付いた場合**: 対象カードに ⚠️ を表示。dismissed 理由を記録
- **全 Fatal / Critical が answered or action_taken**: ✅ を表示
- **レビューは advisory layer**: MVP では allocation score を直接変更しない
