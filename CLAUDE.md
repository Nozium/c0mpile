# CLAUDE.md — c0mpile / BONSAI

## What is this repo

c0mpile is the monorepo for BONSAI — a Constitutional Product Allocation System.
BONSAI helps product teams decide what to build, defer, and kill, using constitution-based reasoning and evidence traces.

## Key docs (read order)

1. `docs/design/bonsai_mvp.md` — MVP scope and demo spec (source of truth for implementation)
2. `docs/design/speech.md` — 1.5 min presentation script with required demo features
3. `docs/design/bonsai_claude.md` — Full system design (architecture, data model, API, pipeline)
4. `docs/design/hypothesis-brief.md` — 14 hypotheses with validation criteria
5. `docs/design/yc_review.md` — YC virtual staff review with Fatal Questions and structural critiques

## Architecture

```
Constitution (3行) → 5軸正規化 → Evidence (observations) → Allocation Engine → Build/Defer/Kill
```

- **Layer 1**: Brand Constitution — "We are / We never / We value" → 5 axes
- **Layer 2**: Observations — customer interviews, usage data, app reviews, support tickets
- **Layer 3**: Allocation Engine — constitutional filter → build/defer/kill + clause-based reasoning

## Tech stack

- Next.js 15 (App Router) + TypeScript
- shadcn/ui + Tailwind CSS
- Vercel AI SDK + Zod (structured LLM output)
- Claude Haiku 4.5 (Extract/Cluster) + Claude Sonnet 4.5 (Filter/Execution Packet)
- Deploy: Cloudflare Pages + @cloudflare/next-on-pages

## Repo structure

```
apps/bonsai/          — BONSAI application (Next.js 15)
  src/
    features/         — Issue-driven feature directories (phase1-4)
    components/       — Shared UI only (feature-specific UI stays in features/)
    lib/              — Pure functions, schemas, LLM helpers
    data/             — Fixtures and import samples
    types/            — Shared types and DTOs
  tests/              — unit/ and integration/
data/demo/            — Pre-shaped demo dataset (constitutions, observations, themes, proposals, execution packets)
docs/design/          — Design docs (bonsai_claude.md, bonsai_mvp.md, hypothesis-brief.md, etc.)
docs/issues/          — Implementation issues organized by phase (phase1-4)
docs/                 — YC RFS theme reference docs (01-10)
```

## Data model

All schemas are defined in Zod. Core types (see `docs/design/bonsai_claude.md` Section 3):

- `BrandConstitution` — 3-line input → 5-axis normalization
- `Observation` — raw evidence with source, channel_type, says vs wants counterfactual
- `Theme` — clustered observations with anti-theme
- `Proposal` — build/defer/kill decision with clause-based reasoning, evidence trail, pre-mortem
- `ExecutionPacket` — UI/data/workflow changes + coding agent task breakdown
- `DecisionLog` — decision tracking with override support

## LLM pipeline (3-step MVP)

1. **Extract** (Haiku): observations → extracted_intent vs inferred_need
2. **Cluster** (Haiku): observations → themes vs anti-themes
3. **Constitutional Filter** (Sonnet): themes + constitution → proposals with build_if/kill_because

Step 4 (Execution Packet, Sonnet) is post-traction. Demo uses pre-computed packets.

## Demo data

`data/demo/` contains pre-shaped demo data:
- `constitutions.json` — 2 patterns (Privacy-First / Growth-First)
- `observations.json` — 50 observations across 6 source types
- `themes.json` — 7 pre-computed themes
- `proposals.json` — 7 proposals for Constitution A (2 build, 3 kill, 2 defer)
- `execution-packets.json` — 2 execution packets for build proposals

Demo flow: Constitution input (live) → pre-computed observations/themes → Constitutional Filter (live) → Build/Kill boards. Changing constitution changes the decisions.

## Implementation phases

- **Phase 1**: MVP allocation spine — constitution, observations, allocation engine, boards, demo gates
- **Phase 2**: Explainability — evidence drill-down, execution packet, coding agent export
- **Phase 3**: Post-MVP — Rork experiments, virtual staff, state/theme refinement
- **Phase 4**: Operations — CRM sync, observability, UX evaluation

## Conventions

- Feature-specific code stays in `features/{phase}/{feature}/`. Don't extract prematurely.
- Shared code in `components/`, `lib/`, `types/` only when used across 2+ features.
- Zod schemas are the source of truth for types. Derive TypeScript types with `z.infer<>`.
- All LLM calls use Vercel AI SDK `generateObject()` with Zod schemas.
- API routes: Next.js App Router `/app/api/`. SSE for pipeline progress.
- UI: shadcn/ui components. Kill = red, Defer = yellow, Build = green, Continue = blue.
- Testing: unit tests for schemas/scoring, integration tests for the full pipeline spine.

## Key design decisions

- **Judgment support, not replacement**: BONSAI proposes, humans decide. Override button on every recommendation.
- **Delegation ladder is internal**: No UI for trust levels. Default: explain, recommend as "suggestion" label.
- **Kill-first differentiation**: Kill Board is the core differentiator. Build Next Board is the entry point.
- **3-step MVP (H-13)**: Ship constitution → data → kill/build first. Add scoring, pre-mortem, execution packets after traction.
- **Evaluation fatigue is post-MVP**: Exposure allocation is a future vision, not today's pain.
- **Constitution names**: Internal = "constitution". External messaging may use "product policy" for accessibility.

## Fatal Questions (must be answerable)

1. **F1**: Who pays $100/mo today? → "No one yet. Finding the first PM to use it weekly is priority #1."
2. **F2**: How is this different from ChatGPT? → "Constitution constraint + evidence trail + reproducible judgment."
3. **F3**: Can people who write constitutions even need this? → "Writing ≠ operationalizing. Teams need the framework, not just the words."
4. **F4**: PM tool or AI governance framework? → "PM tool. Delegation ladder is internal, not the product."
