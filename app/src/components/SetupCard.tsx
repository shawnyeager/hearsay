import { useState } from 'react'
import { Zap, Shield, ExternalLink, CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { PROVIDER_DEFAULTS, type ProviderId } from '@/types'

export function SetupCard() {
  const {
    settings,
    updateProviderSettings,
    setSelectedProvider,
    setSelectedModel,
    getCurrentProviderConfig,
    markSetupComplete,
    hasValidApiKey,
  } = useSettings()

  const [showApiKey, setShowApiKey] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const currentConfig = getCurrentProviderConfig()
  const providerIds = Object.keys(PROVIDER_DEFAULTS) as ProviderId[]

  const testConnection = async () => {
    const apiKey = settings.providers[settings.selectedProvider].apiKey
    if (!apiKey) {
      setTestStatus('error')
      setErrorMessage('Please enter an API key first')
      return
    }

    setTestStatus('testing')
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

      setTestStatus('success')
    } catch (error) {
      setTestStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Connection failed')
    }
  }

  const handleContinue = () => {
    markSetupComplete()
  }

  const providerInfo = {
    openrouter: {
      description: 'Access Claude, GPT-4, Gemini, and more with one API key',
      link: 'https://openrouter.ai/keys',
    },
    openai: {
      description: 'Direct access to OpenAI models',
      link: 'https://platform.openai.com/api-keys',
    },
    maple: {
      description: 'Privacy-focused AI with encryption',
      link: 'https://trymaple.ai/downloads',
    },
  }

  return (
    <div className="animate-scale-in">
      <div className="card-elevated max-w-2xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-accent-500/20 rounded-2xl blur-2xl" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
              <Zap className="h-8 w-8 text-surface-950" strokeWidth={2} />
            </div>
          </div>
          <h2 className="font-display text-2xl font-semibold text-surface-100 mb-2">
            Welcome! Let's get you set up
          </h2>
          <p className="text-surface-400 max-w-md mx-auto">
            This tool analyzes interview transcripts using your preferred LLM.
            You'll need an API key to get started.
          </p>
        </div>

        {/* Provider Selection */}
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-surface-200 mb-3 block">
              Choose your AI provider
            </label>
            <div className="grid grid-cols-3 gap-3">
              {providerIds.map((id) => (
                <button
                  key={id}
                  onClick={() => setSelectedProvider(id)}
                  className={`
                    relative p-4 rounded-xl border-2 text-left transition-all duration-200
                    ${settings.selectedProvider === id
                      ? 'border-accent-500/50 bg-accent-500/5'
                      : 'border-surface-800 hover:border-surface-700 hover:bg-surface-900/50'
                    }
                  `}
                >
                  {settings.selectedProvider === id && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="h-4 w-4 text-accent-500" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    {id === 'maple' ? (
                      <Shield className="h-4 w-4 text-surface-400" />
                    ) : (
                      <Zap className="h-4 w-4 text-surface-400" />
                    )}
                    <span className="font-medium text-sm text-surface-200">
                      {PROVIDER_DEFAULTS[id].name}
                    </span>
                  </div>
                  <p className="text-xs text-surface-500 line-clamp-2">
                    {providerInfo[id].description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-surface-200">
                API Key
              </label>
              <a
                href={providerInfo[settings.selectedProvider].link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent-500 hover:text-accent-400 flex items-center gap-1"
              >
                Get API key <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex gap-2">
              <Input
                type={showApiKey ? 'text' : 'password'}
                value={settings.providers[settings.selectedProvider].apiKey}
                onChange={(e) =>
                  updateProviderSettings(settings.selectedProvider, {
                    apiKey: e.target.value,
                  })
                }
                placeholder={
                  settings.selectedProvider === 'openrouter'
                    ? 'sk-or-v1-...'
                    : 'sk-...'
                }
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? '●●●' : '👁'}
              </Button>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="text-sm font-medium text-surface-200 mb-2 block">
              Model
            </label>
            <Select value={settings.selectedModel} onValueChange={setSelectedModel}>
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

          {/* Test Connection */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={testConnection}
              disabled={testStatus === 'testing' || !hasValidApiKey}
            >
              {testStatus === 'testing' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>

            {testStatus === 'success' && (
              <span className="text-sm text-green-400 flex items-center gap-1.5 animate-fade-in">
                <CheckCircle2 className="h-4 w-4" />
                Connected
              </span>
            )}

            {testStatus === 'error' && (
              <span className="text-sm text-red-400 animate-fade-in">
                {errorMessage}
              </span>
            )}
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2.5 text-xs text-surface-500 p-3 rounded-lg bg-surface-800/30 border border-surface-800/50">
            <Shield className="h-4 w-4 flex-shrink-0 mt-0.5 text-surface-400" />
            <span>
              Your API key is stored locally in your browser and never sent to our servers.
              All analysis requests go directly to your chosen provider.
            </span>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!hasValidApiKey}
            className="w-full"
            size="lg"
          >
            Continue to Workspace
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
