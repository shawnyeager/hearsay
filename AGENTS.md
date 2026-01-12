# AGENTS.md

Guidance for LLM-based coding agents working in this repository.

## What This Repo Is

LLM prompts and methodology for turning customer interview transcripts into product roadmap recommendations. Point an agent at a folder of transcripts and get: **What should we build next, and why?**

This is a **prompt-only repository**—no source code, no builds, no tests. The deliverables are markdown files containing methodology, templates, and rubrics that guide LLM analysis.

---

## Build / Lint / Test Commands

**None.** This repository contains only markdown files. There is no code to compile, lint, or test.

Quality assurance is manual:
- Proofread markdown for clarity and consistency
- Validate that methodology files are internally consistent
- Test prompts by running them against sample transcripts

---

## Primary Workflow

When a user says:
```
Analyze the interviews in ./transcripts/
```

The agent should:
1. Read **all** transcripts fully before beginning analysis
2. Apply the methodology in `PROMPT_core.md` (or `PROMPT_with_quotes.md` if specified)
3. Produce output matching `TEMPLATE_output.md`
4. Self-score using `RUBRIC_scoring.md`
5. Save output to `./output/` (gitignored; may contain PII)

---

## Key Files

| File | Purpose |
|------|---------|
| `PROMPT_core.md` | Core methodology: ingest → extract → normalize → count → rank → synthesize |
| `PROMPT_with_quotes.md` | Quote-heavy variant for stakeholder presentations |
| `TEMPLATE_output.md` | Expected output structure with format specs |
| `RUBRIC_scoring.md` | 7-dimension quality rubric with scoring criteria |
| `EXAMPLE_usage.md` | User guide for transcript prep and invocation |
| `INTERVIEW_script.md` | 20-minute interview script optimized for meta-analysis |

---

## Methodology Principles

These are non-negotiable when analyzing transcripts:

| Principle | Right | Wrong |
|-----------|-------|-------|
| **Cross-transcript analysis** | Synthesize across all interviews | Per-interview summaries |
| **Concrete themes** | "can't export to CSV" | "bad UX" |
| **Frequency-ranked** | Count distinct transcripts | Count total mentions |
| **Explicitly attributed** | "Sources: Alice, Bob, Carol" | "some users said..." |
| **Quote-grounded** | Verbatim quotes with source | Paraphrase or interpretation |
| **Data-driven synthesis** | Recommendations follow frequency | Opinion-based prioritization |

---

## Output Quality Bar

A good analysis passes these tests:

1. **Actionable** — Could someone write a feature spec from the top problem?
2. **Defensible** — Can you justify every ranking with "X of N transcripts said..."?
3. **Verifiable** — Can a skeptic check your claims against the source transcripts?
4. **Concrete** — Are themes specific enough to build, not abstract platitudes?
5. **Grounded** — Is every claim backed by verbatim quotes?

Target score: **32+/35** on the rubric.

---

## Content Style Guidelines

### Markdown Formatting

- Use ATX-style headers (`#`, `##`, `###`)
- One blank line before and after headers
- Use `**bold**` for key terms, `>` for quotes, `` ` `` for inline code/filenames
- Tables should have aligned pipes for readability
- Horizontal rules (`---`) separate major sections

### Naming Conventions

- File names: `SCREAMING_SNAKE_CASE.md` for methodology files
- Transcript files: `role_name_company.md` (e.g., `founder_alice_acme.md`)
- Output files: `descriptive-name-date.md` (e.g., `acme-analysis-jan2024.md`)

### Writing Style

- Direct, imperative tone for instructions ("Read all transcripts", not "You should read")
- Concrete over abstract ("export button is hidden" not "discoverability issues")
- Active voice preferred
- No hedging language in methodology ("must", not "should consider")
- Bullet points for lists; numbered lists only for sequential steps

### Quoting Transcripts

- Use exact verbatim quotes—never paraphrase
- Include speaker attribution: `"[Quote]" — Alice (Acme)`
- Preserve filler words if they convey meaning; trim if they obscure
- Use `[...]` for omissions within quotes
- Quotes must be verifiable against source transcripts

---

## Anti-Patterns to Avoid

When analyzing transcripts:

- **Per-interview summaries** — Never summarize each interview separately
- **Vague themes** — "Users want better UX" is useless; be specific
- **Invented needs** — Only include what was explicitly stated
- **Opinion-based ranking** — Rank by frequency, not importance judgment
- **Single-source in top list** — One person's opinion is anecdote, not pattern
- **Mention-counting** — Count transcripts, not how many times someone said it
- **Cherry-picked quotes** — Quotes must be representative, not outliers

When editing methodology files:

- Don't add complexity without clear benefit
- Don't remove attribution requirements
- Don't weaken quantitative rigor (X/N format is mandatory)
- Don't merge methodology principles that serve different purposes

---

## Analysis Phases (Reference)

From `PROMPT_core.md`:

1. **Ingest** — Read all transcripts; note total N
2. **Extract** — Identify explicit problems and solution desires
3. **Normalize** — Group semantically equivalent statements
4. **Count & Rank** — Count distinct transcripts per theme; rank by frequency
5. **Attribute** — List sources and select representative quotes
6. **Synthesize** — Map recommendations to frequency data

---

## Working with Transcripts

### Transcript Location
- Input: User-specified folder (typically `./transcripts/`)
- Output: `./output/` (gitignored—may contain PII)

### Privacy
- Transcripts may contain PII; never commit them
- Output files may inherit PII from quotes; gitignored by default
- Anonymize if sharing analysis externally

### Minimum Data
- 5 transcripts minimum for pattern detection
- 10-15 transcripts ideal
- Homogeneous cohorts (same persona) work best

---

## Rubric Dimensions

When self-scoring (from `RUBRIC_scoring.md`):

| Dimension | What It Measures |
|-----------|------------------|
| Theme Concreteness | Specific enough to build? |
| Normalization Quality | Similar statements grouped? |
| Quantitative Rigor | X/N format, distinct transcripts? |
| Ranking Validity | Follows frequency, not opinion? |
| Attribution Accuracy | Claims traceable to sources? |
| Evidence Grounding | Verbatim, representative quotes? |
| Synthesis Quality | Recommendations follow data? |

Score 1-5 per dimension. Target: 32+/35.

---

## Repository Maintenance

When modifying methodology files:

- Keep `PROMPT_core.md` and `PROMPT_with_quotes.md` in sync on shared methodology
- Update `TEMPLATE_output.md` if output format changes
- Update `RUBRIC_scoring.md` if quality criteria change
- Cross-reference changes in `EXAMPLE_usage.md`
- This file (`AGENTS.md`) should reflect any structural changes

---

## Quick Reference: Invocation Patterns

```bash
# Standard analysis
Analyze the interviews in ./transcripts/ using the methodology in PROMPT_core.md

# Quote-heavy variant
Analyze the interviews in ./transcripts/ using PROMPT_with_quotes.md

# With explicit output
Analyze ./transcripts/ and write the report to ./output/analysis.md

# With self-scoring
Analyze ./transcripts/, score the output using RUBRIC_scoring.md, and iterate until score >= 32
```
