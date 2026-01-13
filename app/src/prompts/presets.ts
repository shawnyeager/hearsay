import { PROMPT_CORE } from './core'
import { PROMPT_WITH_QUOTES } from './withQuotes'
import { PROMPT_QUICK_SCAN } from './quickScan'
import { PROMPT_DEEP_DIVE } from './deepDive'

export interface PromptPreset {
  id: string
  name: string
  description: string
  benefit?: string  // Short benefit statement for discovery panel
  systemPrompt: string
}

export const PRESETS: PromptPreset[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'What patterns emerged across interviews',
    benefit: 'Balanced analysis with key themes ranked by frequency',
    systemPrompt: PROMPT_CORE,
  },
  {
    id: 'quote-heavy',
    name: 'Quote-Heavy',
    description: 'Lots of direct quotes to share with your team',
    benefit: 'More direct quotes to share with stakeholders',
    systemPrompt: PROMPT_WITH_QUOTES,
  },
  {
    id: 'quick-scan',
    name: 'Quick Scan',
    description: 'Just the highlights, 2-minute read',
    benefit: 'Get the highlights in 2 minutes',
    systemPrompt: PROMPT_QUICK_SCAN,
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive',
    description: 'Everything, including outliers and contradictions',
    benefit: 'Catch outliers, contradictions, and minority opinions',
    systemPrompt: PROMPT_DEEP_DIVE,
  },
]

export function getPreset(id: string): PromptPreset | undefined {
  return PRESETS.find((p) => p.id === id)
}

export function getPresetPrompt(id: string): string {
  const preset = getPreset(id)
  return preset?.systemPrompt ?? PROMPT_CORE
}
