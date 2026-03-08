---
name: yc-review
description: Review the BONSAI app from Y Combinator's perspective using Chrome browser automation. Use when the user asks to review the product as YC, do a demo review, or wants YC-style feedback on the running app.
---

# YC Virtual Staff Review — Browser Automation Skill

## Overview

This skill reviews the running BONSAI application through the lens of 4 YC reviewers, using Chrome browser automation to navigate and evaluate the actual product.

## Reviewers

| Reviewer | Focus | Style |
|---|---|---|
| **Michael Seibel** | Clarity, Speed, User obsession | "30秒で説明できないなら理解していない" |
| **Dalton Caldwell** | Market reality, Competition, Tarpit detection | "金を払う人が見えなければ全て仮説" |
| **Gustaf Alströmer** | Growth, PMF signals, Go-to-market | "最初の10社をどう獲るかが全て" |
| **Paul Graham** | Founder insight, Contrarian truth | "何を知っているか。なぜあなたか" |

## Execution Steps

### Step 0: Get Browser Context

Call `mcp__claude-in-chrome__tabs_context_mcp` to see current browser state.

### Step 1: Navigate to the App

Ask the user for the URL if not provided. Common targets:
- Local dev: `http://localhost:3000`
- Deployed: Ask user

Navigate using `mcp__claude-in-chrome__navigate`.

### Step 2: Screenshot & First Impression (Seibel Test)

Take a screenshot of the landing page with `mcp__claude-in-chrome__read_page`.

**Evaluate (Seibel)**:
- Can I understand what this does in 5 seconds?
- Is there a clear call-to-action?
- Does it look like a real product or a prototype?

### Step 3: Core Flow Review — Constitution Input

Navigate to the Constitution input screen.

**Evaluate**:
- Are the 3 fields clear? (We are / We never / We value)
- Is there placeholder text guiding the user?
- Can I complete input in under 30 seconds?
- Does the Parse button work and show results?

Use `mcp__claude-in-chrome__form_input` to test with sample constitutions from `data/demo/constitutions.json`:
- **Pattern A (Privacy-First)**: "a privacy-first productivity tool for knowledge workers"
- **Pattern B (Growth-First)**: "a growth-first social platform for creators"

### Step 4: Pipeline & Board Review

After Constitution input, check:

1. **Build Next Board**:
   - Are proposals displayed with score, title, target user?
   - Is the BUILD badge visible?
   - Can I drill down into evidence?

2. **Kill / Defer Board**:
   - Are killed items clearly marked with violated clauses?
   - Is the KILL badge red, DEFER yellow?
   - Is confidence shown?

3. **Evidence Drill-down**:
   - Does clicking a card show supporting observations?
   - Is clause reasoning visible?
   - Is the pre-mortem accessible?

4. **Execution Packet** (if available):
   - Does a build candidate show UI/data/workflow changes?
   - Are coding agent tasks listed?

### Step 5: Constitution Switch Test (Demo Core)

This is the **核心** of the demo. Change the constitution and verify that build/kill decisions change.

1. Input Constitution Pattern A → note the build/kill items
2. Switch to Constitution Pattern B → verify items moved between boards
3. Screenshot both states

**Evaluate (Caldwell)**:
- Does the switch actually change outcomes?
- Is the change meaningful or cosmetic?
- Would this convince a skeptic that constitution matters?

### Step 6: Performance & Polish Check

**Evaluate**:
- Page load time (should feel fast)
- LLM response time for Constitution parse (target: <5s)
- Any console errors? Check with `mcp__claude-in-chrome__read_console_messages`
- Mobile responsiveness (optional)

### Step 7: Read Design Docs for Context

Read the following files for evaluation context:
- `docs/design/yc_review.md` — Previous YC review with Fatal Questions
- `docs/design/speech.md` — Demo requirements
- `docs/design/bonsai_mvp.md` — MVP spec

## Output Format

Generate a structured review report:

```markdown
# YC Review — BONSAI [date]

## First Impression (5-Second Test)
[Seibel perspective: what do I understand immediately?]

## Demo Flow Evaluation

### Constitution Input
- Working: [yes/no]
- UX quality: [1-5]
- Issues: [list]

### Build Next Board
- Working: [yes/no]
- Information density: [appropriate/too sparse/too dense]
- Issues: [list]

### Kill / Defer Board
- Working: [yes/no]
- Kill-first differentiation visible: [yes/no]
- Issues: [list]

### Evidence Drill-down
- Working: [yes/no]
- Trace quality: [1-5]
- Issues: [list]

### Execution Packet
- Working: [yes/no / N/A]
- Issues: [list]

### Constitution Switch (Demo Core)
- Decisions change on switch: [yes/no]
- Change is meaningful: [yes/no]
- Issues: [list]

## Fatal Question Readiness

| # | Question | Answerable from product? | Gap |
|---|---|---|---|
| F1 | Who pays $100/mo today? | N/A (traction) | — |
| F2 | How is this different from ChatGPT? | [Can the product demonstrate this?] | [gap] |
| F3 | Can constitution writers even need this? | [Does UX address this?] | [gap] |
| F4 | PM tool or AI governance framework? | [Is positioning clear in UI?] | [gap] |

## Reviewer Verdicts

### Seibel
> [1-2 sentence verdict on clarity and speed]

### Caldwell
> [1-2 sentence verdict on market reality]

### Gustaf
> [1-2 sentence verdict on growth potential]

### PG
> [1-2 sentence verdict on founder insight]

## Critical Issues (must fix before demo)
1. [issue]

## Recommendations (nice to have)
1. [rec]

## Score

| Axis | Score | Notes |
|---|---|---|
| Problem clarity | [A-F] | |
| Solution demo | [A-F] | |
| UX/Polish | [A-F] | |
| Differentiation | [A-F] | |
| Demo impact | [A-F] | |
```

## Key References

- Fatal Questions: See `docs/design/yc_review.md` Section 4
- Demo requirements: See `docs/design/speech.md` 必要な機能 table
- Color conventions: Kill=red, Defer=yellow, Build=green, Continue=blue
- MVP scope: Constitution input (live) → pre-computed observations/themes → Constitutional Filter (live) → Build/Kill boards
- Core differentiator: Changing constitution changes the decisions
- 1-line pitch: "AI made building cheap. The hard part now is deciding what not to build."
