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

  // Create a timeout controller that wraps the provided signal
  const timeoutController = new AbortController()
  const CHUNK_TIMEOUT_MS = 60000 // 60 seconds between chunks
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const resetTimeout = () => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      timeoutController.abort(new Error('Stream timeout - no data received for 60 seconds'))
    }, CHUNK_TIMEOUT_MS)
  }

  // Combine user signal with timeout signal
  const combinedSignal = signal
    ? AbortSignal.any([signal, timeoutController.signal])
    : timeoutController.signal

  const response = await fetch(`${effectiveBaseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
    signal: combinedSignal,
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
  let lineBuffer = '' // Buffer for incomplete lines across chunks

  try {
    resetTimeout() // Start the timeout clock

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      resetTimeout() // Reset timeout on each chunk received

      const chunk = decoder.decode(value, { stream: true })
      lineBuffer += chunk
      const lines = lineBuffer.split('\n')

      // Keep the last potentially incomplete line in the buffer
      lineBuffer = lines.pop() || ''

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine.startsWith('data: ')) {
          const data = trimmedLine.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const token = parsed.choices?.[0]?.delta?.content
            if (token) {
              fullText += token
              callbacks.onToken(token)
            }
          } catch {
            // Ignore parse errors for malformed JSON
          }
        }
      }
    }

    // Process any remaining data in the buffer
    if (lineBuffer.trim().startsWith('data: ')) {
      const data = lineBuffer.trim().slice(6)
      if (data !== '[DONE]') {
        try {
          const parsed = JSON.parse(data)
          const token = parsed.choices?.[0]?.delta?.content
          if (token) {
            fullText += token
            callbacks.onToken(token)
          }
        } catch {
          // Ignore
        }
      }
    }

    if (timeoutId) clearTimeout(timeoutId)
    callbacks.onComplete(fullText)
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId)

    if (error instanceof Error && error.name === 'AbortError') {
      // User cancelled - complete with what we have
      callbacks.onComplete(fullText)
    } else {
      // Provide more context about streaming failures
      const baseMessage = error instanceof Error ? error.message : 'Unknown error'
      const isTimeout = baseMessage.includes('timeout')
      const contextMessage = fullText.length > 0
        ? isTimeout
          ? `Stream stalled after ${Math.round(fullText.length / 1000)}k chars. The LLM may be overloaded - try again.`
          : `Connection lost after ${Math.round(fullText.length / 1000)}k chars. ${baseMessage}`
        : `Failed to connect: ${baseMessage}`
      callbacks.onError(new Error(contextMessage))
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
