import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import { useTranscripts } from '@/contexts/TranscriptContext'
import {
  Button,
  Input,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
      // Use filename without extension as default name
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Transcript</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., founder_alice_acme"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-1" />
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
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your interview transcript here..."
              className="min-h-[300px] font-mono text-sm"
            />
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
