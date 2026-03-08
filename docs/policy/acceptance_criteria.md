# Acceptance Criteria

## 1. MVP 受け入れ基準

### 1.1 Binary（できる / できない）

- [ ] Constitution 3行（We are / We never / We value）を入力できる
- [ ] 3行テキストを 5 軸の clause に正規化して表示できる（5秒以内）
- [ ] Pre-shaped dataset が読み込まれた状態で表示される
- [ ] Build 候補を allocation score 降順で表示できる（title, score, target_user, why_now, evidence count）
- [ ] Kill / Defer 候補を表示できる（title, kill_type, violated_clause, evidence count, confidence）
- [ ] カードを開くと supporting observations, clause reasoning, pre-mortem が見える
- [ ] Build 候補を開くと execution packet（UI/data/workflow 変更案 + coding agent tasks）が表示される（pre-computed 許容）
- [ ] Constitution を書き換えると build/kill の判定が変化する

### 1.2 Quality（質的基準）

- [ ] Constitution の 5 軸正規化が、入力者に「だいたい合っている」と言われる（H-4 基準）
- [ ] Kill 理由が「それは確かに kill すべき」と納得される（3件中2件以上）
- [ ] Build 候補が「確かに次に作るべき」と感じられる（3件中2件以上）
- [ ] Constitution A と B で、同一候補の decision (build/kill) が少なくとも 1 件異なる

### 1.3 Demo 固有基準

- [ ] Constitution 入力 → 正規化 → Pipeline 実行 → Board 表示が 30 秒以内
- [ ] Constitution 変更 → 再実行 → 判定変化の表示が 10 秒以内
- [ ] Pre-computed fallback が用意されている（LLM timeout 時の切り替え）
- [ ] 録画済み walkthrough が用意されている（全体失敗時の fallback）

---

## 2. Phase 別受け入れ基準

### Phase 1: Core Allocation Spine

- [ ] Constitution 3 行入力 → 5 軸正規化
- [ ] Observation の正規化（extracted_intent + inferred_need）
- [ ] Theme clustering
- [ ] Constitutional filter（build / defer / kill 判定 + clause-level reasoning）
- [ ] Evidence trace（decision → theme → observation の追跡）
- [ ] A/B 比較（Constitution A と B で判定が変わることの証明）

### Phase 2: Explainability And Builder Handoff

#### Core
- [ ] Evidence drill-down が成立する
- [ ] Build 候補に execution packet を用意できる（pre-computed 許容）
- [ ] Coding agent 向け export を出力できる（stretch）

#### Stretch (Phase 2.5)
- [ ] Execution Packet → Rork で体験を生成できる
- [ ] 生成された体験を Blaxel sandbox 上で確認できる
- [ ] Constitution compliance check が走る
- [ ] Constitution violation を最低 1 件 flag できる
- [ ] 自動反映ではなく human approval required

### Phase 3: Post-MVP Experiments

- [ ] Rork + Blaxel で複数 variant の experiment loop を回せる
- [ ] Virtual Staff を advisory layer として実行できる
- [ ] User state / theme / allocation の精度を MVP より深く改善できる

---

## 3. Pre-computed vs Live の境界

| 処理 | Pre-computed | Live |
|---|---|---|
| Observation normalization | ✅ | |
| Theme clustering | ✅ | |
| Constitution parse | | ✅ |
| Constitutional filter + allocation | | ✅ |
| Execution packet generation | ✅ (1-2件分) | 余裕があれば Live |

---

## 4. Demo 失敗時のフォールバック

| 障害 | フォールバック |
|---|---|
| LLM call が timeout | pre-computed の結果に切り替える |
| Constitution 正規化が壊れる | 事前検証済みの constitution を使う |
| Pipeline 全体が失敗 | 録画済みの walkthrough を見せる |

**原則**: デモの目的は「mechanism の証明」であり「ライブ動作の証明」ではない。pre-computed で見せても mechanism は証明できる。
