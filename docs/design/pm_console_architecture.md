# BONSAI PM Console Architecture

## 目的

この文書は、`Phase2-0 Chat / Agent / Promote / Decision Log` 以降に出てきた議論を、`Cursor for PM` としての BONSAI の設計方針にまとめ直したものである。

issue は実装順序を定義するが、この文書は以下をまとめて扱う。

- PM が AI とどう対話するか
- 会話をどう artifact に変えるか
- Evidence / Card / Execution をどう一枚の console に統合するか
- allocation-first を壊さずに generation と actuation をどうつなぐか
- backend agent と A2A をどう位置づけるか
- YC demo でどこまで見せれば十分か

## 1. 基本認識

Cursor が解いた本質は、`Agent による完全自動開発` ではなく、`intent -> code` の圧縮だった。
同じように BONSAI が解くべきものは、`AI PM` や `PRD generator` ではなく、`evidence -> judgment -> actuation` の圧縮である。

PdM の仕事も変わる。

- 以前: 機能を整理し、仕様を書き、実装へ渡す
- これから: evidence に基づいて、どの user state transition に投資するかを決め、何を build / defer / kill するかを一貫して選ぶ

したがって BONSAI の出力単位は、単なる feature ではなく `evidence-backed experience` である。

## 2. Phase2-0 の設計原則

Phase2-0 で確定したことは、`会話を source of truth にしない` ことである。

### 2.1 Chat と Agent の分離

- `Chat`
  - 探索、比較、壁打ち、要約、草案づくり
  - thinking surface
- `Agent`
  - policy / card / packet / issue / action を更新する
  - state-changing operator

この分離がないと、AI とのやり取りは flow として流れ、組織の判断が残らない。

### 2.2 Promote

会話の中で価値があるものは、そのままにせず artifact に昇格させる。

- `Promote to Policy Update`
- `Promote to Card`
- `Promote to Evidence Note`
- `Promote to Execution Packet`
- `Promote to Issue Draft`

Promote は、会話と実装の間にある橋である。

### 2.3 Decision Log

残すべきものは transcript 全文ではなく、decision diff である。

最低限残すべき履歴:

- build / defer / kill の変更
- policy version の差分
- override reason
- approver
- external action の実行結果

共有の単位も会話ではなく artifact にする。

## 3. PM Console の情報設計

BONSAI は card viewer ではなく、PdM の operating console として設計する。

### 3.1 3レイヤー構成

左から右へ、以下の 3 レイヤーで構成する。

1. `Evidence Layer`
2. `Judgment / Card Layer`
3. `Execution / Ship Layer`

意味としては、`何が起きているか -> 何をやるか -> どう実行されるか` の流れである。

### 3.2 Evidence Layer

左カラムには、出所の違う信号を first-class に並べる。

- customer interview
- CRM note
- support ticket
- win / loss signal
- product usage event
- funnel drop-off
- app review
- community / X / market signal
- account / actor context

重要なのは、これらをすべて `Observation` に正規化し、provenance を残すことである。

### 3.3 Judgment / Card Layer

中央カラムは build / defer / kill の card を表示する。

各 card は少なくとも以下を持つ。

- verdict
- supported / contradicted evidence
- relevant constitution clauses
- confidence / score
- missing evidence
- next action

PdM がつらいのは、1枚の card を読むことではなく、複数の card を同じ基準で整合的にさばくことである。
BONSAI はその基準を外在化する。

### 3.4 Execution / Ship Layer

右カラムは build team と deploy team を分けて考えるのではなく、`action -> build -> ship -> learn` を 1 本で扱う。

ここに置くもの:

- GitHub issue / PR
- Linear issue
- Execution Packet
- Rork brief / Rork clone / preview
- approval / rejection
- released status
- post-ship usage signal

### 3.5 N:N リンク

Evidence と card は 1:1 ではない。N:N の link が見える必要がある。

最低限必要な link:

- `Observation -> Theme`
- `Observation -> Card`
- `Card -> Action`
- `Action -> Runtime Signal`
- `Runtime Signal -> Observation`

この最後の戻り線があることで、BONSAI は閉ループになる。

## 4. Card の次アクション

card は verdict を出して終わりではなく、次の処理まで持つべきである。

### 4.1 デフォルトアクション

- `BUILD`
  - primary: `Send to Rork`
  - secondary: `Add to Linear`, `Add to GitHub Issue`
- `DEFER`
  - primary: `Add to Linear`
  - secondary: `Add to GitHub Issue`, `Request More Evidence`, `Send to Rork`
- `KILL`
  - primary: `Add to GitHub Issue`
  - secondary: `Add to Linear`, `Create Salvage Proposal`

### 4.2 注意点

同じ `Add to GitHub Issue` でも verdict によって payload は変わる。

- build: 実装 issue
- defer: 再評価条件つき issue
- kill: kill log / salvage issue

BONSAI の役割は、判断を action に変換することである。

## 5. Evidence Loop

新しい evidence は AI の中から自然発生するわけではない。外部の事実と実行結果から入ってくる。

### 5.1 Evidence の主な流入元

1. 顧客 / 市場
   - interview
   - CRM
   - support
   - app review
   - community
2. プロダクト利用
   - usage events
   - retention
   - drop-off
   - adoption
3. BONSAI の実行結果
   - override
   - experiment result
   - Rork prototype feedback
   - release 後の usage

### 5.2 Provenance の分類

- `primary_evidence`
  - 生の事実
- `derived_evidence`
  - AI による要約、推論、cluster、theme
- `decision_evidence`
  - override、approval、experiment result、runtime outcome

AI は primary evidence を作るのではなく、既存 evidence を判断可能な形に正規化する。

## 6. Backend Agent の見せ方

Cursor for PM では backend 側で複数の AI agent が動いていることが期待される。
ただし、agent を会話するキャラクターとして見せるのは弱い。

### 6.1 想定する agent

- `Evidence Agent`
- `Judgment Agent`
- `Review Agent`
- `Handoff Agent`
- `Governance Agent`

### 6.2 UI 上の見せ方

主画面とは別に `Agent Activity Rail` を置く。

表示例:

- `Evidence normalized`
- `3 cards killed by policy`
- `Execution packet generated`
- `Rork brief prepared`
- `Waiting for approval`

agent は spinner ではなく、artifact producer として見せる。

## 7. Allocation-first Actuation

generation は必要だが、allocation より前に来てはいけない。

守るべき順序は次である。

`Constitution -> Evidence -> Allocation -> surviving proposal -> Generation -> Policy Check -> Human Approval`

この形なら generation は BONSAI の本体ではなく actuation layer である。

### 7.1 役割分担

- `BONSAI`
  - judgment layer
- `Rork`
  - actuation layer
- `Blaxel`
  - sandbox layer
- `Unbound` など
  - 将来の runtime governance layer

### 7.2 Rork への接続モデル

現時点では、Rork は BONSAI core の必須依存ではない。
ただし、allocation を通過した proposal を体験に変える downstream actuator としては非常に重要である。

接続の基本単位は次の通り。

- `Execution Packet`
- `Rork Brief`
- `Rork clone project`
- `GitHub sync`
- `preview URL`
- `policy check result`

設計上は、BONSAI repo と Rork-generated repo は分かれていてよい。
BONSAI は controller / judge、Rork repo は actuated artifact として扱う。

### 7.3 Variant Registry

少なくとも以下のメタデータを registry として持つ。

- `proposal_id`
- `execution_packet_id`
- `constitution_id`
- `rork_project`
- `github_repo`
- `preview_url`
- `approval_status`

## 8. A2A Platform と BONSAI の位置づけ

GPT Marketplace / Claude Marketplace が広がる中で、A2A Platform は `AI アプリの置き場` ではなく、`ユーザー許諾つきの agent 間データ流通基盤` として定義されるべきである。

必要な要素:

- identity
- consent
- policy
- data contract
- execution contract
- audit log
- revocation
- compensation

BONSAI の文脈では、BONSAI はそのネットワークの中の `judgment node` である。

- CRM agent から evidence を受ける
- analytics agent から usage signal を受ける
- BONSAI が build / defer / kill を決める
- Rork / GitHub / Linear agent に action を渡す
- governance agent が逸脱を監視する

## 9. YC Demo で必要な範囲

YC demo で必要なのは Phase3 の完成ではない。

### 9.1 必須

- constitution を入れる
- 同じ evidence に対して build / defer / kill が変わる
- card から evidence と clause が見える
- card から次アクションへ進める

### 9.2 あると強い

- build になった 1 件だけを Rork に送る
- clone / GitHub sync / preview return を 1 回見せる

### 9.3 まだ不要

- 複数 variant の自動ループ
- Virtual Staff の本実装
- user state refinement の深掘り
- runtime governance の本実装

したがって、demo の現実的な重心は `Phase2 core + Phase2.5 の最小 actuation` である。

## 10. Phase の整理

- `Phase1`
  - Constitution -> Evidence -> Build / Defer / Kill
- `Phase2-0`
  - Chat / Agent / Promote / Decision Log
- `Phase2 core`
  - evidence drill-down
  - execution packet
  - coding agent export
- `Phase2.5`
  - Experience Actuation Stretch
- `Phase3`
  - Rork experiment loop
  - Virtual Staff
  - user state refinement
  - runtime governance

`Phase3.5` は今のところなく、`Phase2.5` が actuation bridge の役割を持つ。

## 11. まとめ

BONSAI は、`AI が PM の代わりに決める` ツールではない。
`evidence を card に変え、card を action に変え、その履歴を artifact として残す PM console` である。

そのために必要なのは次の 4 点である。

- conversation ではなく artifact を source of truth にする
- Evidence / Judgment / Execution を 1 つの画面とデータモデルでつなぐ
- allocation-first を守ったまま actuation を downstream に置く
- AI agent を theater ではなく operating layer として見せる
