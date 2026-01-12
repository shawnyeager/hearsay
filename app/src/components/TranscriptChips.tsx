import { useState } from 'react'
import { X, ChevronDown, ChevronUp, Trash2, Edit2, CheckCircle2, Circle, FileText } from 'lucide-react'
import { useTranscripts } from '@/contexts/TranscriptContext'
import { EditTranscriptDialog } from './EditTranscriptDialog'
import type { Transcript } from '@/types'

interface TranscriptChipsProps {
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
}

export function TranscriptChips({ selectedIds, onSelectionChange }: TranscriptChipsProps) {
  const { transcripts, deleteTranscript } = useTranscripts()
  const [expanded, setExpanded] = useState(false)
  const [editingTranscript, setEditingTranscript] = useState<Transcript | null>(null)

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    onSelectionChange(newSelection)
  }

  const removeFromSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSelection = new Set(selectedIds)
    newSelection.delete(id)
    onSelectionChange(newSelection)
  }

  const selectAll = () => {
    if (selectedIds.size === transcripts.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(transcripts.map((t) => t.id)))
    }
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

  const selectedTranscripts = transcripts.filter((t) => selectedIds.has(t.id))
  const unselectedTranscripts = transcripts.filter((t) => !selectedIds.has(t.id))

  if (transcripts.length === 0) {
    return (
      <span className="text-sm text-surface-500 italic">
        No transcripts yet
      </span>
    )
  }

  return (
    <div className="flex-1 min-w-0">
      {/* Compact chip row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Selected chips */}
        {selectedTranscripts.map((transcript) => (
          <div
            key={transcript.id}
            className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent-500/15 border border-accent-500/30 text-accent-300 text-sm animate-scale-in"
          >
            <span className="truncate max-w-[120px]" title={transcript.name}>
              {transcript.name}
            </span>
            <button
              onClick={(e) => removeFromSelection(transcript.id, e)}
              className="p-0.5 rounded hover:bg-accent-500/20 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Expand/collapse toggle */}
        {transcripts.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-surface-500 hover:text-surface-300 hover:bg-surface-800/50 transition-all"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                {unselectedTranscripts.length > 0
                  ? `${unselectedTranscripts.length} more`
                  : 'Manage'}
              </>
            )}
          </button>
        )}
      </div>

      {/* Expanded drawer */}
      {expanded && (
        <div className="mt-3 p-4 rounded-xl bg-surface-900/80 border border-surface-800 animate-slide-down">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-surface-400 uppercase tracking-wide">
              All Transcripts
            </span>
            <button
              onClick={selectAll}
              className="text-xs font-medium text-surface-500 hover:text-accent-400 transition-colors"
            >
              {selectedIds.size === transcripts.length ? 'Deselect all' : 'Select all'}
            </button>
          </div>

          <div className="space-y-1 max-h-[280px] overflow-y-auto">
            {transcripts.map((transcript) => (
              <TranscriptRow
                key={transcript.id}
                transcript={transcript}
                isSelected={selectedIds.has(transcript.id)}
                onToggle={() => toggleSelection(transcript.id)}
                onEdit={() => setEditingTranscript(transcript)}
                onDelete={(e) => handleDelete(transcript.id, e)}
              />
            ))}
          </div>
        </div>
      )}

      <EditTranscriptDialog
        transcript={editingTranscript}
        open={!!editingTranscript}
        onOpenChange={(open) => !open && setEditingTranscript(null)}
      />
    </div>
  )
}

function TranscriptRow({
  transcript,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
}: {
  transcript: Transcript
  isSelected: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: (e: React.MouseEvent) => void
}) {
  return (
    <div
      onClick={onToggle}
      className={`
        group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all
        ${isSelected
          ? 'bg-accent-500/10 ring-1 ring-accent-500/20'
          : 'hover:bg-surface-800/50'
        }
      `}
    >
      {/* Selection indicator */}
      <div className="flex-shrink-0">
        {isSelected ? (
          <CheckCircle2 className="h-4 w-4 text-accent-500" />
        ) : (
          <Circle className="h-4 w-4 text-surface-600 group-hover:text-surface-500 transition-colors" />
        )}
      </div>

      {/* Icon */}
      <FileText className="h-4 w-4 text-surface-500 flex-shrink-0" />

      {/* Name */}
      <span className="flex-1 text-sm text-surface-300 truncate min-w-0">
        {transcript.name}
      </span>

      {/* Word count */}
      <span className="text-xs text-surface-600 flex-shrink-0">
        {transcript.content.split(/\s+/).length.toLocaleString()} words
      </span>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-1 rounded text-surface-500 hover:text-surface-200 hover:bg-surface-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
        <button
          className="p-1 rounded text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
