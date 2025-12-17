# Interview to Roadmap Kit

LLM prompts and methodology for turning customer interview transcripts into product roadmap recommendations. Point an agent at a folder of transcripts and get: **What should we build next, and why?**

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

> **Note:** This script is optimized for B2B and developer-facing interviews. The "Stack" phase and technical probing will need adaptation for B2C or non-technical contexts.

## Who to Interview

Interview selection matters more than interview volume. Key principles:

- **Interview your best customers** — those who intuitively see value, are profitable, and recommend you to peers. Not just anyone with a heartbeat.
- **Pursue variation** — across engagement levels (power users, new users, churned), roles, company sizes, and use cases. Variation beats "representative samples" in qualitative research.
- **Match selection to goals** — acquisition insights come from prospects; retention insights from current/churned customers.
- **Recent switchers are gold** — people who just started or stopped using a solution remember their decision context vividly.
- **Ask for referrals** — warm intros from interviewees have 80-90% success vs. 10% for cold outreach.

Common mistakes:
- Over-optimizing for the "perfect" sample (starting anywhere beats paralysis)
- Interviewing whoever responds instead of deliberately recruiting
- Mixing personas in the same analysis (CTOs and junior devs have different problems)

See: [Teresa Torres on selecting customers](https://www.producttalk.org/2022/03/selecting-customers-for-customer-interviews/), [Customer Dev Labs B2B scripts](https://customerdevlabs.com/2014/07/09/b2b-customer-discovery-problem-interview-script/)

## Quality Bar

A good analysis lets someone:
- Write a feature spec from the top problem
- Defend any ranking with "X of N transcripts said..."
- Verify any claim by checking the cited source

Use `RUBRIC_scoring.md` to score outputs (target: 32+/35).

## License

[MIT](LICENSE)
