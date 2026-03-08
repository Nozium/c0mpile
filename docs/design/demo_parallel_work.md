# Demo Parallel Work

Source: `docs/design/speech.md`, `data/demo/*`

## 前提

現時点の demo data は以下で揃っている。

- constitutions: 2
- observations: 50
- themes: 7
- proposals: 7
- execution packets: 2

この量なら、`docs/design/speech.md` の 90 秒デモを成立させるには十分。  
先に必要なのは追加収集ではなく、`何を見せるかを固定すること`。

## 結論

人が並行して進めるべき作業は、`データを増やすこと` より `デモの意思決定を固定すること` である。

最優先は次の 4 つ。

1. Constitution A / B の最終文言を確定する
2. A / B で判定が変わる候補を 1 件固定する
3. 90 秒の画面遷移を固定する
4. ダミーデータ前提での説明文と想定問答を固める

## 人が並行してやるべきこと

### 1. Demo Script Lock

目的: 実装が迷わないように、90 秒の見せ順を固定する。

決めること:

- どの順番で画面を出すか
- どの proposal を Build と Kill の代表にするか
- Constitution B でどの card の判定を変えるか
- Execution Packet はどちらを見せるか

推奨シーケンス:

1. Constitution A を表示
2. Build Next Board で `prop-001` を見せる
3. Kill Board で `prop-003` を見せる
4. Constitution B に切り替えて、同一候補の判定差分を見せる
5. Execution Packet は `ep-002` か `ep-001` を 1 件だけ見せる

備考:

- `speech.md` は `build / continue` 表記が残っている
- `data/demo/proposals.json` は `build / defer / kill`
- デモ前に用語はどちらかに統一した方がよい

### 2. Constitution A/B Freeze

目的: demo の核心である `constitution が判断関数になる` を安定させる。

人が決めること:

- Constitution A を何の会社として見せるか
- Constitution B を何の会社として見せるか
- 2つの違いを 1 文でどう説明するか

最低限必要な確認:

- A と B の差が十分に大きいこと
- 同じ theme / proposal に対して decision が変わること
- 変化理由を 1 文で説明できること

推奨:

- A: privacy-first / focus / offline-first
- B: growth-first / collaboration / analytics-first

### 3. Hero Cards Selection

目的: 7 proposals 全部を見せず、90 秒で意味が通る代表例だけに絞る。

人が固定すべき候補:

- Build 代表: `prop-001` Offline-First Data Vault
- Kill 代表: `prop-003` Social Activity Feed
- Defer 代表: `prop-006` Real-Time Team Collaboration Board
- Differentiation 代表: `prop-002` Evidence-Based Kill Reasoning Engine

判断基準:

- 題名だけで意味が通る
- violated clause が説明しやすい
- speech の主張と矛盾しない

### 4. Messaging / Q&A

目的: dummy data や AI judge への反発でデモが崩れないようにする。

人が用意すべき短い回答:

- ダミーデータですか?
  - `Yes. The data is sample data. The mechanism we are proving is that constitution changes the decision.`
- ChatGPT と何が違う?
  - `ChatGPT answers once. BONSAI applies a reusable constitution to evidence and shows what to kill, with reasons.`
- AI が判断するの?
  - `No. It doesn't replace judgment. It makes judgment explainable and repeatable.`
- なぜ今必要?
  - `AI made building cheap. The bottleneck moved to deciding what not to build.`

### 5. Demo Recording Prep

目的: 実装が間に合っても録画で失敗しないようにする。

人が進めること:

- 90 秒版 script の読み合わせ
- 画面遷移のタイムボックス確認
- 録画担当の固定
- fallback 用の録画版 walkthrough の準備

最低限必要:

- 1 take で通す練習
- Constitution 切り替え位置の確認
- Execution Packet を見せる秒数の固定

### 6. Environment / Ops Setup

目的: 実装側が止まらないように外部依存だけ先に通す。

人がやること:

- `ANTHROPIC_API_KEY` の準備
- Cloudflare Pages / Preview 環境の作成
- 環境変数の登録
- demo URL の共有方法を決める

これはデータ整備より先に終わらせてよい。

## 人が今やらなくてよいこと

以下は demo の blocker ではない。

- CrustData 連携
- X / App Store / ProductHunt の本物データ収集
- Actor enrichment の自動化
- Rork 連携
- CRM integration
- live scraping
- 完全な trust harness

## 実装と並行して進めると良い軽作業

重くないが、早めに決めると後戻りが減る。

- `data/demo` を split files のまま使うか、`/public/data/dataset.json` に bundle するか
- dummy data と言うか sample data と言うか
- proposal title を pitch 向けに少し整えるか
- `Execution Packet` を live 生成に見せるか、pre-computed と明示するか

推奨:

- data は split のまま管理し、build 時に bundle
- 表現は `sample data`
- Execution Packet は pre-computed と割り切る

## ブロッカー順

### P0

- Constitution A / B の確定
- 判定差分を見せる proposal 1 件の固定
- 90 秒の画面遷移固定
- API key / deploy 環境

### P1

- Hero cards の確定
- 想定問答の固定
- fallback 録画準備

### P2

- 本物データへの差し替え
- enrichment
- demo 後の pilot 用データ整備

## 最短の並行進行案

### 人

- Constitution A / B を 15 分で fix
- 代表 proposal を 10 分で fix
- Q&A を 15 分で fix
- 90 秒 script を 1 回通す

### 実装

- `data/demo` を loader につなぐ
- Constitution parse を live にする
- A/B 切り替えで Step 3 だけ再実行する
- Build / Kill / Packet 画面を speech の順番でつなぐ

## 一言でいうと

人が今やるべき仕事は `データ集め` ではなく、`どの constitution とどの card で勝つかを決めること`。
