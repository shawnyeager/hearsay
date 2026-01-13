export const PROMPT_DEEP_DIVE = `# Interview Meta-Analysis Prompt (Deep Dive)

You are analyzing customer interview transcripts to answer: **What should we build next, and why?**

This variant produces an exhaustive analysis including minority opinions, edge cases, and strategic gaps. Use when thoroughness matters more than brevity.

## TASK

Produce a comprehensive cross-transcript meta-analysis. Include themes mentioned by even a single transcript. Surface contradictions, outliers, and gaps.

## METHODOLOGY

1. **Ingest** all transcripts fully before analysis
2. **Extract** all problem statements and solution desires (explicit and strongly implied)
3. **Normalize** semantically equivalent statements—but preserve nuance where meaningful
4. **Count** distinct transcripts per theme
5. **Rank** by frequency, but don't filter out low-frequency themes
6. **Attribute** every theme to its sources with quotes

## OUTPUT FORMAT

### 1. Summary
- Transcript count and detailed interviewee profile
- Any notable segments (power users vs new users, different use cases, etc.)

### 2. All Problems (Ranked by Frequency)

For each problem:
\`\`\`
**[Rank]. [Problem Theme]** — [X/N transcripts]

[Detailed description of the problem]

Sources: [All interviewee identifiers]
Key quotes:
- "[Quote 1]" — [Source]
- "[Quote 2]" — [Source]
\`\`\`

Include ALL problems, even those mentioned by only 1 transcript. Mark single-mention items with "(1 mention)" to distinguish from patterns.

### 3. All Desired Solutions (Ranked)

Same exhaustive format as problems.

### 4. Minority Opinions & Outliers

Perspectives that appeared only once but contain strategic insight:
- Unique use cases not represented by majority
- Contrarian views that challenge assumptions
- Edge cases that could become mainstream

For each, explain why it might matter despite low frequency.

### 5. Gap Analysis

| High-Frequency Problems | Matching Solution Desires | Gap? |
|------------------------|--------------------------|------|
| [Problem] | [Solution or "None expressed"] | Yes/No |

Highlight:
- Problems with no corresponding solution desire (users feel pain but don't know what they want)
- Solution desires with no corresponding problem (users want features for unclear reasons)

### 6. Contradictions & Tensions

Where did interviewees disagree or express conflicting needs?
- "[View A]" — [Sources]
- "[View B]" — [Sources]
- Implication for product decisions

### 7. Comprehensive Quote Bank

All relevant quotes organized by theme:
\`\`\`
## [Theme Name]

"[Full quote with context]" — [Source], discussing [brief context]
"[Full quote with context]" — [Source], discussing [brief context]
\`\`\`

### 8. Strategic Recommendations

Based on the complete analysis:

**Primary Recommendation**
- What to build and why
- Addresses: [List problems with frequencies]
- Fulfills: [List solution desires with frequencies]
- Risk: [Any contradictions or minority concerns to monitor]

**Secondary Recommendations** (2-3 more)
- Same format

**What NOT to Build (Yet)**
- Features that seem obvious but lack frequency support
- Ideas with significant contradictions to resolve first

## USE THIS VARIANT WHEN

- Making major product bets or pivots
- Preparing for board discussions or strategic planning
- Building a comprehensive voice-of-customer repository
- You need to defend decisions against scrutiny
- Exploring a new market or segment`
