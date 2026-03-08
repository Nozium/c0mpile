---
Title: BONSAI Claude Fit Review + Rork Spec Addendum
Target: docs/design/bonsai_claude.md
Reference: docs/01_cursor-for-product-managers.md
Status: Draft v0.1
---

# BONSAI Claude の適合性評価

## 0. この文書の役割

この文書は 2 部構成です。

- **Part I: Review**
  - `docs/design/bonsai_claude.md` が `docs/01_cursor-for-product-managers.md` にどれだけ適合しているかを評価する
- **Part II: Recommended Spec Addendum**
  - `docs.rork.com` の公式ドキュメントをもとに、BONSAI の仕様に追加すべき gate / kill rule を提案する

したがって、前半は評価文書、後半は設計追補です。
後半の提案は `bonsai_claude.md` の現行仕様そのものではなく、**追加すべき運用ルール** として扱う。

## 1. 結論

`docs/design/bonsai_claude.md` は、`docs/01_cursor-for-product-managers.md` の中心命題である
「AI を使って、何を作るべきかを判断するシステム」
にはかなり合っています。

ただし、`docs/01` が具体的に求めている

- customer interviews と product usage data を入力すること
- "what should we build next?" に直接答えること
- 新機能の outline を返すこと
- UI changes / data model modifications / workflow adjustments を提案すること
- coding agents 向けに開発作業を分解すること

まで含めて見ると、現状の `bonsai_claude.md` は **部分適合** です。

総合評価としては、

- **思想適合**: 高い
- **プロダクト要件適合**: 中程度
- **実装具体性**: 高い
- **RFS への字義どおりの適合**: 中程度

と整理できます。

一言で言うと、
**`bonsai_claude.md` は "Cursor for PM" というより "Constitutional Allocation / Kill System" に強く寄っている。**

## 2. 要件別適合性

| `docs/01` の要求 | 適合度 | 評価 |
| --- | --- | --- |
| 顧客会話の取り込み | 部分適合 | App Store / X / ProductHunt はあるが、customer interviews が一次入力として定義されていない |
| product usage data の取り込み | 不足 | usage events / analytics / funnel / retention signal が first-class input になっていない |
| フィードバック統合 | 適合 | Extract / Cluster / Evidence Trail で統合設計はできている |
| 市場理解 | 適合 | 観測チャネル、state estimation、theme clustering がある |
| "何を作るべきか" への回答 | 部分適合 | build / defer / kill を返せるが、主役が kill board で build-next の体験が弱い |
| 新機能 outline の提示 | 部分適合 | proposal はあるが、feature outline の標準出力が弱い |
| なぜその変更が必要かの説明 | 適合 | clause-based reason, evidence trail, pre-mortem がある |
| UI変更の提案 | 不足 | UI change を返す明示的 output schema がない |
| データモデル変更の提案 | 不足 | data model modification を返す明示的 output schema がない |
| ワークフロー変更の提案 | 不足 | workflow adjustment を返す明示的 output schema がない |
| coding agent 向け分解 | 不足 | execution packet や task decomposition が未定義 |
| 統合された product discovery cycle | 部分適合 | pipeline は統合されているが、governance / pruning に寄り、discovery cycle 全体を満たすには不足が残る |

## 3. 良い点

### 3.1 差別化が明確

`bonsai_claude.md` は単なる AI PM ツールではなく、
「何を build するか」より「何を kill するか」を主役にしている。
これは既存の AI PM カテゴリとの差別化として強い。

### 3.2 憲法モデルが実行可能な形になっている

`We are / We never / We value` を 5 軸に正規化し、
判定可能な構造へ落としている点は非常に良い。
これにより出力が LLM の雰囲気ではなく、ルールに基づく判断として説明しやすい。

### 3.3 Explainability が強い

以下がそろっているため、説明責任の設計は強い。

- evidence trail
- violated clauses
- kill type
- pre-mortem diagnosis
- build_if / kill_because の counterfactual 対

これは `docs/01` の「なぜそれを作るべきか」の説明要求に対して強い基盤になる。

### 3.4 実装に落としやすい

概念だけでなく、以下が具体化されている。

- Zod schema
- 3-step LLM pipeline
- API design
- UI hierarchy
- MVP scope
- deploy 方針

そのため、実装用ドキュメントとしての密度は高い。

### 3.5 MVP としての切り方が現実的

live scraping や prototype generation を切り、
pre-shaped dataset に寄せている点はスコープ管理として妥当。
ハッカソンや短期実装としての完成確率は高い。

## 4. 課題

### 4.1 `docs/01` の入力要件とずれている

`docs/01` の典型入力は:

- customer interviews
- product usage data

である。

一方 `bonsai_claude.md` は:

- App Store reviews
- X/Twitter
- ProductHunt

を主な入力としている。

これは市場シグナルとしては有効だが、
`Cursor for Product Managers` が想定する
「自社の顧客会話と利用データを入れて次を決める」
という体験とはずれる。

### 4.2 `build next` より `kill first` に寄りすぎている

`bonsai_claude.md` の強さは kill-first にあるが、
`docs/01` の主眼はあくまで
「次に何を作るかを決めること」
である。

そのため、現状のままだと

- 強い戦略OS
- 強い pruning engine

としては優れている一方、

- PM が次に何を build するかを決める作業台

としてはやや主題がずれる。

### 4.3 feature outline の標準出力が弱い

`Proposal` はあるが、`docs/01` が期待する
「新機能の outline」
としては不足がある。

最低でも以下を持つ必要がある。

- problem statement
- target user
- proposed feature
- expected user value
- why now
- success metric

現状の proposal は decision と kill reasoning が中心で、
build 案の仕様化が相対的に弱い。

### 4.4 builder 向け artifact が足りない

`docs/01` が強く要求しているのは、
判断だけでなく builder に渡す成果物である。

最低でも必要なのは以下。

- UI changes
- data model modifications
- workflow adjustments
- coding agent task breakdown

`bonsai_claude.md` にはここが欠けている。
そのため、allocation system としては成立しても、
`Cursor for PM` としての end-to-end 性は不足する。

### 4.5 product usage data の表現が不足している

`product usage data` は、単なる `observation` の一種としては弱い。
first-class object として少なくとも以下が必要。

- event name
- user segment
- funnel step
- drop-off point
- retention signal
- feature adoption signal

現状の state estimation は発想として良いが、
usage analytics との接続がまだ薄い。

### 4.6 continuous product discovery cycle としては未完成

pipeline 自体は統合されているが、
`docs/01` が示す discovery cycle は
「入力 -> 優先順位付け -> feature outline -> builder handoff」
まで含む。

`bonsai_claude.md` は現状、

- 入力
- 判定
- kill / defer / build

までは強いが、

- build 案の詳細生成
- downstream handoff

が弱い。

## 5. 全体評価

### 5.1 良い意味での逸脱

`bonsai_claude.md` は `docs/01` をそのまま実装していない。
代わりに、
`Cursor for PM` をより戦略的で制度的なシステムへ押し上げている。

この逸脱は思想としては強い。
特に以下は明確な強みである。

- Brand Constitution
- clause-based reasoning
- pre-mortem pruning
- kill board as primary UI

つまり、
**戦略コンセプトとしては前進している。**

### 5.2 しかし RFS への説明ではギャップが残る

`docs/01` の期待に対しては、
以下が不足しているため説明上のギャップが生じる。

- interviews を直接入れる体験
- usage data を直接入れる体験
- build-next artifact の明示
- UI / data / workflow / task への分解

したがって現状は、
**"excellent allocation system, incomplete Cursor for PM"**
という評価になる。

### 5.3 ハッカソンで得た追加示唆

ハッカソン会場での聞き取りから、重要な補正が入った。

#### 1. 「判断を預けたくない」は拒否ではなく、委譲条件が未定義

多くの人は
「このプロダクトが良いものかどうかを他者や AI に全面的に委ねたくない」
と答える。

ただし、これは
`AI が判断してはいけない`
という強い拒否というより、
`どこまで・どういう条件で委譲してよいかが、まだ決まっていない`
に近い。

この反応は、
coder が初期の LLM 生成コードをすぐには受け入れられず、
モデル精度、テスト、lint、eval harness、レビュー運用が整ってから徐々に受け入れた過程に近い。

したがって BONSAI の役割は、

- judgment replacement
- PM の完全自動化

ではなく、

- judgment boundary の明確化
- 条件付き委譲の設計
- evidence と policy による trust harness の提供

として定義し直した方がよい。

#### 2. 「なぜ大事か」を十分に聞けていない

聞き取りでは、機能や pain の話には乗るが、
`このプロダクトが誰かの日常にとってなぜ重要か`
まで深く取れていないことが多い。

これは BONSAI が feature / allocation / kill に寄るほど起きやすいズレであり、
user life cycle の更新や stress reduction を仮説として明示的に扱う必要がある。

#### 3. 評価の津波を考慮していない

「市場に出してインタビューする」は成立しても、
大量の AI プロダクトが同時に user feedback を取りにいく状況では、
ユーザーが評価疲れを起こす可能性がある。

このため BONSAI は
`何を build するか`
だけでなく、
`誰に、何を、どの頻度で見せるか`
という exposure allocation も扱うべきである。

#### 4. 機能設計はできても、体験設計とブランド整合の外在化は未完成

要求をもとに自動開発すること自体は概ね可能という反応がある一方で、

- 体験をどう設計するか
- それをどう共有するか
- その体験がブランドに沿っているか
- それを coding agent 向け policy としてどう規定するか

はまだ十分に形式化されていない。

これは BONSAI の中心価値が
`automatic build`
ではなく
`experience and policy alignment`
にあることを示している。

## 6. 改善提案

`bonsai_claude.md` を `docs/01` により適合させるなら、以下を追加すべきです。

### 6.1 入力モデルを拡張する

`Observation` とは別に以下を first-class に追加する。

- `InterviewTranscript`
- `UsageEvent`
- `UsageMetric`

これにより `docs/01` の入力要件に直接合わせられる。

### 6.2 `build next` を主出力として補強する

Kill Board を残しつつ、build 候補については必ず
`Feature Outline` を返す。

最低限の出力項目:

- feature_name
- target_user
- problem_statement
- why_this_now
- supporting_feedback
- expected_outcome
- success_metric

### 6.3 Builder handoff を仕様に入れる

`Proposal` とは別に `ExecutionPacket` を追加し、以下を返す。

- `ui_changes`
- `data_model_changes`
- `workflow_changes`
- `coding_agent_tasks`

これで `docs/01` の
「コーディングエージェント向けに開発作業を分解する」
まで到達できる。

### 6.4 UI の主画面を二層化する

主画面を以下の二層にする。

- `Build Next Board`
- `Kill / Defer Board`

こうすれば `docs/01` の要求と `bonsai_claude.md` の差別化を両立できる。

### 6.5 受け入れ条件を `docs/01` ベースに書き換える

最低でも以下を acceptance criteria に入れる。

- customer interviews を取り込める
- product usage data を取り込める
- "what should we build next?" に対して ranked proposals を返せる
- 各 proposal に理由説明がある
- build proposal ごとに UI / data / workflow 変更案がある
- coding agent へ渡せるタスク分解がある

### 6.6 判断委譲ラダーを仕様に入れる

ハッカソンでの反応を踏まえると、
BONSAI は `AI に最終判断を委ねるシステム` としてではなく、
`段階的に判断委譲を可能にするシステム` として設計した方がよい。

最低でも以下の ladder を明示する。

1. `observe`
  - 観測を集める
2. `summarize`
  - evidence を要約する
3. `rank`
  - 候補を順位付けする
4. `explain`
  - clause と evidence で理由を返す
5. `recommend`
  - build / continue / defer / kill を提案する
6. `auto-act`
  - 事前定義された条件下でのみ actuation する

このうち、多くのチームが最初に許容するのは `summarize` から `recommend` までであり、
`auto-act` は harness が整うまで後ろ倒しにするべきである。

### 6.7 Trust Harness を first-class にする

LLM code adoption と同じく、判断委譲には harness が要る。
BONSAI では最低でも以下を `trust harness` として first-class にすべきである。

- Brand Constitution
- clause priority (`hard` / `soft`)
- evidence trace
- decision log
- pre-mortem
- release gate
- submission gate
- operator override

これにより、
`AI が勝手に決める`
ではなく、
`人が受け入れ可能な条件で AI の判断を使う`
構造にできる。

### 6.8 `なぜ大事か` と daily cycle 更新を聞く入力へ変える

interview / planning の入力項目に、少なくとも以下を追加すべきである。

- このプロダクトが誰のどの瞬間に効くのか
- その人の daily cycle をどう更新するのか
- どの stress を減らすのか
- 導入後にどの頻度で価値を再発生させるのか

これが無いと、allocation はできても value thesis が弱い。

### 6.9 Exposure Allocation を検討対象に入れる

ユーザーを評価の津波に晒さないため、BONSAI の将来仕様には以下を含める余地がある。

- どの user segment に見せるか
- 何件まで同時に見せるか
- どの頻度で feedback を求めるか
- 高頻度評価対象をどう cooldown するか

これは `UX evaluation` の問題であると同時に、
`allocation system` の自然な拡張でもある。

## 7. Part II: Rork 由来の Spec Addendum

以下は `docs.rork.com` の公式ドキュメントを、BONSAI の仕様に追加すべき gate に翻訳したものです。
Rork がそのまま `kill` を定義しているわけではなく、**公式ガイドのベストプラクティスから導いた推論**として扱います。

### 7.1 Gate の分離方針

Rork 由来のルールは、すべてを同じ `kill` に入れてはいけない。
少なくとも以下の 4 段階に分ける。

| Gate | Stage | 判定対象 | 出力 |
| --- | --- | --- | --- |
| `discovery_gate` | build 前 | 案の需要・価値・体験定義 | `build` / `defer` / `kill` |
| `architecture_gate` | 実装前 | 案と実装方式の整合性 | `build` / `defer` / `kill` |
| `release_gate` | release 前 | 品質・App Review readiness | `ready_for_release` / `release_blocked` |
| `submission_gate` | store submission 前 | legal / policy / listing readiness | `ready_for_submission` / `submission_blocked` |

重要なのは以下です。

- `discovery_gate` と `architecture_gate` だけが、候補自体を `kill` しうる
- `release_gate` は候補ではなく **リリース可否** を止める
- `submission_gate` は候補ではなく **ストア申請可否** を止める

これにより、探索初期の良い案が legal や screenshot 不備だけで誤って kill されることを防ぐ。

### 7.2 Discovery Gate

#### 7.2.1 Need / Demand Gate

Source note:
`How to tell if your app idea is good`

Rork の ideation ガイドから見ると、以下は `kill` 寄りです。

- target user が広すぎる
  - 例: `everyone`, `all creators`, `small businesses`
- novelty はあるが pain が弱い
  - `nice to have` に見える
  - 既存 workaround 探索が見えない
- tarpit idea に近い
  - niche social network
  - supply のない marketplace
  - general-purpose productivity tool
  - broad AI tool with no specific user/use case
- `X for Y` の一文でしか説明できず、具体的な first user が見えない
- 早期検証を避けて pitch や vision だけで支えようとしている

推奨判定:

- `kill`
  - 痛みが弱く、ユーザー定義が曖昧で、検証シグナルもない
- `defer`
  - 問題はありそうだが、frequency / intensity の証拠が薄い
- `build`
  - 明確な target user がいて、痛みが頻発または高強度で、早期アクセスや workaround の存在が確認できる

#### 7.2.2 Experience Definition Gate

Source note:
`How to prompt succesfully`

Rork の prompting ガイドから見ると、以下は `kill` または `defer` 寄りです。

- 機能列挙しかなく、体験の質が定義されていない
- target user と mood が未定義
- primary UX goal が書かれていない
- 初期 prompt に機能を詰め込みすぎている
- `one main flow` ではなく複数フローを同時に成立させようとしている
- polish, motion, responsiveness の要求がなく、単に動けばよい仕様になっている

推奨判定:

- `kill`
  - 体験定義がないまま複雑機能だけ増えており、意図的な UX を作れない
- `defer`
  - 価値仮説はあるが、prompt が曖昧で generic UI になる可能性が高い
- `continue`
  - 価値仮説は維持しつつ、target user / mood / primary goal / constraint を再定義する

#### 7.2.3 Scope Gate

Source note:
`How to build your first app`

Rork は初期 prompt を `one main function` に寄せ、複雑さを抑えることを強く勧めています。
したがって BONSAI では以下を scope overrun とみなすべきです。

- v1 から multi-flow を前提にしている
- コア価値が 1 画面 / 1 導線で説明できない
- 追加機能が polish より先に積まれている
- iteration より initial completeness を優先している

推奨判定:

- `kill`
  - コア機能が定義できず、複数のアプリを 1 つに詰め込んでいる
- `defer`
  - コアはあるが、v1 の範囲を超えた拡張が混ざっている
- `build`
  - 1 main function から始められ、テストと反復が可能

### 7.3 Architecture Gate

Source note:
`Do You Need a Backend for Your App?`

Rork の backend ガイドを BONSAI に翻訳すると、client-only のまま進めてはいけないケースは明確です。

- account / login が必要
- user data の復元が必要
- multi-device sync が必要
- sharing / collaboration / multiplayer が必要
- cross-device で file persistence が必要
- blocking / moderation / rate limiting / anti-spam など user 間ルールが必要
- cloud memory / personalization が必要

この条件で backend なし前提の案は `architecture mismatch` とみなす。

逆に、以下は local-first / backend optional とみなせる。

- local-only app
- temporary / non-persistent tool
- external API call only で history / personalization / tracking 不要
- local-first で後から sync 追加予定

推奨判定:

- `kill`
  - 必須 backend 要件があるのに client-only で成立すると仮定している
- `defer`
  - local-first v1 では成立するが、将来 sync / personalization 設計が未整理
- `build`
  - local-only で十分、または backend 必須要件が明確で実装計画がある

### 7.4 Release Gate

Source note:
`App Review guide`, `App Store Checklist`, `Main App Store rejection reasons`, `App Store screenshots`

Rork の App Store guides を踏まえると、以下は candidate kill ではなく **release blocker** です。

- app が crash する、blank screen がある、core flow が詰まる
- App Store listing と実アプリが一致しない
- screenshots に載せた機能が動かない
- login 必須なのに demo credentials がない
- iPad support が enabled なのに properly handled されていない
- iPad screenshot が実機相当でなく、iPhone screenshot の引き伸ばしになっている
- permission description が不明確
- unavailable backend service に依存して loading で止まる

推奨判定:

- `release_blocked`
  - App Review で落ちる可能性が高い blockers が残っている
- `ready_for_release`
  - 主要導線、permission、listing consistency、device support が最低限そろっている

補足:
ここで止まる案は、**候補としての価値が無いのではなく、今は出荷できない** と判断する。

### 7.5 Submission Gate

Source note:
`How To Create a privacy policy, Terms and conditions, and EULA`

Rork の policy / paywall / checklist 系ドキュメントから、以下は candidate kill ではなく **submission blocker** です。

- user data / analytics / payments / account info を扱うのに privacy policy がない
- Terms & Conditions がない
- EULA がない
- これらの policy が app 内の Settings / Paywall から見えない
- App Store description に policy link がない
- hard paywall なのに「全機能が有料である」ことを store description に明記していない
- support URL / contact page がない

推奨判定:

- `submission_blocked`
  - 課金やデータ取得を行うのに compliance artifact が未整備
- `ready_for_submission`
  - legal / policy / pricing transparency / support metadata が最低限そろっている

補足:
ここは **法務・申請ゲート** であり、探索中の候補自体を kill する根拠にはしない。

### 7.6 BONSAI に追加すべき Taxonomy

`bonsai_claude.md` の taxonomy を拡張するなら、少なくとも以下のように分ける。

`candidate_kill_type`

- `weak_pull_or_tarpit`
- `unclear_experience_definition`
- `scope_bloat`
- `backend_mismatch`

`release_blocker_type`

- `app_review_blocker`
- `device_support_gap`
- `permission_or_listing_gap`

`submission_blocker_type`

- `compliance_gap`
- `policy_visibility_gap`
- `pricing_transparency_gap`

### 7.7 BONSAI 用の実務ルール

Rork の公式 docs を前提にすると、BONSAI は少なくとも以下を別ゲートとして持つべきです。

1. `Need / User Gate`
特定ユーザーの強い pain が説明できない案は `kill` または `defer`。

2. `Experience Gate`
feel, mood, target user, primary goal, constraint が書けない案は `build` しない。

3. `Scope Gate`
v1 を 1 main function に圧縮できない案は `kill` または分割。

4. `Architecture Gate`
backend 必須条件があるのに local-only で押し切る案は `kill`。

5. `Release Gate`
crash, broken flow, unclear permission, screenshot mismatch, login credential 欠如があれば `release_blocked`。

6. `Submission Gate`
privacy policy, terms, EULA, pricing transparency, support URL がなければ `submission_blocked`。

### 7.8 推奨する判定文テンプレート

`candidate_decision`

```text
Kill because:
- problem pull is weak / target user is too broad
- experience is under-specified for high-quality output
- v1 scope violates one-main-function constraint
- backend requirements are incompatible with local-only architecture
```

`release_status`

```text
Release blocked because:
- core flow is unstable or crashes
- App Review evidence package is incomplete
- screenshots / permissions / device support are inconsistent
```

`submission_status`

```text
Submission blocked because:
- privacy policy / terms / EULA are missing
- policy visibility is insufficient
- pricing or support metadata is incomplete
```

## 8. 最終結論

`docs/design/bonsai_claude.md` は、
`docs/01_cursor-for-product-managers.md` に対して
**完全適合ではないが、有望な拡張解釈である**。

評価を短くまとめると以下です。

- **思想としては強い**
- **差別化としては非常に良い**
- **実装仕様としても良い**
- **ただし Cursor for PM の字義どおりの要件には未達が残る**

したがって、次の方針が妥当です。

**BONSAI の allocation / pruning の強さは維持しつつ、`docs/01` が求める build-next artifact と builder handoff を明示的に追加する。**

## 9. 参照ソース

以下はいずれも `docs.rork.com` の公式ドキュメントです。2026-03-08 時点で確認しました。

- [How to prompt succesfully](https://docs.rork.com/introduction/introduction/prompting-strategy)
- [How to tell if your app idea is good](https://docs.rork.com/elements-of-a-good-idea/how-to-tell-if-your-idea-is-good)
- [How to build your first app](https://docs.rork.com/introduction/build-your-first-app)
- [Do You Need a Backend for Your App?](https://docs.rork.com/backend)
- [App Review guide](https://docs.rork.com/appstore-submission-checklist/app-review-guide)
- [App Store Checklist](https://docs.rork.com/submitting-to-app-store/apple/app-store-checklist)
- [Main App Store rejection reasons](https://docs.rork.com/appstore-submission-checklist/whats-next-after-the-apps-finished)
- [App Store screenshots](https://docs.rork.com/appstore-screenshots/app-store-screenshots)
- [How To Create a privacy policy, Terms and conditions, and EULA](https://docs.rork.com/make-your-app-profitable/paywalls/how-to-set-up-your-policies)
