import type { Transcript, AnalysisVariant, RubricScore } from '@/types'
import type { LLMConfig, ChatMessage, StreamCallbacks } from './llm'
import { streamChat, chat } from './llm'
import { getPresetPrompt } from '@/prompts/presets'
import { SCORING_PROMPT } from '@/prompts/rubric'

export function buildAnalysisPrompt(
  transcripts: Transcript[],
  variant: AnalysisVariant
): ChatMessage[] {
  const systemPrompt = getPresetPrompt(variant)

  // Build transcript content
  const transcriptContent = transcripts
    .map(
      (t, i) => `## Transcript ${i + 1}: ${t.name}

${t.content}

---`
    )
    .join('\n\n')

  const userMessage = `Here are ${transcripts.length} interview transcripts to analyze:

${transcriptContent}

Please analyze these transcripts following the methodology above and produce the meta-analysis report.`

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ]
}

export async function runAnalysis(
  config: LLMConfig,
  transcripts: Transcript[],
  variant: AnalysisVariant,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const messages = buildAnalysisPrompt(transcripts, variant)
  await streamChat(config, messages, callbacks, signal)
}

export async function scoreAnalysis(
  config: LLMConfig,
  analysisContent: string,
  signal?: AbortSignal
): Promise<RubricScore & { commentary: string }> {
  const messages: ChatMessage[] = [
    { role: 'system', content: SCORING_PROMPT },
    {
      role: 'user',
      content: `Here is the meta-analysis to evaluate:

${analysisContent}`,
    },
  ]

  const response = await chat(config, messages, signal)

  // Extract JSON from response
  const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                    response.match(/\{[\s\S]*\}/)
  
  if (!jsonMatch) {
    throw new Error('Failed to parse scoring response')
  }

  const jsonStr = jsonMatch[1] || jsonMatch[0]
  const parsed = JSON.parse(jsonStr)

  return {
    themeConcreteness: parsed.themeConcreteness,
    normalizationQuality: parsed.normalizationQuality,
    quantitativeRigor: parsed.quantitativeRigor,
    rankingValidity: parsed.rankingValidity,
    attributionAccuracy: parsed.attributionAccuracy,
    evidenceGrounding: parsed.evidenceGrounding,
    synthesisQuality: parsed.synthesisQuality,
    total: parsed.total,
    commentary: parsed.commentary || '',
  }
}

export function getRatingFromScore(total: number): string {
  if (total >= 32) return 'Excellent'
  if (total >= 25) return 'Good'
  if (total >= 18) return 'Acceptable'
  if (total >= 11) return 'Poor'
  return 'Unusable'
}

export function getRatingColor(total: number): string {
  if (total >= 32) return 'text-green-600'
  if (total >= 25) return 'text-blue-600'
  if (total >= 18) return 'text-yellow-600'
  if (total >= 11) return 'text-orange-600'
  return 'text-red-600'
}
