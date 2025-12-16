# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A methodology toolkit for analyzing customer interview transcripts. When pointed at a folder of transcripts, Claude produces a deliverable answering: **What should we build next, and why?**

## Primary Workflow

```
User: Analyze the interviews in ./transcripts/
```

Claude then:
1. Reads all transcripts
2. Applies the methodology in `PROMPT_core.md`
3. Produces output matching `TEMPLATE_output.md`
4. Self-scores using `RUBRIC_scoring.md`

## Key Files

| File | Purpose |
|------|---------|
| `PROMPT_core.md` | Core methodology: ingest → extract → normalize → count → rank → synthesize |
| `PROMPT_with_quotes.md` | Quote-heavy variant for stakeholder presentations |
| `TEMPLATE_output.md` | Expected output structure with format specs |
| `RUBRIC_scoring.md` | 7-dimension quality rubric with scoring criteria |
| `EXAMPLE_usage.md` | User guide for transcript prep and invocation |

## Methodology Principles

- **Cross-transcript analysis** — never per-interview summaries
- **Concrete themes** — "can't export to CSV" not "bad UX"
- **Frequency-ranked** — count distinct transcripts, not mentions
- **Explicitly attributed** — every claim traceable to sources
- **Quote-grounded** — verbatim evidence, not paraphrase

## Output Quality Bar

A good analysis lets someone:
- Write a feature spec from the top problem
- Defend any ranking with "X of N transcripts said..."
- Verify any claim by checking the cited source
