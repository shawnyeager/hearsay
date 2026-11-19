# Hearsay

Turn customer interview transcripts into product roadmap recommendations. Install the skill in Claude or ChatGPT, point it at your transcripts, and get: **What should we build next, and why?**

## Use the skill

The skill is a folder, [`skills/hearsay`](skills/hearsay), with a `SKILL.md` and the methodology files it follows. Claude and ChatGPT both load that format.

Zip it once:

```bash
cd skills
zip -r hearsay.zip hearsay
```

**Claude.** In Customize, open Skills, choose +, then Upload a skill, and upload `hearsay.zip`. On an individual plan, turn on code execution and file creation under Settings, Capabilities. On a Team or Enterprise plan, an owner turns Skills on under Organization settings, Plugins & skills.

In Claude Code, install it for every project:

```bash
mkdir -p ~/.claude/skills
cp -R /path/to/hearsay/skills/hearsay ~/.claude/skills/
```

**ChatGPT.** Open your profile, choose Skills, then Create, then Upload from your computer, and upload the same zip. ChatGPT scans the skill before it can run. Skills are on Business, Enterprise, Edu, Teachers, and Healthcare plans.

Then attach the transcripts, or point a coding agent at the folder, and ask:

```
Analyze the interviews in ./transcripts/
```

The skill reads every transcript, follows the core methodology bundled with it, and writes the report in the bundled template. Ask for the quote-heavy variant when you need stakeholder evidence. Transcript prep, scoring, and revision are in [`EXAMPLE_usage.md`](EXAMPLE_usage.md).

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

## Toolkit Contents

| File | Purpose |
|------|---------|
| `skills/hearsay/` | Skill for Claude and ChatGPT. This is how you run an analysis |
| `PROMPT_core.md` | Core methodology: ingest → extract → normalize → count → synthesize |
| `PROMPT_with_quotes.md` | Quote-heavy variant for stakeholder presentations |
| `TEMPLATE_output.md` | Expected output structure |
| `RUBRIC_scoring.md` | 7-dimension quality rubric (1-5 scoring) |
| `EXAMPLE_usage.md` | Transcript prep, invocation, and scoring |
| `INTERVIEW_script.md` | 20-minute interview script optimized for later analysis |
| `app/` | Browser app, for when you want a local UI |

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

## Browser app

A local UI lives in [`app/`](app). Bring your own model: Claude, OpenAI, OpenRouter, or Maple. Transcripts and the API key stay in the browser.

```bash
cd app
npm install
npm run dev
```

## License

[MIT](LICENSE)
