# Remotion Recording Skill — BONSAI Demo Video 設計書

## 概要

BONSAIの90秒デモ動画を **ハイブリッド構成** で制作する。

| パート | 方式 | 時間 | 内容 |
|---|---|---|---|
| **Part A: Concept** | Remotion（プログラマティック） | ~60秒 | Problem → Solution → Approach |
| **Part B: Live Demo** | 実アプリ画面録画 | ~30秒 | Build Board → Kill Board → Constitution変更 |

Remotionでコンセプトを印象的に伝え、実アプリの操作録画で「本物」を見せる。
Part Aの演出力 × Part Bの信頼感 = 最大インパクト。

---

## なぜハイブリッドか

| 方式 | コンセプト説明 | ライブデモ |
|---|---|---|
| 全部Remotion | 演出◎ 自由度◎ | 実物感✕ モックアップ乖離リスク |
| 全部画面録画 | 演出✕ 退屈になりがち | 実物感◎ 信頼感◎ |
| **ハイブリッド** ✅ | 演出◎ タイプライター・天秤・パイプライン図 | 実物感◎ 本物のUI操作 |

コンセプト部分は**抽象的な演出**が活きる。ライブデモは**実物を見せる**ことに価値がある。

---

## 全体タイムライン

```
0:00                           1:00        1:05                    1:30
 ├─── Part A: Remotion ─────────┤─ Bridge ─┤─── Part B: 実アプリ ───┤
 │                               │          │                       │
 │ Scene 1: Problem (25s)        │ Remotion │ Build Board            │
 │ Scene 2: Solution (20s)       │→実画面   │ Kill Board             │
 │ Scene 3: Approach (15s)       │ fade     │ Constitution変更       │
 │                               │          │ → 判断入れ替え         │
 │                               │          │ → "That's it."        │
 └───────────────────────────────┘          └────────────────────────┘
         Remotion render                    OBS / ScreenCapture
                    ↘                    ↙
                    ffmpeg concat → bonsai-demo.mp4
```

---

## Part A: Remotion コンセプト動画（~60秒 = 1800フレーム）

### アーキテクチャ

```
remotion/
├── index.ts                   — エントリーポイント
├── Root.tsx                   — Composition 登録
├── compositions/
│   └── BonsaiConcept.tsx      — Part A コンポジション（60秒）
├── scenes/
│   ├── 01-ProblemHook.tsx     — Problem（0:00-0:25）
│   ├── 02-SolutionIntro.tsx   — Solution（0:25-0:45）
│   ├── 03-Approach.tsx        — 3-Step Pipeline（0:45-0:55）
│   └── 04-Bridge.tsx          — 実アプリへの橋渡し（0:55-1:00）
├── overlays/
│   ├── Captions.tsx           — 字幕オーバーレイ
│   └── BrandWatermark.tsx     — BONSAIロゴ
├── effects/
│   ├── TypewriterText.tsx     — タイプライター風テキスト出現
│   ├── NumberCounter.tsx      — 数字カウントアップ
│   ├── GlowPulse.tsx          — 強調パルス
│   ├── ScaleBalanceAnim.tsx   — 天秤アニメーション
│   └── PipelineFlow.tsx       — パイプライン構築アニメーション
├── mockups/
│   └── ConstitutionMockup.tsx — Constitution入力の再現（Scene 2用）
├── data/
│   └── script.ts             — タイムライン・テキスト定義
├── styles/
│   └── theme.ts              — 色、フォント定数
└── utils/
    ├── timing.ts             — フレーム/秒変換ヘルパー
    └── easing.ts             — カスタムイージング関数
```

> `mockups/` からBoard系・Evidence系を削除。実アプリで見せるのでモックアップ不要。
> ConstitutionMockupのみ残す（Scene 2でConstitution入力の「概念」を見せるため）。

---

### Scene 1: Problem Hook（0:00 - 0:25 = 750フレーム）

**コンセプト**: 衝撃的な数字 → 問題の本質へ

| 時間 | フレーム | 演出 | テキスト |
|---|---|---|---|
| 0:00-0:03 | 0-90 | 黒背景、タイプライター | `I shipped 10 products in one month` |
| 0:03-0:05 | 90-150 | 数字「10」巨大フォント、パルス | `using AI coding tools.` |
| 0:05-0:08 | 150-240 | 赤フラッシュ、数字反転 | `Revenue: $0` / `Customer conversations: 0` |
| 0:08-0:15 | 240-450 | フェードイン | `AI made building 10x faster.` → `But nobody made deciding-what-to-build faster.` |
| 0:15-0:25 | 450-750 | 天秤アニメーション | `The bottleneck shifted.` → `"What to build, and what NOT to build."` |

**エフェクト**:
- `TypewriterText`: 1文字ずつ出現
- `NumberCounter`: 0 → 10 カウントアップ（spring）
- `GlowPulse`: `$0 revenue` 赤パルス強調
- `ScaleBalanceAnim`: SVG天秤 — Build Speed ↑↑ vs Judgment Speed → が傾く

---

### Scene 2: Solution Introduction（0:25 - 0:45 = 600フレーム）

**コンセプト**: 3行入力 → 判断が構造化される

| 時間 | フレーム | 演出 | テキスト |
|---|---|---|---|
| 0:25-0:30 | 750-900 | フェードイン | `We built a constitutional product allocation system.` |
| 0:30-0:38 | 900-1140 | ConstitutionMockup、タイプライター入力 | `We are...` → `We never...` → `We value...` |
| 0:38-0:42 | 1140-1260 | 3行→5軸変換アニメーション | テキスト分解 → 5軸ラベル再構成 |
| 0:42-0:45 | 1260-1350 | テキストフェード | `Judgment: explainable, repeatable, fast.` |

**エフェクト**:
- `ConstitutionMockup`: 3行入力フィールド（実UIスタイル参照）
- タイプライター: `We are a privacy-first productivity tool...` が入力される
- 変換アニメーション: テキスト → 5軸パーティクル再構成
- `spring()` でラベルがバウンス配置

---

### Scene 3: Approach — 3-Step Pipeline（0:45 - 0:55 = 300フレーム）

**コンセプト**: パイプライン図が左→右に組み上がる

| 時間 | フレーム | 演出 | テキスト |
|---|---|---|---|
| 0:45-0:49 | 1350-1470 | Step 1 スライドイン | `Constitution → 5-axis clauses` |
| 0:49-0:52 | 1470-1560 | Step 2 出現 + 矢印 | `Evidence → Extract intent vs need` |
| 0:52-0:55 | 1560-1650 | Step 3 出現 → 3色分岐 | `Allocation Engine → Build / Defer / Kill` |

**エフェクト**:
- `PipelineFlow`: 各ステップが`spring()` + `interpolate()`でスライドイン
- SVG矢印: `stroke-dashoffset` で伸びるアニメーション
- Step 3: Build(緑)、Defer(黄)、Kill(赤)の3色分岐 → 色が放射状に広がる
- 背景にデータフローパーティクル（subtle）

---

### Scene 4: Bridge — 実アプリへの橋渡し（0:55 - 1:00 = 150フレーム）

**コンセプト**: Remotionのモーション演出 → 実アプリ画面へ自然に遷移

| 時間 | フレーム | 演出 | テキスト |
|---|---|---|---|
| 0:55-0:57 | 1650-1710 | パイプライン図が縮小、画面中央へ集約 | `Here's the product.` |
| 0:57-0:59 | 1710-1770 | ブラウザフレーム（chrome）が出現、中にBONSAI UIのスクリーンショット | ブラウザ枠がフェードイン |
| 0:59-1:00 | 1770-1800 | フェードアウト（白 or 黒） | → Part Bの実画面に繋がる |

**設計意図**:
- Remotionのモーション演出から実アプリ画面への**視覚的ブリッジ**
- ブラウザフレーム出現で「これから本物を見せますよ」という期待感
- フェードの色・タイミングをPart B冒頭と合わせてシームレスにする
- Part Bの実アプリのスクリーンショットを `remotion/assets/app-screenshot.png` に配置

---

## Part B: 実アプリ画面録画（~30秒）

### 録画ガイドライン

Part Bは手動の画面録画。以下のガイドに沿って録画する。

#### 録画環境

| 項目 | 設定 |
|---|---|
| 解像度 | 1920×1080（Part Aと統一） |
| ブラウザ | Chrome、フルスクリーンモード（F11） |
| アドレスバー | 非表示推奨（プレゼンテーションモード） |
| マウスカーソル | 表示（操作の意図が伝わる） |
| 録画ツール | OBS Studio / macOS Screen Capture / Loom 等 |
| フレームレート | 30fps（Part Aと統一） |
| 形式 | MP4 (H.264) |

#### 録画シナリオ（ショットリスト）

| # | 時間 | 操作 | 見せたいもの |
|---|---|---|---|
| B1 | 0:00-0:05 | ページ表示。Build Next Boardにスクロール | 緑のBuildカード群、allocation score、evidence count |
| B2 | 0:05-0:08 | Buildカード1枚をクリック | Evidence drill-down展開。violated clause, observation引用 |
| B3 | 0:08-0:12 | ドリルダウンを閉じ、Kill/Defer Boardにスクロール | 赤/黄のKill/Deferカード群 |
| B4 | 0:12-0:15 | Killカード1枚をクリック | violated clause、kill reason表示 |
| B5 | 0:15-0:18 | Constitution切り替え（ドロップダウン: A→B） | Constitution Bに変更 |
| B6 | 0:18-0:23 | Re-evaluate実行。Boardが再描画される | **核心**: KillだったカードがBuildに、BuildだったカードがKillに変わる |
| B7 | 0:23-0:28 | 変わったカードをホバー/クリック | 判断が変わった理由（clause reasoning）が見える |
| B8 | 0:28-0:30 | 画面を引きで見せる → フェードアウト | `Constitution in, allocation out.` テキストオーバーレイ（後処理で追加） |

#### 録画のコツ

1. **マウスの動きはゆっくり**: 急な動きは視聴者が追えない
2. **クリック前に一瞬止める**: 「ここを押しますよ」の間を作る
3. **スクロールは滑らかに**: 一気にスクロールしない
4. **B5→B6が最重要ショット**: Constitution変更 → 判断入れ替え。ここは特に丁寧に
5. **失敗しても大丈夫**: 何度でも撮り直し可能。最も良いテイクを使う

---

## 結合ワークフロー

### ファイル構成

```
out/
├── part-a-concept.mp4         — Remotion出力（~60秒）
├── part-b-live-demo.mp4       — 実アプリ録画（~30秒）
├── bonsai-demo.mp4            — 最終結合動画（~90秒）
└── stills/
    ├── problem-hook.png       — Scene 1のサムネイル
    └── magic-moment.png       — Part BのConstitution変更瞬間（手動キャプチャ）
```

### 結合コマンド

```bash
# 方法1: ffmpeg concat（最もシンプル）
# concat_list.txt:
#   file 'part-a-concept.mp4'
#   file 'part-b-live-demo.mp4'
ffmpeg -f concat -safe 0 -i concat_list.txt -c copy out/bonsai-demo.mp4

# 方法2: ffmpeg filter（トランジション付き）
# Part A末尾 + Part B冒頭を0.5秒クロスフェード
ffmpeg \
  -i out/part-a-concept.mp4 \
  -i out/part-b-live-demo.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=59.5[v]" \
  -map "[v]" \
  out/bonsai-demo.mp4

# 方法3: Part Bにテキストオーバーレイ追加（ラストカット用）
ffmpeg \
  -i out/part-b-live-demo.mp4 \
  -vf "drawtext=text='Constitution in, allocation out.':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:enable='between(t,28,30)'" \
  out/part-b-with-text.mp4
```

### npm scripts

```json
{
  "scripts": {
    "remotion:studio": "remotion studio remotion/index.ts",
    "remotion:render": "remotion render remotion/index.ts BonsaiConcept --output out/part-a-concept.mp4",
    "remotion:still": "remotion still remotion/index.ts BonsaiConcept --frame 1560 --output out/stills/pipeline.png",
    "video:concat": "ffmpeg -f concat -safe 0 -i out/concat_list.txt -c copy out/bonsai-demo.mp4",
    "video:concat:fade": "ffmpeg -i out/part-a-concept.mp4 -i out/part-b-live-demo.mp4 -filter_complex '[0:v][1:v]xfade=transition=fade:duration=0.5:offset=59.5[v]' -map '[v]' out/bonsai-demo.mp4"
  }
}
```

---

## script.ts の構造

```typescript
export const SCRIPT = {
  fps: 30,
  width: 1920,
  height: 1080,
  totalDurationInFrames: 1800, // 60秒（Part Aのみ）

  scenes: [
    {
      id: 'problem-hook',
      from: 0,
      durationInFrames: 750, // 25秒
      captions: [
        { from: 0, text: 'I shipped 10 products in one month', lang: 'en' },
        { from: 90, text: 'using AI coding tools.', lang: 'en' },
        { from: 150, text: 'Revenue: $0', lang: 'en', style: 'impact' },
        { from: 240, text: 'AI made building 10x faster.', lang: 'en' },
        { from: 330, text: 'But nobody made deciding-what-to-build faster.', lang: 'en' },
        { from: 450, text: 'The bottleneck shifted.', lang: 'en' },
        { from: 570, text: '"What to build, and what NOT to build."', lang: 'en', style: 'emphasis' },
      ],
    },
    {
      id: 'solution-intro',
      from: 750,
      durationInFrames: 600, // 20秒
      captions: [
        { from: 0, text: 'We built a constitutional product allocation system.', lang: 'en' },
        { from: 150, text: 'Three lines define your product boundaries.', lang: 'en' },
        { from: 390, text: 'Evidence becomes build, defer, or kill decisions.', lang: 'en' },
        { from: 510, text: 'Judgment: explainable, repeatable, fast.', lang: 'en', style: 'emphasis' },
      ],
      constitutionInput: {
        weAre: 'a privacy-first productivity tool for knowledge workers',
        weNever: 'sell user data to third parties or use dark patterns',
        weValue: 'depth of workflow over breadth of features',
      },
    },
    {
      id: 'approach',
      from: 1350,
      durationInFrames: 300, // 10秒
      captions: [
        { from: 0, text: 'Three steps.', lang: 'en' },
        { from: 60, text: 'Constitution → evaluable clauses.', lang: 'en' },
        { from: 120, text: 'Evidence → intent vs actual need.', lang: 'en' },
        { from: 180, text: 'Allocation → Build, Defer, or Kill.', lang: 'en' },
      ],
    },
    {
      id: 'bridge',
      from: 1650,
      durationInFrames: 150, // 5秒
      captions: [
        { from: 0, text: "Here's the product.", lang: 'en' },
      ],
    },
  ],
} as const;
```

---

## 主要エフェクト仕様

### TypewriterText

```typescript
const TypewriterText: React.FC<{
  text: string;
  startFrame: number;
  charsPerFrame?: number; // デフォルト: 0.5（2フレームに1文字）
  cursor?: boolean;       // カーソル点滅
  style?: 'default' | 'impact' | 'emphasis';
}>;
```

### NumberCounter

```typescript
const NumberCounter: React.FC<{
  from: number;
  to: number;
  startFrame: number;
  durationInFrames: number;
  fontSize?: number;
  prefix?: string;  // '$'
  suffix?: string;  // ' products'
}>;
// spring() physics でバウンスしながらカウント
```

### ScaleBalanceAnim（天秤）

```typescript
const ScaleBalanceAnim: React.FC<{
  startFrame: number;
  durationInFrames: number;
  leftLabel: string;   // 'Build Speed'
  rightLabel: string;  // 'Judgment Speed'
  tiltDirection: 'left' | 'right'; // どちらに傾くか
}>;
// SVG: 天秤の腕がspring()で傾くアニメーション
```

### PipelineFlow（パイプライン図）

```typescript
const PipelineFlow: React.FC<{
  startFrame: number;
  steps: Array<{
    label: string;
    icon?: string;
    color: string;
    delayFrames: number; // ステップ間の遅延
  }>;
  branches?: Array<{
    label: string;
    color: string; // Build=green, Defer=yellow, Kill=red
  }>;
}>;
// 各ステップがstaggered spring()で出現、矢印がstroke-dashoffsetで伸びる
```

### GlowPulse

```typescript
const GlowPulse: React.FC<{
  color: string;
  startFrame: number;
  pulseCount?: number; // デフォルト: 2
  children: React.ReactNode;
}>;
```

---

## 技術スタック

### 必要パッケージ

```json
{
  "devDependencies": {
    "remotion": "^4.0",
    "@remotion/cli": "^4.0",
    "@remotion/player": "^4.0",
    "@remotion/renderer": "^4.0"
  }
}
```

> `@remotion/transitions` は不要（シーン間はシンプルなfade/cutで十分）

---

## 音声・BGM設計

### v1: 無音（テキスト字幕のみ）

Part AはRemotionの字幕オーバーレイで十分。Part Bも無音で操作を見せる。

### v2（将来拡張）: ナレーション + BGM

| 要素 | 方式 | 適用範囲 |
|---|---|---|
| ナレーション | TTS生成（ElevenLabs等） → Remotion `<Audio>` or ffmpeg合成 | Part A + Part B 全体 |
| BGM | ロイヤリティフリーBGM → ffmpeg `-filter_complex amix` | 全体 |
| 効果音 | タイプライター音、カウンター音 → Remotion `<Audio>` | Part Aのみ |

ナレーションを追加する場合、Part A + Part Bの結合後にffmpegでオーディオトラックを重ねるのが最もシンプル。

---

## 実装フェーズ

### Phase 1: Remotion Skeleton

1. `remotion/` ディレクトリ作成、パッケージインストール
2. `Root.tsx` + `BonsaiConcept.tsx` の骨格
3. `script.ts` にタイムライン定義
4. 4シーンの `<Sequence>` 配置（背景色 + テキストのみ）
5. `remotion studio` で確認

### Phase 2: Scene実装

1. Scene 1: ProblemHook — TypewriterText + NumberCounter + ScaleBalanceAnim
2. Scene 2: SolutionIntro — ConstitutionMockup + タイプライター入力 + 5軸変換
3. Scene 3: Approach — PipelineFlow（3ステップ + 3色分岐）
4. Scene 4: Bridge — 縮小 + ブラウザフレーム + フェード

### Phase 3: 実アプリ録画

1. BONSAIアプリをローカルで起動
2. 録画シナリオ（B1-B8）に沿って画面録画
3. 不要部分のトリミング（ffmpeg or 動画エディタ）

### Phase 4: 結合 + Polish

1. Part A + Part B を ffmpeg concat / xfade で結合
2. テキストオーバーレイ（ラストカット: `Constitution in, allocation out.`）
3. 全体の尺・テンポ確認
4. 最終出力: `out/bonsai-demo.mp4`

---

## Skill定義（Claude Code用）

```yaml
name: remotion-recording
description: >
  BONSAIデモ動画のRemotionコンセプトパート（Part A）を作成・編集する。
  シーンの追加、エフェクトの調整、レンダリング、結合ワークフローを管理。

trigger:
  - "Remotionで動画を作りたい"
  - "デモ動画のコンセプトパートを修正して"
  - "動画をレンダリングして"
  - "remotion render"
  - "動画を結合して"

capabilities:
  - remotion/ ディレクトリ内のコンポーネント作成・編集
  - script.ts のタイムライン・字幕テキスト編集
  - remotion studio / render の実行
  - ffmpeg による Part A + Part B 結合
  - デモデータ（data/demo/）の参照（ConstitutionMockup用）

constraints:
  - Remotion は Part A（コンセプト ~60秒）のみ担当
  - Part B（実アプリ録画）は手動。Skillは録画ガイドライン提示のみ
  - apps/bonsai/src/ のコードは読み取り参照のみ（スタイル参照用）
  - useCurrentFrame() + interpolate() でアニメーション（CSS animationは使わない）
```

---

## 成功基準

| # | 基準 | 検証方法 |
|---|---|---|
| 1 | `npm run remotion:render` で Part A の mp4 が生成される | ローカル実行 |
| 2 | Part A が ~60秒（±3秒） | 出力ファイルの尺確認 |
| 3 | 1920×1080 フルHD | Part A, Part B 共に解像度統一 |
| 4 | Part A → Part B の遷移が自然 | Bridge シーンの目視確認 |
| 5 | `video:concat` で90秒の最終動画が生成される | 結合後の尺・画質確認 |
| 6 | speech.md の4セクションが全て含まれる | Part A(1-3) + Part B(4) の網羅確認 |
| 7 | テキストが読みやすい（最低2秒表示） | 各字幕のフレーム数確認 |
| 8 | Part BでConstitution変更→判断入れ替えが映っている | 録画の目視確認 |

---

## 参考

- [Remotion公式ドキュメント](https://www.remotion.dev/docs/)
- [`<Sequence>` API](https://www.remotion.dev/docs/sequence)
- [`spring()` API](https://www.remotion.dev/docs/spring)
- [`interpolate()` API](https://www.remotion.dev/docs/interpolate)
- [ffmpeg concat](https://trac.ffmpeg.org/wiki/Concatenate)
- [ffmpeg xfade](https://ffmpeg.org/ffmpeg-filters.html#xfade)
- `docs/design/speech.md` — 90秒プレゼンスクリプト
- `docs/design/bonsai_mvp.md` — MVP仕様
- `data/demo/` — デモデータセット
