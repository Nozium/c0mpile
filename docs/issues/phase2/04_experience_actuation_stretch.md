# Phase2-4 Experience Actuation Stretch

- Status: Proposed
- Depends on: `02_execution_packet_generation.md`
- Classification: Stretch (Phase2.5)

## 背景

BONSAI の allocation pipeline は constitution → evidence → build/kill 判定 → execution packet まで到達する。
しかし execution packet がテキストで止まると、BONSAI は強い judgment tool であっても "Cursor for PM" の完成形にはならない。

allocation の結果として generation が走る形であれば、BONSAI の allocation-first 原則を壊さずに、判断から体験反映までの一気通貫が成立する。

重要な前提:
- generation は allocation を置き換えない
- kill / defer が generation より先に確定している
- generation は build に通ったものだけに限定する
- generation の出力も constitution で再チェックする

つまり順序はこうなる:

```
Constitution -> Evidence -> Allocation -> surviving proposal -> Generation -> Policy Check -> Human Approval
```

この形なら generation は actuation であって、BONSAI の本体を侵食しない。

## 目的

build 判定を通過した proposal の execution packet を、Rork でプロトタイプ体験に変換し、Blaxel sandbox で安全に実行・検証できるようにする。

## BONSAI エコシステムでの役割分担

| Layer | 担当 | 役割 |
|---|---|---|
| Judgment | BONSAI | 何を build / kill するか決める |
| Actuation | Rork | surviving proposal を体験に変換する |
| Sandbox | Blaxel | 体験生成と実行を安全に sandbox 化する |
| Governance (将来) | Unbound 系 | 実行中の policy / constitution 違反を監視する |

## スコープ

- Execution Packet → Rork prompt / spec 変換
- Rork output → Blaxel sandbox 実行
- Constitution compliance check（生成された体験が constitution に違反していないか）
- Human approve / reject フロー
- 1 proposal → 1 generated experience に絞った demo シナリオ

## 非スコープ

- 複数 variant の自動生成
- 自動 publish / 自動反映
- Fully autonomous generation loop
- Rork を core pipeline の必須依存にすること
- Live での大量生成
- Rork 以外の prototype generator 対応

## 実装タスク

- Execution Packet から Rork 向け prompt / spec を生成するアダプタを作る
- Rork API 呼び出しと output の取得を実装する
- Blaxel sandbox 上で Rork output を実行する連携を作る
- 生成された体験を constitution clause で再評価するパスを作る
- constitution violation を検出した場合の flag 表示を実装する
- human approval / rejection の UI フローを作る
- demo 用に 1 proposal → 1 experience の固定シナリオを用意する

## 受け入れ条件

- build 判定済み proposal の execution packet から、Rork で体験を生成できる
- 生成された体験を Blaxel sandbox 上で確認できる
- 生成された体験に対して constitution compliance check が走る
- constitution violation を最低 1 件 flag できる
- 自動反映ではなく human approval required になっている
- demo で「constitution を変えたら判断が変わり、体験も変わる」を見せられる

## 確定していること

- allocation-first を守ったまま generation を downstream に置く
- generation は build 通過案のみに限定
- 自動反映はしない（human approval required）
- Rork は actuation layer であり、BONSAI の core ではない
- Phase2 core（P2-1, P2-2, P2-3）が閉じてから着手する

## 未確定 / 要確認

- Rork API の安定性と rate limit
- Blaxel sandbox の実行環境制約
- constitution compliance check をどのモデルで実行するか
- Rork が落ちた場合の fallback（execution packet テキストのみに退行）
- 将来的に Unbound を governance layer として追加するタイミング

## デモでのインパクト

Phase2.5 がデモで動けば、speech のメッセージを拡張できる:

> "Constitution in, allocation out, experience generated — all policy-checked before it ships."

これにより BONSAI は「判断ツール」から「judgment-driven product generator」に進化する。
ただし、demo では 1 proposal → 1 experience に絞り、失敗点を最小化する。
