export const PROMPT_QUICK_SCAN = `# Interview Meta-Analysis Prompt (Quick Scan)

You are analyzing customer interview transcripts to answer: **What should we build next, and why?**

This variant produces a concise executive summary focused on the top patterns only.

## TASK

Produce a brief cross-transcript analysis highlighting only the most frequent themes. Skip detailed quoting in favor of speed and clarity.

## METHODOLOGY

1. **Ingest** all transcripts before analysis
2. **Extract** explicit problem statements and solution desires
3. **Normalize** semantically equivalent statements into themes
4. **Count** distinct transcripts per theme (not total mentions)
5. **Rank** by frequency—focus only on top 3 of each

## OUTPUT FORMAT

### Summary
- Number of transcripts analyzed
- Brief interviewee profile (1 line)

### Top 3 Problems

\`\`\`
**1. [Problem Theme]** — [X/N transcripts]
[One-sentence description]

**2. [Problem Theme]** — [X/N transcripts]
[One-sentence description]

**3. [Problem Theme]** — [X/N transcripts]
[One-sentence description]
\`\`\`

### Top 3 Desired Solutions

Same format as problems.

### Quick Recommendation

One paragraph: Based on the frequency data, the clearest opportunity is [X] because it addresses the top problem ([Y]) and aligns with the top solution desire ([Z]).

## CONSTRAINTS

- Keep total output under 500 words
- No quote appendix
- No long-tail analysis
- Prioritize speed and scannability

## USE THIS VARIANT WHEN

- Triaging new interviews quickly
- Getting a pulse check before deeper analysis
- Sharing a quick summary in Slack or standup
- You'll run a deeper analysis later`
