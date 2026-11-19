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
  onPartialComplete?: (partialText: string, error: Error) => void
}

const ANTHROPIC_VERSION = '2026-10-21'
// Adaptive thinking shares this budget with the written report.
const ANTHROPIC_MAX_TOKENS = 64000

function openAiHeaders(providerId: ProviderId, apiKey: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  }

  if (providerId === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin
    headers['X-Title'] = 'Hearsay'
  }

  return headers
}

function anthropicRequest(apiKey: string, model: string, messages: ChatMessage[], stream: boolean) {
  const system = messages
    .filter((message) => message.role === 'system')
    .map((message) => message.content)
    .join('\n\n')

  const conversation = messages
    .filter((message) => message.role !== 'system')
    .map((message) => ({ role: message.role, content: message.content }))

  return {
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'anthropic-dangerous-direct-browser-access': 'true',
    } satisfies Record<string, string>,
    body: {
      model,
      max_tokens: ANTHROPIC_MAX_TOKENS,
      stream,
      ...(system ? { system } : {}),
      messages: conversation.length > 0 ? conversation : [{ role: 'user' as const, content: ' ' }],
    },
  }
}

function readErrorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object' && 'error' in payload) {
    const message = (payload as { error?: { message?: string } }).error?.message
    if (message) return message
  }
  return `HTTP ${status}`
}

function readClaudeText(payload: unknown): string {
  if (!payload || typeof payload !== 'object' || !('content' in payload)) return ''
  const content = (payload as { content?: Array<{ type?: string; text?: string }> }).content
  if (!Array.isArray(content)) return ''
  return content
    .filter((block) => block.type === 'text' && block.text)
    .map((block) => block.text as string)
    .join('')
}

function readStreamDelta(providerId: ProviderId, parsed: unknown): { token?: string; error?: string } {
  if (!parsed || typeof parsed !== 'object') return {}

  const data = parsed as {
    type?: string
    error?: { message?: string }
    delta?: { type?: string; text?: string }
    choices?: Array<{ delta?: { content?: string } }>
  }

  if (providerId === 'claude') {
    if (data.type === 'error') {
      return { error: data.error?.message || 'Claude request failed' }
    }
    if (data.type === 'content_block_delta' && data.delta?.type === 'text_delta' && data.delta.text) {
      return { token: data.delta.text }
    }
    return {}
  }

  const token = data.choices?.[0]?.delta?.content
  return token ? { token } : {}
}

export async function streamChat(
  config: LLMConfig,
  messages: ChatMessage[],
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const { providerId, apiKey, baseUrl, model } = config

  const effectiveBaseUrl = baseUrl || PROVIDER_DEFAULTS[providerId].baseUrl

  const claude = providerId === 'claude' ? anthropicRequest(apiKey, model, messages, true) : null
  const headers = claude ? claude.headers : openAiHeaders(providerId, apiKey)

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

  const response = await fetch(claude ? `${effectiveBaseUrl}/messages` : `${effectiveBaseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(
      claude ?? {
        model,
        messages,
        stream: true,
      }
    ),
    signal: combinedSignal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(readErrorMessage(error, response.status))
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
            const delta = readStreamDelta(providerId, JSON.parse(data))
            if (delta.error) throw new Error(delta.error)
            if (delta.token) {
              fullText += delta.token
              callbacks.onToken(delta.token)
            }
          } catch (error) {
            if (error instanceof SyntaxError) continue
            throw error
          }
        }
      }
    }

    // Process any remaining data in the buffer
    if (lineBuffer.trim().startsWith('data: ')) {
      const data = lineBuffer.trim().slice(6)
      if (data !== '[DONE]') {
        try {
          const delta = readStreamDelta(providerId, JSON.parse(data))
          if (delta.error) throw new Error(delta.error)
          if (delta.token) {
            fullText += delta.token
            callbacks.onToken(delta.token)
          }
        } catch (error) {
          if (!(error instanceof SyntaxError)) throw error
        }
      }
    }

    if (timeoutId) clearTimeout(timeoutId)
    callbacks.onComplete(fullText)
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId)

    // Log the actual error for debugging
    console.error('[Hearsay] Stream error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      charsReceived: fullText.length,
      error
    })

    if (error instanceof Error && error.name === 'AbortError') {
      // User cancelled - complete with what we have
      callbacks.onComplete(fullText)
    } else {
      // Build error message with better details
      let baseMessage = 'Unknown error'
      if (error instanceof TypeError) {
        baseMessage = 'Network connection failed'
      } else if (error instanceof Error) {
        baseMessage = error.message
      }
      const isTimeout = baseMessage.includes('timeout')

      if (fullText.length > 0 && callbacks.onPartialComplete) {
        // We have partial content - preserve it and signal the interruption
        const contextMessage = isTimeout
          ? `Generation stalled - the LLM may be overloaded`
          : `Connection interrupted`
        callbacks.onPartialComplete(fullText, new Error(contextMessage))
      } else if (fullText.length > 0) {
        // Fallback: call onError but content is already in UI via onToken
        const contextMessage = isTimeout
          ? `Stream stalled after ${Math.round(fullText.length / 1000)}k chars`
          : `Connection lost after ${Math.round(fullText.length / 1000)}k chars`
        callbacks.onError(new Error(contextMessage))
      } else {
        callbacks.onError(new Error(`Failed to connect: ${baseMessage}`))
      }
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

  const claude = providerId === 'claude' ? anthropicRequest(apiKey, model, messages, false) : null

  const response = await fetch(claude ? `${effectiveBaseUrl}/messages` : `${effectiveBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: claude ? claude.headers : openAiHeaders(providerId, apiKey),
    body: JSON.stringify(
      claude ?? {
        model,
        messages,
        stream: false,
      }
    ),
    signal,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(readErrorMessage(error, response.status))
  }

  const data = await response.json()
  if (providerId === 'claude') return readClaudeText(data)
  return data.choices?.[0]?.message?.content || ''
}
