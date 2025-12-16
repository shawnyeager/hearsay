# Customer Interview Meta-Analysis Toolkit

A methodology toolkit for extracting actionable product insights from customer interviews. Point an LLM agent at a folder of transcripts and get a deliverable answering: **What should we build next, and why?**

## What This Does

Analyzes interview transcripts to produce:
- Frequency-ranked problems (X of N transcripts mentioned...)
- Frequency-ranked solution desires
- Verbatim quote evidence with attribution
- Concrete build recommendations

Explicitly avoids:
- Per-interview summaries
- Vague themes ("bad UX")
- Opinion-driven prioritization
- Mention-counting (counts transcripts, not mentions)

## Quick Start

```
Analyze the interviews in ./transcripts/ using the methodology in PROMPT_core.md
```

The agent reads all transcripts, applies the methodology, and produces a report matching `TEMPLATE_output.md`.

## Toolkit Contents

| File | Purpose |
|------|---------|
| `INTERVIEW_script.md` | 20-minute interview script optimized for later analysis |
| `PROMPT_core.md` | Core methodology: ingest → extract → normalize → count → synthesize |
| `PROMPT_with_quotes.md` | Quote-heavy variant for stakeholder presentations |
| `TEMPLATE_output.md` | Expected output structure |
| `RUBRIC_scoring.md` | 7-dimension quality rubric (1-5 scoring) |
| `EXAMPLE_usage.md` | Detailed usage guide |

## Workflow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Conduct        │     │  Analyze        │     │  Build          │
│  Interviews     │ ──▶ │  Transcripts    │ ──▶ │  Recommendations│
│                 │     │                 │     │                 │
│ INTERVIEW_      │     │ PROMPT_core.md  │     │ "What to build  │
│ script.md       │     │ + transcripts   │     │  next and why"  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Interview Script

`INTERVIEW_script.md` provides a tight 20-minute structure:

| Phase | Time | Focus |
|-------|------|-------|
| Open | 2 min | Setup, purpose frame |
| Context | 5 min | Background, current focus |
| Stack | 5 min | Tech choices, buy vs. build |
| Problems | 6 min | Challenges, gaps, workarounds |
| Magic Wand | 2 min | Aspirational solutions |
| Close | 2 min | Follow-up, referral ask |

Consistent interviews yield better cross-transcript pattern detection.

## Quality Bar

A good analysis lets someone:
- Write a feature spec from the top problem
- Defend any ranking with "X of N transcripts said..."
- Verify any claim by checking the cited source

Use `RUBRIC_scoring.md` to score outputs (target: 32+/35).

## License

[MIT](LICENSE)
