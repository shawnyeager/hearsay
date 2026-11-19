# Usage Guide

Install the Hearsay skill in Claude or ChatGPT first. The install steps are in the README, under "Use the skill."

## Run an analysis

1. Place interview transcripts in a folder (for example, `./transcripts/`), or attach the files to the chat.
2. Ask Claude or ChatGPT: "Analyze the interviews in ./transcripts/"
3. The skill reads every transcript, applies the methodology, and produces the deliverable.

With a coding agent that has the skill installed, you can name the variant and the output file:

```
Analyze the interviews in ./transcripts/ using the quote-heavy variant.
Write the report to ./output/analysis.md.
Score it with the rubric and revise until the score is at least 32.
```

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

## Quality Control

After receiving the analysis:

1. **Spot-check quotes** — Verify 2-3 quotes against source transcripts
2. **Validate counts** — Check that X/N claims are accurate
3. **Test concreteness** — Could you write a feature spec from the top problem?
4. **Score with rubric** — Use RUBRIC_scoring.md for systematic evaluation

## Iteration

If quality is low:
- Ask Claude or ChatGPT to re-analyze with specific corrections
- "The themes are too abstract—make them more concrete and product-specific"
- "Quote #3 under Problem #2 seems out of context—replace with a better example"
- "Combine 'slow performance' and 'takes too long' into one theme and recount"

## Tips

- **More transcripts = better signal.** 5 is minimum; 10-15 is ideal for pattern detection.
- **Homogeneous cohorts work best.** Mixing CTOs with junior devs dilutes patterns.
- **Run twice and compare.** If rankings differ significantly, themes may need refinement.
- **Long tail matters.** Single-mention items may be early signals worth noting.
- **Consistent interviews = better analysis.** Use `INTERVIEW_script.md` to ensure all transcripts cover the same question arc (context → stack → problems → magic wand). This makes cross-transcript pattern detection more reliable.

## Browser app

The app in `app/` runs the same standard and quote-heavy methodologies in a browser, plus Quick Scan and Deep Dive. Install and start it from the README. Use the skill when Claude or ChatGPT can read the transcripts directly.
