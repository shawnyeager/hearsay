import { useState } from 'react'
import { Eye, EyeOff, ExternalLink } from 'lucide-react'
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
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
      </div>

      {/* Provider Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">LLM Provider</label>
        <Select
          value={settings.selectedProvider}
          onValueChange={(value) => setSelectedProvider(value as ProviderId)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {providerIds.map((id) => (
              <SelectItem key={id} value={id}>
                {PROVIDER_DEFAULTS[id].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          {settings.selectedProvider === 'openrouter' && (
            <>
              Access multiple models with one API key.{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
              >
                Get API key <ExternalLink className="h-3 w-3" />
              </a>
            </>
          )}
          {settings.selectedProvider === 'openai' && (
            <>
              Direct OpenAI API access.{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
              >
                Get API key <ExternalLink className="h-3 w-3" />
              </a>
            </>
          )}
          {settings.selectedProvider === 'maple' && (
            <>
              Privacy-focused AI via local proxy. Requires{' '}
              <a
                href="https://trymaple.ai/downloads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
              >
                Maple app <ExternalLink className="h-3 w-3" />
              </a>{' '}
              running locally.
            </>
          )}
        </p>
      </div>

      {/* API Key */}
      <div className="space-y-2">
        <label className="text-sm font-medium">API Key</label>
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
                  ? 'Maple API key (from dashboard)'
                  : 'sk-...'
              }
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowApiKey(!showApiKey)}
          >
            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Your API key is stored locally in your browser. It never leaves your device
          except to authenticate with the LLM provider.
        </p>
      </div>

      {/* Custom Base URL (for advanced users) */}
      {settings.selectedProvider === 'maple' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Base URL</label>
          <Input
            value={settings.providers[settings.selectedProvider].baseUrl}
            onChange={(e) =>
              updateProviderSettings(settings.selectedProvider, {
                baseUrl: e.target.value,
              })
            }
            placeholder={PROVIDER_DEFAULTS[settings.selectedProvider].baseUrl}
          />
          <p className="text-xs text-gray-500">
            Default: {PROVIDER_DEFAULTS[settings.selectedProvider].baseUrl}
          </p>
        </div>
      )}

      {/* Model Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Model</label>
        <Select
          value={settings.selectedModel}
          onValueChange={setSelectedModel}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currentConfig.models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Connection Test */}
      <div className="pt-4 border-t">
        <ConnectionTest />
      </div>
    </div>
  )
}

function ConnectionTest() {
  const { settings, getCurrentProviderConfig } = useSettings()
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const testConnection = async () => {
    const config = getCurrentProviderConfig()
    if (!config.apiKey) {
      setStatus('error')
      setErrorMessage('API key is required')
      return
    }

    setStatus('testing')
    setErrorMessage('')

    try {
      const baseUrl = settings.providers[settings.selectedProvider].baseUrl ||
        PROVIDER_DEFAULTS[settings.selectedProvider].baseUrl

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          ...(settings.selectedProvider === 'openrouter' && {
            'HTTP-Referer': window.location.origin,
          }),
        },
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
    <div className="space-y-2">
      <Button variant="outline" onClick={testConnection} disabled={status === 'testing'}>
        {status === 'testing' ? 'Testing...' : 'Test Connection'}
      </Button>
      {status === 'success' && (
        <p className="text-sm text-green-600">Connection successful!</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600">{errorMessage || 'Connection failed'}</p>
      )}
    </div>
  )
}
