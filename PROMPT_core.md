# Interview Meta-Analysis Prompt

You are analyzing customer interview transcripts to answer: **What should we build next, and why?**

## TASK

Produce a cross-transcript meta-analysis using a quantitative + qualitative hybrid approach. Analyze all transcripts collectively before producing output.

## METHODOLOGY

### Phase 1: Ingest
- Read all transcripts fully before beginning analysis
- Note the total number of distinct interviewees (N)

### Phase 2: Extract
- Identify explicit **problem statements** (pain points, frustrations, blockers, inefficiencies)
- Identify explicit **solution desires** (features wanted, tools wished for, capabilities requested)
- Only extract what interviewees actually said—do not infer unstated needs

### Phase 3: Normalize
- Group semantically equivalent statements across transcripts
- "It's too slow" and "performance is terrible" = same theme
- "I wish I could export to CSV" and "need to get data out" = same theme
- Keep themes concrete and product-oriented, not abstract

### Phase 4: Count & Rank
- For each theme, count how many **distinct transcripts** mention it (not total mentions)
- Rank themes strictly by frequency (highest first)
- Ties are acceptable

### Phase 5: Attribute
- For each theme, list which transcripts/interviewees referenced it
- Select 1-2 representative quotes per theme

## OUTPUT FORMAT

### 1. Summary
- Number of transcripts analyzed
- Brief note on interviewee profile (if discernible)

### 2. Top Problems (Ranked by Frequency)

For each problem:
```
**[Rank]. [Problem Theme]** — [X/N transcripts]

[One-sentence description of the problem]

Sources: [Interviewee identifiers]
Representative quote: "[Direct quote]" — [Source]
```

Include all problems mentioned by 2+ transcripts. List problems mentioned by only 1 transcript separately under "Long Tail."

### 3. Top Desired Solutions (Ranked by Frequency)

Same format as problems.

### 4. Quote Appendix

Organized by theme, include 2-3 verbatim quotes per theme with source attribution.

### 5. What to Build (Synthesis)

Based strictly on the frequency data:
- Top 3 recommendations with rationale
- Each recommendation should map to specific problems AND desired solutions
- Note any gaps (high-frequency problems with no corresponding solution desire, or vice versa)

## ANTI-PATTERNS TO AVOID

- **Per-interview summaries**: Do not summarize each interview separately
- **Vague themes**: "Users want better UX" is too abstract; "Users can't find the export button" is concrete
- **Invented needs**: Only include what was explicitly stated
- **Opinion-based ranking**: Rank by frequency, not by your assessment of importance
- **Single-source themes in top list**: A theme mentioned by 1 person is anecdote, not pattern
