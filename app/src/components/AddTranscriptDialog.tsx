import { useState, useRef } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { useTranscripts } from '@/contexts/TranscriptContext'
import {
  Button,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui'

interface PendingTranscript {
  name: string
  content: string
}

interface AddTranscriptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTranscriptsAdded?: (ids: string[]) => void
}

// Generate a name from content (first few words) or fallback to date
function generateName(content: string, index?: number): string {
  const words = content.trim().split(/\s+/).slice(0, 4).join(' ')
  if (words.length > 30) {
    return words.slice(0, 30) + '...'
  }
  if (words.length > 3) {
    return words
  }
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return index !== undefined ? `Interview ${index + 1} - ${date}` : `Interview - ${date}`
}

export function AddTranscriptDialog({ open, onOpenChange, onTranscriptsAdded }: AddTranscriptDialogProps) {
  const { addTranscript, transcripts } = useTranscripts()
  const [pending, setPending] = useState<PendingTranscript[]>([])
  const [pasteContent, setPasteContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounterRef = useRef(0)

  const processFiles = async (files: File[]) => {
    const textFiles = files.filter(f =>
      f.type === 'text/plain' ||
      f.name.endsWith('.txt') ||
      f.name.endsWith('.md') ||
      f.name.endsWith('.text')
    )
    if (textFiles.length === 0) return

    const newPending: PendingTranscript[] = []
    for (const file of textFiles) {
      const text = await file.text()
      const name = file.name.replace(/\.[^/.]+$/, '')
      newPending.push({ name, content: text })
    }
    setPending((prev) => [...prev, ...newPending])
    setPasteContent('')
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current++
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounterRef.current = 0

    const files = Array.from(e.dataTransfer.files)
    await processFiles(files)
  }

  const handleSubmit = async () => {
    const toAdd = pending.length > 0
      ? pending
      : pasteContent.trim()
        ? [{ name: generateName(pasteContent, transcripts.length), content: pasteContent.trim() }]
        : []

    if (toAdd.length === 0) return

    setIsSubmitting(true)
    try {
      const addedIds: string[] = []
      for (const { name, content } of toAdd) {
        const transcript = await addTranscript(name, content)
        addedIds.push(transcript.id)
      }
      setPending([])
      setPasteContent('')
      onOpenChange(false)
      onTranscriptsAdded?.(addedIds)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    await processFiles(files)
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const removePending = (index: number) => {
    setPending((prev) => prev.filter((_, i) => i !== index))
  }

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      setPending([])
      setPasteContent('')
    }
    onOpenChange(newOpen)
  }

  const totalCount = pending.length || (pasteContent.trim() ? 1 : 0)
  const wordCount = pasteContent.trim().split(/\s+/).filter(Boolean).length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] flex flex-col"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <DialogHeader>
          <DialogTitle>Add Transcripts</DialogTitle>
          <DialogDescription>
            Drop files or paste text. Add as many as you like.
          </DialogDescription>
        </DialogHeader>

        {/* Full-dialog drop overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-surface-900/95 rounded-2xl border-2 border-dashed border-accent-500 flex items-center justify-center animate-fade-in">
            <div className="text-center">
              <FileText className="h-12 w-12 text-accent-500 mx-auto mb-3" />
              <p className="text-lg font-medium text-surface-100">Drop files here</p>
              <p className="text-sm text-surface-400">.txt, .md files</p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          {/* Pending files list */}
          {pending.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-surface-200">
                {pending.length} file{pending.length !== 1 ? 's' : ''} ready
              </p>
              <div className="space-y-1.5">
                {pending.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-800/50 group"
                  >
                    <FileText className="h-4 w-4 text-surface-500 flex-shrink-0" />
                    <span className="text-sm text-surface-300 truncate flex-1">
                      {item.name}
                    </span>
                    <span className="text-xs text-surface-500">
                      {item.content.split(/\s+/).filter(Boolean).length.toLocaleString()} words
                    </span>
                    <button
                      onClick={() => removePending(index)}
                      className="p-1 rounded text-surface-500 hover:text-surface-200 hover:bg-surface-700 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-surface-400"
              >
                <Upload className="h-4 w-4 mr-1.5" />
                Add more files
              </Button>
            </div>
          )}

          {/* Drop zone - show when no pending files */}
          {pending.length === 0 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-surface-700 hover:border-surface-600 rounded-xl p-8 text-center cursor-pointer transition-colors group"
            >
              <div className="w-14 h-14 rounded-xl bg-surface-800 flex items-center justify-center mx-auto mb-3 group-hover:bg-surface-700 transition-colors">
                <FileText className="h-7 w-7 text-surface-500" />
              </div>
              <p className="text-sm font-medium text-surface-300">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-surface-500 mt-1">
                Select multiple files at once
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.text"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Paste area - only show when no files pending */}
          {pending.length === 0 && (
            <div className="space-y-2">
              <p className="text-xs text-surface-500 text-center">or paste a transcript</p>
              <Textarea
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                placeholder="Paste your interview transcript here..."
                className={`font-mono text-sm ${pasteContent ? 'min-h-[250px]' : 'min-h-[80px]'}`}
              />
              {pasteContent && (
                <p className="text-xs text-surface-500">
                  {wordCount.toLocaleString()} words
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={totalCount === 0 || isSubmitting}
          >
            {isSubmitting
              ? 'Adding...'
              : totalCount === 0
                ? 'Add Transcripts'
                : `Add ${totalCount} Transcript${totalCount !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
