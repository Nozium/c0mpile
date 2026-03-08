# Phase4-1 CRM Native Integration And Writeback

- Status: Proposed
- Depends on: Phase3 完了

## 背景

MVP では既存 CRM export の read-only 取り込みに留める。運用段階では CRM と BONSAI の往復を整える必要がある。

## 目的

CRM との native integration を実装し、観測取り込みと必要最小限の writeback を管理可能にする。

## スコープ

- CRM connector
- incremental sync
- import / sync status 管理
- BONSAI 側の metadata writeback

## 非スコープ

- 全 CRM を同時対応
- 大規模 ETL 基盤化

## 実装タスク

- 対象 CRM を決める
- sync cursor と retry を実装する
- read-only / writeback 領域を分離する
- sync error と data drift を検知する

## 受け入れ条件

- 1 つ以上の CRM と native に同期できる
- sync 状態が追える
- writeback の対象と非対象が明確

## 確定していること

- native CRM は Phase4 に後ろ倒しする

## 未確定 / 要確認

- 対象 CRM
- writeback する項目の範囲
