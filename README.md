# c0mpile — BONSAI

**Constitutional Product Allocation System**

BONSAI helps product teams decide what to build, defer, and kill — using constitution-based reasoning backed by customer evidence.

> "What if every build/kill decision came with 12 pieces of evidence and 2 constitutional violations?"

## How it works

```
Constitution (3 lines) → 5-axis normalization → Evidence → Allocation Engine → Build / Defer / Kill
```

1. **Define your constitution**: "We are / We never / We value" — 3 lines that encode your product's identity
2. **Feed evidence**: Customer interviews, usage data, app reviews, support tickets
3. **Get decisions**: Each candidate gets build/defer/kill with clause-level reasoning and evidence trail

Changing the constitution changes the decisions. That's the point.

## Why BONSAI

AI coding tools have made it trivially cheap to build. The bottleneck has shifted from "can we build it?" to "should we build it?" Teams now generate 30+ candidates per quarter but still decide what to kill using spreadsheets and gut feeling.

BONSAI provides **systematic kill discipline** — evidence-backed reasoning for what NOT to build.

## Key differentiators

- **Kill-first**: Most tools help you prioritize what to build. BONSAI helps you justify what to kill.
- **Constitution-based**: Decisions are reproducible and traceable to your product policy.
- **Evidence trail**: Every decision links to customer quotes, usage data, and violated clauses.
- **Judgment support, not replacement**: AI proposes, humans decide. Override button on every recommendation.

## Tech stack

- Next.js 15 (App Router) + TypeScript
- shadcn/ui + Tailwind CSS
- Vercel AI SDK + Zod
- Claude Haiku 4.5 / Sonnet 4.5
- Cloudflare Pages

## Project structure

```
apps/bonsai/        — BONSAI application (Next.js 15)
data/demo/          — Pre-shaped demo dataset
docs/design/        — Design documents
docs/issues/        — Implementation issues by phase
```

## Docs

| Document | Description |
|----------|-------------|
| [bonsai_mvp.md](docs/design/bonsai_mvp.md) | MVP scope and demo spec |
| [speech.md](docs/design/speech.md) | 1.5 min presentation script |
| [bonsai_claude.md](docs/design/bonsai_claude.md) | Full system design |
| [hypothesis-brief.md](docs/design/hypothesis-brief.md) | 14 hypotheses with validation criteria |

## License

Private — YC RFS 2026 Hackathon project.
