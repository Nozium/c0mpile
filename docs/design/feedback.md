アップロードされた戦略書を前提に、論点を潰しながら10回分の改善イテレーションとして再構成します。元の核は「Brand Constitution × Autonomous Discovery × Kill Decision」で、PMを“作る人”から“憲法を書く人”へ移す構想です。これは文書の中心命題そのものです。
この引用は、今回の分析対象が単なるPM補助ツールではなく、過剰生産時代の意思決定OSとして設計されていることを支えています。なお元資料はこれです。

## 1. イテレーション1: テーマを「PM支援」から「資本配分」に寄せる

**問題**
今のままだと見た目は派手でも、審査側からは「AI PMツールの一種」に見える危険がある。実際、文書でも Productboard Spark 等との比較を気にしています。
この引用は、現行案が既存AI PMカテゴリとの比較軸に乗ってしまう懸念の根拠です。

**改善**
主語を PM ではなく **portfolio allocation** に変える。
ピッチの一行目をこう変えるべきです。

> We are not helping PMs write better feature ideas.
> We are allocating attention and build capacity under constitutional constraints.

**結果**
「Cursor for PM」適合は保ちつつ、審査の頭の中ではカテゴリが一段上がる。
つまり **feature suggestion tool → product capital allocator** へ移る。

---

## 2. イテレーション2: “Brand Constitution”を抽象概念から実行可能ルールへ落とす

**問題**
現状の “We are / We never / We value” はデモ入力としては良いが、判定根拠としては曖昧です。資料でもここがリアルタイム判定の中核になっています。
この引用は、ブランド入力が実時間の提案・棄却に直結する設計であることを示しています。だから曖昧だと全体が曖昧になります。

**改善**
Brand Constitution を3行テキストではなく、内部的には5つの判定軸に正規化する。

* Target user
* Prohibited business model
* Quality bar
* Strategic terrain
* Trust / compliance rule

例:

* We are → target_user, strategic_terrain
* We never → prohibited_business_model, forbidden_pattern
* We value → quality_bar, preference_order

**結果**
「なぜ kill されたか」が説明可能になる。
説明可能性が上がると、Kill Decision Engine が gimmick でなくなる。元資料でも rejection_reason を差別化要素に置いているので、ここは必須です。
この引用は、kill の理由説明が本提案の中核であり、単なる補助情報ではないことを支えています。

---

## 3. イテレーション3: “発見”と“生成”を切り離す

**問題**
今のフローは、発見したテーマからそのまま iOS プロトタイプまで行くので、デモとしては映る一方で、審査では「本当にその生成が必要か？」と突かれやすい。資料では Rork MAX による60秒試作が印象装置になっています。
この引用は、プロトタイプ生成がデモの印象作りに強く結びついていることを示します。だからこそ、本質と切り分ける必要があります。

**改善**
システムを2製品に見せる。

* Core: Discovery + Constitutional Filtering + Kill Engine
* Surface: Optional Prototype Generator

つまり、**prototype generation is an actuator, not the product** と定義する。

**結果**
もし Rork が死んでも本体は死なない。
資料でも Rork 失敗時のフォールバックが既に書かれていますが、現状は「壊れた時の逃げ道」です。
この引用は、Rork依存が現実にリスクとして認識されていることを示します。設計上も従属物に下げるべきです。

---

## 4. イテレーション4: “Build提案”より“Kill品質”を前面に出す

**問題**
AIは build を提案するのが簡単です。 kill が賢いかどうかの方が、知性として差が出る。元資料も「何を作るか」より「何を作らないか」が重要だと言っています。
この引用は、kill が補助機能でなく、コンセプトの本丸であることを支えています。

**改善**
UIの主役を Build list ではなく **Kill board** に変える。
各案に対して以下を出す。

* kill reason
* violated constitutional clause
* evidence count
* possible salvage path

**結果**
「AIがアイデアを出す」ではなく「AIが戦略的に捨てる」になる。
審査での記憶残りが強くなる。

---

## 5. イテレーション5: “市場の声”を雑に集めない

**問題**
X + Product Hunt + App Store Reviews を並列で扱っていますが、信号の性質が違いすぎます。元資料でも3ソースを混ぜています。 
これらの引用は、ソースが多様である一方、同列混合されていることを示しています。だからノイズ混入リスクがあります。

**改善**
ソースを3階層に分ける。

* Intent signal: Product Hunt comments
* Pain signal: App Store reviews
* Trend signal: X

各ソースで重みを変える。
例:

* pain severity は reviews を重く
* novelty は X を重く
* willingness-to-adopt は Product Hunt を重く

**結果**
「たくさん集めた」ではなく「役割別に統合した」になる。
これは discovery engine としての設計密度を一段上げる。

---

## 6. イテレーション6: LLM 3段パイプラインを “judgment trace” に変える

**問題**
extract → cluster → propose は自然だが、審査目線では普通です。文書でも generateObject + Zod による構造化は説明されています。
この引用は、現在の実装方針が「安定した構造化出力」であることを示しています。ただし、それだけでは戦略の新規性は出ません。

**改善**
各ステップに **counterfactual** を追加する。

* Extract: “what user says” と “what user actually wants” を分ける
* Cluster: “theme” と “anti-theme” を対で出す
* Propose: “build if…” と “kill because…” を両方出す

**結果**
単なる summarizer ではなく、**judgment engine** に見える。
これは「知能」より「経営判断」に近づける改善です。

---

## 7. イテレーション7: 審査デモを“自由入力”から“対立する2憲法比較”に変える

**問題**
審査員の自由入力は盛り上がるが、品質が運任せです。資料でも「nonsensical brand policy」は低影響と置いていますが、実際はかなり危ないです。
この引用は、入力品質問題を軽く見積もっていることを示しています。デモでは低影響ではありません。

**改善**
ライブでは1回だけ自由入力させるのでなく、**同じ市場データに対して2つのブランド憲法を比較**させる。

例:

* Constitution A: privacy-first productivity
* Constitution B: growth-first consumer engagement

そして同じ theme 群から build/kill が逆転する様子を見せる。

**結果**
「ブランドは装飾ではなく、意思決定関数そのもの」という主張が一発で伝わる。
これは今の案より圧倒的に強い。

---

## 8. イテレーション8: “PMの代替”という言い方を捨てる

**問題**
資料には “replace the PM decision bottleneck” 方向のニュアンスがあります。
この引用は、差別化のためにPM代替ニュアンスへ踏み込んでいることを示します。しかし、これは刺さる相手もいる一方で嫌われる。

**改善**
言い方を変える。

* 悪い言い方: PMs are replaced
* 良い言い方: PM judgment is externalized and scaled

**結果**
敵を作りにくくなる。
しかも “constitutional author / supreme court” の比喩とも整合します。
この引用は、PM役割の再定義がすでに文書にあることを支えています。なので、敵対的な言い回しは不要です。

---

## 9. イテレーション9: 5時間ビルド計画を切り詰める

**問題**
現行スケジュールは、ソロでの完成確率が低い。資料にも “Solo developer can’t finish in 5 hours” を中～高リスクで入れています。
この引用は、実装不能リスクが設計書自身で認識されていることを示しています。

**改善**
MVP をここまで削る。

絶対作るもの:

* 事前に整形済みデータセット 1個
* constitution parser
* build/kill ranking
* evidence drill-down
* 2 constitution compare

捨てるもの:

* live scraping
* Product Hunt API
* Rork live generation
* fancy charts
* sponsor stretch goals

**結果**
完成率が跳ね上がる。
今の計画は “よくできたら勝つ” で、悪く言うとギャンブルです。ハッカソンでは **完成した鋭いもの** の方が勝率が高い。

---

## 10. イテレーション10: 最終コンセプトを “Autonomous Product Discovery Engine” からさらに一段進める

**問題**
現状名は強いが、まだ “engine” 止まりです。資料の哲学パートでは、注意資源の配分・知識資本・組織認知まで言及していて、実はもっと大きい。
この引用は、あなたがこの案を単なる発見器ではなく、組織知と資本配分の機構として見ていることを支えています。

**改善**
最終定義をこう変える。

> Constitutional Product Capital Allocation System

その上でデモでは、3つだけ見せる。

* What the market is asking for
* What this company is allowed to become
* What should be killed now

**結果**
これは “idea generator” ではなく **AI-native company operating primitive** になる。
資料の “Brand is the new operating system for AI-native companies.” という締めとも一致します。
この引用は、最終的にOSレイヤーの主張をしていることを示しており、名称変更の方向性を支えています。

---

## 10イテレーション後の最終形

一言で言うと、こうです。

**これは PM ツールではない。**
**会社が AI 時代に何を作り、何を殺し、何になってよいかを決めるための憲法実行系である。**

最終プロダクト定義:

* 入力: 市場シグナル + ブランド憲法
* 中核: constitutional parsing + evidence-weighted ranking + explicit kill reasoning
* 出力: build / kill / salvage
* デモ核: 同一市場に対する複数憲法比較
* 生成UI: あってもよいが従属物

---

## 明確なダメ出し

1つ目。**今の案は賢そうに見えるが、まだ盛りすぎです。**
live scraping、LLM多段、リアルタイム判定、Rork生成、ダッシュボード演出を全部5時間ソロでやるのは、設計として欲張りすぎです。資料自身がその失敗可能性を認めています。
この引用は、実装不能・通信障害・API遅延などが主要リスクであることを示しており、スコープ過大という批判の根拠です。

2つ目。**“Brand Constitution” がまだ詩的で、実行規則として甘いです。**
いまのままだと、出力がLLMの気分に見える。killの説得力は constitution の形式化で決まります。

3つ目。**一番新しいのは build ではなく kill なのに、演出がまだ build 側に寄っています。**
そのせいで既存AI PMツールに見えやすい。差別化したいなら、捨てる判断を主役にするべきです。

4つ目。**“PMを不要にする” 匂いは不要です。**
思想としては理解できるが、ピッチで得をしません。外在化・拡張・制度化と言い換えた方が強い。

5つ目。**今の名前はまだ一段弱いです。**
“Autonomous Product Discovery Engine” は良いが、あなたが本当に作ろうとしているのは engine ではなく governance layer です。

結論だけ言うと、次にやるべきことはこれです。
**Rorkを切って、2憲法比較デモに寄せ、killの理由を clause ベースで見せる。**
そこまでやれば、この案はかなり前に進みます。



了解。7は撤回します。
2憲法比較デモは外します。その代わり、単一の Brand Constitution の下で「人をどう切り出し、その人がどう反応し、次の体験でどう遷移するか」を見せる方向に寄せた方が、あなたの狙いには合っています。

## 1. なぜ `allocation` に寄せるのか

まず言語の話から言うと、`discovery` は「見つける」、`generation` は「作る」、`analysis` は「分析する」で、いずれも**観測や生成の行為**を指します。
それに対して `allocation` は、限られた資源を**どこに配るか・どこに配らないかを決める意思決定語**です。

この差はかなり大きいです。

あなたの元資料でも、中心命題はすでに「AIが作れるようになった後、希少なのは何を作るかの判断である」に移っています。文書では、AI時代において scarcity は build ability ではなく judgment に移る、と明言されています。
この引用が支えているのは、プランの本質が生成能力ではなく判断能力だという点です。だから語彙も discovery より allocation の方が中核に近い。

さらに文書自身が、Kill Decision Engine の役割を「attention を highest-value opportunities に向ける capital allocation」と書いています。
この引用が支えているのは、あなたの案の内部ロジックがすでに allocation として記述されていることです。外向け名称だけがまだ追いついていない。

### 言語的な位置付け

`allocation` は、一般に次の含意を持ちます。

* scarcity がある
* competing options がある
* objective function がある
* decision cost がある
* opportunity cost がある

逆に言うと、`allocation` という語を使うだけで、聞き手は無意識に
「何が scarce で、何を最適化し、何を捨てるのか」
を期待します。

あなたの案はまさにそこです。
文書でも「what to build / what to kill / what to wait on」が新しいボトルネックだと書かれています。
この引用が支えているのは、判断対象が build だけでなく kill と defer を含むことです。これは典型的な allocation 問題です。

### 事業的な位置付け

`Cursor for PM` だと、どうしても「PMの作業支援」に見えます。実際に文書でも、その位置づけだと Productboard Spark, ChatPRD, BuildBetter と競合して差分が漸進的だと整理されています。
この引用が支えているのは、PM支援の語彙に留まると既存カテゴリに吸収されるという問題です。

一方で `allocation` に寄せると、カテゴリが変わります。

* PM support tool ではなく
* organizational judgment system になる

もっと言えば、

* feature recommendation ではなく
* attention / prototype / experiment / capital の配分になる

このとき、Brand Constitution は単なる“価値観入力欄”ではなく、**allocation policy** になります。
文書でも Brand Constitution は「AI agents の autonomy と alignment を両立させる境界条件」であり、違反提案は explicit rejection reasons 付きで kill される設計です。
この引用が支えているのは、Brand が装飾ではなく配分ルールそのものだという点です。

### だから何と呼ぶとよいか

`Autonomous Product Discovery Engine` でも意味は通ります。
ただ、より進んだ概念にするなら、外向けには次のどれかの方が中身と一致します。

* Product Allocation Engine
* Constitutional Product Allocation System
* Attention Allocation Engine for AI-Native Products
* Product Capital Allocation Layer

この中で一番バランスがいいのは、今の文脈なら
**Constitutional Product Allocation System**
です。

理由は単純で、文書の3レイヤー

* Brand Constitution
* Autonomous Discovery
* Kill Decision Engine

を全部含められるからです。
この引用が支えているのは、現行案が constitution / discovery / kill の三層構造であることです。allocation はこの三層を束ねる上位概念として置ける。

## 2. 5の論点を ABM に接続するなら、重み付けではなく「遷移モデル」に変える

あなたの補足の方が重要です。
論点は「X, Reviews, Product Hunt をどう重み付けするか」ではなく、**ある体験を経た人が、どういう反応を返し、その後どの体験にどう反応するかを予測できるか**です。これは discovery というより、ほぼ **behavioral state transition** の問題です。

つまり設計をこう変えるべきです。

### 変更前

* ソースごとの signal を集める
* cluster する
* 提案する

### 変更後

* 人を latent persona/state に切る
* 体験イベントを状態遷移として表現する
* 各 state に対して reaction likelihood を推定する
* その反応が次の体験 exposure でどう変わるかを回す

この方が、あなたがやりたい「雑に集めるのではなく、その先にある人をどう切り出すか」に一致します。

## 3. ABMにするなら、persona は属性ではなく「状態」で切る

ここが重要です。
ABMに持ち込むときに失敗しやすいのは、persona を

* 20代男性
* 忙しいPM
* ヘビーユーザー

みたいな静的属性で置いてしまうことです。
それだと predictive power が弱い。

あなたのタスク定義はむしろこうです。

* 体験 X を受けた
* 反応 Y をした
* 次に体験 XX を受けたとき
* 反応 YY を返すか

これは静的ペルソナではなく、**履歴依存の状態機械**です。
したがって agent の最小単位は persona ではなく、次のような state vector にすべきです。

* current need intensity
* trust level
* novelty seeking
* effort tolerance
* switching cost sensitivity
* social signaling tendency
* adoption readiness
* constitutional fit

この最後の constitutional fit が、あなたの Brand Constitution と繋がるポイントです。
文書では market signals を brand policy に照らして測る層が、既存の Manashiki alignment に対応すると書かれています。
この引用が支えているのは、すでに「シグナルをポリシーに照らして測る」設計が中核にあることです。ABMにするなら、これを個人状態レベルまで下ろせばよい。

## 4. あなたのタスクを数理的に言い換えると何か

あなたの文を形式化すると、やりたいことはこれです。

* user state (s_t)
* experience (e_t)
* reaction (r_t)
* transition (T(s_t, e_t, r_t) \to s_{t+1})
* prediction target (P(r_{t+1} \mid s_{t+1}, e_{t+1}))

要するに、

**「観測された反応」ではなく「体験による状態更新」をモデル化したい**
ということです。

この設計にすると、App Store Review, X post, Product Hunt comment はすべて「同じ土俵のソース」ではなくなります。

* Review は強い pain/reward の事後反応
* X は軽量で社会的に演出された反応
* Product Hunt は early adopter 的な公開評価

となり、それぞれ agent の state inference に使う観測として扱える。

前回の私の5は、まだ浅かったです。
正しくは「ソースの重み付け」ではなく、**ソースを state estimation の観測変数として再定義する**べきでした。

## 5. このプランに ABM を接続したときの最も筋の良い構造

あなたの元の三層構造は壊さずに、こう差し替えるのが良いです。

### Layer 1: Brand Constitution

会社として許される体験空間を定義する。
何を build して良いかだけでなく、どの user transition を望ましいとみなすかまで書く。
文書でも Brand Constitution は build boundary を定義する層です。
この引用が支えているのは、constitution が product boundary を決める第一層だという点です。

### Layer 2: Persona-State Simulation

ユーザーを static persona ではなく stateful agents として持つ。
experience → reaction → state update を回す。

### Layer 3: Allocation / Kill Engine

ある体験設計案が、

* どの state cluster に効くのか
* どの遷移を生むのか
* その遷移がブランド上望ましいのか
* どれだけ全体資源を食うのか
  を見て、build / defer / kill を出す。

この形なら、Kill が単なる「ブランド違反」では終わりません。

* predicted transition is low-value
* short-term reaction positive but long-term trust decay
* high engagement but constitutionally misaligned
* works only for a narrow unstable micro-state

みたいな、より強い kill reason が出せる。

## 6. この方向にすると、概念として何が一段進むか

元資料はすでに「overproduction の時代には judgment が希少資源になる」と置いています。
この引用が支えているのは、ボトルネックが production から judgment に移るという大枠です。

そこに ABM を入れると、判断対象が
「市場で今うるさいテーマ」から
「どういう人間状態を会社として増やしたいか」
へ進みます。

つまり概念が

* market trend mining から
* human-state allocation

に上がる。

これはかなり大きいです。
なぜなら、もはや「顧客の声を集めて feature を決める」ではなく、
**人間状態の遷移に対して会社の資源を配るシステム**
になるからです。

## 7. 現時点での明確な改善提案

今のプランを次に進めるなら、用語と構造を以下に変えるのがいいです。

### 用語

* Autonomous Product Discovery Engine
  → **Constitutional Product Allocation System**
* persona
  → **user state / agent state**
* signal source
  → **observation channel**
* recommendation
  → **allocation decision**
* kill reason
  → **constitutional or transition failure**

### 画面/出力

出すべきなのは idea list ではなく、少なくとも次の4つです。

* inferred user states
* candidate experiences
* predicted reactions and next-state transitions
* build / defer / kill with clause + transition reason

## 8. ダメ出し

はっきり言うと、現状のプランの弱点は3つです。

### 1. まだ「市場の声を賢くまとめるツール」に見える

これは弱いです。
そのままだと PM tooling の延長に見えます。文書でもその路線は既存ツールとの差分が漸進的だと整理されています。
この引用が支えているのは、その見え方だと新規性が弱いという点です。

### 2. persona の概念がまだ浅い

もし persona を属性ラベルで切るなら、ABMに行っても弱いです。
あなたが必要としているのは「誰か」ではなく「どの状態にある人か」です。ここを誤ると、reaction prediction はすぐに雰囲気になる。

### 3. Brand Constitution がまだ product boundary に留まっている

そこも足りない。
本当は constitution は「どの user transition を会社として増やしたいか」まで持つべきです。
そうしないと、build/kill の判断が単なるブランド好みで終わる。

結論はこれです。
**allocation に寄せるのは、あなたの案の中心が discovery ではなく scarce attention と experiment capacity の配分だからです。**
そして 5 を本気で伸ばすなら、ソース重み付けではなく、**experience → reaction → next state** の ABM に設計を切り替えるべきです。
この変更を入れると、案は「AIで顧客の声を読む」から「AI-native企業の人間状態配分システム」まで上がります。


結論から言うと、**BONSAI はそのままの単独名では厳しい**です。
理由は、すでにソフトウェア／SaaS文脈でかなり使われています。少なくとも現時点で、業務管理SaaSの **Bonsai / Hello Bonsai**、検索基盤SaaSの **Bonsai**、マーケティング基盤の **Bonsai**、ロボティクス企業の **Bonsai Robotics** が存在します。App Storeにも Bonsai 名義の業務アプリがあります。([ハローボンサイ][1])
この引用が支えているのは、「BONSAI」が未使用の新規名称ではなく、すでに複数の近接カテゴリで運用されているという点です。なので、少なくとも**プロダクト名としての衝突リスクは高い**です。

なお、USPTO と WIPO には公式検索入口がありますが、今回こちらで確認できたのは「公式DBがある」ことと、実運用中の同名サービスが複数あることまでです。日本での最終的な登録可否までは、この場では断定しません。J-PlatPat / USPTO / WIPO で**区分指定込み**の正式確認が必要です。([特許庁][2])
この引用が支えているのは、「正式な法的クリアランスは別工程」という点です。ここを飛ばして「使える」と断定するのは危ない。

---

## 7をどう差し替えるか

あなたが入れたいのは「死亡前診断仮説を継続実行する」です。
これはかなり筋がいいです。前の iteration 7 より良い。

元の案は「ライブ入力でその場で違いを見せる」寄りでしたが、あなたが本当に持ち込みたいのは **one-shot decision** ではなく **continuous pre-mortem** です。
つまりシステムの役割は、

* 何を作るか決める
  ではなく
* **今進んでいる案が、どう死ぬかを先回りして診断し続ける**

です。

この形にすると 7 はこう置き換えられます。

### Iteration 7 改訂版

**Static decision demo → Continuous death-before-build diagnosis**

システムは各案に対して常に次を出す。

* この案は何によって死ぬか
* その死因の兆候は今どこまで見えているか
* どの仮説が未検証か
* どの体験変更で死亡確率を下げられるか
* それでも kill すべきか

これで build/kill は結果になり、主役は **継続的な死亡前診断** になります。

---

## 8を BONSAI に紐づけて説明するなら

ここは「日本の盆栽」を雑に和風メタファーとして使うと弱いです。
使うなら、意味をかなり絞るべきです。

盆栽で使える要素は4つだけです。

### 1. 盆は Constitution

盆栽は「何でも好きに伸ばす」ものではない。
鉢という境界が先にある。
このプランでいうと、**Brand Constitution が鉢**です。
何を育てるかより先に、どこまで伸ばしてよいかの境界がある。

### 2. 剪定は Kill

盆栽の価値は成長量ではなく、**捨て方の精度**にある。
枝を増やすことではなく、どの枝を切るかで形が決まる。
このプランでいうと、Kill engine は失敗判定ではなく、**造形行為そのもの**です。

### 3. 針金は Guided Autonomy

盆栽は完全放置でも完全固定でもない。
自律成長させながら、方向だけ与える。
これは「AI agents are autonomous but belong to a brand framework」という元資料の中核と一致しています。
この引用が支えているのは、元プラン自体が「自律と帰属の両立」を核にしている点です。BONSAI比喩はここにだけ使うのが正しい。

### 4. 死亡前診断は樹勢管理

盆栽は枯れてから対処するのでは遅い。
葉色、芽、根、伸び方の微妙な変化で先に診る。
あなたの言う「死亡前診断仮説の継続実行」は、この部分に対応する。

だから 8 はこう説明できます。

> BONSAI is not about growing many branches.
> It is about constitutional constraint, continuous pruning, and pre-mortem care.

日本語で言い切るなら、

> **BONSAI は、増やすためのシステムではなく、枯れる前に診て、切ることで形を守るシステム。**

これなら和風記号ではなく、概念として使えます。

---

## ただし名前は削った方がいい

コンセプト比喩として BONSAI は使えます。
でも**製品名として BONSAI 単独は避けた方がいい**です。理由は2つです。

1. 既存同名が多い
2. 名前だけで機能が伝わらない

なので使い方はこうです。

* 製品名にしない
* 内部コードネーム or pitch metaphor にする
* 外向け正式名は別にする

例えば:

* **Constitutional Product Allocation System**
* **Pre-Mortem Allocation Engine**
* **Pruning Engine for AI-Native Products**
* **Brand Constitution Kill Loop**

BONSAI は副題に留める。

例:

* **Pruning Engine — BONSAI for AI-native product decisions**
* **BONSAI Loop: constitutional pruning before build**

---

## 削って削って削ると、残すべきコンセプトはこれだけ

今の資料はまだ多いです。
特に以下は削れます。

* live scraping
* Product Hunt 追加
* Rork MAX
* 多ソース統合の演出
* ダッシュボードの豪華さ
* PM代替の主張
* full autonomous loop の強調

元資料でも今の核はすでに「Brand Constitution × Multi-Spawn × Kill Decision」ですが、ここでもまだ広いです。
この引用が支えているのは、現行案がなお複数要素を抱えすぎているという点です。最小化するなら Multi-Spawn すら一度外した方がいい。

### 最小コンセプト

**AI-native product teams need continuous pre-mortem pruning, not more idea generation.**

日本語でさらに詰めると、

> **AI時代に不足するのは案ではない。枯れる前に診て、切る判断である。**

システムの最小構成は3要素だけです。

### Input

* Brand Constitution
* 候補体験 3件
* 各体験に対する観測シグナル少量

### Core

* 死亡前診断仮説
* constitutional violation 判定
* kill / defer / continue の判定

### Output

* この案は何で死ぬか
* 何を見ればその死因を早期検知できるか
* 今切るべきか、1実験だけ延命すべきか

これだけです。

---

## ここまで削った後の一文

外向けには、もうこれでいいです。

**BONSAI is a continuous pre-mortem pruning system for AI-native product decisions.**
**It does not generate more ideas. It diagnoses how ideas die before teams waste time building them.**

日本語なら、

**BONSAIは、AIネイティブ企業のための継続的な死亡前診断と剪定のシステムです。**
**案を増やすのではなく、案がどう死ぬかを先に診て、切るべきものを切る。**

---

## ダメ出し

はっきり言うと、今の案の一番ダメなところは **まだ機能を足したがっていること** です。

* discovery を入れたい
* ABM を入れたい
* live demo を強くしたい
* prototype 生成も見せたい
* naming に意味も持たせたい

全部入れるとまた散ります。

今残すべき核は一つです。
**continuous pre-mortem pruning** です。

BONSAI を使うなら、そこにしか使わない方がいい。
逆に言うと、そこに絞れないなら BONSAI 比喩も要りません。

必要なら次に、
**この最小コンセプトを90秒ピッチ、1画面UI、デモ手順の3点にまで削って書き直します。**

[1]: https://www.hellobonsai.com/?utm_source=chatgpt.com "Bonsai - Business management software"
[2]: https://www.uspto.gov/trademarks/search?utm_source=chatgpt.com "Search our trademark database"

