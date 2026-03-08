---
Title: YC Virtual Staff Review — BONSAI v0.2
Target: docs/design/bonsai.md, docs/design/bonsai_claude.md, docs/design/bonsai_codex.md, docs/design/bonsai_mvp.md, docs/design/hypothesis-brief.md
Status: Review v0.2
Date: 2026-03-08
---

# YC Virtual Staff Review — BONSAI

## 0. レビュー対象

本レビューは `docs/design/bonsai.md` の最新更新（5.3, 6.6-6.9）および `bonsai_claude.md`, `bonsai_codex.md` の全体を対象とする。

特に以下の追加点を重点的に評価する:

- **5.3**: ハッカソンでの示唆 — 判断委譲は拒否ではなく条件未定義
- **6.6**: 判断委譲ラダー（observe → auto-act）
- **6.7**: Trust Harness の first-class 化
- **6.8**: 「なぜ大事か」と daily cycle 更新の入力
- **6.9**: Exposure Allocation

---

## 1. 評価フレームワーク

### 審査員構成

| 審査員モデル | 評価軸 | 性格 |
|---|---|---|
| **Michael Seibel** | Clarity, Speed, User obsession | 30秒で説明できないなら理解していない |
| **Dalton Caldwell** | Market reality, Competition, Tarpit detection | 金を払う人が見えなければ全て仮説 |
| **Gustaf Alströmer** | Growth, PMF signals, Go-to-market | 最初の10社をどう獲るかが全て |
| **Paul Graham** | Founder insight, Contrarian truth | 何を知っているか。なぜあなたか |

---

## 2. 前回レビューからの進化評価

### 2.1 進化した点

| 変更 | 評価 | 理由 |
|---|---|---|
| 「判断を預けたくない」→ 委譲条件未定義 | **強い改善** | coder のLLMコード受容プロセスとの類推は説得力がある。市場のどこにいるかの理解が深まっている |
| 判断委譲ラダー（6段階） | **概念は正しい** | ただし実装スコープが膨らむリスクあり |
| Trust Harness の明示化 | **良い方向** | 「AI が決める」→「人が条件付きで委譲する」への再定義は、go-to-market で刺さりやすい |
| daily cycle / stress reduction | **着眼は良い** | ただし入力項目の追加は adoption barrier を上げる |
| Exposure Allocation | **時期尚早** | MVP スコープから明確に外すべき |

### 2.2 残る根本課題

前回指摘の以下は**未解決**:

1. **動くプロダクトがない** — 設計文書の密度は上がったが、プロダクトは 0
2. **paying user の evidence がない** — ハッカソン聞き取りはあるが、金を払う意志の確認はない
3. **LLM ラッパー問題** — なぜ ChatGPT/Claude に直接聞くのではダメかの回答が弱い

---

## 3. 新規追加点への深掘りレビュー

### 3.1 判断委譲ラダー（6.6）

#### Seibel 視点: "Which rung do you ship first?"

**質問**:
> 6段階のラダーを全部作るつもりか？MVP で ship するのはどの段階までか？

**指摘**:
- observe → summarize → rank → explain → recommend → auto-act は概念としては正しい
- しかし**6段階は製品設計としては多すぎる**
- MVP は `summarize + rank + explain` の3段階で十分
- `observe` は入力、`recommend` は出力ラベル、`auto-act` は post-MVP
- 6段階を全部見せると、ユーザーは「どこから始めればいいかわからない」

**致命度**: `important` — コンセプトは正しいが、スコープ肥大のリスク

#### Caldwell 視点: "Is this a feature or a product?"

**質問**:
> 判断委譲ラダーは BONSAI のコア価値なのか、それとも設定画面の一項目なのか？もしコア価値なら、なぜこれが独立プロダクトでないのか？

**指摘**:
- 「AI への判断委譲を段階的に設計する」という問題は、BONSAI 固有ではなく **全ての AI ツールに共通する**
- これがコアなら、BONSAI は「PM ツール」ではなく「AI 委譲フレームワーク」になる
- ポジショニングがさらにブレるリスク

**致命度**: `critical` — アイデンティティ問題。BONSAI は何のプロダクトなのか

#### 推奨アクション:
- MVP では委譲ラダーを **暗黙的に** 実装する（UIに段階選択は出さない）
- 初期状態は `explain` まで自動、`recommend` はオプトイン
- ラダーの概念は内部設計として保持し、外に見せるのは post-MVP

---

### 3.2 Trust Harness（6.7）

#### PG 視点: "What do you know that others don't?"

**質問**:
> Trust Harness という概念は、coder の LLM コード受容から来ている。あなたはコードの世界でこの過程を見たから、PM の世界でも同じだと言っている。その類推はどこまで正しいか？

**指摘**:
- coder と PM の判断委譲には**構造的な違い**がある:

| | coder の LLM コード受容 | PM の AI 判断受容 |
|---|---|---|
| 検証手段 | テスト、lint、CI が自動検証する | **検証手段が存在しない** |
| 失敗の可視性 | バグは crash / test failure で即わかる | 判断ミスは**数ヶ月後にしかわからない** |
| ロールバック | git revert で戻せる | kill した案は**復活コストが高い** |
| 心理的安全性 | 「テストが通ったから OK」と言える | 「AI がそう言ったから」は**言い訳として通りにくい** |

- つまり、PM の判断委譲は coder より**はるかに難しい**
- Trust Harness が本当に機能するには、**判断の検証ループ**が必要
- 現状の設計に「BONSAI の判断が正しかったか事後検証する仕組み」がない

**致命度**: `critical` — 類推は魅力的だが、PM 側には coder が持つ safety net（テスト）に相当するものがない

**質問の追加**:
> BONSAI が「kill」と判断した案が実は正しかった場合、それをどうやって検知するか？判断の事後検証ループはどこにあるか？

#### 推奨アクション:
- `decision_log` に事後検証フィールドを追加（6ヶ月後レビュー）
- kill した案の「その後どうなったか」を追跡する仕組みを将来設計に入れる
- ただし MVP では不要。MVP は「判断を出す」までで十分

---

### 3.3 「なぜ大事か」と daily cycle（6.8）

#### Gustaf 視点: "Does this help you get your first 10 customers?"

**質問**:
> interview の入力項目に「daily cycle をどう更新するか」「どの stress を減らすか」を追加すると、ユーザーの入力負荷が上がる。最初の 10 社は、この追加項目のせいで onboarding を完了しないのでは？

**指摘**:
- 入力項目の追加は**正しい方向**だが、**adoption とトレードオフ**
- PM は忙しい。「We are / We never / We value」の 3 行入力ですら面倒な人がいる
- さらに daily cycle / stress reduction まで聞くと、**セラピスト感**が出る
- 初期ユーザーが求めているのは「答え」であって「深い問い」ではない

**致命度**: `important` — 正しいが、タイミングが早い

#### Seibel 視点: "What's the minimum input for maximum output?"

**質問**:
> BONSAI に必要な最小入力は何か？Constitution 3行 + データ CSV 1個で動くなら、それが MVP の入力。daily cycle まで聞くのは、ユーザーが BONSAI を好きになった後でいい。

**致命度**: `probe` — MVP では不要だが、v2 の差別化ポイントにはなりうる

#### 推奨アクション:
- MVP の入力は `Constitution 3行 + Observation CSV` のみ
- daily cycle / stress reduction は **BONSAI が推論して提示する**（ユーザーに聞かない）
- 「あなたのユーザーの daily cycle はこう変わると予測します」を output に入れる方が強い

---

### 3.4 Exposure Allocation（6.9）

#### Caldwell 視点: "You're solving a problem that doesn't exist yet"

**質問**:
> 「評価の津波」は本当に今起きているのか？AI プロダクトが大量にフィードバックを取りにいく世界は来るかもしれないが、今日の PM の pain はそこではない。今日の pain は「フィードバックが足りない」方ではないか？

**指摘**:
- Exposure Allocation は**知的には面白い**が、**顧客の今の問題ではない**
- YC が最も嫌うパターン: 「将来起こるかもしれない問題を先回りして解く」
- 今のユーザーは「もっと多くのフィードバックが欲しい」のであって「フィードバック依頼を制限したい」ではない

**致命度**: `probe` — 将来ビジョンとしては有効。MVP には絶対入れない

#### 推奨アクション:
- 設計文書に残すのは良い（将来の拡張方向として）
- MVP スコープの `Cut` リストに明示的に追加する
- ピッチでは触れない

---

## 4. BONSAI 全体への Killer Questions（更新版）

### Tier 1: Fatal（答えられなければ案が成立しない）

| # | 質問 | 背景 | 未回答リスク |
|---|---|---|---|
| F1 | **今日このプロダクトに月 $100 払う PM を 3 人名前で挙げられるか？** | 需要の実在証明 | 全てが仮説のまま |
| F2 | **ChatGPT に「うちの constitution はこれ、データはこれ、何を kill すべき？」と聞くのと何が違うか？** | LLM ラッパー問題 | defensibility なし |
| F3 | **Brand Constitution を書ける PM は、そもそも良い判断をしている人では？本当に困っている PM は constitution を書けないのでは？** | ターゲット矛盾 | TAM が消える |
| F4 | **判断委譲ラダーを入れたことで、BONSAI は PM ツールなのか、AI ガバナンスフレームワークなのか？結局何を売っているのか？** | アイデンティティ問題 | ポジショニング崩壊 |

### Tier 2: Critical（回答次第で build/kill が変わる）

| # | 質問 | 背景 |
|---|---|---|
| C1 | **BONSAI が kill と判断した案が正しかった場合、どう検知するか？事後検証ループはあるか？** | trust harness の完全性 |
| C2 | **coder の LLM 受容類推を PM に適用しているが、PM には「テスト」に相当する検証手段がない。この構造差をどう埋めるか？** | 類推の限界 |
| C3 | **「observe → recommend」の委譲ラダーは全ての AI ツールに共通する問題。なぜ BONSAI 固有のプロダクトとして成立するのか？** | 汎用性の罠 |
| C4 | **Productboard が来月「constitution-based filtering」を追加したら、何が残るか？** | 防御性 |
| C5 | **入力項目が増えている（constitution + observation + interview + usage + daily cycle + stress）。onboarding 完了率はどうなるか？** | adoption barrier |

### Tier 3: Important（改善が必要だが致命的ではない）

| # | 質問 | 背景 |
|---|---|---|
| I1 | **Trust Harness の 8 項目（constitution, clause priority, evidence trace, decision log, pre-mortem, release gate, submission gate, operator override）は MVP で全部要るか？** | スコープ管理 |
| I2 | **daily cycle / stress reduction を入力として聞くより、BONSAI が推論して提示する方が UX として強いのでは？** | 入力 vs 出力の設計 |
| I3 | **exposure allocation は今日の問題か、5 年後の問題か？** | タイミング |
| I4 | **6 段階ラダーの各段階で、ユーザーに見せる UI はどう変わるか？** | 実装の具体性 |
| I5 | **kill 判定が間違っていたとき、誰が責任を取るのか？PM か AI か？** | 責任所在 |

### Tier 4: Probe（思考を深めるための探索的質問）

| # | 質問 |
|---|---|
| P1 | この委譲ラダーの概念を 1 社に売れたら、それは PM ツールとして売れたのか、コンサルティングとして売れたのか？ |
| P2 | Trust Harness は「人が AI を信頼するための仕組み」だが、逆に「AI が人の判断を信頼しない」ケースをどう扱うか？constitution に反する判断を人がしたとき、BONSAI は何を出すか？ |
| P3 | BONSAI 自身に委譲ラダーを適用するなら、今のチームは BONSAI をどの段階まで信頼しているか？ |
| P4 | 「なぜ大事か」を聞くことで得られるデータは、BONSAI の allocation 精度をどれだけ上げるか？定量的に見積もれるか？ |

---

## 5. 判断委譲ラダーへの構造的批判

### 5.1 ラダーは正しいが、プロダクトに見えない

判断委譲ラダー（observe → auto-act）は **AI adoption の一般理論**としては正しい。
しかし、プロダクト機能としては以下の問題がある:

1. **ユーザーに見せるべきか？**
   - ラダーを UI に出すと「設定画面の項目」になる
   - ユーザーは「委譲レベルを選ぶ」体験を求めていない
   - 求めているのは「使っているうちに自然に信頼が上がる」体験

2. **暗黙的に実装すべきか？**
   - 初回は `explain` まで自動、`recommend` は「提案」として表示
   - ユーザーが recommend を 10 回連続で accept したら、「自動適用しますか？」と聞く
   - これなら ラダーはシステムの内部ロジックであり、UX ではない

3. **pricing に影響するか？**
   - 上位の委譲レベル（recommend, auto-act）を有料プランにする可能性
   - ただしこれは「AI の判断を trust する権利に課金する」という微妙な構造

### 5.2 推奨: ラダーは内部概念として保持、外には出さない

MVP では:
- デフォルトで `summarize + rank + explain` を実行
- `recommend`（build/kill 判定）は常に表示するが「提案」ラベル付き
- ユーザーが判定を override できるボタンを常に表示
- 委譲レベルの明示的選択 UI は作らない

---

## 6. 総合評価（更新版）

### 6.1 軸別評価

| 軸 | 前回 | 今回 | 変化理由 |
|---|---|---|---|
| Problem | B+ | **A-** | 「委譲条件未定義」の洞察で問題理解が深まった |
| Solution | A- | **B+** | 委譲ラダー/exposure allocation の追加でスコープ肥大リスク ↑ |
| Market | B | **B** | 変化なし。paying user の evidence がまだない |
| Competition | B+ | **B+** | 変化なし |
| Traction | C | **C+** | ハッカソン聞き取りが追加されたが、まだ弱い |
| Why Now | A- | **A-** | 変化なし |

### 6.2 最大の前進

**「AI が判断を置き換える」から「人が条件付きで委譲する」への再定義。**

これは go-to-market で大きな差を生む。PM に売るとき:
- 旧: 「AI が次に何を作るか決めます」→ 抵抗される
- 新: 「AI が証拠を整理して、あなたが判断するための harness を提供します」→ 受け入れやすい

coder のLLMコード受容との類推は**ピッチで使える**レベルに仕上がっている。

### 6.3 最大のリスク

**スコープクリープ。**

bonsai.md の改善提案は v0.1 → v0.2 で以下が追加された:
- 判断委譲ラダー 6 段階
- Trust Harness 8 項目
- daily cycle / stress reduction 入力
- exposure allocation

これらは全て「正しい」が、全て「MVP に入れるべきではない」。

設計文書の密度が上がるほど、**実装が遠のく**。
YC が見たいのは「賢い設計書」ではなく「雑でも動くもの」。

### 6.4 最終判定

> **"The insight about delegation conditions is genuine and sharp. But you're building a PhD thesis, not a product. Ship the simplest version that one PM uses every morning. Then we'll talk about trust harnesses and exposure allocation."**

---

## 7. 次にやるべきこと（優先順）

| # | Action | 理由 | 期限感 |
|---|---|---|---|
| 1 | **動くプロダクトを出す** | 設計は十分。足りないのはコード | 最優先 |
| 2 | **F1 に答える**: 月 $100 払う PM を 3 人見つける | 需要検証なしに進むのは危険 | 実装と並行 |
| 3 | **F2 に答える**: ChatGPT との差分を 1 文で言い切る | ピッチで必ず聞かれる | ピッチ前 |
| 4 | **6.6-6.9 を MVP Cut に移す** | 正しいが今ではない | 即時 |
| 5 | **F3 に答える**: constitution を書けない PM が使えるフローを設計する | TAM 問題 | v2 |

---

## 8. 推奨する 1 文回答の準備

YC 面接で聞かれた場合の回答テンプレート:

### F1: 「今日払う PM は？」
> "まだいない。だからまず 1 人の PM に 1 週間使ってもらうことが最優先。設計はそのために削る。"

### F2: 「ChatGPT と何が違う？」
> "ChatGPT は聞かれたら答える。BONSAI は constitution という制約の下で、何を作らないかを先に決める。判断の再現性と追跡可能性が違う。"

### F3: 「constitution 書ける人は困ってないのでは？」
> "逆。constitution を書ける founder ほど、それをチーム全体の判断基準として機能させる仕組みがない。書けることと、それでチームが動くことは別。"

### F4: 「結局何を売っている？」
> "PM チームが次に何を作るか決めるためのシステム。差別化は、何を作らないかの判断を constitution と evidence で追跡可能にしていること。"

---

## Part 2: bonsai_mvp.md + hypothesis-brief.md レビュー

### レビュー日: 2026-03-08
### 対象バージョン: bonsai_mvp.md Draft v0.1, hypothesis-brief.md Draft v0.1

---

## 9. MVP ドキュメントの評価

### 9.1 前回レビューからの最大の変化

前回のレビューで指摘した最大のリスクは「スコープクリープ」と「動くものがない」だった。

bonsai_mvp.md はこの両方に**正面から対応している**:

| 前回の指摘 | MVP での対応 | 評価 |
|---|---|---|
| スコープクリープ | 6.6-6.9 を明示的に Cut | **解決** |
| 動くものがない | Demo ストーリーと実装優先順位を明示 | **方向性は解決、実行は未着手** |
| ChatGPT との差分 | 1文回答を準備 | **改善** |
| over-engineering | 3ステップ版を許容 | **改善** |
| ターゲット矛盾 | Constitution を書ける founder ≠ 判断に困る PM の分離 | **未解決（hypothesis-brief に委譲）** |

### 9.2 MVP ドキュメントの強み

#### 1. スコープが削れている

Section 6 「MVP で入れないもの」が明快。前回 bonsai.md で追加された 6.6-6.9 が全て Cut されている。これは正しい判断。

#### 2. Demo の設計が戦略的

Demo で見せるものと見せないものの区分が明確。特に:
- Live でやるのは Constitution の反映だけ（9.2）
- Pre-computed を許容する（9.1）
- Rork は必須にしない（9.3）

これは「完成した製品」ではなく「mechanism の証明」としてデモを定義しており、ハッカソン/YC面接に適している。

#### 3. メッセージングが固まった

Section 8.4 の3文が良い:
> "AI made building cheap. The hard part now is deciding what not to build."
> "BONSAI does not replace PM judgment."
> "We turn raw evidence into build / defer / kill decisions, and only the survivors become execution packets."

これは30秒ピッチとして機能する。

---

## 10. hypothesis-brief.md の評価

### 10.1 全体評価: A-

**これは BONSAI のドキュメント群の中で最も強い文書。**

理由:
- 仮説が検証可能な形で書かれている
- Kill Trigger が全仮説に明示されている
- 検証ロードマップが時系列で整理されている
- YC の質問に対する回答準備がある
- Founder Evidence（10プロダクト/0売上）が組み込まれている

### 10.2 Founder Evidence が最大の武器

> "I shipped 10 products in February with AI. Revenue: zero. Conversations with customers: zero."

**これは YC 面接で最も強い1文。**

| 評価者 | 反応予測 |
|---|---|
| Seibel | "Good. You know the problem because you ARE the problem. Now show me the product." |
| Caldwell | "10 products and 0 revenue is a strong signal. But is your pain representative, or are you an outlier?" |
| Gustaf | "OK, so you need this. But do other founders with your exact profile also need it? How many are there?" |
| PG | "The best founders build what they need. But the risk is building for yourself and no one else." |

---

## 11. MVP + Hypothesis への Critical Questions（新規）

### Tier 1: Fatal

| # | 質問 | 背景 |
|---|---|---|
| F5 | **「10プロダクト/0売上」は founder の実行能力の問題であって、判断ツールの欠如の問題ではないのでは？** | Founder Evidence の代替解釈。「顧客と話さなかった」のは判断ツールがなかったからではなく、話す前に次を作り始めたから。ツールがあっても行動は変わらないのでは？ |
| F6 | **H-1 と H-4 が通っても、H-11（LLMラッパー）が通らなければ全て崩れる。検証順序が間違っていないか？** | H-11 は Week 4-8 に置かれているが、「GPT に聞けばいい」が成立するなら H-1 / H-4 の検証自体が無意味。H-11 を Week 0 に前倒すべき |

#### F5 への Founder 回答と再評価

**Founder 回答**:
> その可能性はある。ただし、評価・改善サイクルが高速化された結果、デリバリまでの審査・評価プロセス自体がボトルネックになる現象は、App Store の審査ですでに起きている。プロダクトの更新速度が審査速度を超えると、審査プロセスが律速になる。

**再評価**: この反論は F5 を **fatal → critical に格下げ** する。理由:

1. **先行事例がある**: App Store 審査のボトルネック化は実在する現象。Apple は審査速度を上げることで対応したが、プロダクト判断の審査（何を作るべきか）には同じ解法が使えない
2. **構造的な主張に変わる**: 「自分の実行能力の問題」→「生産速度が評価速度を超えたときに構造的に発生する問題」。これは個人の行動パターンではなく、AI coding tools 普及の帰結
3. **ピッチで使える**: "This already happened to App Store review. When build speed exceeds evaluation speed, the evaluation process becomes the bottleneck. BONSAI is the evaluation layer for product decisions."

**残るリスク**: 「App Store 審査のボトルネック」と「PM の判断ボトルネック」は構造は似ているが、以下が違う:

| | App Store 審査 | PM の判断 |
|---|---|---|
| 審査基準 | 明文化されている（ガイドライン） | 暗黙知が多い |
| 審査者 | Apple の専門チーム | PM/founder 自身 |
| 解法 | 審査を速くする | **判断を構造化する（← BONSAI の位置）** |

つまり BONSAI の正しいポジションは「審査を速くする」ではなく「審査基準（constitution）を外在化して、判断を構造化・並列化可能にする」。この言い方なら F5 は完全に返せる。

**推奨ピッチ文**:
> "When AI makes building 10x faster, evaluation becomes the bottleneck — just like App Store review couldn't keep up with submission volume. But Apple solved it by hiring more reviewers. Product judgment can't be solved by hiring. It has to be structured, externalized, and made repeatable. That's what BONSAI does."

#### F6 への対応

**決定**: H-11（LLMラッパー検証）を **Week 4-8 → Week 0-1 に前倒し**。

**理由**: GPT/Claude に直接聞いて同等の結果が出るなら、BONSAI のプロダクトとしての存在理由が消える。H-1/H-4 より先に、または同時に検証すべき。

**前倒し後の検証方法**:
1. MVP 3ステップ版を実装する前に、同じ constitution + observation データで以下を比較:
   - A: ChatGPT に自由に質問
   - B: Claude にワンショットの構造化プロンプトで質問
   - C: BONSAI pipeline（最小構成でもよい）
2. 自分自身がまず blind 評価する（n=1 だが即日実行可能）
3. 差がなければ、**BONSAI の差別化を「単発回答 vs 継続的 workflow」に即座に移す**

**検証ロードマップ修正**:
```
Week 0-2 (修正後):
  ├── H-11: LLMラッパー検証 ← Week 0 に前倒し。最初にやる
  ├── H-1 + H-2b + H-15: PM インタビュー統合版 (15-20名)
  ├── H-2:  LP A/B テスト
  ├── H-4 + H-10: Constitution テスト (インタビュー対象から5名)
  └── H-13: 即決 → 3ステップで ship
```

### Tier 2: Critical

| # | 質問 | 背景 |
|---|---|---|
| C6 | **H-4 の成功基準「80%一致」は甘くないか？Constitution の解釈が 20% ズレたら、kill/build の判定は 20% 以上ズレる（誤差が増幅する）** | upstream の 20% エラーが downstream で拡大する構造。80% は十分か？ |
| C7 | **H-3 の Growth team（PM 3-10名、候補20-50件）は何社あるか？TAM を計算したか？** | セグメントは定義されたが、規模が不明。全世界で1000社なのか10万社なのかで戦略が変わる |
| C8 | **Demo の「Pre-computed を許容する」は、Live でやるべき部分が Constitution 反映だけで本当にインパクトがあるか？** | Constitution を変えると結果が変わる、は概念として理解できるが、pre-computed data 上での変化はデモとして弱い可能性 |
| C9 | **H-13 で「3ステップ版で十分」と出た場合、BONSAI の技術的 moat は何になるか？3ステップなら本当に GPT で再現できるのでは？** | 3ステップへの簡素化と H-11（LLMラッパー問題）が衝突する。シンプルにするほど GPT との差が消える |
| C10 | **Founder Evidence は n=1。しかもその1人は創業者自身。これは evidence か、それとも confirmation bias か？** | 自分の pain を汎化するリスク。「自分が困っている」≠「市場が困っている」 |

### Tier 3: Important

| # | 質問 | 背景 |
|---|---|---|
| I6 | **H-5 の少数データ有効性（60件で theme clustering）は、LLM の能力が上がれば誰でもできる。これは BONSAI 固有の強みか？** | LLM の汎用能力に依存した機能は moat にならない |
| I7 | **Execution Packet（H-6）が「PRD の下書き」に格下げされた場合、RFS #1 の "coding agent 向けに開発作業を分解する" 要件を満たさなくなる。RFS との整合性は？** | salvage path が RFS 要件放棄を意味する |
| I8 | **Kill Trigger の設定が「全仮説で均等に厳しい」ように見えるが、実際には H-1 の Kill Trigger（25%以下）は甘すぎないか？75% が判断負荷を感じていないのに Go するのか？** | 60% 成功基準 vs 25% Kill Trigger の間のグレーゾーンが広い |
| I9 | **検証ロードマップの Week 0-2 に 7 仮説が詰まっている。2 週間で本当に全部やるのか？** | 検証計画の実行可能性 |

### Tier 4: Probe

| # | 質問 |
|---|---|
| P5 | H-15（Evaluation Fatigue）は「将来の問題」として Cut されたが、これこそが BONSAI の次のプロダクトになる可能性はないか？ |
| P6 | 「10プロダクト/0売上」の体験を持つ founder は、BONSAI を使っても結局「作ることが楽しいから作る」のではないか？ツールは行動を変えるか？ |
| P7 | H-10（ターゲット矛盾）の salvage が「対話型で引き出す」だが、それは BONSAI のコア体験を根本から変える。Constitution 3行入力を捨てられるか？ |

---

## 12. 構造的な矛盾の指摘

### 12.1 簡素化のジレンマ

bonsai_mvp.md と hypothesis-brief.md は、互いに正しいが、組み合わせると矛盾が生じる:

```
bonsai_mvp.md:    "3ステップで十分。シンプルに ship せよ"
hypothesis-brief: "GPT との差別化が必要。再現性と蓄積が moat"
```

**問題**: 3ステップにするほど GPT で再現しやすくなる。しかし複雑にするほど ship が遅れる。

**これが BONSAI の最も根本的なジレンマ。**

#### 解法の候補

| 解法 | 説明 | リスク |
|---|---|---|
| A: 3ステップで ship し、差別化は UX と workflow で出す | GPT は1回の回答。BONSAI は継続的に constitution × data × 判断履歴を蓄積する workflow | UX だけでは weak moat |
| B: 3ステップで ship し、蓄積データで差別化する | 初回は GPT と同等でも、使い続けるほど精度が上がる | 蓄積効果の証明に時間がかかる |
| C: Constitution の深さで差別化する | 3行入力は同じだが、内部の clause 解釈と kill reasoning の精度で勝つ | GPT も prompt engineering で追いつく |

**推奨**: A + B の組み合わせ。初回は GPT と同等でもよい。「毎回同じ constitution を渡し直す」手間が BONSAI にはない、という workflow advantage を先に売る。蓄積効果は後から証明。

### 12.2 Founder Evidence のダブルエッジ

"10 products, 0 revenue" は最大の武器だが、最大の弱点でもある:

- **武器**: burning pain の直接証明。「自分が困っている」は最も説得力がある
- **弱点**: n=1。しかも「顧客と話さなかった」のはツールの問題ではなく、founder の行動パターンの問題かもしれない

#### Caldwell が必ず聞く質問:
> "If you had BONSAI in February, would you have shipped 10 products or 1? Be honest."

#### 正しい回答:
> "Probably 3-4, not 1. BONSAI wouldn't have stopped me from building. But it would have told me which 7 to kill in week 1 instead of week 4. That's 3 weeks of attention saved per product."

#### 間違った回答:
> "I would have shipped 1 perfect product." — これは嘘に聞こえる

### 12.3 検証計画の過密

Week 0-2 に 7 仮説を詰めているが、これは**実行不可能に近い**:

- H-1: PM 20名インタビュー
- H-2: LP A/B テスト
- H-2b: 同上インタビュー追加質問
- H-4: Constitution 正規化テスト
- H-10: ターゲット矛盾テスト
- H-13: 3ステップ vs full pipeline 設計
- H-15: Evaluation Fatigue インタビュー

**現実的な Week 0-2**:
1. H-1 + H-2b + H-15 は同じインタビューで同時検証可能（統合すべき）
2. H-4 は MVP 実装と並行でテスト可能
3. H-2（LP A/B）は独立して実行可能
4. H-10 は H-4 のデータで検証可能
5. H-13 は設計判断であり、検証ではない（即決すべき）

**統合後の Week 0-2**:
- **Track A**: PM インタビュー 15-20名（H-1, H-2b, H-15 を統合。1人15分、5-7日で完了）
- **Track B**: LP A/B テスト（H-2。即日セットアップ、1週間計測）
- **Track C**: MVP 3ステップ版の実装開始（H-13 は「3ステップで ship」を即決）
- **Track D**: Constitution テスト（H-4, H-10。インタビュー対象から5名に追加10分）

---

## 13. 総合評価（v0.2 最終版）

### 13.1 軸別評価

| 軸 | v0.1 | v0.2 | 変化理由 |
|---|---|---|---|
| Problem | A- | **A** | Founder Evidence（10/0）が追加。自分が burning user |
| Solution | B+ | **B+** | MVP でスコープは削れたが、簡素化ジレンマは未解決 |
| Market | B | **B+** | セグメント定義（H-3）が追加。TAM は未計算 |
| Competition | B+ | **B+** | LLMラッパー問題の検証計画が追加されたが、未実行 |
| Founder-Market Fit | ? | **A** | "10 products, 0 revenue" で証明済み |
| Traction | C+ | **C+** | ハッカソン聞き取りのみ。プロダクトなし |
| Why Now | A- | **A-** | 変化なし |

### 13.2 最終判定

> **設計は A。検証計画は A-。実行は C。**
>
> ドキュメントの密度と思考の深さは、YC 応募レベルを超えている。
> しかし、ドキュメント群の合計が 2000 行を超えた時点で、1行のコードも書かれていない。
>
> **次の 48 時間でやるべきことは、ドキュメントを書くことではなく、3ステップ版の MVP を動かすこと。**

### 13.3 最も危険な 1 つの質問（更新版）

> **"You've written 2000 lines of design docs and 0 lines of code. When does the product exist?"**

---

## 14. 推奨アクション（更新版）

| # | Action | 期限 |
|---|---|---|
| 1 | **コードを書く。3ステップ MVP を 48 時間で動かす** | 最優先。今すぐ |
| 2 | H-13 を即決: 3ステップで ship | 即時 |
| 3 | H-1/H-2b/H-15 のインタビューを 1 本に統合し、15名に実施 | 1週間以内 |
| 4 | H-11（LLMラッパー検証）を Week 4-8 → Week 1-2 に前倒し | 即時判断 |
| 5 | 簡素化ジレンマの解法を 1 つ選ぶ（推奨: A+B） | MVP 完成前 |
