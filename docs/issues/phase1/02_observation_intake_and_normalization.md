# Phase1-2 Observation Intake And Normalization

- Status: Done
- Depends on: `00_pre_shaped_demo_dataset.md`

## 背景

`bonsai_mvp.md` の入力は observation CSV / JSON であり、customer interviews, usage snapshot, support / CRM export を取り込めればよい。Phase1 では native CRM 開発ではなく、pre-shaped dataset と manual import / normalization を先に成立させる。

## 目的

手元の情報源と既存 CRM export を、軽量に `Observation` 系データへ正規化できるようにする。

## スコープ

- JSON / CSV / 手入力メモからの observation 取り込み
- demo fixture の static bundle 読み込み
- interviews, usage snapshot, support note, CRM export のマッピング
- raw input と normalized observation の両保存
- dataset version と import batch の管理
- 軽量な重複検知と import error handling

## 非スコープ

- CRM との双方向同期
- CRM 専用 UI の作り込み
- リアルタイム webhook ingest
- 高度な data quality dashboard

## 実装タスク

- Phase1 用 canonical observation schema を定義する
- repo 内 demo dataset の loader / fixture を作る
- CRM export 向け mapping template を作る
- 手動 import API / operator flow を作る
- import batch ごとの validation と error report を残す
- usage data を observation に落とす最小変換ルールを決める

## 受け入れ条件

- 1 つの dataset に interviews, usage snapshot, CRM export を混在取り込みできる
- pre-shaped dataset を network / auth なしで読み込める
- raw input と normalized observation を両方辿れる
- import failure が item 単位で分かる
- Phase1 の allocation engine でその dataset を直接参照できる

## 確定していること

- Phase1 では観測は既存 export を使ってよい
- live scraping は不要
- native CRM integration は後続 phase に回す

## 実装結果

- `src/lib/schema/observation.ts` — ObservationSchema (id, source, channel_type, raw_text, extracted_intent, inferred_need, signal_type, severity, confidence, actor, weight, timestamp) + ThemeSchema
- `src/features/phase1/observations/intake.ts` — `importObservationsFromJSON()` (per-item validation + error report), `parseCSVToObservations()`, `deduplicateObservations()` (raw_text + source キーで重複検知)
- `src/data/fixtures/loader.ts` — demo dataset の static bundle 読み込み
- テスト 4件 pass (`observation-intake.test.ts`)

## 未確定 / 要確認 (解決済み)

- ~~CRM 製品種別と export 形式~~ → Phase1 は JSON/CSV import のみ、native CRM は Phase2+
- ~~dedupe の判定キー~~ → raw_text + source の一致で重複判定
- ~~usage data の粒度を event 単位にするか、週次集計から始めるか~~ → Phase1 は pre-shaped で保留
