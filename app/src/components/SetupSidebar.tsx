import { useState, useMemo, useEffect } from 'react'
import { Plus, Play, Square, ChevronLeft, ChevronRight, Eye, RotateCcw, Search, Edit2, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranscripts } from '@/contexts/TranscriptContext'
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { EditTranscriptDialog } from './EditTranscriptDialog'
import { PRESETS } from '@/prompts/presets'
import type { AnalysisVariant, Transcript } from '@/types'

interface SetupSidebarProps {
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
  variant: AnalysisVariant
  onVariantChange: (variant: AnalysisVariant) => void
  hasRunAnalysis: boolean
  hasContent: boolean
  isRunning: boolean
  onRun: () => void
  onStop: () => void
  onStartNew: () => void
  onAddClick: () => void
  onViewMethodology: () => void
}

export function SetupSidebar({
  selectedIds,
  onSelectionChange,
  variant,
  onVariantChange,
  hasRunAnalysis,
  hasContent,
  isRunning,
  onRun,
  onStop,
  onStartNew,
  onAddClick,
  onViewMethodology,
}: SetupSidebarProps) {
  const { transcripts, deleteTranscript } = useTranscripts()
  const [collapsed, setCollapsed] = useState(() => {
    // Start collapsed on mobile
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [editingTranscript, setEditingTranscript] = useState<Transcript | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !collapsed) {
        setCollapsed(true)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [collapsed])

  // Filter transcripts by search query
  const filteredTranscripts = useMemo(() => {
    if (!searchQuery.trim()) return transcripts
    const query = searchQuery.toLowerCase()
    return transcripts.filter(
      t => t.name.toLowerCase().includes(query) || 
           t.content.toLowerCase().includes(query)
    )
  }, [transcripts, searchQuery])

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
    onSelectionChange(new Set(filteredTranscripts.map(t => t.id)))
  }

  const selectNone = () => {
    onSelectionChange(new Set())
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this transcript?')) {
      await deleteTranscript(id)
      const newSelection = new Set(selectedIds)
      newSelection.delete(id)
      onSelectionChange(newSelection)
    }
  }

  const handleEdit = (transcript: Transcript, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingTranscript(transcript)
  }

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedId(expandedId === id ? null : id)
  }

  // Get word count
  const getWordCount = (content: string) => {
    return content.trim().split(/\s+/).filter(Boolean).length
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
    <div className="w-80 h-full flex-shrink-0 border-r border-surface-200 bg-white/50 flex flex-col">
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
      <div className="flex-1 overflow-y-auto flex flex-col">
        {transcripts.length === 0 ? (
          <div className="p-4 text-center flex-1 flex flex-col items-center justify-center">
            <p className="text-sm text-surface-500 mb-3">No transcripts yet</p>
            <Button size="sm" onClick={onAddClick}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add Transcripts
            </Button>
          </div>
        ) : (
          <>
            {/* Search and quick actions */}
            <div className="px-3 py-3 border-b border-surface-100 space-y-2">
              {/* Search */}
              {transcripts.length > 3 && (
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                  <Input
                    type="text"
                    placeholder="Search transcripts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-8 h-9 text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-surface-400 hover:text-surface-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}
              
              {/* Actions row */}
              <div className="flex items-center gap-2">
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

              {/* Search results indicator */}
              {searchQuery && (
                <p className="text-xs text-surface-500">
                  {filteredTranscripts.length} of {transcripts.length} transcripts
                </p>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-2">
              {filteredTranscripts.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-surface-500">No matches found</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-accent-600 hover:text-accent-700 mt-1"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                filteredTranscripts.map((transcript) => {
                  const isSelected = selectedIds.has(transcript.id)
                  const isExpanded = expandedId === transcript.id
                  const wordCount = getWordCount(transcript.content)
                  
                  return (
                    <div
                      key={transcript.id}
                      className={`
                        group mx-2 mb-1 rounded-lg transition-colors
                        ${isSelected ? 'bg-accent-50 ring-1 ring-accent-200' : 'hover:bg-surface-50'}
                      `}
                    >
                      <div
                        className="flex items-start gap-3 px-3 py-2.5 cursor-pointer"
                        onClick={() => toggleTranscript(transcript.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleTranscript(transcript.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-0.5 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm text-surface-700 leading-snug line-clamp-2">
                              {transcript.name}
                            </span>
                            {/* Expand/collapse button */}
                            <button
                              onClick={(e) => toggleExpand(transcript.id, e)}
                              className="flex-shrink-0 p-1 rounded text-surface-400 hover:text-surface-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              title={isExpanded ? 'Collapse' : 'Preview'}
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-surface-400">
                              {wordCount.toLocaleString()} words
                            </span>
                            {/* Action buttons */}
                            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => handleEdit(transcript, e)}
                                className="p-1 rounded text-surface-400 hover:text-surface-700 hover:bg-surface-200 transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(transcript.id, e)}
                                className="p-1 rounded text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded preview */}
                      {isExpanded && (
                        <div className="px-3 pb-3 pt-0">
                          <div className="ml-7 p-2.5 rounded-lg bg-surface-100 text-xs text-surface-600 leading-relaxed max-h-32 overflow-y-auto">
                            {transcript.content.slice(0, 500)}
                            {transcript.content.length > 500 && '...'}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
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

        {/* Selection count and keyboard hint */}
        <div className="flex items-center justify-between text-xs text-surface-500">
          <span>{selectedIds.size} of {transcripts.length} selected</span>
          {selectedIds.size > 0 && !isRunning && (
            <span className="text-surface-400">⌘↵ to run</span>
          )}
        </div>

        {/* Run/Stop button */}
        {isRunning ? (
          <Button variant="destructive" className="w-full" onClick={onStop}>
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        ) : (
          <div className="flex gap-2">
            {hasContent && (
              <Button variant="outline" onClick={onStartNew} title="Start new analysis">
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={onRun}
              disabled={selectedIds.size === 0}
              data-run-button
            >
              <Play className="h-4 w-4 mr-2" />
              Run Analysis
            </Button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <EditTranscriptDialog
        transcript={editingTranscript}
        open={!!editingTranscript}
        onOpenChange={(open) => !open && setEditingTranscript(null)}
      />
    </div>
  )
}
