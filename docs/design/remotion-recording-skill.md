# Remotion Recording Skill — BONSAI Demo Video 設計書

## 概要

BONSAIアプリの操作デモを **Remotionで完全プログラマティックに録画** し、YC RFS提出用の90秒動画を生成するSkillの設計。

手動スクリーンレコーディングではなく、**コードで定義された再現可能なデモ動画** を出力する。
Constitutionを変えれば判断が変わる — その「ワクワク感」を映像演出で最大化する。

---

## ゴール

| # | ゴール | 詳細 |
|---|---|---|
| 1 | **再現可能** | `npm run render:video` 一発で同じ動画が生成される |
| 2 | **編集可能** | シーン単位でタイミング・演出を調整できる |
| 3 | **ワクワクする** | カメラワーク、タイミング、エフェクトで「おっ」と思わせる |
| 4 | **90秒** | YC要件に準拠（30fps × 2700フレーム） |
| 5 | **1920×1080** | フルHD出力 |

---

## アーキテクチャ

```
remotion/
├── index.ts              — エントリーポイント（remotion studio / render のルート）
├── Root.tsx              — Composition 登録
├── compositions/
│   └── BonsaiDemo.tsx    — メインの90秒動画コンポジション
├── scenes/
│   ├── 01-ProblemHook.tsx      — Problem（0:00-0:25）
│   ├── 02-SolutionIntro.tsx    — Solution（0:25-0:45）
│   ├── 03-Approach.tsx         — 3-Step Pipeline（0:45-1:05）
│   └── 04-LiveDemo.tsx         — Live Demo（1:05-1:30）
├── overlays/
│   ├── Captions.tsx            — 字幕オーバーレイ（英語 + 日本語）
│   ├── ProgressBar.tsx         — 動画進行バー
│   └── BrandWatermark.tsx      — BONSAIロゴ + c0mpile
├── transitions/
│   └── SceneTransitions.tsx    — シーン間トランジション定義
├── effects/
│   ├── TypewriterText.tsx      — タイプライター風テキスト出現
│   ├── NumberCounter.tsx       — 数字カウントアップ
│   ├── GlowPulse.tsx          — Kill→Build変化時の強調パルス
│   ├── CardFlip.tsx           — カード反転アニメーション
│   └── ZoomPan.tsx            — UIへのズームイン/パン
├── mockups/
│   ├── ConstitutionMockup.tsx  — Constitution入力の再現UI
│   ├── BoardMockup.tsx         — Build/Kill Boardの再現UI
│   ├── EvidenceMockup.tsx      — Evidence Drill-downの再現UI
│   └── ExecutionMockup.tsx     — Execution Packetの再現UI
├── data/
│   └── script.ts              — 全シーンのタイムライン・テキスト・データ定義
├── styles/
│   └── theme.ts               — 色、フォント、共通スタイル定数
└── utils/
    ├── timing.ts              — フレーム/秒変換ヘルパー
    └── easing.ts              — カスタムイージング関数
```

### なぜ「実アプリの録画」ではなく「モックアップ再現」か

| 方式 | メリット | デメリット |
|---|---|---|
| **A: ヘッドレスブラウザで実アプリを録画** | 実際のUIを忠実に再現 | API待ち時間の制御困難、ネットワーク依存、レイアウト崩れリスク |
| **B: Remotionでモックアップ再現** ✅ | フレーム単位で完全制御、演出自在、オフライン生成可能 | 実UIとの乖離リスク（→ 共通コンポーネント利用で軽減） |

**選択: B（モックアップ再現）** — デモ動画に求められるのは「製品の本質が伝わること」であり、ピクセル単位の忠実性ではない。演出の自由度を最優先する。

> **補足**: モックアップコンポーネントは可能な限り `apps/bonsai/src/` の実コンポーネントのスタイル・構造を参照して作成し、視覚的一貫性を保つ。

---

## シーン設計

### Scene 1: Problem Hook（0:00 - 0:25 = 750フレーム）

**コンセプト**: 衝撃的な数字 → 問題の本質へ

| 時間 | フレーム | 演出 | テキスト/要素 |
|---|---|---|---|
| 0:00-0:03 | 0-90 | 黒背景、中央にタイプライター | `I shipped 10 products in one month` |
| 0:03-0:05 | 90-150 | 数字「10」が巨大フォントで中央に。パルスエフェクト | `10 products` → `using AI coding tools.` |
| 0:05-0:08 | 150-240 | 赤いフラッシュ、数字反転 | `Revenue: $0` / `Customer conversations: 0` |
| 0:08-0:15 | 240-450 | フェードイン、落ち着いた背景へ | `AI made building 10x faster.` → `But nobody made deciding-what-to-build faster.` |
| 0:15-0:25 | 450-750 | 天秤のアニメーション（Build Speed ↑↑ vs Judgment Speed →） | `The bottleneck shifted.` → `"What to build, and what NOT to build."` |

**エフェクト**:
- `TypewriterText`: 文字が1文字ずつ出現（タイプライター音のタイミングマーカー付き）
- `NumberCounter`: 0 → 10 のカウントアップ（spring物理）
- `GlowPulse`: 赤背景パルスで「$0 revenue」を強調
- 天秤アニメーション: SVGで build speed が上がり judgment が下がる

---

### Scene 2: Solution Introduction（0:25 - 0:45 = 600フレーム）

**コンセプト**: 3行の入力 → システムが判断を構造化

| 時間 | フレーム | 演出 | テキスト/要素 |
|---|---|---|---|
| 0:25-0:30 | 750-900 | フェードイン、Constitution Editorが出現 | `We built a constitutional product allocation system.` |
| 0:30-0:38 | 900-1140 | 3行がタイプライターで入力される | `We are...` → `We never...` → `We value...` |
| 0:38-0:42 | 1140-1260 | 入力テキストが5軸に変換されるアニメーション | 3行 → 5軸正規化の視覚フロー |
| 0:42-0:45 | 1260-1350 | 全体像フェード | `Judgment: explainable, repeatable, fast.` |

**エフェクト**:
- `ConstitutionMockup`: 実UIを模した3行入力フィールド
- タイプライター入力: `We are a privacy-first productivity tool...` が1文字ずつ出現
- 変換アニメーション: テキストが分解 → 5つの軸ラベルに再構成される（パーティクル風）
- `spring()` でカードがバウンスしながら配置

---

### Scene 3: Approach — 3-Step Pipeline（0:45 - 1:05 = 600フレーム）

**コンセプト**: パイプライン図が組み上がる

| 時間 | フレーム | 演出 | テキスト/要素 |
|---|---|---|---|
| 0:45-0:52 | 1350-1560 | Step 1 出現 | `Constitution → 5-axis clauses` ボックス + アイコン |
| 0:52-0:58 | 1560-1740 | Step 2 出現、矢印が伸びる | `Evidence → Extract intent vs need` ボックス |
| 0:58-1:05 | 1740-1950 | Step 3 出現、3色に分岐 | `Allocation Engine → Build / Defer / Kill` 分岐図 |

**エフェクト**:
- 各ステップが左から右にスライドイン（`spring()` + `interpolate()`）
- ステップ間を矢印が伸びるアニメーション（SVG pathのstroke-dashoffset）
- Step 3でBuild(緑)、Defer(黄)、Kill(赤)の3色に分岐 → 色が広がるエフェクト
- 背景にデータフロー粒子が流れる（subtle）

---

### Scene 4: Live Demo（1:05 - 1:30 = 750フレーム）

**コンセプト**: 実際の画面を見せる → Constitutionを変えると判断が変わる瞬間

これが**最もワクワクするシーン**。3つのサブシーンで構成。

#### 4A: Build Next Board（1:05-1:13 = 240フレーム）

| 時間 | フレーム | 演出 |
|---|---|---|
| 1:05-1:07 | 1950-2010 | ブラウザフレームがズームイン |
| 1:07-1:13 | 2010-2190 | Build Boardのカードが上からカスケードで出現。各カードにscore、evidence count、feature outline。ホバーでハイライト |

**エフェクト**:
- `BoardMockup`: 緑色のBuildカードが `staggered spring` で順番に出現
- カードにはリアルなデモデータを表示（`data/demo/proposals.json` から）
- スコアバーが0%→80%にアニメーション

#### 4B: Kill/Defer Board（1:13-1:20 = 210フレーム）

| 時間 | フレーム | 演出 |
|---|---|---|
| 1:13-1:15 | 2190-2250 | スライドトランジションで Kill Board へ |
| 1:15-1:20 | 2250-2400 | 赤いKillカードが出現。violated clauseがハイライトされる。Evidence drill-downがオーバーレイで開く |

**エフェクト**:
- `BoardMockup`: 赤/黄のKill/Deferカードが出現
- violated clauseが赤い下線付きで強調表示
- `EvidenceMockup`: ドリルダウンパネルがスライドインで開く → observation引用文がフェードイン

#### 4C: The Magic Moment — Constitution変更（1:20-1:30 = 300フレーム）★

**動画のクライマックス。ここが一番ワクワクするシーン。**

| 時間 | フレーム | 演出 |
|---|---|---|
| 1:20-1:22 | 2400-2460 | Constitution Aが画面上部に表示 → `We never sell user data` がハイライト |
| 1:22-1:24 | 2460-2520 | Constitution Bに切り替え: `We never slow down growth` に変化 → テキストモーフィング |
| 1:24-1:28 | 2520-2640 | **Board全体が再シャッフル**: KillだったカードがBuildに移動、BuildだったカードがKillに移動。カードが飛び交うアニメーション |
| 1:28-1:30 | 2640-2700 | `Constitution in, allocation out.` テキスト → BONSAIロゴ → `That's it.` |

**エフェクト**:
- テキストモーフィング: Constitution Aの文言がConstitution Bに変化（文字単位で入れ替え）
- **カードフライト**: KillカードがBuild列に飛ぶ（放物線軌道 + spring着地） ← 最重要演出
- `GlowPulse`: 変化したカードが緑/赤にパルス
- 背景色が微妙にシフト（寒色→暖色）
- ラストカット: ロゴが `spring()` でバウンスイン

---

## データフロー

```
data/demo/proposals.json ──→ mockups/BoardMockup.tsx
data/demo/constitutions.json ──→ mockups/ConstitutionMockup.tsx
data/demo/observations.json ──→ mockups/EvidenceMockup.tsx
data/demo/execution-packets.json ──→ mockups/ExecutionMockup.tsx
                                        │
data/script.ts (タイムライン定義) ──→ scenes/*.tsx ──→ BonsaiDemo.tsx
                                                           │
                                                    remotion render
                                                           │
                                                     bonsai-demo.mp4
```

### script.ts の構造

```typescript
export const SCRIPT = {
  fps: 30,
  width: 1920,
  height: 1080,
  totalDurationInFrames: 2700, // 90秒

  scenes: [
    {
      id: 'problem-hook',
      from: 0,
      durationInFrames: 750, // 25秒
      captions: [
        { from: 0, text: 'I shipped 10 products in one month', lang: 'en' },
        { from: 90, text: 'using AI coding tools.', lang: 'en' },
        { from: 150, text: 'Revenue: $0', lang: 'en', style: 'impact' },
        // ...
      ],
    },
    {
      id: 'solution-intro',
      from: 750,
      durationInFrames: 600, // 20秒
      captions: [/* ... */],
    },
    {
      id: 'approach',
      from: 1350,
      durationInFrames: 600, // 20秒
      captions: [/* ... */],
    },
    {
      id: 'live-demo',
      from: 1950,
      durationInFrames: 750, // 25秒
      subScenes: [
        { id: 'build-board', from: 0, durationInFrames: 240 },
        { id: 'kill-board', from: 240, durationInFrames: 210 },
        { id: 'magic-moment', from: 450, durationInFrames: 300 },
      ],
      captions: [/* ... */],
    },
  ],

  // Constitution A → B の変化データ
  constitutionSwap: {
    a: { label: 'Privacy-First', weNever: 'sell user data to third parties' },
    b: { label: 'Growth-First', weNever: 'slow down growth for edge cases' },
    // カードの移動マップ（どのproposalがbuild→kill / kill→buildに変わるか）
    transitions: [
      { proposalId: 'prop-001', from: 'build', to: 'kill' },
      { proposalId: 'prop-005', from: 'kill', to: 'build' },
      // ...
    ],
  },
} as const;
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
    "@remotion/renderer": "^4.0",
    "@remotion/transitions": "^4.0"
  }
}
```

### npm scripts

```json
{
  "scripts": {
    "remotion:studio": "remotion studio remotion/index.ts",
    "remotion:render": "remotion render remotion/index.ts BonsaiDemo --output out/bonsai-demo.mp4",
    "remotion:render:gif": "remotion render remotion/index.ts BonsaiDemo --output out/bonsai-demo.gif --image-format png",
    "remotion:still": "remotion still remotion/index.ts BonsaiDemo --frame 2520 --output out/magic-moment.png"
  }
}
```

---

## 主要エフェクト仕様

### TypewriterText

```typescript
// テキストが1文字ずつ出現
const TypewriterText: React.FC<{
  text: string;
  startFrame: number;
  charsPerFrame: number; // デフォルト: 0.5（2フレームに1文字）
  cursor?: boolean;
}>;
```

### CardFlip（カード入れ替え）

```typescript
// Constitution変更時にカードが飛ぶ
const CardFlip: React.FC<{
  fromPosition: { x: number; y: number };  // Kill Board座標
  toPosition: { x: number; y: number };    // Build Board座標
  startFrame: number;
  durationInFrames: number; // 60-90フレーム（2-3秒）
  verdictFrom: 'kill' | 'build';
  verdictTo: 'build' | 'kill';
  children: React.ReactNode; // カード内容
}>;
// 実装: spring() + interpolate() で放物線軌道 + 色変化
```

### GlowPulse

```typescript
// 変化強調のパルスエフェクト
const GlowPulse: React.FC<{
  color: string; // '#ef4444' (red) or '#22c55e' (green)
  startFrame: number;
  pulseCount: number; // 2-3回
  children: React.ReactNode;
}>;
// 実装: box-shadow + opacity のspring oscillation
```

### ZoomPan

```typescript
// UI要素へのズームイン
const ZoomPan: React.FC<{
  from: { scale: number; x: number; y: number };
  to: { scale: number; x: number; y: number };
  startFrame: number;
  durationInFrames: number;
  children: React.ReactNode;
}>;
// 実装: transform: scale() translate() のinterpolate
```

---

## モックアップ設計方針

### ConstitutionMockup

実アプリの `ConstitutionInput.tsx` のスタイルを参照。以下を再現:
- 3つのtextareaフィールド（`We are` / `We never` / `We value`）
- Parseボタン（shadcn/ui風のスタイル）
- Clause表示パネル（5軸のタグ表示）
- **動的要素**: タイプライターでテキストが入力される → Parseボタンがクリックされる → Clauseが展開

### BoardMockup

実アプリの `AllocationBoard.tsx` + `DecisionCard.tsx` のスタイルを参照:
- 2カラムレイアウト（Build Next | Kill/Defer）
- カード: verdict badge（色分け）、タイトル、スコア、evidence count
- Summary Bar: Build 2 / Defer 2 / Kill 3 の集計表示
- **動的要素**: カードがspring付きで出現 / Constitution変更時にカードが飛ぶ

### EvidenceMockup

実アプリの `EvidencePanel.tsx` のスタイルを参照:
- スライドインドロワー
- Violated clause一覧
- Supporting evidence（blockquote + relevance score）
- **動的要素**: ドロワーがスライドイン → 内容がフェードイン

---

## 音声・BGM設計（将来拡張）

動画のv1は **無音**（テキスト字幕のみ）で生成。
将来的に以下を追加可能:

| 要素 | 方式 |
|---|---|
| ナレーション | speech.mdのスクリプトをTTS（ElevenLabs等）で生成 → `<Audio>` |
| BGM | ロイヤリティフリーBGM → `<Audio>` + `interpolateVolume()` |
| 効果音 | タイプライター音、カード出現音 → `<Audio>` |

Remotionの `<Audio>` コンポーネントでフレーム同期可能。

---

## 実装フェーズ

### Phase 1: Skeleton（推定作業量: 小）

1. `remotion/` ディレクトリ作成、パッケージインストール
2. `Root.tsx` + `BonsaiDemo.tsx` の骨格
3. `script.ts` にタイムライン定義
4. 4シーンの `<Sequence>` 配置（プレースホルダー）
5. `remotion studio` で確認

### Phase 2: Scene実装（推定作業量: 中）

1. Scene 1: ProblemHook — タイプライター + 数字カウンター
2. Scene 2: SolutionIntro — ConstitutionMockup + タイプライター入力
3. Scene 3: Approach — パイプライン図アニメーション
4. Scene 4A/4B: BoardMockup + EvidenceMockup

### Phase 3: Magic Moment（推定作業量: 中）

1. Scene 4C: Constitution切り替えアニメーション
2. CardFlip: カードが飛ぶ放物線アニメーション
3. GlowPulse: 変化強調エフェクト
4. ラストカット: ロゴ + `That's it.`

### Phase 4: Polish（推定作業量: 小）

1. Captions overlay（字幕）
2. トランジション磨き（`<TransitionSeries>`）
3. 色・タイミング微調整
4. `remotion render` で最終出力

---

## Skill定義（Claude Code用）

このSkillをClaude Codeで呼び出す際のトリガーと振る舞い:

```yaml
name: remotion-recording
description: >
  BONSAIアプリのデモ動画をRemotionで作成・編集する。
  シーンの追加、エフェクトの調整、レンダリングを行う。

trigger:
  - "Remotionで動画を作りたい"
  - "デモ動画を生成して"
  - "動画のシーンを修正して"
  - "remotion render"
  - code imports from "remotion" or "@remotion/*"

capabilities:
  - remotion/ ディレクトリ内のコンポーネント作成・編集
  - script.ts のタイムライン編集
  - remotion studio / render の実行
  - デモデータ（data/demo/）の参照

constraints:
  - apps/bonsai/src/ のコードは読み取り参照のみ（スタイル参照用）
  - 動画の実アプリ操作は行わない（モックアップで再現）
  - useCurrentFrame() + interpolate() でアニメーション（CSS animationは使わない）
```

---

## 成功基準

| # | 基準 | 検証方法 |
|---|---|---|
| 1 | `npm run remotion:render` で mp4 が生成される | CI/ローカルで実行 |
| 2 | 動画が90秒（±2秒） | 出力ファイルの尺確認 |
| 3 | 1920×1080 フルHD | 出力ファイルの解像度確認 |
| 4 | speech.md の4セクションが全て含まれる | 目視確認 |
| 5 | Constitution変更→判断入れ替えが視覚的に明確 | Magic Momentシーンの目視確認 |
| 6 | テキストが読みやすい（最低2秒表示） | 各字幕のフレーム数確認 |

---

## 参考

- [Remotion公式ドキュメント](https://www.remotion.dev/docs/)
- [Remotion + Next.js](https://www.remotion.dev/docs/miscellaneous/nextjs)
- [`<Sequence>` API](https://www.remotion.dev/docs/sequence)
- [`<TransitionSeries>` API](https://www.remotion.dev/docs/transitions/transitionseries)
- `docs/design/speech.md` — 90秒プレゼンスクリプト
- `docs/design/bonsai_mvp.md` — MVP仕様
- `data/demo/` — デモデータセット
