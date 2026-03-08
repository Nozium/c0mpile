---
Title: BONSAI MVP
Status: Draft v0.1
Date: 2026-03-08
Source: docs/design/bonsai_claude.md, docs/design/bonsai_codex.md, docs/design/bonsai.md, docs/design/hypothesis-brief.md, docs/design/yc_review.md
---

# BONSAI MVP

## 0. 結論

BONSAI の MVP は、`AI が最終判断を置き換えるプロダクト` ではない。

BONSAI の MVP は、
**PM / Founder が「何を作るか」「何を作らないか」を、constitution と evidence に基づいて配分するための allocation / judgment support system** である。

外向けの入口は `Cursor for Product Managers` を使う。
ただし内部的な定義は、`Constitutional Product Allocation System` とする。

## 1. MVP の一文定義

> BONSAI is a constitutional allocation system that helps product teams decide what to build next, what to defer, and what to kill, with explicit evidence and policy-based reasoning.

日本語:

> BONSAI は、プロダクトチームが「次に何を作るか」「何を保留するか」「何を殺すか」を、憲法的な方針と証拠に基づいて決めるための allocation system である。

## 2. 何を売るか

### 2.1 売るもの

- build / defer / kill の判断支援
- constitution に基づく判断基準の外在化
- evidence trace による説明可能性
- build 候補の execution packet 化

### 2.2 売らないもの

- AI が最終判断を完全自動で下すこと
- 何でも自動生成する prototyping platform
- AI 委譲フレームワークそのもの
- 評価疲れや exposure allocation を今すぐ解く汎用 OS

## 3. MVP で解く問題

MVP が解く問題は 2 つに絞る。

### P1. 候補が増えたが、何を kill すべきか説明付きで決められない

AI coding tools により build 候補は増えた。
しかし、どれを kill / defer / build すべきかを、チームで再現可能に説明する仕組みがない。

### P2. Build 判断を builder / coding agent に渡せる artifact へ落とせない

「良さそう」で終わるのではなく、
UI / data / workflow / task breakdown へ接続したい。

## 4. MVP の対象ユーザー

### Primary

- founder-led product team
- Head of Product
- PM 2-10 名規模のチーム
- 候補案件が増え、判断基準がばらつき始めているチーム

### Not Primary

- solo founder で候補が 3-5 件しかないケース
- enterprise governance 全体を先に欲しい組織
- AI に最終判断を丸投げしたい組織

## 5. MVP で入れるもの

### 5.1 Input

- `Constitution 3行`
  - `We are`
  - `We never`
  - `We value`
- `Observation CSV / JSON`
  - customer interviews
  - usage snapshot
  - support / CRM export
- `Candidate proposals`
  - MVP では manual seed でもよい

### 5.2 Core

- constitution parser
- observation normalization
- user state / theme inference
- allocation scoring
- build / defer / kill reasoning
- evidence trace
- execution packet generation

### 5.3 Output

- `Build Next Board`
- `Kill / Defer Board`
- evidence drill-down
- feature outline summary
- execution packet

## 6. MVP で入れないもの

以下は正しいが、MVP には入れない。

- 明示的な `判断委譲ラダー UI`
- `Trust Harness` の完全実装
- `daily cycle / stress reduction` の追加入力
- `exposure allocation`
- live scraping
- Rork への本格統合依存
- release gate / submission gate の完全運用
- CRM native integration
- observability dashboard の本格化
- people/company enrichment の自動 API 連携

## 7. MVP のプロダクト原則

### 7.1 Allocate first

MVP の価値は idea generation ではなく allocation にある。

### 7.2 Explain before automate

まず説明可能にする。
自動化は後ろ。

### 7.3 Build-next を前に、kill を差別化に使う

外向けには `What should we build next?` に答える。
差別化として `Why this should be killed / deferred` を見せる。

### 7.4 Constitution は軽く入力、重く効かせる

入力 UX は 3 行で軽くする。
内部評価は clause として重く使う。

## 8. Demo で通す部分

Demo は `全部を実装していること` を見せる場ではない。
**H-1 と H-4 が前に進むだけの mechanism を見せる場** と定義する。

### 8.1 Demo の目的

Demo で証明したいのはこの 3 点だけ。

1. `Constitution` を入れると、判断が変わる
2. `evidence` があるので、build / kill の理由を説明できる
3. build 判断を `Execution Packet` に落とせる

### 8.2 Demo で見せる画面

1. Constitution Input
2. Build Next Board
3. Kill / Defer Board
4. Evidence Drill-down
5. Execution Packet

### 8.3 Demo のストーリー

#### Step 1

judge / viewer に `We are / We never / We value` を入力してもらう。

#### Step 2

あらかじめ用意した observation dataset に対して、themes と candidate を表示する。

#### Step 3

build / defer / kill を並べて表示する。
ここで重要なのは、

- build 候補が 1-2 件
- kill / defer に明確な clause-based reason がある

こと。

#### Step 4

kill された候補を 1 件開き、

- violated clause
- evidence quote
- pre-mortem

を見せる。

#### Step 5

build 候補を 1 件開き、

- feature outline
- UI / data / workflow changes
- coding agent tasks

を含む execution packet を見せる。

### 8.4 Demo で通すべきメッセージ

Demo で通すメッセージは以下に固定する。

> AI made building cheap. The hard part now is deciding what not to build.

> BONSAI does not replace PM judgment. It makes product judgment explainable, repeatable, and allocatable under a constitution.

> We turn raw evidence into build / defer / kill decisions, and only the survivors become execution packets.

### 8.5 Demo であえて見せないもの

以下はデモで触れない。

- 委譲ラダー
- exposure allocation
- 評価疲れの将来問題
- Rork の深い連携
- release gate / submission gate
- enrichment / moat 議論

これらは正しいが、今見せると焦点がぼける。

## 9. Demo の実装ルール

### 9.1 Pre-computed を許容する

Demo では以下を pre-computed でよい。

- observation normalization
- state/theme clustering
- candidate seed

Live でやるのは最小限に絞る。

### 9.2 Live でやるのは Constitution の反映だけ

Live で見せるのは、

- constitution input
- clause normalization
- candidate の build / defer / kill の変化

までで十分。

### 9.3 Rork は必須にしない

Rork は demo actuator として補助的に使うことはできるが、
BONSAI の core demo には入れない。

理由:

- MVP の本体は allocation
- Rork を入れるとプロトタイプ生成に見える
- 失敗時の依存リスクが大きい

## 10. MVP の acceptance criteria

MVP は少なくとも以下を満たす。

### Product

- constitution 3 行を入力できる
- observation CSV / JSON を取り込める
- build / defer / kill を返せる
- 各判定に evidence と理由がある
- build 候補に feature outline がある
- build 候補に execution packet がある

### Demo

- 1 回の constitution 入力で結果が変わる
- kill 理由を clause と evidence で説明できる
- build 候補から execution packet を見せられる

### Messaging

- `AI judge replacement` と誤解されない
- `Cursor for PM` の文脈で理解できる
- `ChatGPT wrapper` との違いを 1 文で言える

## 11. ChatGPT との差分を 1 文で言う

> ChatGPT is an answer engine. BONSAI is an allocation system: it applies a reusable constitution to evidence, explains what to build or kill, and turns surviving decisions into execution packets.

## 12. YC / Hackathon 用の最終ピッチ位置づけ

### 外向け

`Cursor for Product Managers`

### 内部定義

`Constitutional Product Allocation System`

### 一番短い説明

> BONSAI helps product teams decide what to build next, what to defer, and what to kill, using constitution-based reasoning and evidence traces.

### 一番短い差別化

> The difference is not that it generates more ideas. The difference is that it explains what not to build.

## 13. 今やらないと決めること

この文書で、以下は `post-MVP` として確定する。

- trust harness の本格設計
- explicit delegation ladder
- exposure allocation
- release / submission gate の本格運用
- CRM native sync
- observability dashboard
- people/company enrichment automation

## 14. 実装優先順位

1. Constitution input
2. Observation import
3. Allocation engine
4. Build Next / Kill-Defer surfaces
5. Evidence drill-down
6. Execution packet
7. Coding agent export

## 15. 最終確定

BONSAI の MVP は、
**allocation system として確定する。**

ただし、売り方は `allocation OS` ではなく、
`Cursor for PM that makes build/kill decisions explainable and actionable`
に寄せる。

Demo で通すのは、
**Constitution -> Evidence -> Build / Kill -> Execution Packet**
の一本線だけでよい。
