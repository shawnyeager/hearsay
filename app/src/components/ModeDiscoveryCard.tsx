import { Sparkles, Quote, Zap, Search } from 'lucide-react'
import { Button } from '@/components/ui'

interface ModeDiscoveryCardProps {
  onExplore: () => void
  onDismiss: () => void
}

export function ModeDiscoveryCard({ onExplore, onDismiss }: ModeDiscoveryCardProps) {
  return (
    <section
      className="mt-8 pt-6 border-t border-surface-200 animate-fade-in"
      role="complementary"
      aria-label="Discover analysis modes"
    >
      <div className="bg-surface-50 border border-surface-200 rounded-xl p-5 max-w-xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-accent-100 border border-accent-200 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4 text-accent-600" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-surface-900">
              Try different analysis styles
            </h3>
            <p className="text-sm text-surface-600 mt-1">
              This used the <strong>Standard</strong> style. Next time, try:
            </p>
          </div>
        </div>

        <div className="space-y-2 ml-12 mb-5">
          <ModeOption
            icon={Quote}
            name="Quote-Heavy"
            description="More direct quotes to share with stakeholders"
          />
          <ModeOption
            icon={Zap}
            name="Quick Scan"
            description="Just the highlights, 2-minute read"
          />
          <ModeOption
            icon={Search}
            name="Deep Dive"
            description="Catch outliers, contradictions, and minority opinions"
          />
        </div>

        <div className="flex items-center gap-3 ml-12">
          <Button size="sm" onClick={onExplore}>
            Explore Modes
          </Button>
          <button
            onClick={onDismiss}
            className="text-sm text-surface-500 hover:text-surface-700 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </section>
  )
}

function ModeOption({
  icon: Icon,
  name,
  description
}: {
  icon: React.ComponentType<{ className?: string }>
  name: string
  description: string
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon className="h-4 w-4 text-surface-400 mt-0.5 flex-shrink-0" />
      <div>
        <span className="font-medium text-surface-700">{name}</span>
        <span className="text-surface-500"> — {description}</span>
      </div>
    </div>
  )
}
