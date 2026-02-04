import { useState } from 'react'
import { Eye, EyeOff, ExternalLink, CheckCircle2, XCircle, Loader2, Shield, Zap } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { PROVIDER_DEFAULTS, type ProviderId } from '@/types'

export function SettingsPanel() {
  const {
    settings,
    updateProviderSettings,
    setSelectedProvider,
    setSelectedModel,
    getCurrentProviderConfig,
  } = useSettings()
  const [showApiKey, setShowApiKey] = useState(false)

  const currentConfig = getCurrentProviderConfig()
  const providerIds = Object.keys(PROVIDER_DEFAULTS) as ProviderId[]

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="space-y-10">
        {/* Provider Selection */}
        <section className="space-y-5">
          <div>
            <h3 className="text-sm font-medium text-surface-800 mb-1">
              LLM Provider
            </h3>
            <p className="text-xs text-surface-500">
              Choose which AI service to use for analysis
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {providerIds.map((id) => (
              <ProviderCard
                key={id}
                id={id}
                name={PROVIDER_DEFAULTS[id].name}
                isSelected={settings.selectedProvider === id}
                onSelect={() => setSelectedProvider(id)}
              />
            ))}
          </div>

          <ProviderInfo providerId={settings.selectedProvider} />
        </section>

        {/* API Key */}
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-surface-800 mb-1">
              API Key
            </h3>
            <p className="text-xs text-surface-500">
              Your key is stored locally and never sent to our servers
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showApiKey ? 'text' : 'password'}
                value={settings.providers[settings.selectedProvider].apiKey}
                onChange={(e) =>
                  updateProviderSettings(settings.selectedProvider, {
                    apiKey: e.target.value,
                  })
                }
                placeholder={
                  settings.selectedProvider === 'maple'
                    ? 'Maple API key'
                    : settings.selectedProvider === 'openrouter'
                    ? 'sk-or-v1-...'
                    : 'sk-...'
                }
                className="pr-10 font-mono text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowApiKey(!showApiKey)}
              className="flex-shrink-0"
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-surface-500 p-3 rounded-lg bg-surface-100 border border-surface-200">
            <Shield className="h-4 w-4 flex-shrink-0 mt-0.5 text-surface-500" />
            <span>
              Your API key is stored in your browser's local storage. It's only used to
              authenticate directly with {PROVIDER_DEFAULTS[settings.selectedProvider].name}.
            </span>
          </div>
        </section>

        {/* Custom Base URL (Maple only) */}
        {settings.selectedProvider === 'maple' && (
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-surface-800 mb-1">
                Proxy URL
              </h3>
              <p className="text-xs text-surface-500">
                The local endpoint where Maple proxy is running
              </p>
            </div>

            <Input
              value={settings.providers.maple.baseUrl}
              onChange={(e) =>
                updateProviderSettings('maple', { baseUrl: e.target.value })
              }
              placeholder={PROVIDER_DEFAULTS.maple.baseUrl}
              className="font-mono text-sm"
            />
            <p className="text-xs text-surface-600">
              Default: {PROVIDER_DEFAULTS.maple.baseUrl}
            </p>
          </section>
        )}

        {/* Model Selection */}
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-surface-800 mb-1">
              Model
            </h3>
            <p className="text-xs text-surface-500">
              Select which model to use for analysis
            </p>
          </div>

          <Select value={settings.selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentConfig.models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <span>{model.name}</span>
                    {model.tier && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        model.tier === 'fast' 
                          ? 'bg-green-50 text-green-700' 
                          : model.tier === 'balanced'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}>
                        {model.tier === 'fast' ? '⚡ Fast' : model.tier === 'balanced' ? '⚖️ Balanced' : '🧠 Powerful'}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-start gap-3 text-xs text-surface-500 p-3 rounded-lg bg-surface-50 border border-surface-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-medium">⚡ Fast</span>
                <span>Quick results, lower cost</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">⚖️ Balanced</span>
                <span>Good quality/speed tradeoff</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium">🧠 Powerful</span>
                <span>Best quality, slower</span>
              </div>
            </div>
          </div>
        </section>

        {/* Connection Test */}
        <section className="pt-6 border-t border-surface-200">
          <ConnectionTest />
        </section>
      </div>
    </div>
  )
}

function ProviderCard({
  id,
  name,
  isSelected,
  onSelect,
}: {
  id: ProviderId
  name: string
  isSelected: boolean
  onSelect: () => void
}) {
  const icons: Record<ProviderId, React.ReactNode> = {
    maple: <Shield className="h-4 w-4" />,
    openai: <span className="text-sm font-bold">AI</span>,
    openrouter: <Zap className="h-4 w-4" />,
  }

  return (
    <button
      onClick={onSelect}
      className={`
        relative p-4 rounded-xl border-2 text-left transition-all duration-200
        ${isSelected
          ? 'border-accent-400 bg-accent-50'
          : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
        }
      `}
    >
      {isSelected && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="h-5 w-5 text-accent-500" />
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <div className={`text-surface-500 ${isSelected ? 'text-accent-600' : ''}`}>
          {icons[id]}
        </div>
        <span className="font-medium text-sm text-surface-800">
          {name}
        </span>
      </div>
      <div className="text-xs text-surface-500">
        {id === 'openrouter' && 'Multi-model'}
        {id === 'openai' && 'Direct API'}
        {id === 'maple' && 'Privacy-first'}
      </div>
    </button>
  )
}

function ProviderInfo({ providerId }: { providerId: ProviderId }) {
  const info = {
    maple: {
      description: 'Privacy-focused AI with end-to-end encryption. Requires the Maple desktop app.',
      link: 'https://trymaple.ai/downloads',
      linkText: 'Download Maple app',
    },
    openai: {
      description: 'Direct access to OpenAI models including GPT-4o and GPT-4 Turbo.',
      link: 'https://platform.openai.com/api-keys',
      linkText: 'Get OpenAI API key',
    },
    openrouter: {
      description: 'Access Claude, GPT-4, Gemini, and more with a single API key.',
      link: 'https://openrouter.ai/keys',
      linkText: 'Get OpenRouter API key',
    },
  }

  const { description, link, linkText } = info[providerId]

  return (
    <div className="p-4 rounded-xl bg-surface-50 border border-surface-200 space-y-3">
      <p className="text-sm text-surface-600 leading-relaxed">{description}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent-500 hover:underline underline-offset-4 transition-colors cursor-pointer"
      >
        {linkText}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}

function ConnectionTest() {
  const { settings } = useSettings()
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const testConnection = async () => {
    const apiKey = settings.providers[settings.selectedProvider].apiKey
    if (!apiKey) {
      setStatus('error')
      setErrorMessage('API key is required')
      return
    }

    setStatus('testing')
    setErrorMessage('')

    try {
      const baseUrl =
        settings.providers[settings.selectedProvider].baseUrl ||
        PROVIDER_DEFAULTS[settings.selectedProvider].baseUrl

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      }

      if (settings.selectedProvider === 'openrouter') {
        headers['HTTP-Referer'] = window.location.origin
      }

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: settings.selectedModel,
          messages: [{ role: 'user', content: 'Say "connected" and nothing else.' }],
          max_tokens: 10,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error?.message || `HTTP ${response.status}`)
      }

      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Connection failed')
    }
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={testConnection} disabled={status === 'testing'}>
        {status === 'testing' ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Testing...
          </>
        ) : (
          'Test Connection'
        )}
      </Button>

      {status === 'success' && (
        <div className="flex items-center gap-2 text-sm text-green-600 animate-fade-in">
          <CheckCircle2 className="h-4 w-4" />
          Connection successful
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-red-600 animate-fade-in">
          <XCircle className="h-4 w-4" />
          {errorMessage || 'Connection failed'}
        </div>
      )}
    </div>
  )
}
