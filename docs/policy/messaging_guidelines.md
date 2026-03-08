# Messaging Guidelines

## 1. コアメッセージ

### 1.1 一文定義

> BONSAI is a constitutional product allocation system — it decides what to build, what to defer, and what to kill, based on your product policy and customer evidence.

### 1.2 30 秒ピッチ（Seibel ルール）

> AI made building cheap. The hard part now is deciding what not to build.
> BONSAI doesn't replace your judgment. It makes your judgment explainable, evidence-based, and sharp enough to kill 9 out of 10.
> We turn raw evidence into build / defer / kill decisions, and only the survivors become execution packets.

### 1.3 ChatGPT との差分（F2 回答）

> ChatGPT answers once. BONSAI allocates continuously: constitution in, build/kill decisions out, with evidence you can trace.

---

## 2. Killer Question への準備回答

### F1: 「今日払う PM は？」
> まだいない。だからまず 1 人の PM に 1 週間使ってもらうことが最優先。設計はそのために削る。

### F2: 「ChatGPT と何が違う？」
> ChatGPT は聞かれたら答える。BONSAI は constitution という制約の下で、何を作らないかを先に決める。判断の再現性と追跡可能性が違う。

### F3: 「Constitution 書ける人は困ってないのでは？」
> 逆。Constitution を書ける founder ほど、それをチーム全体の判断基準として機能させる仕組みがない。書けることと、それでチームが動くことは別。

### F4: 「結局何を売っている？」
> PM チームが次に何を作るか決めるためのシステム。差別化は、何を作らないかの判断を constitution と evidence で追跡可能にしていること。

### F5: 「10プロダクト/0売上は founder の問題では？」
> When AI makes building 10x faster, evaluation becomes the bottleneck — just like App Store review couldn't keep up with submission volume. But Apple solved it by hiring more reviewers. Product judgment can't be solved by hiring. It has to be structured, externalized, and made repeatable. That's what BONSAI does.

### F6: 「H-11（LLMラッパー検証）が先では？」
> その通り。H-11 を Week 0 に前倒しした。GPT に直接聞いて同等の結果が出るなら、BONSAI のプロダクトとしての存在理由が消える。最初に検証する。

---

## 3. メッセージング原則

| 原則 | 説明 | NG 例 |
|---|---|---|
| **Judgment support, not replacement** | BONSAI は判断を置き換えない。判断を支援する | 「AI が何を作るか決めます」 |
| **Constitution-first** | 判断基準の外在化が差別化の核 | Constitution に触れずに機能だけ説明する |
| **Evidence-based** | 全判定に evidence trace がある | 「AI が考えました」で終わる |
| **Kill > Build** | 「何を作らないか」が先 | 「最適な機能を提案します」 |
| **Allocation, not generation** | BONSAI は allocation system。generation は downstream | 「AI が自動でプロダクトを作ります」 |

---

## 4. Demo メッセージング

### 4.1 Demo で見せること

| # | 証明すること | 対応する画面 |
|---|---|---|
| 1 | Constitution を入れると判断が構造化される | Constitution Editor → Parse 結果 |
| 2 | Evidence と constitution から build/kill が決まる | Build Next Board + Kill Board |
| 3 | Constitution を変えると判定が変わる | Constitution 書き換え → 再実行 → 判定変化 |
| 4 | 判定の根拠を evidence まで辿れる | Evidence Drill-down |
| 5 | Build 候補は execution packet まで落とせる | Execution Packet 画面 |

### 4.2 Demo で見せないこと（speech で触れない）

- 判断委譲ラダー
- Trust Harness
- Exposure Allocation
- Release / Submission Gate
- Rork 連携
- CRM integration
- 評価疲れの将来問題

### 4.3 Demo 時の禁句

- 「完全に自動化します」— human approval required が BONSAI のポジション
- 「AI が最適解を出します」— constitution-based allocation であり optimization ではない
- 「全ての PM に使えます」— 初期ターゲットは growth-stage PM team (3-10名)

---

## 5. 内部用語の対外説明マッピング

| 内部用語 | 対外説明 |
|---|---|
| Constitution | Product policy — who you are, what you never do, what you value |
| Clause | Evaluable rule derived from your policy |
| Observation | Customer evidence — interviews, usage data, support tickets |
| Theme | Clustered pattern from evidence |
| Allocation | Build / defer / kill decision with reasons |
| Execution Packet | Implementation spec ready for coding agents |
| Pre-mortem | Risk analysis — how this decision could fail |
| Virtual Staff | Adversarial review — stress-testing your decisions |
