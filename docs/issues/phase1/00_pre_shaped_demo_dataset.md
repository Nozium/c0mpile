# Phase1-0 Pre-Shaped Demo Dataset

- Status: Proposed
- Depends on: なし

## 背景

`bonsai_mvp_feedback.md` では、実装優先順位の最短パスとして `Pre-shaped dataset` を先頭に置くべきとされている。live ingest や広い source 対応より先に、安定して再現できる demo 用データが必要である。

## 目的

Constitution A / B と build / kill の差分を安定して見せられる、固定の demo dataset と fixture を用意する。

## スコープ

- static JSON / CSV の demo dataset
- raw observation と normalized observation の対
- interviews, usage snapshot, support / CRM export を混ぜた最小構成
- stable ids と source refs
- Constitution A / B の比較に使う fixture
- fallback 用の pre-computed run artifact

## 非スコープ

- live scraping
- CRM native integration
- 大規模データ ingest
- production 向け永続化

## 実装タスク

- demo に使う 20-60 件前後の observation を選ぶ
- raw と normalized の両方を repo fixture として保存する
- stable proposal / theme ids を振る
- Constitution A / B の差で少なくとも 1 件判定が変わる候補を用意する
- fallback 用に pre-computed な decision artifact を残す

## 受け入れ条件

- repo 内 fixture だけで demo を開始できる
- 同一 dataset 上で Constitution A / B により少なくとも 1 件の decision が変わる
- raw input から normalized observation まで辿れる
- dataset が local / preview 環境で安定して扱えるサイズである

## 確定していること

- pre-shaped dataset は MVP の正当な近道である
- mechanism の証明が目的であり、live ingest の証明は目的ではない

## 未確定 / 要確認

- どの source を demo fixture に含めるか
- 何件あれば十分に説得力が出るか
- fallback artifact を JSON にするか、画面キャプチャも持つか
