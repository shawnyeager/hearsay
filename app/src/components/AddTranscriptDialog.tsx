import { useState, useRef } from 'react'
import { Upload, FileText } from 'lucide-react'
import { useTranscripts } from '@/contexts/TranscriptContext'
import {
  Button,
  Input,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui'

interface AddTranscriptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTranscriptDialog({ open, onOpenChange }: AddTranscriptDialogProps) {
  const { addTranscript } = useTranscripts()
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    if (!name.trim() || !content.trim()) return

    setIsSubmitting(true)
    try {
      await addTranscript(name.trim(), content.trim())
      setName('')
      setContent('')
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    setContent(text)
    if (!name) {
      setName(file.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      setName('')
      setContent('')
    }
    onOpenChange(newOpen)
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Transcript</DialogTitle>
          <DialogDescription>
            Paste or upload an interview transcript for analysis
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-surface-200">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., founder_alice_acme"
            />
            <p className="text-xs text-surface-500">
              Use a descriptive name like role_name_company
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="content" className="text-sm font-medium text-surface-200">
                Content
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-1.5" />
                Upload file
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.text"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {!content ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-surface-700 hover:border-surface-600 rounded-xl p-8 text-center cursor-pointer transition-colors group"
              >
                <div className="w-14 h-14 rounded-xl bg-surface-800 flex items-center justify-center mx-auto mb-3 group-hover:bg-surface-700 transition-colors">
                  <FileText className="h-7 w-7 text-surface-500" />
                </div>
                <p className="text-sm font-medium text-surface-300">
                  Drop a file here or click to upload
                </p>
                <p className="text-xs text-surface-500 mt-1">
                  Or paste your transcript below
                </p>
              </div>
            ) : null}

            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your interview transcript here..."
              className={`font-mono text-sm ${content ? 'min-h-[300px]' : 'min-h-[100px]'}`}
            />

            {content && (
              <p className="text-xs text-surface-500">
                {wordCount.toLocaleString()} words
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !content.trim() || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Transcript'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
