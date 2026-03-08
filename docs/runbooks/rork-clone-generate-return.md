# Operator Runbook: Rork Clone → Generate → Return

Status: Phase3-0 初期版
対象: BONSAI operator が Rork で variant を生成し、BONSAI へメタデータを戻す手順

---

## 前提条件

- Rork base project (`bonsai-exp-base`) が作成済み
- base project が GitHub repo に接続済み
- BONSAI 側に対象の proposal と execution packet が存在する
- GitHub personal access token が `.env` に設定済み (`GITHUB_TOKEN`)
- Rork API key が `.env` に設定済み (`RORK_API_KEY`)

---

## 手順

### Step 1: 対象 Proposal の確認

1. BONSAI の Build Board で対象の build proposal を開く
2. `proposal_id`, `execution_packet_id`, `constitution_id` を記録する

```
proposal_id:          prop-001
execution_packet_id:  ep-001
constitution_id:      const-a
variant_number:       1
```

### Step 2: Rork で Clone Project を作成

1. Rork にログインする
2. base project (`bonsai-exp-base`) を開く
3. 「Clone Project」を実行する
4. clone project に名前をつける: `bonsai-exp-{proposal_id}-v{variant_number}`
   - 例: `bonsai-exp-prop-001-v1`

### Step 3: Execution Packet の内容を Rork に入力

1. clone project を開く
2. execution packet の以下を Rork のプロンプト / 設定に反映する:
   - `problem_statement` → Rork のアプリ説明
   - `ui_change_outline` → UI 要件
   - `workflow_change_outline` → ユーザーフロー
   - `success_metric` → 成功基準
3. Rork で generate を実行する

### Step 4: GitHub Connect

1. clone project の Settings > GitHub を開く
2. 「Connect to GitHub」を選択する
3. repo 名: `bonsai-exp-{proposal_id}-v{variant_number}` (Step 2 と同じ)
4. 接続完了を確認する
5. Rork が自動 push したことを確認する

### Step 5: Preview URL と Artifact の取得

1. Rork の preview URL をコピーする
   - 例: `https://rork.app/preview/xxxxx`
2. 必要に応じてスクリーンショットを撮る
   - 主要画面: Home, 主要機能画面, Settings
3. screenshot の URL を記録する (Rork 内蔵 or 外部ストレージ)

### Step 6: BONSAI へメタデータを戻す

現時点では manual return。以下の JSON を作成し、BONSAI の variant registry に登録する。

```json
{
  "id": "var-001",
  "proposal_id": "prop-001",
  "execution_packet_id": "ep-001",
  "constitution_id": "const-a",
  "variant_number": 1,
  "rork_project_url": "https://rork.app/project/xxxxx",
  "github_repo": "bonsai-exp-prop-001-v1",
  "preview_url": "https://rork.app/preview/xxxxx",
  "artifact_urls": [
    "https://storage.example.com/screenshots/var-001-home.png",
    "https://storage.example.com/screenshots/var-001-feature.png"
  ],
  "github_connected": true,
  "status": "ready",
  "created_at": "2026-03-08T10:00:00Z",
  "operator_memo": "Initial generation from ep-001. UI matches proposal spec."
}
```

登録先: `data/demo/variants.json` (demo) または API endpoint (本運用時)

### Step 7: 確認

- [ ] clone project が Rork 上に存在する
- [ ] GitHub repo が作成されている
- [ ] Rork → GitHub の sync が完了している
- [ ] preview URL でアプリにアクセスできる
- [ ] variant registry entry が作成されている
- [ ] operator memo が記入されている

---

## 2 回目以降の variant 作成

同一 proposal に対して追加 variant を作る場合:

1. Step 2 で `variant_number` をインクリメントする (v2, v3, ...)
2. Rork のプロンプトを調整する (前回との差分を明記)
3. 以降の手順は同じ

---

## トラブルシューティング

| 問題 | 対応 |
|---|---|
| Rork の GitHub Connect が失敗する | Rork 側で repo 名に使えない文字がないか確認。GitHub token の scope に `repo` があるか確認 |
| Preview URL が 404 | Rork の generate が完了しているか確認。数分待って再試行 |
| GitHub repo にコードが push されていない | Rork の GitHub sync 設定を確認。手動で sync をトリガー |
| variant registry の schema validation エラー | 必須フィールドが null になっていないか確認。`VariantRegistryEntrySchema` を参照 |

---

## 未確定事項 (Phase3-1 で確定予定)

- webhook による自動 return の仕組み
- Blaxel sandbox への自動投入フロー
- Unbound による constitution governance チェックの差し込みポイント
