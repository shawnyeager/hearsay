import { Button } from '@/components/ui'

interface WelcomePanelProps {
  onAddClick: () => void
}

export function WelcomePanel({ onAddClick }: WelcomePanelProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in">
      <h2 className="font-display text-3xl font-semibold text-surface-100 mb-4 text-center">
        What should we build next, and why?
      </h2>
      <p className="text-surface-400 text-center max-w-md mb-8">
        Drop in your interview transcripts. See what customers are actually asking for.
      </p>
      <Button size="lg" onClick={onAddClick}>
        Add Your First Transcript
      </Button>
    </div>
  )
}
