import { useState } from 'react'
import { Settings, FlaskConical, BookOpen } from 'lucide-react'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { TranscriptProvider } from '@/contexts/TranscriptContext'
import { AnalysisProvider } from '@/contexts/AnalysisContext'
import { TranscriptList } from '@/components/TranscriptList'
import { AnalysisPanel } from '@/components/AnalysisPanel'
import { SettingsPanel } from '@/components/SettingsPanel'
import { GuidePanel } from '@/components/GuidePanel'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'

function AppContent() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState('analyze')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Interview Analysis</h1>
            <p className="text-sm text-gray-500">
              Turn customer interviews into product roadmap recommendations
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar with transcripts */}
        <aside className="w-80 border-r p-4 overflow-y-auto flex-shrink-0">
          <TranscriptList
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </aside>

        {/* Main panel with tabs */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mb-4 self-start">
              <TabsTrigger value="analyze" className="gap-2">
                <FlaskConical className="h-4 w-4" />
                Analyze
              </TabsTrigger>
              <TabsTrigger value="guide" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Interview Guide
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyze" className="flex-1 overflow-hidden">
              <AnalysisPanel selectedIds={selectedIds} />
            </TabsContent>

            <TabsContent value="guide" className="flex-1 overflow-y-auto">
              <GuidePanel />
            </TabsContent>

            <TabsContent value="settings" className="flex-1 overflow-y-auto">
              <SettingsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </main>
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
