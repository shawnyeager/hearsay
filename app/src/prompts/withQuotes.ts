export const PROMPT_WITH_QUOTES = `# Interview Meta-Analysis Prompt (Quote-Heavy Variant)

You are analyzing customer interview transcripts to answer: **What should we build next, and why?**

This variant emphasizes extensive quote extraction for stakeholder presentations or investment memos where verbatim evidence is critical.

## TASK

Produce a cross-transcript meta-analysis with heavy quote grounding. Every claim must be backed by direct quotes.

## METHODOLOGY

Same as core methodology:
1. **Ingest** all transcripts before analysis
2. **Extract** explicit problem statements and solution desires
3. **Normalize** semantically equivalent statements into themes
4. **Count** distinct transcripts per theme (not total mentions)
5. **Rank** by frequency
6. **Attribute** with extensive quotes

## OUTPUT FORMAT

### 1. Summary
- Transcript count and interviewee profile

### 2. Top Problems (Ranked)

For each problem (2+ transcripts):
\`\`\`
**[Rank]. [Problem Theme]** — [X/N transcripts]

[One-sentence description]

Evidence:
- "[Quote 1]" — [Source]
- "[Quote 2]" — [Source]
- "[Quote 3]" — [Source]
\`\`\`

Minimum 3 quotes per top-5 theme. Include all sources that mentioned it.

### 3. Top Desired Solutions (Ranked)

Same format with extensive quoting.

### 4. Comprehensive Quote Bank

All relevant quotes organized by theme, including:
- Full context (2-3 sentences around the key statement)
- Speaker identifier
- Theme tag

This section should be exhaustive—include every relevant quote, not just representatives.

### 5. What to Build

Top 3 recommendations, each with:
- The problems it addresses (with quote references)
- The solution desires it fulfills (with quote references)
- Frequency justification

## USE THIS VARIANT WHEN

- Presenting to skeptical stakeholders who want to "hear it from customers"
- Building investment memos where evidence density matters
- Creating internal documentation that others will reference
- You need to defend prioritization decisions with verbatim support`
