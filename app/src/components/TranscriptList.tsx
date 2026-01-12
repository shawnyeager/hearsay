import { useState } from 'react'
import { FileText, Plus, Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react'
import { useTranscripts } from '@/contexts/TranscriptContext'
import { Button } from '@/components/ui'
import { AddTranscriptDialog } from './AddTranscriptDialog'
import { EditTranscriptDialog } from './EditTranscriptDialog'
import type { Transcript } from '@/types'

interface TranscriptListProps {
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
}

export function TranscriptList({ selectedIds, onSelectionChange }: TranscriptListProps) {
  const { transcripts, isLoading, deleteTranscript } = useTranscripts()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
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

  const selectAll = () => {
    if (selectedIds.size === transcripts.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(transcripts.map((t) => t.id)))
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this transcript?')) {
      await deleteTranscript(id)
      const newSelection = new Set(selectedIds)
      newSelection.delete(id)
      onSelectionChange(newSelection)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-surface-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-surface-700 border-t-accent-500 rounded-full animate-spin" />
          <span className="text-sm">Loading transcripts...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-surface-800/60">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-base font-semibold text-surface-100">
            Transcripts
          </h2>
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add
          </Button>
        </div>
        {transcripts.length > 0 && (
          <p className="text-xs text-surface-500">
            {selectedIds.size > 0 ? (
              <span className="text-accent-400">{selectedIds.size} of {transcripts.length} selected</span>
            ) : (
              `${transcripts.length} transcript${transcripts.length !== 1 ? 's' : ''}`
            )}
          </p>
        )}
      </div>

      {/* Empty state */}
      {transcripts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-accent-500/10 rounded-2xl blur-2xl" />
            <div className="relative w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center">
              <FileText className="h-8 w-8 text-surface-500" />
            </div>
          </div>
          <h3 className="font-display text-base font-medium text-surface-200 mb-1">
            No transcripts yet
          </h3>
          <p className="text-sm text-surface-500 text-center mb-5 max-w-[240px]">
            Add your first interview transcript to begin analysis
          </p>
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add transcript
          </Button>
        </div>
      ) : (
        <>
          {/* Select all */}
          <div className="px-5 py-2.5 border-b border-surface-800/40">
            <button
              onClick={selectAll}
              className="text-xs font-medium text-surface-500 hover:text-accent-400 transition-colors"
            >
              {selectedIds.size === transcripts.length ? 'Deselect all' : 'Select all'}
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-2">
              {transcripts.map((transcript, index) => (
                <TranscriptItem
                  key={transcript.id}
                  transcript={transcript}
                  isSelected={selectedIds.has(transcript.id)}
                  onToggle={() => toggleSelection(transcript.id)}
                  onEdit={() => setEditingTranscript(transcript)}
                  onDelete={() => handleDelete(transcript.id)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <AddTranscriptDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <EditTranscriptDialog
        transcript={editingTranscript}
        open={!!editingTranscript}
        onOpenChange={(open) => !open && setEditingTranscript(null)}
      />
    </div>
  )
}

function TranscriptItem({
  transcript,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
  index,
}: {
  transcript: Transcript
  isSelected: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  index: number
}) {
  return (
    <div
      className={`
        group relative flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200
        animate-slide-up
        ${isSelected
          ? 'bg-accent-500/10 ring-1 ring-accent-500/30'
          : 'hover:bg-surface-800/60'
        }
      `}
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={onToggle}
    >
      {/* Selection indicator */}
      <div className="flex-shrink-0 pt-0.5">
        {isSelected ? (
          <CheckCircle2 className="h-5 w-5 text-accent-500" />
        ) : (
          <Circle className="h-5 w-5 text-surface-600 group-hover:text-surface-500 transition-colors" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-surface-200 truncate group-hover:text-surface-100 transition-colors">
          {transcript.name}
        </div>
        <div className="text-xs text-surface-500 line-clamp-2 mt-1 leading-relaxed">
          {transcript.content.slice(0, 120)}...
        </div>
        <div className="text-xs text-surface-600 mt-1.5">
          {new Date(transcript.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          className="p-1.5 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-surface-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          className="p-1.5 rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
