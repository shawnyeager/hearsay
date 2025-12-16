# Usage Guide

## Basic Workflow

1. Place interview transcripts in a folder (e.g., `./transcripts/`)
2. Point Claude to the folder: "Analyze the interviews in ./transcripts/"
3. Claude reads all transcripts, applies the methodology, produces the deliverable

## Transcript Preparation

### Naming Convention
Use identifiable names for attribution:
- `founder_alice_acme.md`
- `dev_bob_bigcorp.md`
- `pm_carol_startup.md`

### Format
Plain text or markdown. Include:
- Interviewee identifier (can be anonymized)
- Date (optional)
- Full transcript (questions and answers)

### What Makes a Good Transcript
- Semi-structured interview format
- Questions about problems, workflows, tools, desires
- Interviewee's own words (not summarized)
- 15-60 minutes of content typical

## Invoking Analysis

### Standard analysis:
```
Analyze the interviews in ./transcripts/ using the methodology in PROMPT_core.md
```

### Quote-heavy variant (for stakeholder presentations):
```
Analyze the interviews in ./transcripts/ using PROMPT_with_quotes.md
```

### With explicit output location:
```
Analyze ./transcripts/ and write the report to ./output/analysis.md
```

## Quality Control

After receiving the analysis:

1. **Spot-check quotes** — Verify 2-3 quotes against source transcripts
2. **Validate counts** — Check that X/N claims are accurate
3. **Test concreteness** — Could you write a feature spec from the top problem?
4. **Score with rubric** — Use RUBRIC_scoring.md for systematic evaluation

## Iteration

If quality is low:
- Ask Claude to re-analyze with specific corrections
- "The themes are too abstract—make them more concrete and product-specific"
- "Quote #3 under Problem #2 seems out of context—replace with a better example"
- "Combine 'slow performance' and 'takes too long' into one theme and recount"

## Tips

- **More transcripts = better signal.** 5 is minimum; 10-15 is ideal for pattern detection.
- **Homogeneous cohorts work best.** Mixing CTOs with junior devs dilutes patterns.
- **Run twice and compare.** If rankings differ significantly, themes may need refinement.
- **Long tail matters.** Single-mention items may be early signals worth noting.
- **Consistent interviews = better analysis.** Use `INTERVIEW_script.md` to ensure all transcripts cover the same question arc (context → stack → problems → magic wand). This makes cross-transcript pattern detection more reliable.
