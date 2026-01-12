import { Clock, Settings, BookOpen } from 'lucide-react'
import { HearsayLogo } from './HearsayLogo'

interface HeaderProps {
  onHistoryClick: () => void
  onGuideClick: () => void
  onSettingsClick: () => void
  historyOpen: boolean
  guideOpen: boolean
}

export function Header({ onHistoryClick, onGuideClick, onSettingsClick, historyOpen, guideOpen }: HeaderProps) {
  return (
    <header className="relative border-b border-surface-200 bg-white/80 backdrop-blur-xl px-6 py-4">
      {/* Subtle warm gradient line at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400/40 to-transparent" />

      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-accent-400/15 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <HearsayLogo size="md" className="relative" />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold text-surface-900 tracking-tight">
              Hearsay
            </h1>
            <p className="text-sm text-surface-500">
              Customer interviews → roadmap insights
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onHistoryClick}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${historyOpen
                ? 'bg-accent-100 text-accent-700 border border-accent-200'
                : 'text-surface-600 hover:text-surface-800 hover:bg-surface-100'
              }
            `}
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </button>

          <button
            onClick={onGuideClick}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${guideOpen
                ? 'bg-accent-100 text-accent-700 border border-accent-200'
                : 'text-surface-600 hover:text-surface-800 hover:bg-surface-100'
              }
            `}
            title="Interview Guide"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          <button
            onClick={onSettingsClick}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-surface-600 hover:text-surface-800 hover:bg-surface-100 transition-all"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  )
}
