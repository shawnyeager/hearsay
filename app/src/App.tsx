import { useState } from 'react'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { TranscriptProvider } from '@/contexts/TranscriptContext'
import { AnalysisProvider } from '@/contexts/AnalysisContext'
import { Header } from '@/components/Header'
import { Workspace } from '@/components/Workspace'
import { HistoryPanel } from '@/components/HistoryPanel'
import { SettingsPanel } from '@/components/SettingsPanel'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui'
import type { Analysis } from '@/types'

function AppContent() {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [loadedAnalysis, setLoadedAnalysis] = useState<Analysis | null>(null)

  const handleSelectHistoricalAnalysis = (analysis: Analysis) => {
    setLoadedAnalysis(analysis)
  }

  const handleClearLoadedAnalysis = () => {
    setLoadedAnalysis(null)
  }

  return (
    <div className="min-h-screen flex flex-col texture-noise">
      <Header
        onHistoryClick={() => setHistoryOpen(!historyOpen)}
        onSettingsClick={() => setSettingsOpen(true)}
        historyOpen={historyOpen}
      />

      <main className="flex-1 flex overflow-hidden">
        <Workspace
          loadedAnalysis={loadedAnalysis}
          onClearLoaded={handleClearLoadedAnalysis}
        />
      </main>

      {/* History Panel */}
      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={handleSelectHistoricalAnalysis}
      />

      {/* Settings Modal */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <SettingsPanel />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <TranscriptProvider>
        <AnalysisProvider>
          <AppContent />
        </AnalysisProvider>
      </TranscriptProvider>
    </SettingsProvider>
  )
}
