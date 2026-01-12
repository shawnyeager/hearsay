// Transcript types
export interface Transcript {
  id: string
  name: string
  content: string
  createdAt: Date
  updatedAt: Date
}

// LLM Provider types
export type ProviderId = 'maple' | 'openai' | 'openrouter'

export interface ProviderConfig {
  id: ProviderId
  name: string
  baseUrl: string
  apiKey: string
  models: ModelInfo[]
}

export interface ModelInfo {
  id: string
  name: string
}

// Analysis types
export type AnalysisVariant = 'core' | 'with-quotes'

export interface Analysis {
  id: string
  transcriptIds: string[]
  variant: AnalysisVariant
  providerId: ProviderId
  model: string
  content: string
  score: RubricScore | null
  createdAt: Date
}

export interface RubricScore {
  themeConcreteness: number
  normalizationQuality: number
  quantitativeRigor: number
  rankingValidity: number
  attributionAccuracy: number
  evidenceGrounding: number
  synthesisQuality: number
  total: number
}

// Settings types
export interface Settings {
  providers: Record<ProviderId, ProviderSettings>
  selectedProvider: ProviderId
  selectedModel: string
}

export interface ProviderSettings {
  apiKey: string
  baseUrl: string
}

// Provider defaults
export const PROVIDER_DEFAULTS: Record<ProviderId, { name: string; baseUrl: string; models: ModelInfo[] }> = {
  maple: {
    name: 'Maple AI',
    baseUrl: 'http://localhost:8080/v1',
    models: [
      { id: 'llama3-3-70b', name: 'Llama 3.3 70B' },
      { id: 'deepseek-r1-0528', name: 'DeepSeek R1' },
      { id: 'qwen2-5-72b', name: 'Qwen 2.5 72B' },
      { id: 'mistral-small-3-1-24b', name: 'Mistral Small 3.1 24B' },
    ],
  },
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4.1', name: 'GPT-4.1' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    ],
  },
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4' },
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
      { id: 'openai/gpt-4o', name: 'GPT-4o' },
      { id: 'openai/gpt-4.1', name: 'GPT-4.1' },
      { id: 'google/gemini-2.5-pro-preview', name: 'Gemini 2.5 Pro' },
      { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1' },
    ],
  },
}
