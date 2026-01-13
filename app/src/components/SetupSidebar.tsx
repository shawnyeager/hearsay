import { useState } from 'react'
import { Plus, Play, Square, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { useTranscripts } from '@/contexts/TranscriptContext'
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { PRESETS } from '@/prompts/presets'
import type { AnalysisVariant } from '@/types'

interface SetupSidebarProps {
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
  variant: AnalysisVariant
  onVariantChange: (variant: AnalysisVariant) => void
  hasRunAnalysis: boolean
  isRunning: boolean
  onRun: () => void
  onStop: () => void
  onAddClick: () => void
  onViewMethodology: () => void
}

export function SetupSidebar({
  selectedIds,
  onSelectionChange,
  variant,
  onVariantChange,
  hasRunAnalysis,
  isRunning,
  onRun,
  onStop,
  onAddClick,
  onViewMethodology,
}: SetupSidebarProps) {
  const { transcripts } = useTranscripts()
  const [collapsed, setCollapsed] = useState(false)

  const toggleTranscript = (id: string) => {
    const newIds = new Set(selectedIds)
    if (newIds.has(id)) {
      newIds.delete(id)
    } else {
      newIds.add(id)
    }
    onSelectionChange(newIds)
  }

  const selectAll = () => {
    onSelectionChange(new Set(transcripts.map(t => t.id)))
  }

  const selectNone = () => {
    onSelectionChange(new Set())
  }

  if (collapsed) {
    return (
      <div className="w-12 flex-shrink-0 border-r border-surface-200 bg-white/50 flex flex-col items-center py-4">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="w-72 flex-shrink-0 border-r border-surface-200 bg-white/50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200">
        <h2 className="font-display font-semibold text-surface-900">Transcripts</h2>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
          title="Collapse sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Transcript List */}
      <div className="flex-1 overflow-y-auto">
        {transcripts.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm text-surface-500 mb-3">No transcripts yet</p>
            <Button size="sm" onClick={onAddClick}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add Transcripts
            </Button>
          </div>
        ) : (
          <>
            {/* Quick actions */}
            <div className="px-4 py-2 border-b border-surface-100 flex items-center gap-2">
              <Button size="sm" onClick={onAddClick}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add
              </Button>
              <div className="flex-1" />
              <button
                onClick={selectAll}
                className="text-xs text-surface-500 hover:text-surface-700 transition-colors"
              >
                All
              </button>
              <span className="text-surface-300">|</span>
              <button
                onClick={selectNone}
                className="text-xs text-surface-500 hover:text-surface-700 transition-colors"
              >
                None
              </button>
            </div>

            {/* List */}
            <div className="py-2">
              {transcripts.map((transcript) => (
                <label
                  key={transcript.id}
                  className="flex items-start gap-3 px-4 py-2 hover:bg-surface-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(transcript.id)}
                    onChange={() => toggleTranscript(transcript.id)}
                    className="mt-0.5 h-4 w-4 rounded border-surface-300 text-accent-600 focus:ring-accent-500"
                  />
                  <span className="text-sm text-surface-700 leading-snug">
                    {transcript.name}
                  </span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer - Mode selector and Run button */}
      <div className="flex-shrink-0 border-t border-surface-200 p-4 space-y-3">
        {/* Mode selector - only for returning users */}
        {hasRunAnalysis && (
          <div className="flex items-center gap-2">
            <Select
              value={variant}
              onValueChange={(v) => onVariantChange(v as AnalysisVariant)}
              disabled={isRunning}
            >
              <SelectTrigger className="flex-1">
                <SelectValue>
                  {PRESETS.find(p => p.id === variant)?.name ?? 'Select mode'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PRESETS.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    <div className="flex flex-col items-start gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{preset.name}</span>
                        {preset.id === 'standard' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent-100 text-accent-700">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-surface-500">{preset.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={onViewMethodology}
              className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 transition-colors"
              title="View methodology"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Selection count */}
        <div className="text-xs text-surface-500">
          {selectedIds.size} of {transcripts.length} selected
        </div>

        {/* Run/Stop button */}
        {isRunning ? (
          <Button variant="destructive" className="w-full" onClick={onStop}>
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={onRun}
            disabled={selectedIds.size === 0}
          >
            <Play className="h-4 w-4 mr-2" />
            Run Analysis
          </Button>
        )}
      </div>
    </div>
  )
}
