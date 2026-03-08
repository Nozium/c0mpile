# BONSAI — Product Hypothesis Brief

> PdM向け仮説検証ドキュメント。このプロダクトが成立する/しない条件を、検証可能な仮説として整理する。
> YCombinator_review.md のパネル評価・First Principles レビューを反映済み。

---

## 0. このドキュメントの使い方

このドキュメントは5層で構成されている。

1. **前提仮説** — BONSAI が存在する理由。これが崩れたらピボットが必要
2. **価値仮説** — ユーザーが金を払う理由。これが崩れたら機能レベルの再設計が必要
3. **実行仮説** — 技術的に成立する条件。これが崩れたらアーキテクチャの変更が必要
4. **競合仮説** — 防御可能性の条件。これが崩れたら moat の再構築が必要
5. **構造的矛盾仮説** — プロダクト設計の内部矛盾。これが崩れたらコンセプト再設計が必要

各仮説には **検証方法**、**成功基準**、**Kill Trigger** (撤退条件) を明記する。
仮説は検証の緊急度順に並んでいる。

### YC審査の現状評価 (YCombinator_review.md より)

| 軸 | 評価 | 要約 |
|---|---|---|
| Problem | B+ | 命題は正しいが burning pain の証拠不足 |
| Solution | A- | 思想は強いが over-engineered |
| Market | B | 新カテゴリ。大きくなりうるが不確実 |
| Competition | B+ | 差別化は明確だが防御が弱い |
| Founder-Market Fit | ? | 文書からは判定不能 |
| Traction | C | 設計文書のみ。動くものがない |
| Why Now | A- | AI coding agents の普及でタイミングは良い |

**最も危険な1つの質問**: "Have you talked to PMs who are desperate for this? Not interested — desperate. Show me the evidence."

### Field Evidence: ハッカソン聞き取り (2026-03-08)

| 質問 | 回答傾向 | 仮説への影響 |
|---|---|---|
| 最終評価を AI に委ねていいか | **多くが NO** | H-1 修正: judgment replacement → judgment support |
| なぜそのプロダクトが誰かに大事か聞けているか | 聞けていない人が多い | pain 言語化の支援が価値になる |
| ユーザー評価の津波を考慮しているか | 未考慮 | **新ペイン: evaluation fatigue** |
| 自動開発できるか | おおよそ Yes | 自動開発は差別化にならない確認 |
| coding agent にポリシーを規定できるか | 考えられていない | constitution → agent policy の需要あり |

**重要な読み替え**:
- 「AIが決める」は拒絶される → 「AIが判断材料と境界条件を整え、最終判断は人が持つ」
- 自動開発の差別化なし → 作る前後の判断・体験設計・ブランド整合が本丸
- 評価疲れ → 「誰に何をどの頻度で見せるか」の制御が新しい価値

### Founder Evidence: 自分自身が burning pain の当事者である

2026年2月の1ヶ月間で **10プロダクト** を出荷した。AI coding tools により production は10x になった。

結果:

- **売れたプロダクト: 0**
- **顧客と話したプロダクト: 0**
- 10個のうち、どれに注力すべきかの判断が追いつかない
- どれを kill すべきかの基準が曖昧なまま、全部を「とりあえず続ける」状態になる
- 1つ1つの品質判断・市場適合性の検証に割ける attention が1/10になる
- 「作れるから作った」が「作るべきだから作った」を圧倒的に上回った

**10個作れて、0個売れた。** これが overproduction の実態。問題は build ability ではない。問題は「10個のうちどれを kill し、残りの1-2個にどう集中するか」の判断が存在しないこと。

**これは仮説ではなく、創業者自身の直接体験である。** BONSAI は「月10プロダクトを出荷できるが、どれに集中すべきかわからない人間」のために生まれた。

> PG的質問への回答: "I shipped 10 products in February with AI. Revenue: zero. Conversations with customers: zero. I can build anything now. The problem is I couldn't decide which 9 to kill and which 1 to talk to people about."

この体験が示すのは、overproduction テーゼが理論ではなく **今日すでに起きている現実** だということ。そして BONSAI が必要な理由は、自分自身が最も切実に感じている。

---

## 1. 前提仮説 (Market Thesis)

### H-1: 判断のボトルネック仮説

> AI coding tools の普及により、プロダクト開発のボトルネックは「どう作るか」から「何を作るか / 何を作らないか」の判断に移行する。ただし、最終判断は人が持ちたい。前段の judgment support が求められている。

**なぜ重要か**: BONSAI の存在理由そのもの。これが間違いなら市場がない。

**既存エビデンス**:
- 創業者自身が2月に10プロダクトを出荷し、売上0・顧客対話0 (n=1)
- ハッカソン聞き取り: 「最終評価を AI に委ねていいか」に多くが NO → judgment replacement ではなく judgment support

**Field Evidence からの修正**: H-1 は「判断負荷が増えたか」だけでなく、「最終判断は人が持ちたいが、その前段 (証拠整理、境界条件の明示、kill 理由の言語化) は支援してほしい」を含む。

**検証方法 (ハッカソン版 — 方向性の強い証拠を取る)**:
- AI coding tools を触っている founder, PM, PM的役割を持つ engineer に短いインタビュー (5分)
- 質問 (誘導しないこと — 「overproduction ですよね」とは言わない):
  1. 最近1か月で、「何を作るか」より「何を作らないか」で困った具体例はありましたか
  2. AI coding tools を使う前と後で、候補数や意思決定負荷はどう変わりましたか
  3. 候補が増えた結果、誰が一番困っていますか (PM / Founder / Design / Engineer)
  4. 今いちばん欲しいのは: アイデア生成 / 優先順位付け / kill 判断 のどれですか
  5. 間違って build するコストと、間違って kill するコストはどちらが大きいですか
  6. build/kill の最終判断は誰が持つべきだと思いますか
  7. その最終判断の前に、AIに任せてもいい部分はどこまでですか
  8. 今のツールで足りていないのは: 情報収集 / 統合 / 判断 / 説明 / 合意形成 のどれですか
- 追加質問: 「直近1ヶ月で何個のプロダクト/機能を ship したか？そのうち意味があったのは何個か？」

**ハッカソン成功基準**: 10人前後に当たって、半数以上が「確かに候補が増えて判断が重くなった」と言い、数人が「kill 理由まで出るなら欲しい」と反応すること

**本検証成功基準**: 20名中12名以上 (60%) が「候補過多 / 判断負荷の増大」を実感している

**Kill Trigger**: 20名中5名以下 (25%) しか判断負荷の変化を感じていない場合、テーゼを撤回

**検証時期**: ハッカソン当日 (方向性証拠) → 2週間以内 (本検証)

---

### H-2: "Kill を買う" 仮説

> PM / プロダクトチームは「何を作るか」だけでなく「何を殺すか」の意思決定支援に対して金を払う。

**なぜ重要か**: BONSAI の差別化の核。Kill が売れないなら、既存 PM ツールとの差別化が消える。

**検証方法**:
- 以下の2パターンの LP を作成し、A/B テストする
  - A: "次に何を作るべきかを、証拠付きで提案します"
  - B: "今すぐ殺すべき案と、その理由を特定します"
- waitlist 登録率を比較
- 登録者10名に "kill 機能に月額いくら払うか" をインタビュー

**成功基準**:
- B の LP 登録率が A と同等以上
- 10名中4名以上が kill 機能単体に月 $50+ の支払意思を表明

**Kill Trigger**: B の LP 登録率が A の50%以下、かつ支払意思表明が10名中1名以下

**検証時期**: MVP前〜MVP直後。3週間以内

---

### H-2b: "正しいが早すぎる" 仮説 (YC Review: Problem 軸)

> AI-native チームはまだ少数派であり、「判断のボトルネック化」を実感する組織が市場を形成するには1-2年早い。

**なぜ重要か**: YC Review で Problem 評価が B+ に留まった最大の理由。命題が正しくても、今日 burning pain がなければプロダクトは売れない。

> Seibel: "Who is your user, and what are they doing right now instead of using your product? Why is that painful enough to switch?"

**検証方法**:
- H-1 のインタビューで追加質問: 「今日、判断のために何を使っているか？」「それで困っているか？」
- 「Notion + スプレッドシート + 直感」で「十分困っていない」人の割合を計測

**成功基準**: 20名中10名以上が「現在の方法に明確な不満がある」と回答

**Kill Trigger**: 20名中15名以上が「今の方法で十分」と回答。この場合、市場の形成を待つか、pain が顕在化しているサブセグメント (PM 10名以上の組織等) に絞る

**検証時期**: H-1 と同時。2週間以内

---

### H-3: ターゲットセグメント仮説

> BONSAI の primary buyer は「PM 3名以上、候補案件 20件以上を同時に抱えるプロダクト組織」である。

**なぜ重要か**: #6 (データ不足) と #7 (人間の方が早い) の背景にある問題。ターゲットを間違えるとプロダクトが刺さらない。

**前提の構造**:

| セグメント | 候補案件数 | PM人数 | BONSAI の価値 |
|---|---|---|---|
| Solo founder | 3-5件 | 1名 | 低い。直感で3秒で判断できる |
| Small team | 5-15件 | 1-2名 | 低〜中。判断基準の外在化にまだ必要性を感じにくい |
| **Growth team** | **20-50件** | **3-10名** | **高い。判断基準がばらつき、kill discipline が崩壊し始める** |
| Enterprise | 50件+ | 10名+ | 中〜高。ただし既存ツール (Productboard等) に lock-in |

**検証方法**:
- 各セグメントから5社ずつ、計20社にデモ + インタビュー
- 「これを使いたいか」「いくら払うか」「最も価値がある機能は何か」

**成功基準**: Growth team セグメントの5社中3社以上が有料利用の意思を示す

**Kill Trigger**: 全セグメントで有料利用意思が20社中3社以下

**検証時期**: MVP後。1ヶ月以内

---

## 2. 価値仮説 (Value Proposition)

### H-4: Brand Constitution 精度仮説

> 3行テキスト ("We are / We never / We value") を5つの判定軸に正規化し、その結果に基づく kill/build 判定が、創業者/PMの意図と80%以上一致する。

**なぜ重要か**: BONSAI の全出力の品質を決定する最上流。ここが壊れると全体が壊れる。

**検証方法 (ハッカソン版 — mechanism の理解を得る)**:
- ハッカソンではデモの中で live で constitution を入力してもらい、正規化結果を見せる
- その場で「この解釈は合っていますか？」と聞く
- 失敗しても「3行テキストではなく対話型引き出しへ pivot する」という学びを取る
- H-4 向けの質問:
  1. We are / We never / We value の3行で、自社の判断基準をかなり表せると思いますか
  2. その3行を AI が5軸に解釈したとき、どこが一番ズレやすいと思いますか
  3. ブランドや方針で、絶対に超えてはいけない線は何ですか
  4. 機能は良くても、体験としては絶対に採用しない例を1つ挙げると何ですか
  5. 同じユーザーペインでも、自社がやるべき解き方と、やるべきでない解き方の違いは何ですか
  6. その判断を今チームや外部メンバーにどう共有していますか
  7. coding agent にも守らせたいポリシーは何ですか
  8. build/kill の判定理由が clause 単位で出たら、納得しやすくなりますか

**ハッカソン成功基準**: constitution を入力した3-5名のうち、過半数が「5軸の解釈はだいたい合っている」と言うこと

**本検証方法**:
1. 10社の創業者/Head of Product に constitution を3行で書いてもらう
2. BONSAI の LLM で5軸に正規化する
3. 正規化結果を創業者に見せ、「この解釈は正しいか」を5段階で評価
4. 正規化された clause で架空の候補5件を判定し、「この判定は妥当か」を評価

**本検証成功基準**:
- 5軸正規化の正答率 (創業者が「正しい」「ほぼ正しい」): 80%以上
- 候補判定の妥当性 (創業者の判断と一致): 70%以上

**Kill Trigger**:
- 正規化正答率が 60%を下回る
- または候補判定の一致率が 50%を下回る (ランダムと変わらない)

**Pivot Option**: 3行テキストが機能しない場合、対話型引き出し (インタビュー形式で BONSAI が clause を生成) に設計変更

**検証時期**: ハッカソン当日 (mechanism 証明) → MVP開発中 (本検証)。最優先。

---

### H-5: 少数データ有効性仮説

> Customer interview 10件 + usage event 20件 + review 30件 (計60件程度) の observation で、意味のある theme clustering と allocation が可能である。

**なぜ重要か**: Growth team であっても、初回利用時のデータ量は限定的。「データを溜めてから使ってください」ではオンボーディングで死ぬ。

**検証方法**:
1. 3社から実データ (匿名化済み) を60件ずつ取得
2. BONSAI pipeline を実行
3. 出力された themes と proposals を、各社の PM に評価してもらう
4. 同じ3社で observation を120件に増やし、再実行して品質差を比較

**成功基準**:
- 60件で生成された themes の80%以上が PM に「妥当」と評価される
- 60件と120件で allocation の decision が70%以上一致する (データ増加で判断が覆らない)

**Kill Trigger**:
- 60件での theme 妥当性が50%以下
- または60件と120件で decision 一致率が40%以下 (不安定すぎて信頼できない)

**検証時期**: MVP直後。2週間以内。

---

### H-6: Execution Packet 有用性仮説

> BONSAI が生成する Execution Packet (UI/data/workflow 変更案 + coding agent tasks) を受け取ったエンジニアが、追加の仕様書なしに作業を開始できる。

**なぜ重要か**: RFS #1 の核心要件「coding agent 向けに開発作業を分解する」の成否を決める。ここが機能しないなら、BONSAI は判断ツール止まりで "Cursor for PM" にならない。

**検証方法**:
1. BONSAI で Execution Packet を5件生成
2. 各 packet をエンジニア2名 (合計10名) に渡す
3. 「このまま作業を開始できるか」「何が足りないか」「Cursor/Claude Code に渡して使えるか」を評価
4. 実際に coding agent に渡して、生成されたコードの品質を確認

**成功基準**:
- 10名中6名以上が「修正なしまたは軽微な修正で作業開始可能」
- coding agent に渡した場合、5件中3件以上で意味のあるコードが生成される

**Kill Trigger**:
- 10名中8名以上が「このままでは使えない、書き直す」と回答
- coding agent で意味のあるコードが5件中0件

**対応策 (Kill 前の salvage)**:
- Execution Packet を full spec ではなく「PRD の下書き」として再ポジショニング
- コードベース context を連携する仕組みを追加検討 (Cursor extension 等)

**検証時期**: MVP後。3週間以内。

---

## 3. 実行仮説 (Feasibility)

### H-7: Pipeline 速度仮説

> 4-step LLM pipeline (Extract → Cluster → Filter → Execution Packet) が、observation 100件に対して30秒以内に完了する。

**なぜ重要か**: pipeline が遅いと、インタラクティブな「次に何を作るべきか」の体験が成立しない。

**検証方法**:
- 100件の observation で pipeline を10回実行し、latency を計測
- p50, p95 を記録

**成功基準**: p95 が30秒以内

**Kill Trigger**: p95 が60秒を超え、pipeline の並列化でも改善しない場合

**対応策**: Step 1-2 を pre-compute に回し、Step 3-4 のみリアルタイム実行に変更

**検証時期**: MVP開発中。即時。

---

### H-8: Cloudflare Edge 互換性仮説

> Next.js + Cloudflare Pages + Workers の構成で、LLM streaming を含む pipeline が安定稼働する。

**検証方法**: MVP実装時に確認

**Kill Trigger**: Workers の制限により pipeline が頻繁に timeout する場合

**対応策**: Vercel に切り替え、または API server を別途立てる

**検証時期**: MVP開発中。即時。

---

## 4. 競合仮説 (Competitive)

### H-9: 差別化持続性仮説

> Constitution-based allocation + clause-level kill reasoning は、既存 PM ツール (Productboard, Linear, ChatPRD) が6ヶ月以内に模倣できない。

**なぜ重要か**: 模倣が容易なら、既存ツールの distribution advantage に負ける。

**検証方法**:
- 競合の product changelog と roadmap を月次で監視
- 「constitution」「kill reasoning」「clause-based」等のキーワードでアラート設定

**成功基準**: ローンチ後6ヶ月時点で、clause-based kill reasoning を搭載した競合が0

**Kill Trigger**: 上位3社のうち2社以上が同等機能を搭載し、BONSAI の有料転換率が月次10%以上低下

**対応策**: constitution の depth (desired/forbidden transitions, ABM) を先行して拡張し、模倣コストを上げる

---

## 5. 構造的矛盾仮説 (Structural Contradictions)

*YCombinator_review.md の Critical Questions から抽出。プロダクト設計の内部矛盾。*

### H-10: ターゲット矛盾仮説 (YC Review: Q3)

> Brand Constitution を書ける人は、そもそも判断に困っていない。自社の価値観を言語化できる PM/創業者は、すでに良い判断をしている。本当に判断に困っている人は constitution を書けない。

**なぜ重要か**: BONSAI の入力（constitution）を提供できるユーザーと、BONSAI の出力（allocation）を必要とするユーザーが、別人である可能性。

> YC Q3: "Brand Constitution を書ける人は、そもそも判断に困っていないのでは？"

**検証方法**:
1. 10社に constitution を書いてもらう
2. 書けた人 vs 書けなかった人に分けて、「判断の困り度」を比較
3. 書けなかった人に対して、テンプレート/対話型入力で支援し、完成度を比較

**成功基準**:
- 「判断に困っている」かつ「constitution を書ける (支援込み)」の重複が 10社中5社以上

**Kill Trigger**: 「判断に困っている人は constitution を書けない」と「書ける人は困っていない」が9社以上で成立。重複ゾーンが存在しない

**対応策**: constitution を自分で書かせず、インタビュー形式で BONSAI が引き出す設計に変更

**検証時期**: H-4 と同時。即時

---

### H-11: LLMラッパー仮説 (YC Review: Q4)

> ChatGPT / Claude に直接 "うちのプロダクトでどれを kill すべき？" と聞けば、BONSAI と同等の回答が得られる。BONSAI は LLM ラッパーに過ぎない。

**なぜ重要か**: "GPT に聞けばいい" を超える理由がなければ、プロダクトとして成立しない。

> YC Q4: "なぜ ChatGPT/Claude に直接聞くのではダメなのか？"

**検証方法**:
1. 同じ constitution + observation データを使って、以下の3パターンで kill/build 判定を実行
   - A: ChatGPT に自由に質問
   - B: Claude に構造化プロンプトで質問
   - C: BONSAI pipeline
2. 出力の quality を PM 5名に blind 評価してもらう (どのシステムの出力かを隠す)
3. 評価軸: 判定の妥当性、理由の説得力、evidence の具体性、再現性

**成功基準**:
- BONSAI (C) が A/B より有意に高評価 (5名中4名以上が C を最上位)
- 特に「再現性」と「evidence の具体性」で差がつく

**Kill Trigger**: blind 評価で A/B と C に有意差なし (5名中2名以下しか C を最上位に選ばない)

**対応策**:
- BONSAI の価値を「単発回答」ではなく「constitution の蓄積 × observation の継続的 tracking × 判断の履歴」に移す
- "GPT に毎回同じ context を渡し直す" コストを、BONSAI が構造的に解消する設計

**検証時期**: MVP直後。2週間以内

---

### H-12: 10x 未到達仮説 (YC Review: Elon 10x テスト)

> BONSAI は既存の方法 (PM + スプレッドシート + 直感) と比べて 10x 良くない。2-3x の改善では、switching cost を超えられない。

**なぜ重要か**: YC Elon 式 Review で「10x はまだ成立していない」と判定済み。

| 比較対象 | BONSAI の優位性 | 10x か？ |
|---|---|---|
| PM + スプレッドシート | 判断の外在化、再現性 | No — 2-3x |
| Productboard | kill reasoning, pre-mortem | No — 差別化だが10xではない |
| GPT に直接聞く | 構造化、constitution制約、evidence trail | Maybe — ここが一番近い |

**10x を実現しうるシナリオ**:
- **速度**: 「10プロダクトのうちどれを kill すべきか」の判断が、1週間→10分に短縮 (100x)
- **精度**: kill すべき案を見逃す率が、人間の50%→5%に低下
- **コスト**: PM 1名分の判断コスト (年$150K) を月$200で代替

**検証方法**:
- 初期ユーザー5社で「BONSAI 導入前 vs 導入後」の判断速度と判断の事後正答率を計測
- 「10個中何個を正しく kill/continue できたか」で比較

**成功基準**: 速度・精度・コストのいずれかで 5x 以上の改善

**Kill Trigger**: すべての軸で 2x 以下

**検証時期**: MVP後。1ヶ月以内

---

### H-13: Over-engineering 仮説 (YC Review: Solution 軸)

> 7ステージパイプラインは複雑すぎる。Constitution → Data → Kill/Build の3ステップで十分であり、state inference / pre-mortem / allocation scoring は動くものができてから追加すべき。

**なぜ重要か**: YC は「最初から正しいアーキテクチャ」を嫌う。

> Elon: "The best part is no part. The best process is no process."
> Caldwell: "If you could only build one feature and ship it today, what would it be?"

**最小構成 (3ステップ)**:
1. Constitution 入力 ("We are / We never / We value")
2. Data 入力 (observations)
3. Kill / Build 判定 + 理由

**検証方法**:
- 3ステップ版と full pipeline 版の両方を実装
- PM 5名に両方の出力を評価してもらう
- 「full pipeline の追加ステップに価値を感じるか」を確認

**成功基準**: 5名中3名以上が full pipeline の出力を明確に上位と評価

**Kill Trigger**: 5名中4名以上が「3ステップ版で十分」と回答

**対応策**: MVP は3ステップで ship し、state inference / pre-mortem / scoring は利用データを見てから追加判断

**検証時期**: MVP開発中。即時

---

### H-14: Moat 不在仮説 (YC Review: Q12)

> BONSAI にはデータが蓄積されることで強くなる learning loop / network effect がない。constitution と observation は顧客ごとに独立しており、使えば使うほど良くなる仕組みがない。

**なぜ重要か**: moat がなければ、既存ツールの distribution advantage に負ける。

> YC Q12: "データが溜まることで何が良くなるか？ moat は何か？"

**考えうる moat**:
- **Constitution の蓄積**: 過去の constitution version × allocation 結果の履歴から、「この種の company にはこの clause が効く」を学習
- **Kill 判定の精度向上**: 過去に kill した案の事後結果 (本当に死んだか) をフィードバックし、pre-mortem の精度を上げる
- **Cross-company pattern**: 匿名化された kill/build pattern を横断分析し、「この業界では X を kill すべき」を提示

**検証方法**: MVP後に constitution 数が50を超えた段階で、cross-company pattern の有用性を検証

**成功基準**: 蓄積データにより、新規ユーザーの初回 allocation 精度が有意に向上

**Kill Trigger**: 100 constitution 蓄積後も、新規ユーザーの初回精度に改善なし

**検証時期**: 長期。6ヶ月後

---

### H-15: Evaluation Fatigue 仮説 (Field Evidence: 2026-03-08)

> AI が大量の実験・プロトタイプを回すと、ユーザーが評価疲れ (evaluation fatigue) に陥る。「誰に何をどの頻度で見せるか」の制御が、判断支援と同等以上の価値を持つ。

**なぜ重要か**: ハッカソン聞き取りで新たに発見されたペイン。AI-native チームは build 速度だけでなく evaluation 速度もボトルネックになる。BONSAI の exposure_budget 機構の根拠。

**Field Evidence**: ハッカソン参加者のほぼ全員が「評価の津波」を未考慮だった。市場投入→インタビューは考えているが、大量の実験が回る状況での evaluation 管理は想定外。

**検証方法 (インタビュー質問)**:
1. 何回目から「また評価か」と感じると思いますか (評価疲れの閾値)
2. AI プロダクトが大量に実験を回すと、ユーザー体験はどう悪化しますか
3. 評価対象を増やすことより、評価負荷を減らすことに価値はありますか
4. 「誰に何をどの頻度で見せるか」を制御する仕組みに価値を感じますか
5. 今、A/B テストや実験の評価をどうやって管理していますか
6. 評価が追いつかず放置した実験はいくつありますか

**成功基準**: 15名中8名以上が「評価疲れを感じたことがある、または感じうる」と回答し、4名以上が exposure 制御に支払意思を示す

**Kill Trigger**: 15名中3名以下しか評価疲れを認識しない。AI-native チームでも evaluation は current process で十分管理できている

**対応策**: evaluation fatigue が認識されない場合、exposure_budget 機構を MVP から Cut し、判断支援のみに集中する

**検証時期**: H-1 と同時。2週間以内

---

## 6. 検証ロードマップ

```
Week 0-2 (MVP前):
  ├── H-1:  PM 20名インタビュー (判断ボトルネック検証)
  │         追加: 「先月何個 ship して、何個意味があったか」
  ├── H-2:  LP A/B テスト (Kill の購買意思)
  ├── H-2b: 同上インタビューで「今の方法で十分か」を確認
  ├── H-4:  Constitution 正規化精度テスト ← 最優先
  ├── H-10: ターゲット矛盾テスト (H-4 と同時実施)
  ├── H-13: 3ステップ版 vs full pipeline の比較設計
  └── H-15: Evaluation Fatigue インタビュー (H-1 と同時)

Week 2-4 (MVP開発中):
  ├── H-7:  Pipeline latency 計測
  ├── H-8:  Cloudflare 互換性確認
  └── H-13: 3ステップ版で MVP ship → full pipeline は後

Week 4-8 (MVP後):
  ├── H-3:  セグメント別デモ (20社)
  ├── H-5:  少数データ有効性テスト (3社実データ)
  ├── H-6:  Execution Packet エンジニア評価 (10名)
  ├── H-11: LLMラッパー検証 (blind 評価)
  └── H-12: 10x テスト (導入前後の判断速度・精度比較)

Week 8+ (運用中):
  ├── H-9:  競合監視 (月次)
  └── H-14: Moat 検証 (constitution 50件蓄積後)
```

---

## 6. 判断フレームワーク

### 全体 Go / No-Go 基準

| 条件 | 判断 |
|---|---|
| H-1 + H-4 の両方が成功 | **Go**: MVP開発を本格化 |
| H-1 は成功、H-4 が失敗 | **Pivot**: Constitution の設計を変更 (3行テキスト→対話型引き出し等) |
| H-1 が失敗 | **Stop**: 過剰生産テーゼが不成立。別のテーゼで再出発 |
| H-2 が失敗 | **Reposition**: Kill を裏に回し、Build Next を前面に (allocation system としての本質は維持) |
| H-2b が失敗 | **Wait or Niche**: 市場が早すぎる。PM10名+組織に絞るか、1年待つ |
| H-3 が失敗 | **Re-segment**: ターゲットを変更 (Enterprise PM ops 等) |
| H-5 が失敗 | **Re-scope**: 初期は data-rich な顧客のみ。または synthetic observation 生成を検討 |
| H-6 が失敗 | **Descope**: Execution Packet を PRD 下書きに格下げ。判断層に集中 |
| H-10 が失敗 | **Redesign input**: Constitution を自分で書かせず、対話型で引き出す UX に変更 |
| H-11 が失敗 | **Pivot to workflow**: 単発回答ではなく、継続的 tracking + 判断履歴で差別化 |
| H-12 が失敗 | **Find 10x**: 速度・精度・コストのいずれかで 10x を見つけるまで feature を変え続ける |
| H-13 が確認 | **Simplify**: 3ステップ版で ship。追加層は traction が出てから |
| H-14 が失敗 | **Build moat**: kill 事後検証 feedback loop を最優先で実装 |
| H-15 が失敗 | **Cut exposure_budget**: evaluation fatigue 機構を MVP から削除、判断支援に集中 |

### 致命度 × 緊急度マトリクス

```
            致命度 →
            Low          Medium        High          Critical
  即時     [H-8]        [H-7,H-13]    [H-5,H-10]    [H-4]
           Edge互換      latency       少数データ     Constitution
                         3step判定     ターゲット矛盾  精度

  短期                   [H-6]         [H-2,H-2b]    [H-1]
                         Exec Packet   Kill購買       テーゼ
                         [H-15]        早すぎる
                         評価疲れ

  中期                   [H-9]         [H-3,H-12]    [H-11]
                         競合吸収      セグメント     LLMラッパー
                                       10x未到達

  長期                   [H-14]
                         Moat不在
```

### yc_review.md Fatal Questions (2026-03-08 追加)

| # | 質問 | 対応仮説 | 回答 |
|---|---|---|---|
| F1 | 今日月$100払うPMを3人挙げられるか？ | H-2, H-3 | まだいない。まず1人のPMに1週間使ってもらうことが最優先 |
| F2 | ChatGPTに直接聞くのと何が違うか？ | H-11 | constitution × evidence trail × 判断履歴。再現性と追跡可能性 |
| F3 | Constitution を書けるPMはそもそも困っていないのでは？ | H-10 | 書けることと、それでチームが動くことは別 |
| F4 | これはPMツールなのかAIガバナンスFWなのか？ | H-13 | PMツール。委譲ラダーは内部概念、UIに出さない |

### 構造的指摘への対応

| 指摘 | 対応 |
|---|---|
| Trust Harness の類推の限界 (coder にはテスト/CI、PM にはない) | decision_log に事後検証フィールドを将来追加。MVP は判断を出すまで |
| 委譲ラダーは内部概念にすべき | UI に段階選択を出さない。デフォルトで explain まで自動、recommend は「提案」ラベル |
| スコープクリープ (6.6-6.9) | 全て MVP Cut に移動。設計文書には残すが実装しない |
| Exposure allocation は今日の問題ではない | H-15 の Kill Trigger 評価を待つが、MVP には入れない |

### YC 面接で問われた場合の回答準備

| 質問 | 回答の核 |
|---|---|
| "Who is desperate for this?" | "I am. 10 products in Feb, 0 revenue, 0 conversations. The bottleneck is judgment, not building." |
| "Why not just ask ChatGPT?" | "You can, once. But you lose the constitution, the evidence trail, the kill history. We make judgment reproducible and accumulative." |
| "Why is this 10x better?" | "PM判断が1週間→10分。10個作って0個売れた状態から、1個に集中できる状態へ。" |
| "Is this over-engineered?" | "Fair. MVP は3ステップ: constitution → data → kill/build。残りは traction 次第で追加。" |
| "Can Productboard copy this?" | "kill機能は3ヶ月で追加できる。constitution × kill history の学習ループは追えない。" |
| "Is this a PM tool or an AI governance framework?" | "PM tool. 委譲ラダーは全AIツールに共通する問題。BONSAI 固有の価値は constitution × evidence × kill reasoning。" |
| "How do you verify your kill decisions were correct?" | "MVP は判断を出すまで。事後検証 (decision outcome tracking) はロードマップ。coder のテスト/CI に相当するものをPM判断に作るのが次のステップ。" |

**最初の2週間で H-1 と H-4 を検証する。この2つが通らなければ、残りの検証に進む意味がない。**

**Founder Evidence が最大の武器**: "10 products, 0 revenue, 0 conversations" — これを30秒で言えることが、burning pain の証明であり、founder-market fit の証明。
