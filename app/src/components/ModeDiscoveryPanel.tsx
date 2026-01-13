import { X, Sparkles, Quote, Zap, Search } from 'lucide-react'
import { PRESETS } from '@/prompts/presets'
import type { AnalysisVariant } from '@/types'

interface ModeDiscoveryPanelProps {
  open: boolean
  onClose: () => void
  onSelectMode: (mode: AnalysisVariant) => void
}

const MODE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'standard': Sparkles,
  'quote-heavy': Quote,
  'quick-scan': Zap,
  'deep-dive': Search,
}

export function ModeDiscoveryPanel({ open, onClose, onSelectMode }: ModeDiscoveryPanelProps) {
  if (!open) return null

  const alternativeModes = PRESETS.filter(p => p.id !== 'standard')

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="max-w-2xl mx-auto px-4 pb-6">
          <div className="bg-white rounded-2xl shadow-2xl border border-surface-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-100 border border-accent-200 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-accent-600" />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-surface-900">
                    Your analysis is ready
                  </h2>
                  <p className="text-xs text-surface-500">
                    Did you know there are other analysis modes?
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-sm text-surface-600 mb-4">
                You just ran a <strong>Standard</strong> analysis. Next time, try one of these:
              </p>

              <div className="grid gap-3">
                {alternativeModes.map((preset) => {
                  const Icon = MODE_ICONS[preset.id] || Sparkles
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectMode(preset.id as AnalysisVariant)
                        onClose()
                      }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-surface-50 hover:bg-surface-100 border border-surface-200 hover:border-surface-300 transition-all text-left group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-surface-200 flex items-center justify-center group-hover:border-accent-300 group-hover:bg-accent-50 transition-colors">
                        <Icon className="h-5 w-5 text-surface-500 group-hover:text-accent-600 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-surface-800 group-hover:text-surface-900">
                          {preset.name}
                        </div>
                        <div className="text-sm text-surface-500 mt-0.5">
                          {preset.benefit || preset.description}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-surface-100 bg-surface-50">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-surface-600 hover:text-surface-800 hover:bg-surface-100 transition-colors"
              >
                Got it, keep using Standard
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
