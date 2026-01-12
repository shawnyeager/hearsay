import type { ProviderId } from '@/types'
import { PROVIDER_DEFAULTS } from '@/types'

export interface LLMConfig {
  providerId: ProviderId
  apiKey: string
  baseUrl: string
  model: string
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface StreamCallbacks {
  onToken: (token: string) => void
  onComplete: (fullText: string) => void
  onError: (error: Error) => void
}

export async function streamChat(
  config: LLMConfig,
  messages: ChatMessage[],
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const { providerId, apiKey, baseUrl, model } = config

  const effectiveBaseUrl = baseUrl || PROVIDER_DEFAULTS[providerId].baseUrl

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  }

  // OpenRouter requires referer header
  if (providerId === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin
    headers['X-Title'] = 'Hearsay'
  }

  const response = await fetch(`${effectiveBaseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
    signal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `HTTP ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No response body')
  }

  const decoder = new TextDecoder()
  let fullText = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const token = parsed.choices?.[0]?.delta?.content
            if (token) {
              fullText += token
              callbacks.onToken(token)
            }
          } catch {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }

    callbacks.onComplete(fullText)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      callbacks.onComplete(fullText)
    } else {
      callbacks.onError(error instanceof Error ? error : new Error('Stream error'))
    }
  }
}

// Non-streaming version for simpler use cases
export async function chat(
  config: LLMConfig,
  messages: ChatMessage[],
  signal?: AbortSignal
): Promise<string> {
  const { providerId, apiKey, baseUrl, model } = config

  const effectiveBaseUrl = baseUrl || PROVIDER_DEFAULTS[providerId].baseUrl

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  }

  if (providerId === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin
    headers['X-Title'] = 'Hearsay'
  }

  const response = await fetch(`${effectiveBaseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages,
      stream: false,
    }),
    signal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `HTTP ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}
