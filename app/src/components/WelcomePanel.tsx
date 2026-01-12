import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui'

interface WelcomePanelProps {
  onAddClick: () => void
  onGuideClick?: () => void
}

export function WelcomePanel({ onAddClick, onGuideClick }: WelcomePanelProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in">
      <h2 className="font-display text-3xl font-semibold text-surface-900 mb-4 text-center">
        What should we build next, and why?
      </h2>
      <p className="text-surface-500 text-center max-w-md mb-8">
        Drop in your interview transcripts. See what customers are actually asking for.
      </p>
      <Button size="lg" onClick={onAddClick}>
        Add Your First Transcript
      </Button>

      {/* Secondary CTA for interview novices */}
      {onGuideClick && (
        <div className="mt-8 flex flex-col items-center animate-fade-in" style={{ animationDelay: '200ms' }}>
          <span className="text-sm text-surface-500 mb-3">New to customer interviews?</span>
          <button
            onClick={onGuideClick}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-accent-600 hover:text-accent-700 hover:bg-accent-50 cursor-pointer transition-all"
          >
            <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="underline-offset-4 group-hover:underline">
              Read our 20-minute discovery script
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
