import { useState } from 'react'
import { Zap, Shield, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui'
import { PROVIDER_DEFAULTS, type ProviderId } from '@/types'

interface APIKeyPromptProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function APIKeyPrompt({ open, onOpenChange, onSuccess }: APIKeyPromptProps) {
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

  const providerInfo: Record<ProviderId, { description: string; link: string }> = {
    openrouter: {
      description: 'Claude, GPT-4, Gemini & more',
      link: 'https://openrouter.ai/keys',
    },
    openai: {
      description: 'Direct OpenAI access',
      link: 'https://platform.openai.com/api-keys',
    },
    maple: {
      description: 'Local, privacy-focused',
      link: 'https://trymaple.ai/downloads',
    },
  }

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

  const handleSaveAndRun = () => {
    markSetupComplete()
    onOpenChange(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent-500" />
            Connect your AI provider
          </DialogTitle>
          <DialogDescription>
            Your API key stays in your browser and is never sent to our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Provider Selection - Compact */}
          <div className="grid grid-cols-3 gap-2">
            {providerIds.map((id) => (
              <button
                key={id}
                onClick={() => setSelectedProvider(id)}
                className={`
                  relative p-3 rounded-lg border text-left transition-all duration-200
                  ${settings.selectedProvider === id
                    ? 'border-accent-500/50 bg-accent-500/5'
                    : 'border-surface-800 hover:border-surface-700 hover:bg-surface-900/50'
                  }
                `}
              >
                {settings.selectedProvider === id && (
                  <CheckCircle2 className="absolute top-2 right-2 h-3.5 w-3.5 text-accent-500" />
                )}
                <div className="flex items-center gap-1.5 mb-0.5">
                  {id === 'maple' ? (
                    <Shield className="h-3.5 w-3.5 text-surface-400" />
                  ) : (
                    <Zap className="h-3.5 w-3.5 text-surface-400" />
                  )}
                  <span className="font-medium text-xs text-surface-200">
                    {PROVIDER_DEFAULTS[id].name}
                  </span>
                </div>
                <p className="text-[10px] text-surface-500 leading-tight">
                  {providerInfo[id].description}
                </p>
              </button>
            ))}
          </div>

          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-surface-200">
                API Key
              </label>
              <a
                href={providerInfo[settings.selectedProvider].link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent-500 hover:text-accent-400 flex items-center gap-1"
              >
                Get key <ExternalLink className="h-3 w-3" />
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
            <label className="text-sm font-medium text-surface-200 mb-1.5 block">
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

          {/* Test Connection + Status */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={testConnection}
              disabled={testStatus === 'testing' || !hasValidApiKey}
            >
              {testStatus === 'testing' ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
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

          {/* Save & Run Button */}
          <Button
            onClick={handleSaveAndRun}
            disabled={!hasValidApiKey}
            className="w-full"
          >
            Save & Run Analysis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
