---
name: hearsay
description: >
  Turn customer interview transcripts into a frequency-ranked product roadmap:
  what to build next, and why. Use when the user asks to analyze interviews,
  meta-analyze transcripts, find patterns across customer conversations, or
  decide what to build from interview notes.
---

# Hearsay

Produce one cross-transcript report. Read every transcript before you write.

## Steps

1. Read every transcript the user supplied. Note N, the number of distinct interviewees.
2. Read the methodology file, then follow it.
   - Default: [references/core.md](references/core.md)
   - Quote-heavy, when the user wants stakeholder evidence: [references/with-quotes.md](references/with-quotes.md)
3. Write the report in the shape of [references/template.md](references/template.md).
4. Score the report with [references/rubric.md](references/rubric.md). Revise until the score is at least 32 out of 35.
5. When you have a filesystem, save the report under `output/`. Do not commit transcripts or reports. They may contain personal data.

## Rules that the methodology files already require

Count distinct transcripts, not mentions. Rank by that count. Attribute every theme to named sources. Use verbatim quotes. Leave one-person themes out of the top list. Do not write a summary of each interview.

The files in `references/` are the procedure. Do not replace them with a looser analysis.
