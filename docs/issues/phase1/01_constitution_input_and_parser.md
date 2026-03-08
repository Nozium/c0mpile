# Phase1-1 Constitution Input And Parser

- Status: Proposed
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

## 未確定 / 要確認

- clause の最終 schema
- clause weight を設定可能にするか
- desired transition を phase2 でどこまで使うか
- constitution を自力で書けないユーザーの入力 UX
