# Phase1-1 Constitution Input And Parser

- Status: Done
- Depends on: なし

## 背景

`bonsai_mvp.md` では Constitution 3 行が MVP の最初の入力であり、demo でも live に変化を見せる必須要素になっている。したがって parser は Phase1 の先頭に置く。

## 目的

`We are / We never / We value` を executable clause に正規化し、allocation と demo の両方で使えるようにする。

## スコープ

- constitution input UX
- clause schema
- 5軸正規化
- desired / forbidden transition の最小表現
- live preview と再評価導線

## 非スコープ

- multi-constitution 比較 UI の作り込み
- 組織別権限や version governance の本格運用
- planning brief 専用 UX

## 実装タスク

- constitution parser API を設計する
- hard / soft clause の優先度を持たせる
- clause preview を input UX に返す
- 禁止パターンと quality bar を allocation に反映する
- demo 用の Constitution A / B fixture を用意する
- 10 社程度で clause 正規化の妥当性を検証する
- constitution を書けないユーザー向けに対話型入力への fallback を設計する

## 受け入れ条件

- 3 行入力から clause 群を生成できる
- clause が allocation と evaluation の両方で参照される
- hard violation を検出可能になる
- Constitution を変えると下流の結果を変えられる
- demo 用の Constitution A / B を再利用できる
- 正規化結果について、対象ユーザーの 80% 以上が「正しい / ほぼ正しい」と評価する

## 確定していること

- 5軸正規化は既存設計に沿う
- constitution は UX 入力でありつつ、内部では機械評価可能である必要がある
- H-4 は Phase1 で前に進める

## 実装結果

- `src/features/phase1/constitution/parser.ts` — `parseConstitution(id, label, rawInput)` で 3行入力 → 5軸正規化 → clause 群を生成
- `src/features/phase1/constitution/ConstitutionInput.tsx` — preset A/B 選択 + custom 入力モード、clause preview 付き
- `src/lib/schema/constitution.ts` — Zod schema: `ClauseSchema` (id, axis, source_line, text, type: hard|soft, polarity: desired|forbidden)
- hard clause (we_never → forbidden) / soft clause (we_are, we_value → desired) を区別
- custom constitution が allocation に inline で流れる (`/api/allocate` が `{ constitution }` を受付)
- Constitution 変更で board が即時再評価される導線を実装
- テスト 7件 pass (`constitution-parser.test.ts`)

## 未確定 / 要確認 (解決済み)

- ~~clause の最終 schema~~ → ClauseSchema (id, axis, source_line, text, type, polarity)
- ~~clause weight を設定可能にするか~~ → Phase1 では weight なし、hard/soft の 2段階
- ~~desired transition を phase2 でどこまで使うか~~ → Phase2 以降に持ち越し
- ~~constitution を自力で書けないユーザーの入力 UX~~ → preset A/B + 3 textarea での最小 UX を実装
