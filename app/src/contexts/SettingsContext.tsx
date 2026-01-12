import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { db } from '@/lib/db'
import type { Settings, ProviderId, ProviderSettings } from '@/types'
import { PROVIDER_DEFAULTS } from '@/types'

const SETTINGS_ID = 'app-settings'

const defaultSettings: Settings = {
  providers: {
    openrouter: { apiKey: '', baseUrl: PROVIDER_DEFAULTS.openrouter.baseUrl },
    openai: { apiKey: '', baseUrl: PROVIDER_DEFAULTS.openai.baseUrl },
    maple: { apiKey: '', baseUrl: PROVIDER_DEFAULTS.maple.baseUrl },
  },
  selectedProvider: 'openrouter',
  selectedModel: 'anthropic/claude-sonnet-4',
}

interface SettingsContextValue {
  settings: Settings
  isLoading: boolean
  hasValidApiKey: boolean
  hasCompletedSetup: boolean
  updateProviderSettings: (providerId: ProviderId, settings: Partial<ProviderSettings>) => Promise<void>
  setSelectedProvider: (providerId: ProviderId) => Promise<void>
  setSelectedModel: (model: string) => Promise<void>
  getCurrentProviderConfig: () => { apiKey: string; baseUrl: string; models: typeof PROVIDER_DEFAULTS.openrouter.models }
  markSetupComplete: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [hasCompletedSetup, setHasCompletedSetup] = useState(() => {
    return localStorage.getItem('setup-complete') === 'true'
  })

  // Computed: does the current provider have a valid API key?
  const hasValidApiKey = Boolean(settings.providers[settings.selectedProvider]?.apiKey)

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const stored = await db.settings.get(SETTINGS_ID)
        if (stored) {
          // Merge with defaults to handle new fields
          setSettings({
            ...defaultSettings,
            ...stored,
            providers: {
              ...defaultSettings.providers,
              ...stored.providers,
            },
          })
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [])

  // Persist settings helper
  const persistSettings = useCallback(async (newSettings: Settings) => {
    setSettings(newSettings)
    await db.settings.put({ id: SETTINGS_ID, ...newSettings })
  }, [])

  const updateProviderSettings = useCallback(
    async (providerId: ProviderId, providerSettings: Partial<ProviderSettings>) => {
      const newSettings = {
        ...settings,
        providers: {
          ...settings.providers,
          [providerId]: {
            ...settings.providers[providerId],
            ...providerSettings,
          },
        },
      }
      await persistSettings(newSettings)
    },
    [settings, persistSettings]
  )

  const setSelectedProvider = useCallback(
    async (providerId: ProviderId) => {
      // Also update model to first available for that provider
      const firstModel = PROVIDER_DEFAULTS[providerId].models[0]?.id || ''
      const newSettings = {
        ...settings,
        selectedProvider: providerId,
        selectedModel: firstModel,
      }
      await persistSettings(newSettings)
    },
    [settings, persistSettings]
  )

  const setSelectedModel = useCallback(
    async (model: string) => {
      const newSettings = { ...settings, selectedModel: model }
      await persistSettings(newSettings)
    },
    [settings, persistSettings]
  )

  const getCurrentProviderConfig = useCallback(() => {
    const providerId = settings.selectedProvider
    const providerSettings = settings.providers[providerId]
    const defaults = PROVIDER_DEFAULTS[providerId]
    return {
      apiKey: providerSettings.apiKey,
      baseUrl: providerSettings.baseUrl || defaults.baseUrl,
      models: defaults.models,
    }
  }, [settings])

  const markSetupComplete = useCallback(() => {
    localStorage.setItem('setup-complete', 'true')
    setHasCompletedSetup(true)
  }, [])

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        hasValidApiKey,
        hasCompletedSetup,
        updateProviderSettings,
        setSelectedProvider,
        setSelectedModel,
        getCurrentProviderConfig,
        markSetupComplete,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
