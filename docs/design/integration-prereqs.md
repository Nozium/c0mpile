# Integration Prerequisites — Phase3-0

Status: Proposed
Source issue: `docs/issues/phase3/00_integration_prereqs_and_github_connect.md`

---

## 1. 確定事項

以下は issue で確定済みの方針。変更しない。

- BONSAI は controller / judge であり、Rork generated app repo は actuation artifact として別管理でよい
- repo が分かれること自体は問題ではない
- demo では `1 proposal → 1 experience` に絞る
- GitHub Connect できるものは先に繋いでよい
- Phase3-0 は Phase2 と並列で前倒し可能

---

## 2. Repo Topology

### 採用方式: `1 repo per clone` (demo / 初期運用)

Rork clone ごとに個別の GitHub repo を作る。理由:

- Rork の GitHub sync は clone 単位で 1 repo に接続する設計
- branch 方式だと clone 間の sync conflict リスクが高い
- repo 単位の方が preview URL / artifact 管理が独立し、運用が単純

### Naming Convention

```
bonsai-exp-{proposal_id}-v{variant_number}
```

例:
- `bonsai-exp-prop-001-v1` — prop-001 の最初の variant
- `bonsai-exp-prop-001-v2` — prop-001 の 2 番目の variant
- `bonsai-exp-prop-003-v1` — prop-003 の最初の variant

### Base Project

Rork base project は `bonsai-exp-base` として GitHub 接続する。clone はここから派生。

---

## 3. Variant Registry — 最低 Schema

`apps/bonsai/src/lib/schema/variant-registry.ts` に Zod で定義。

必須フィールド:

| フィールド | 型 | 説明 |
|---|---|---|
| `id` | string | variant の一意識別子 (e.g. `var-001`) |
| `proposal_id` | string | 元の proposal ID |
| `execution_packet_id` | string \| null | 紐づく execution packet ID |
| `constitution_id` | string | 適用された constitution ID |
| `variant_number` | number | 同一 proposal 内の連番 |
| `rork_project_url` | string \| null | Rork project URL |
| `github_repo` | string \| null | GitHub repo name |
| `preview_url` | string \| null | Rork preview / deploy URL |
| `artifact_urls` | string[] | screenshot, recording 等の URL 配列 |
| `github_connected` | boolean | GitHub 接続済みか |
| `status` | enum | draft / generating / ready / validated / archived |
| `created_at` | string | ISO8601 |
| `operator_memo` | string \| null | operator のメモ |

---

## 4. Preview URL / Artifact メタデータ形式

preview URL と generated artifact を BONSAI 側へ戻すためのメタデータ:

```jsonc
{
  "variant_id": "var-001",
  "proposal_id": "prop-001",
  "preview_url": "https://rork.app/preview/xxx",
  "github_repo": "bonsai-exp-prop-001-v1",
  "artifacts": [
    {
      "type": "screenshot",
      "url": "https://...",
      "label": "Home screen",
      "captured_at": "2026-03-08T10:00:00Z"
    },
    {
      "type": "recording",
      "url": "https://...",
      "label": "User flow walkthrough",
      "captured_at": "2026-03-08T10:05:00Z"
    }
  ],
  "operator_memo": "Initial generation. UI matches proposal spec.",
  "returned_at": "2026-03-08T10:10:00Z"
}
```

---

## 5. Integration Registry

GitHub Connect 済みかどうかを記録する registry。
`apps/bonsai/src/lib/schema/integration-registry.ts` に Zod で定義。

| フィールド | 型 | 説明 |
|---|---|---|
| `id` | string | entry ID |
| `service` | enum | rork / blaxel / github / unbound |
| `resource_type` | string | base_project / clone_project / sandbox / repo 等 |
| `resource_id` | string | サービス側の識別子 |
| `github_repo` | string \| null | 接続先 GitHub repo |
| `connected` | boolean | 接続済みか |
| `connection_verified_at` | string \| null | 最終確認日時 |
| `notes` | string \| null | メモ |

---

## 6. Env / Credential 整理

`.env.example` に以下の placeholder を定義:

- `RORK_API_KEY` — Rork API アクセス用
- `GITHUB_TOKEN` — GitHub repo 操作用
- `BLAXEL_API_KEY` — Blaxel sandbox 実行用 (Phase3-1 以降)
- `UNBOUND_API_KEY` — Unbound runtime governance 用 (Phase3 以降)
- `ANTHROPIC_API_KEY` — Claude API (既存)

---

## 7. 未確定事項

以下は Phase3-0 時点で未確定。各 issue の実装時に確定する。

- [ ] Rork の GitHub sync が clone ごとに repo を分ける方が安定するか → Phase3-1 着手時に検証
- [ ] Blaxel が repo URL, preview URL, artifact URL のどこを入力に取るか → Blaxel API 調査後に確定
- [ ] Unbound を GitHub repo, CI, runtime のどこに差し込むか → Phase3 後半で検証
- [ ] webhook 連携を先にやるか、manual return から始めるか → **初期は manual return を採用し、webhook は Phase3-1 以降で検討**

---

## 8. Operator Runbook

`docs/runbooks/rork-clone-generate-return.md` に独立ファイルとして配置。

手順だけで clone → generate → return を再現できることが受け入れ条件。
