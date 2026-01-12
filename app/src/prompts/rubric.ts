export const RUBRIC = `# Meta-Analysis Quality Rubric

Score each dimension from 1-5.

## 1. Theme Concreteness
*Are themes specific enough to act on?*
- 5: All themes are product/feature-specific and directly buildable
- 4: Most themes are concrete; 1-2 slightly abstract but still actionable
- 3: Mix of concrete and abstract themes
- 2: Most themes are abstract or vague
- 1: Themes are platitudes or truisms with no actionable specificity

## 2. Normalization Quality
*Are semantically equivalent statements properly grouped?*
- 5: Clear evidence of normalization; similar phrasings consolidated; no obvious duplicates
- 4: Good normalization with minor inconsistencies
- 3: Some normalization but visible duplicates or over-splitting
- 2: Minimal normalization; many themes that should be combined
- 1: No normalization; themes are just raw extracted statements

## 3. Quantitative Rigor
*Is frequency counting accurate and transparent?*
- 5: Clear X/N format; counts distinct transcripts (not mentions); N is consistent
- 4: Counts present and mostly accurate; minor ambiguities
- 3: Counts present but methodology unclear
- 2: Vague quantification ("many users said...")
- 1: No quantification; purely qualitative

## 4. Ranking Validity
*Does ranking reflect frequency, not opinion?*
- 5: Ranking strictly follows frequency; ties handled appropriately
- 4: Ranking mostly follows frequency; minor deviations justified
- 3: Ranking loosely correlated with frequency
- 2: Ranking appears opinion-based with frequency as secondary
- 1: No clear ranking logic; appears arbitrary

## 5. Attribution Accuracy
*Can claims be traced to sources?*
- 5: Every theme lists specific sources; easy to verify any claim
- 4: Most themes attributed; occasional gaps
- 3: Top themes attributed; others lack sources
- 2: Minimal attribution; "some users" language
- 1: No attribution; impossible to verify

## 6. Evidence Grounding
*Are quotes accurate and representative?*
- 5: Verbatim quotes; clearly representative; properly contextualized
- 4: Good quotes; minor concerns about representativeness
- 3: Quotes present but may be cherry-picked or out of context
- 2: Few quotes; or quotes don't clearly support themes
- 1: No quotes; or quotes appear fabricated/paraphrased

## 7. Synthesis Quality
*Do recommendations follow from the data?*
- 5: Recommendations directly map to top-frequency themes; gaps noted
- 4: Strong data-recommendation link; minor leaps
- 3: Recommendations plausible but connection to frequency data is loose
- 2: Recommendations seem opinion-based with data as post-hoc justification
- 1: Recommendations unrelated to the analysis

## Scoring Guide
- 32-35: Excellent — ready for decision-making
- 25-31: Good — minor revisions needed
- 18-24: Acceptable — significant gaps to address
- 11-17: Poor — major methodology issues
- 7-10: Unusable — redo analysis`

export const SCORING_PROMPT = `You are evaluating an interview meta-analysis against a quality rubric.

${RUBRIC}

## Your Task

Analyze the provided meta-analysis and score each dimension from 1-5. Return your evaluation as JSON:

\`\`\`json
{
  "themeConcreteness": <1-5>,
  "normalizationQuality": <1-5>,
  "quantitativeRigor": <1-5>,
  "rankingValidity": <1-5>,
  "attributionAccuracy": <1-5>,
  "evidenceGrounding": <1-5>,
  "synthesisQuality": <1-5>,
  "total": <sum>,
  "commentary": "<brief explanation of scores>"
}
\`\`\`

Be rigorous and objective. Only output the JSON block, no other text.`
