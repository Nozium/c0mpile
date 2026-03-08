# BONSAI 死亡前診断仮説

> このプロダクトが成立しない条件を、死因ごとに構造化する。

---

## Death Hypothesis 1: 過剰生産テーゼそのものが間違っている

### 死因

「AI時代に希少なのは判断である」という前提が成立しない。実際には build ability もまだ希少であり、ほとんどの組織は overproduction ではなく underproduction に苦しんでいる。

### 兆候

- AI coding tools の導入率が想定ほど伸びない
- 「何を作るか」より「どう作るか」の方が依然としてボトルネックである企業が多数派
- PM の仕事が「案を絞る」ではなく「案を出す」のまま変わらない

### 現時点の信号

弱い。Cursor, Claude Code, Devin 等の急速な普及は production cost の低下を裏付けている。ただし、これが「案の過剰」に到達しているかの直接的エビデンスはまだ薄い。AI coding tools を使っている組織でも、PM プロセスの変化を報告しているケースは限定的。

### Kill Trigger

AI coding tools の普及が2年以内に30%を超えても、PM の判断負荷が増えたという定量的報告が出てこない場合。

---

## Death Hypothesis 2: Kill は誰も買わない

### 死因

「何を殺すか」を売りにしたプロダクトは、心理的に拒絶される。PM は自分の案を殺されたくない。組織は build の承認フローを持っていても、kill の承認フローを持っていない。Kill を主語にした瞬間、導入の政治的障壁が跳ね上がる。

### 兆候

- デモで kill board を見せたとき、反応が「面白い」で終わり「使いたい」にならない
- 導入検討時に「うちは kill より build 提案が欲しい」と言われる
- kill reasoning を見た PM が防御的になる
- 競合が build-first のポジショニングで先に市場を取る

### 現時点の信号

中程度。PM コミュニティでの「何を作らないかが重要」という言説は増えているが、それを **ツールとして購入する** 意思があるかは未検証。思想としての支持とプロダクトとしての需要は別物。

### Kill Trigger

初期ユーザー10社中、Kill Board を主画面として使い続ける企業が2社以下の場合。

---

## Death Hypothesis 3: Brand Constitution が機能しない

### 死因

3行テキスト ("We are / We never / We value") から5軸に正規化する工程が、実用的な判定精度を出せない。入力が曖昧すぎて clause が空虚になるか、正規化が恣意的で kill の説得力が出ない。

### 兆候

- 異なる表現で同じ意図を入力しても、正規化結果がばらつく
- 正規化された clause を見た創業者が「これは我々の意図と違う」と言う
- kill reason が clause に基づいていると謳いつつ、実質 LLM の自由生成と変わらない
- ユーザーが constitution を何度も書き直すが、出力の質が変わらない

### 現時点の信号

強い。これは最も危険な死因。LLM による自然言語 → 構造化ルールの変換は、現時点でも hallucination や過度な解釈のリスクが高い。"We never sell user data" を `prohibited_business_model: "data monetization"` に正規化できるかは、入力の書き方に強く依存する。

### Kill Trigger

10社の constitution を正規化し、創業者に「この clause は正しいか」と確認して、正答率が70%を下回る場合。

---

## Death Hypothesis 4: 既存ツールに吸収される

### 死因

Productboard, Linear, Notion AI, ChatPRD 等の既存ツールが kill / prioritization 機能を追加し、BONSAI の差別化が消える。既存のワークフローに組み込まれたツールに後付けされた kill 機能の方が、新規プロダクトより導入障壁が低い。

### 兆候

- Productboard Spark が "kill recommendation" 機能を発表する
- Linear が AI-driven prioritization で build/kill 判定を搭載する
- 既存ツールのユーザーが「わざわざ別ツールを入れる理由がない」と言う
- BONSAI の constitution-based approach よりも、既存データとの統合度の方が価値を持つ

### 現時点の信号

中程度。Productboard Spark は2026年1月に public beta を出しており、PM AI の領域は急速にコモディティ化している。ただし constitution-based kill reasoning を搭載したツールは現時点で存在しない。

### Kill Trigger

BONSAI のローンチから6ヶ月以内に、上位3社の PM ツールのうち2社以上が clause-based kill reasoning を搭載した場合。

---

## Death Hypothesis 5: Execution Packet が使い物にならない

### 死因

LLM が生成する UI変更案・データモデル変更案・coding agent タスク分解が、実際のコードベースと乖離しすぎて、エンジニアが使えない。「こんな抽象的な指示ではコードは書けない」と言われ、結局 PM が自分で仕様書を書き直す。

### 兆候

- Execution Packet を受け取ったエンジニアが、そのままでは作業開始できない
- coding_agent_tasks を Cursor/Claude Code に渡しても、有用なコードが生成されない
- 「仕様が粗すぎる」「コンテキストが足りない」というフィードバック
- ユーザーが Execution Packet を無視して、Feature Outline だけ使う

### 現時点の信号

中〜強。LLM は「それらしい仕様書」を書けるが、特定のコードベースの context なしに actionable な変更案を書くのは現在の技術では困難。BONSAI はコードベースにアクセスしない設計なので、Execution Packet は必然的に抽象度が高くなる。

### Kill Trigger

Execution Packet を生成した案件の50%以上で、エンジニアが packet を使わず独自に仕様を書き直す場合。

---

## Death Hypothesis 6: データ不足で判断が空回りする

### 死因

constitution + observations → allocation という設計は、十分な量と質の observation があることを前提にしている。実際には、初期段階のスタートアップは customer interview 5件、App Store review 0件、usage data 断片的という状況。データが少なすぎると、LLM は hallucinate し、allocation score は根拠のない数字になる。

### 兆候

- observation 数が30未満の状態で pipeline を回すと、theme が1-2個しか出ない
- evidence_strength_score が常に低く、ほぼ全案が defer になる
- ユーザーが「データが足りないから使えない」と離脱する
- pre-mortem の death_cause が observation ではなく LLM の推測に依存する

### 現時点の信号

強い。初期スタートアップ (BONSAI の最も自然なターゲット) ほど、この問題に直面する。データリッチな大企業は既存ツールで十分であり、BONSAI を必要としない可能性がある。

### Kill Trigger

ターゲットユーザーの80%以上が「observation 50件未満」の状態でしか使えず、その状態での allocation 精度がランダムと有意差がない場合。

---

## Death Hypothesis 7: allocation は人間がやった方が早い

### 死因

経験豊富な PM / 創業者にとって、build/kill の判断は直感で3秒でできる。BONSAI の constitution 入力 → pipeline 実行 → 結果確認 のフローは、その3秒の判断を5分かけて再現しているだけ。判断の外在化・追跡可能性に価値を感じる組織が少ない。

### 兆候

- 「結果を見たが、自分が最初に思ったのと同じだった」という反応
- 一度使って「面白い」と言うが、繰り返し使わない
- 組織内で allocation の透明性・追跡可能性を求める声がそもそも存在しない
- 「PM の勘」で回っている組織が大半で、勘を外在化するインセンティブがない

### 現時点の信号

中程度。小規模チームでは PM の直感が高速で正確。BONSAI の価値は「PM が10人いて判断基準がばらつく」「候補が30以上あり人間の認知限界を超える」スケールで初めて発揮される可能性がある。

### Kill Trigger

初期ユーザーの週次 retention が30日後に20%を下回る場合。

---

## Death Hypothesis 8: Cloudflare edge で LLM pipeline が動かない

### 死因

4-step LLM pipeline (特に Sonnet による constitutional filter + execution packet 生成) は、Cloudflare Workers の CPU 時間制限・メモリ制限に収まらない。streaming でも timeout し、ユーザー体験が破綻する。

### 兆候

- pipeline run が30秒以上かかり、ユーザーが離脱する
- Cloudflare Workers の CPU 制限 (50ms / invocation on free, 30s on paid) に引っかかる
- SSE が途中で切れる
- 複数ユーザーの同時利用でコストが急増する

### 現時点の信号

中程度。LLM API call 自体は外部呼び出しなので CPU 制限には引っかかりにくいが、4段のチェーンは total latency が長くなる。paid plan の Workers は30秒制限だが、pipeline 全体は十分収まる見込み。ただし Execution Packet 生成が重い場合はリスクがある。

### Kill Trigger

実装時に pipeline の p95 latency が60秒を超え、architectural な変更なしに解決できない場合。

---

## 総合リスクマップ

| # | 死因 | 可能性 | 致命度 | 検証可能性 |
|---|---|---|---|---|
| 1 | 過剰生産テーゼが間違い | Low | Critical | 中期 (市場観察) |
| 2 | Kill は誰も買わない | Medium | Critical | 短期 (初期ユーザーの反応) |
| 3 | Brand Constitution が機能しない | High | Critical | 即時 (プロトタイプで検証可) |
| 4 | 既存ツールに吸収される | Medium | High | 中期 (競合動向) |
| 5 | Execution Packet が使えない | Medium-High | High | 短期 (エンジニアに渡して検証) |
| 6 | データ不足で空回り | High | High | 即時 (少数データで pipeline 試行) |
| 7 | 人間の方が早い | Medium | High | 短期 (retention 計測) |
| 8 | Edge で pipeline 動かない | Medium | Medium | 即時 (実装で判明) |

---

## 最優先で検証すべき3仮説

1. **#3 Brand Constitution が機能しない** — 最も致命的かつ即時検証可能。10社分の constitution を正規化し、創業者に正答率を確認する。これが機能しないなら、システム全体が崩壊する。

2. **#6 データ不足で空回り** — ターゲットユーザーの典型的なデータ量 (interview 5件、review 20件) で pipeline を回し、allocation の質を検証する。ゴミが出るなら、ターゲット市場の再定義が必要。

3. **#2 Kill は誰も買わない** — 思想の支持とプロダクトの購買は別物。Build Next Board を前面に出しつつ Kill Board の利用率を計測し、kill が実際に使われるかを確認する。
