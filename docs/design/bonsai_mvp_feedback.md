---
Title: BONSAI MVP Feedback — bonsai_claude.md 視点でのレビュー
Target: docs/design/bonsai_mvp.md
Reference: docs/design/bonsai_claude.md, docs/design/yc_review.md, docs/design/hypothesis-brief.md
Status: Review v0.1
Date: 2026-03-08
---

# BONSAI MVP Feedback

## 0. 総合評価

`bonsai_mvp.md` は **正しい方向に大きく前進している**。
設計文書の膨張に対する自覚と、「動くもの」への収束意思が明確。

ただし、以下の3点で `bonsai_claude.md` および他の設計資料との **構造的な不整合** がある。

| 評価軸 | 評価 | 要約 |
|---|---|---|
| スコープ判断 | **A** | 「入れないもの」の選定は的確。yc_review.md の指摘を正しく反映 |
| bonsai_claude.md との整合 | **B-** | H-13 の3ステップ簡略化が反映されていない。Core に full pipeline を記載 |
| Demo 設計 | **A-** | 3点に絞った証明目標は正しい。ただし pre-computed の範囲定義が曖昧 |
| 実装可能性 | **B** | 実装優先順位は良いが、技術的な制約・前提が未記載 |
| 仮説検証との接続 | **B+** | H-1/H-4 への接続は明示されているが、Demo 後の計測方法が未定義 |

---

## 1. 最も重要な不整合: H-13 (3ステップ簡略化) が反映されていない

### 問題

`bonsai_claude.md` の MVP Scope は H-13 対応として **3ステップ版 (★) を優先** し、full pipeline は traction 後と明記している:

> MVP は3ステップ版 (Constitution → Data → Kill/Build判定) を優先する。

しかし `bonsai_mvp.md` の §5.2 Core には full pipeline の要素が並んでいる:

```
- constitution parser
- observation normalization
- user state / theme inference       ← 3ステップ版では不要
- allocation scoring                 ← 3ステップ版では不要
- build / defer / kill reasoning
- evidence trace
- execution packet generation        ← 3ステップ版の ★ には含まれない
```

### 推奨

§5.2 Core を3ステップ版に絞る:

```
★ Core (3ステップ版):
- constitution parser (3行 → 5軸正規化)
- observation normalization (Extract)
- theme clustering (Cluster)
- constitutional filter (build/defer/kill 判定 + clause-based reason)
- evidence trace

Post-traction で追加:
- user state inference
- allocation scoring (5軸)
- execution packet generation
- pre-mortem diagnosis
```

### なぜ重要か

yc_review.md の最終判定:
> "Ship the simplest version that one PM uses every morning."

bonsai_mvp.md がこの判定を引用しながら Core に full pipeline を載せるのは矛盾。3ステップ版の明示が必要。

---

## 2. Execution Packet の位置づけが曖昧

### 問題

`bonsai_mvp.md` は execution packet を3箇所で言及:

- §2.1 売るもの: 「build 候補の execution packet 化」 ✓
- §5.2 Core: 「execution packet generation」
- §8.3 Demo Step 5: execution packet を見せる

しかし `bonsai_claude.md` では execution packet は **★ (3ステップ版) に含まれない**:

```
- [ ] Execution packet (UI/data/workflow 変更案 + coding agent タスク分解) — Step 4
  ↑ ★ なし = 3ステップ版には入らない
```

### 推奨

2つの選択肢がある:

**Option A: Demo で見せるなら3ステップ版に昇格**
- execution packet を ★ に含め、bonsai_claude.md も更新
- RFS #1 の「coding agent 向け分解」要件を MVP で満たすため
- Demo の説得力が上がる

**Option B: Demo では pre-computed で見せる**
- execution packet は live 生成しない
- あらかじめ用意した packet を1件だけ見せる
- §9.1 の「pre-computed を許容する」ルールと整合

Demo の目的が「mechanism の証明」なら **Option B で十分**。
ただしその場合、§5.2 Core から `execution packet generation` を外し、§8.3 Step 5 に「pre-computed」と注記すべき。

---

## 3. `continue` decision が消えている

### 問題

`bonsai_claude.md` は 4値 decision: `build / continue / defer / kill`
`bonsai_mvp.md` は全体を通して `build / defer / kill` の3値で記述

- §3 P1: 「kill / defer / build」
- §5.3 Output: 「Build Next Board」「Kill / Defer Board」
- §8.3 Step 3: 「build / defer / kill」

`continue` は既に active な実験を継続する判定で、codex 由来の重要な概念。

### 推奨

**MVP では3値で良い。** `continue` は「既に active な案件」が存在する前提であり、MVP のデモ時点では案件はすべて新規候補。

ただし、意図的に3値にしているなら §1 の一文定義を合わせる:

```diff
- "what to build next, what to defer, and what to kill"
+ 変更不要（continue は build に内包されるので問題ない）
```

明示的に「MVP は3値、post-MVP で4値に拡張」と注記すると、bonsai_claude.md との差分が説明できる。

---

## 4. Demo ストーリーの改善提案

### 4.1 Step 1 の「judge / viewer」が曖昧

§8.3 Step 1:
> judge / viewer に `We are / We never / We value` を入力してもらう。

「judge / viewer」の定義が不明。Demo の文脈では:
- **ハッカソン審査員** に入力してもらうのか
- **自分が入力して見せる** のか

推奨: **自分が入力する。** 審査員に入力させると失敗リスクが高い（曖昧な入力 → 正規化が壊れる → デモ失敗）。
「自分の constitution を入力し、リアルタイムで正規化される様子を見せる」が安全。

### 4.2 Constitution 変更で結果が変わるデモがない

§8.1 Demo の目的 #1:
> Constitution を入れると、判断が変わる

しかし §8.3 のストーリーでは constitution は1回しか入力しない。
「入れると変わる」を見せるには **2回目の constitution** が必要。

推奨:
- Step 1 で constitution A を入力 → Step 3 で build/kill 表示
- Step 3.5 (追加): constitution B に変更 → **同じ候補の判定が変わる** ことを見せる
- これが「constitution が judgment を制御する」ことの最も強い証明

### 4.3 「なぜ ChatGPT と違うか」のデモ証明がない

F2 は Fatal Question。Demo で直接回答できると強い。

推奨: Step 3.5 の constitution 変更デモが F2 への回答になる。
「同じデータに対して constitution を変えると判定が変わる。ChatGPT にはこの constrained + reproducible な判断ができない。」

---

## 5. Acceptance Criteria の不足

### 5.1 計測可能性がない

§10 の acceptance criteria は全て binary (できる/できない):

```
- constitution 3 行を入力できる
- observation CSV / JSON を取り込める
- build / defer / kill を返せる
```

H-4 (Constitution 精度) の検証には **質的な基準** が必要:

推奨として追加:
```
### Quality
- constitution の5軸正規化が、入力者に「だいたい合っている」と言われる (H-4 の hackathon 成功基準)
- kill 理由が「それは確かに kill すべき」と納得される (3件中2件以上)
- build 候補が「確かに次に作るべき」と感じられる (3件中2件以上)
```

### 5.2 Demo の acceptance criteria に「constitution 変更で結果が変わる」がない

§10 Demo:
```
- 1 回の constitution 入力で結果が変わる
```

これは「変わる」の定義が曖昧。推奨:
```
- constitution A と B で、同一候補の decision (build/kill) が少なくとも1件異なる
```

---

## 6. 技術的な制約が未記載

`bonsai_claude.md` には Tech Stack と Deploy の詳細があるが、`bonsai_mvp.md` には技術的前提がない。

MVP 文書として最低限必要:

```
## Tech Constraints
- Cloudflare Pages + Workers (CPU 30s制限)
- LLM: Claude Haiku 4.5 (Extract/Cluster) + Sonnet 4.5 (Filter)
- Total pipeline latency target: < 30s (H-7)
- Pre-shaped dataset: static JSON, ビルド時バンドル
- No auth, no persistent state (Cloudflare KV はセッション単位のみ)
```

これがないと、実装者が判断できない。

---

## 7. Messaging の強化提案

### 7.1 §11 の1文差分は良い、しかし長い

```
ChatGPT is an answer engine. BONSAI is an allocation system: it applies a reusable
constitution to evidence, explains what to build or kill, and turns surviving decisions
into execution packets.
```

30秒ルール (Seibel) に合わせるなら:

> ChatGPT answers once. BONSAI allocates continuously: constitution in, build/kill decisions out, with evidence you can trace.

### 7.2 §12 の差別化に「judgment support」がない

yc_review.md の最大の前進は「judgment replacement → judgment support」への再定義。
しかし §12 の「一番短い差別化」にこれが入っていない:

```
> The difference is not that it generates more ideas.
> The difference is that it explains what not to build.
```

推奨:
```
> BONSAI doesn't replace your judgment. It makes your judgment explainable,
> evidence-based, and sharp enough to kill 9 out of 10.
```

---

## 8. bonsai_claude.md の yc_review 対応が bonsai_mvp.md に未反映

`bonsai_claude.md` に今回追加された以下の要素が `bonsai_mvp.md` に反映されていない:

| bonsai_claude.md の追加 | bonsai_mvp.md の状態 |
|---|---|
| Fatal Questions テーブル (F1-F4) | §11 に F2 の回答はあるが、F1/F3/F4 の回答がない |
| DecisionLog スキーマ (override フィールド) | 未記載。MVP で override UI を作るなら言及すべき |
| 判断委譲ラダー (内部概念) | §6 で「入れない」としているが、暗黙実装の方針が未記載 |
| Trust Harness の類推の限界 | 未反映。Demo messaging で「PM のテスト/CI 相当を作る」ビジョンに触れるべきか |
| Evaluation fatigue が post-MVP に移動 | §6 で「入れない」。整合している ✓ |

### 推奨

以下を `bonsai_mvp.md` に追加:

1. **§7 に追加**: 「7.5 Recommend, not decide — 全判定に override ボタンを付ける。BONSAI は提案し、人が決める」
2. **§8.4 に追加**: Demo メッセージの1つとして「BONSAI doesn't decide for you. It shows you what would die, and why.」
3. **§10 Messaging に追加**: 「Trust Harness のビジョンを聞かれたら: 'Coder にはテスト、PM にはまだない。BONSAI の decision log がそれになる'」

---

## 9. §14 実装優先順位への提案

現在の順序:
```
1. Constitution input
2. Observation import
3. Allocation engine
4. Build Next / Kill-Defer surfaces
5. Evidence drill-down
6. Execution packet
7. Coding agent export
```

### 問題

- #3 「Allocation engine」が曖昧。3ステップ版なら Extract → Cluster → Filter の3つに分解すべき
- #6 と #7 は実質同じもの (execution packet に coding agent tasks が含まれる)
- Demo の最短パスを意識した順序になっていない

### 推奨 (Demo 最短パス順)

```
1. Pre-shaped dataset 準備 (static JSON)
2. Constitution input + 5軸正規化 (Sonnet 1 call)
3. Extract pipeline (Haiku — observation → extracted intent/need)
4. Cluster pipeline (Haiku — observations → themes)
5. Constitutional Filter (Sonnet — themes + constitution → proposals with build/kill)
6. Allocation Board UI (Build Next + Kill/Defer の2タブ)
7. Evidence drill-down (proposal → theme → observation)
------- ここまでで Demo の目的 #1, #2 が達成 -------
8. Execution packet generation (Sonnet — proposal → UI/data/workflow/tasks)
------- ここまでで Demo の目的 #3 が達成 -------
```

これなら #1-#7 で Demo 可能、#8 は時間があれば追加。

---

## 10. 欠けている視点: Demo 失敗時のフォールバック

Demo は live の LLM call を含む。失敗する可能性がある。

推奨: §9 に追加

```
### 9.4 Demo 失敗時のフォールバック

- LLM call が timeout した場合: pre-computed の結果に切り替える
- Constitution 正規化が壊れた場合: 事前検証済みの constitution を使う
- Pipeline 全体が失敗した場合: 録画済みの walkthrough を見せる

原則: デモの目的は「mechanism の証明」であり「ライブ動作の証明」ではない。
pre-computed で見せても mechanism は証明できる。
```

---

## 11. まとめ: 推奨アクション

| # | Action | 重要度 | 理由 |
|---|---|---|---|
| 1 | §5.2 Core を3ステップ版に絞る | **Critical** | bonsai_claude.md / H-13 / yc_review と矛盾 |
| 2 | Execution packet を Core から外すか、pre-computed と明記 | **Critical** | 3ステップ版との整合 |
| 3 | Demo に constitution 変更 → 判定変化 のステップ追加 | **High** | F2 回答 + 最強のデモ証明 |
| 4 | §10 に質的 acceptance criteria を追加 | **High** | H-4 検証との接続 |
| 5 | §14 の実装優先順位を Demo 最短パス順に変更 | **Medium** | 実装効率 |
| 6 | Tech constraints セクション追加 | **Medium** | 実装者が判断できない |
| 7 | Demo 失敗時のフォールバック追加 | **Medium** | リスク管理 |
| 8 | Messaging の judgment support 統合 | **Medium** | yc_review の最大の前進を反映 |
| 9 | `continue` の3値/4値を明示 | **Low** | bonsai_claude.md との差分説明 |

**最も重要な1つ**: §5.2 Core の3ステップ版への絞り込み。これが bonsai_mvp.md 全体の設計判断を左右する。
