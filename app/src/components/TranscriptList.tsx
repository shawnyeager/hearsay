import { useState } from 'react'
import { FileText, Plus, Trash2, Edit2 } from 'lucide-react'
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
      <div className="flex items-center justify-center py-8 text-gray-500">
        Loading transcripts...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Transcripts</h2>
          {transcripts.length > 0 && (
            <span className="text-sm text-gray-500">({transcripts.length})</span>
          )}
        </div>
        <Button size="sm" onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {transcripts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <FileText className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm">No transcripts yet</p>
          <p className="text-xs mt-1">Add your first interview transcript to get started</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2 text-sm">
            <Button variant="ghost" size="sm" onClick={selectAll}>
              {selectedIds.size === transcripts.length ? 'Deselect all' : 'Select all'}
            </Button>
            {selectedIds.size > 0 && (
              <span className="text-gray-500">{selectedIds.size} selected</span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {transcripts.map((transcript) => (
              <div
                key={transcript.id}
                className={`
                  group flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                  ${selectedIds.has(transcript.id)
                    ? 'border-gray-400 bg-gray-50 dark:border-gray-600 dark:bg-gray-900'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
                  }
                `}
                onClick={() => toggleSelection(transcript.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(transcript.id)}
                  onChange={() => toggleSelection(transcript.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{transcript.name}</div>
                  <div className="text-sm text-gray-500 truncate mt-0.5">
                    {transcript.content.slice(0, 100)}...
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(transcript.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingTranscript(transcript)
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(transcript.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
